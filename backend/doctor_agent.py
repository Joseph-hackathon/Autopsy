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
            causes = [c["title"] for c in evidence.get("causes", [])]
            metrics = evidence.get("raw_metrics", {})
            context_data = f"\n\nCURRENT INVESTIGATION TARGET: {token_context}\nDEATH SCORE: {score}/100\nRISK LEVEL: {risk}\nDETECTED CAUSES: {', '.join(causes)}\nMETRICS: Price={metrics.get('price')}, Vol={metrics.get('volume_24h')}, Mcap={metrics.get('market_cap')}"

    system_prompt = (
        "You are 'Doctor Agent', an elite AI forensic analyst for the 'Crypto Autopsy' platform. "
        "Your job is to investigate cryptocurrency collapses, rug pulls, and token deaths. "
        "You speak in a professional, cold, and highly analytical tone, like a forensic pathologist or cyber-security expert. "
        "The system algorithmically calculates a Death Risk Score (0-100) using real CoinMarketCap telemetry. "
        "Your role is to explain this data to the user, answer their questions, and give risk management advice."
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
        if resp.status_code == 429:
            # Fallback for OpenAI Rate Limit / Quota issues
            msg_lower = message.lower()
            token_name = token_context or "this asset"
            
            if "why" in msg_lower or "cause" in msg_lower or "reason" in msg_lower:
                if evidence and evidence.get("causes"):
                    causes = [c["title"] for c in evidence["causes"]]
                    return {"reply": f"[Fallback Mode: LLM Rate Limited] The primary catalysts for {token_name}'s current state are: {', '.join(causes)}. My telemetry indicates this is a structural issue, not just market noise."}
                return {"reply": f"[Fallback Mode] I cannot pinpoint a single severe cause for {token_name} at this moment. The metrics indicate baseline stability."}
                
            elif "watch" in msg_lower or "next" in msg_lower or "future" in msg_lower:
                if evidence:
                    mcap = evidence.get("raw_metrics", {}).get("market_cap", 0)
                    return {"reply": f"[Fallback Mode: LLM Rate Limited] For {token_name}, you must monitor if the market cap can hold above the ${mcap:,.0f} support level. If 24h volume does not recover, expect further downward vectors."}
                return {"reply": "[Fallback Mode] Monitor the 24-hour volume and 7-day trendlines closely."}
                
            elif "risk" in msg_lower or "accurate" in msg_lower or "sure" in msg_lower:
                score = evidence.get("score", "unknown") if evidence else "unknown"
                risk_lvl = evidence.get("risk_level", "unknown") if evidence else "unknown"
                return {"reply": f"[Fallback Mode: LLM Rate Limited] Yes. My analysis is strictly based on live CMC data. The calculated Death Score is {score}/100 ({risk_lvl}), derived directly from mathematically verifiable liquidity and volatility metrics."}
                
            else:
                score = evidence.get("score", "unknown") if evidence else "unknown"
                return {"reply": f"[Fallback Mode: LLM Rate Limited] I am currently operating under restricted bandwidth (OpenAI API 429 Error: Quota Exceeded). However, I can confirm {token_name}'s Death Score is {score}/100. Please ask about 'risk', 'causes', or 'what to watch next' for local heuristic analysis."}
                
        return {"reply": f"Secure connection failed. LLM core unreachable: {str(e)}"}
    except Exception as e:
        return {"reply": f"System error: {str(e)}"}
