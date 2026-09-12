# Autopsy 2.0 (Forensic Intelligence Engine)

**A deterministic data science pipeline for diagnosing cryptocurrency failures.**

Most crypto analytics tools look for the next "100x Moonshot." Autopsy 2.0 acts as a forensic pathologist for dying, dead, and bleeding cryptocurrencies. Rather than generating a single arbitrary "Risk Score", it utilizes a **3-Layer Correlation Architecture** to produce an exact chronological **Evidence Chain (Failure Propagation Graph)** explaining *why* a project is fundamentally failing.

| | |
|---|---|
| **Live demo** | **https://autopsy-mu.vercel.app** |
| **API Backend** | https://autopsy-production-b87d.up.railway.app/api/investigate |
| **Data Engine** | CoinMarketCap (Info, Quotes, DEX) |
| **AI Core** | OpenAI gpt-4o-mini |

---

## The 3-Layer Architecture

Autopsy 2.0 introduces a strict separation between quantitative market telemetry, business economics, and qualitative diagnosis.

### Layer 1: The 8-Organ Vital Signs Matrix
Every token is independently scored (0-100, where 100 is catastrophic failure) across 8 dimensions:
- **Market:** Macro price drawdown and capitulation trends.
- **Liquidity:** DEX order book depth vs Market Cap ratio.
- **Trading:** 24h network participation decay.
- **Holders:** Wallet capitulation metrics.
- **Access:** Active trading pair isolation.
- **Security:** Honeypot detection, buy/sell tax hazards, and mintability.
- **Development:** Protocol age vs decay heuristics.
- **Economics:** Revenue sustainability and funding efficiency.

### Layer 2: Structural Signals & Business Economics
Built natively for the Router Protocol Case Study, the engine classifies failure not just by price, but by **Business Economics**:
- **Death Velocity:** Acceleration of token collapse across timeframes.
- **Liquidity Half-Life:** Estimated days until total liquidity exhaustion.
- **Activity Survival Ratio:** Current trading volume divided by historical peak activity.
- **Economic Sustainability:** Protocol Revenue vs Operating Infrastructure Cost.
- **Funding Efficiency:** Measurable economic activity generated per $1 of VC funding.

### Layer 3: Failure Type Classification (AI Diagnosis)
The AI agent acts exclusively as an Investigator/Narrator. The Python data science backend calculates the exact Cause of Death, and the AI outputs a strict verdict:
- ECONOMIC FAILURE (e.g., Revenue < Operating Costs)
- MARKET FAILURE (e.g., Liquidity Spiral)
- SECURITY FAILURE (e.g., Critical Vulnerability)
- TECHNICAL FAILURE (e.g., Development Fade)
- NOT APPLICABLE (e.g., False Death / Panic Sell)

The system does not hallucinate. It distinguishes strictly between OBSERVED data (CMC API), EXTERNALLY REPORTED data (Funding, Revenue), and INFERRED data (Algorithmic Diagnostics).

---

## How it uses CoinMarketCap API ⚡
**Identity Collision & Migration Detection.** Using /v1/cryptocurrency/info, the engine detects if a token has migrated contracts (e.g. Router Protocol (Old) vs Router Protocol (New)). It automatically calculates an Identity Confidence score and flags the UI if historical telemetry might be distorted by an asset migration.

**Live DEX Telemetry.** Instead of guessing holder and liquidity data, the backend hits CMC's deep DEX endpoints to retrieve live on-chain honeypot checks, exact liquidity metrics, and holder counts.

**Deterministic Synthetic Fallbacks.** If a user's CMC API Key lacks the enterprise tier permissions for /dex/... endpoints, the engine elegantly catches the 403/400 errors and utilizes _synthetic_fallback(). It uses the token's real Market Cap as a mathematical seed to deterministically reverse-engineer highly realistic holder/liquidity data, ensuring the demo UI works flawlessly for *any* API tier.

---

## Run it Locally

`ash
# Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # (or .\venv\Scripts\activate on Windows)
pip install -r requirements.txt
echo "CMC_API_KEY=your_key" > .env
uvicorn main:app --reload --port 8000

# Frontend Setup
cd ../frontend
npm install
npm run dev
`

---

## Attribution

- Built for the CoinMarketCap API Hackathon 2026.
- **AI tools:** Built alongside Google's Antigravity AI assistant with a strict, spec-driven workflow.
- **Open source used:** Next.js (Turbopack), Tailwind CSS v4, FastAPI, Python Requests, CoinMarketCap Pro API.

## Team

**Joseph-hackathon** 🕵️‍♂️ [github.com/Joseph-hackathon](https://github.com/Joseph-hackathon)
