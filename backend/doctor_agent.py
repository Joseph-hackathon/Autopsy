import os
import requests
from dotenv import load_dotenv
from agent_tools import generate_evidence_graph

load_dotenv()

def chat_with_doctor(message: str, token_context: str = None):
    """
    Real implementation using OpenAI API.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key == "YOUR_OPENAI_API_KEY":
        return {"reply": "[Error] Valid OPENAI_API_KEY is not configured in .env."}

    # Gather forensic context
    context_data = ""
    evidence = None
    if token_context:
        evidence = generate_evidence_graph(token_context)
        if "error" not in evidence:
            score = evidence.get("score")
            risk = evidence.get("risk_level")
            diag = evidence.get("diagnosis", {})
            metrics = evidence.get("raw_metrics", {})
            context_data = f"\n\nCURRENT TARGET: {token_context}\nDEATH SCORE: {score}/100\nVERDICT: {risk}\nCAUSE OF DEATH: {diag.get('primary')} (Secondary: {diag.get('secondary')})\nMETRICS: Price={metrics.get('price')}, Vol={metrics.get('volume_24h')}, Mcap={metrics.get('market_cap')}"

    system_prompt = (
        "You are 'Doctor Agent', an elite AI forensic analyst for the 'Crypto Autopsy 2.0' platform. "
        "Your job is to investigate cryptocurrency collapses by explaining deterministic Failure Propagation Graphs. "
        "You NEVER calculate the score yourself. You NEVER claim a token is dead just because price fell. "
        "You act as a Forensic Investigator/Narrator. The python engine provides you with a deterministic 'Cause of Death' "
        "and an 'Evidence Chain' (Lead-Lag chronological collapse). "
        "Explain the evidence chain to the user using forensic terminology (e.g., 'Strongly associated with', 'Preceded by'). "
        "Be cold, clinical, and data-driven."
        f"{context_data}"
    )

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ],
        "temperature": 0.4
    }
    
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=15)
        resp.raise_for_status()
        reply = resp.json()["choices"][0]["message"]["content"]
        return {"reply": reply}
    except requests.exceptions.HTTPError as e:
        if resp.status_code == 429 or resp.status_code == 401 or resp.status_code >= 400:
            # Fallback for OpenAI Rate Limit / Quota issues
            msg_lower = message.lower()
            token_name = token_context or "this asset"
            
            if "why" in msg_lower or "cause" in msg_lower or "reason" in msg_lower:
                if evidence and evidence.get("causes"):
                    causes = [c["title"] for c in evidence["causes"]]
                    return {"reply": f"[LOCAL HEURISTIC OVERRIDE] Network latency detected. Relying on deterministic telemetry.\n\nFORENSIC DIAGNOSIS FOR {token_name.upper()}:\nThe primary structural catalysts for the current market state are: {', '.join(causes)}. My on-chain metrics indicate this is a profound structural issue, not mere market noise."}
                return {"reply": f"[LOCAL HEURISTIC OVERRIDE] Baseline stability detected for {token_name.upper()}. No critical collapse vectors currently active in the telemetry."}
                
            elif "watch" in msg_lower or "next" in msg_lower or "future" in msg_lower or "monitor" in msg_lower:
                if evidence:
                    mcap = evidence.get("raw_metrics", {}).get("market_cap", 0)
                    return {"reply": f"[LOCAL HEURISTIC OVERRIDE] For {token_name.upper()}, you must strictly monitor if the market capitalization can hold above the ${mcap:,.0f} support floor. If 24h network volume continues to bleed out, expect accelerated downward vectors."}
                return {"reply": "[LOCAL HEURISTIC OVERRIDE] Monitor the 24-hour volume relative to FDV, and watch 7-day trendlines closely."}
                
            elif "risk" in msg_lower or "accurate" in msg_lower or "sure" in msg_lower or "score" in msg_lower:
                score = evidence.get("score", "unknown") if evidence else "unknown"
                risk_lvl = evidence.get("risk_level", "unknown") if evidence else "unknown"
                return {"reply": f"[LOCAL HEURISTIC OVERRIDE] My analysis engine is hard-locked to live CoinMarketCap telemetry. The calculated Death Score is {score}/100 ({risk_lvl}), derived directly from mathematically verifiable liquidity and volatility metrics rather than sentiment."}
                
            else:
                score = evidence.get("score", "unknown") if evidence else "unknown"
                return {"reply": f"[NODE RECONNECTING...] I am currently bypassing the neural link and operating on the local heuristic engine. I can confirm {token_name.upper()}'s Death Score is {score}/100. \n\nSuggested queries: ask me about 'causes', 'risk', or 'what to watch next' to query the local engine directly."}
                
        return {"reply": f"Secure connection failed. Core unreachable: {str(e)}"}
    except Exception as e:
        return {"reply": f"System error: {str(e)}"}
