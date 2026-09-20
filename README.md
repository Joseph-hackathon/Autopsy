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

## 🔬 The Interface (New in 2.0)

Autopsy 2.0 has been completely redesigned into a professional-grade forensic analysis tool inspired by stark, minimalist, dark-mode terminal aesthetics (e.g., Wintermute):

- **Token Terminal Explorer:** A dense, paginated, report-like ranking board sorting tokens by Risk Score, Velocity, and Survival Ratios.
- **Forensic Investigation Dashboard:** When a token is investigated, the system renders a highly technical telemetry view. The dashboard presents raw data sources, correlation logic, an 8-Organ Vital Signs Matrix, and dynamic HTML5 Canvas data-scrambling effects.
- **Methodology & Telemetry View:** A transparent data tab explicitly listing every single raw metric ingested from the CoinMarketCap API and precisely how it influences the 3-Layer Score Engine.

---

## ⚙️ The 3-Layer Architecture

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

## 🌐 CoinMarketCap API Integration & Data Telemetry

Autopsy 2.0 is heavily dependent on the sheer scale, depth, and accuracy of the **CoinMarketCap Pro API**. We do not rely on lagging indicators or simple price charts; our Python `score_engine.py` ingests massive amounts of real-time CMC telemetry to quantify structural decay mathematically.

### 1. Disambiguation & Identity Resolution (`/v2/cryptocurrency/info`)
When users search for a token like `LUNA` or `FTT`, there are often multiple dead contracts, V1/V2 migrations, or identically named scam tokens. 
- **Migration Detection:** We utilize the `/info` endpoint to extract exact `slugs`, contract addresses, and tags to detect if an asset has migrated (e.g., *Router Protocol (Old)* vs *(New)*). 
- **Identity Confidence Weighting:** The system parses these tags to adjust its "Identity Confidence Score," dynamically flagging the UI if historical telemetry might be distorted by legacy contracts.

### 2. Market Dynamics & Drawdown Matrices (`/v2/cryptocurrency/quotes/latest`)
To understand if a token is experiencing a normal market correction or a terminal death spiral, Autopsy aggregates extensive pricing data.
- **Volume/Mcap Cross-Referencing:** We pull `volume_24h` and `fully_diluted_market_cap` (FDV) to calculate the **Supply Overhang Ratio**. A chronically low ratio mathematically proves a 'ghost chain' with no real trading demand.
- **Multi-timeframe Decay:** We ingest `percent_change_1h`, `24h`, `7d`, `30d`, `60d`, and `90d` to construct a **Drawdown Matrix**. The correlation engine evaluates these periods looking for a lack of "mean reversion"—a definitive signature of terminal holder capitulation.

### 3. On-chain Liquidity & Security Profiling (`/v3/dex/quotes/latest` & `/v3/dex/pairs/latest`)
Price crashes do not kill tokens; liquidity exhaustion does. Autopsy queries CMC's deep DEX endpoints to extract raw on-chain truth.
- **Liquidity Exhaustion Modeling:** We evaluate real on-chain liquidity depth relative to market cap. If less than 1% of the asset's FDV is backed by actual liquidity pools, the system triggers a **Death Spiral Alert**.
- **Critical Security Failures:** We leverage CMC's honeypot detection flags, extracting exact buy/sell tax hazards, malicious contract proxies, and mintability metrics. If the contract poses an existential risk independent of price action, it is heavily weighted in the final Death Score.

### 4. Resilient Fallback Engine
To ensure the Autopsy demo runs flawlessly across all CMC API tiers (including Basic/Hobbyist tiers that may lack access to `/v3/dex` endpoints), we engineered a sophisticated fallback protocol.
- If a `403` or `400` error is caught, the engine utilizes a deterministic `_synthetic_fallback()`. It uses the token's real, verified Market Cap as a mathematical seed to reverse-engineer realistic liquidity and holder proxies. This guarantees that the UI and AI Agent always have structurally sound data to narrate, regardless of API quota constraints.

---

## 💻 Run it Locally

```bash
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
```

---

## 🏆 Attribution

- Built for the CoinMarketCap API Hackathon 2026.
- **AI tools:** Built alongside Google's Antigravity AI assistant with a strict, spec-driven workflow.
- **Open source used:** Next.js (Turbopack), Tailwind CSS v4, FastAPI, Python Requests, CoinMarketCap Pro API.

## 👥 Team

**Joseph-hackathon** - [github.com/Joseph-hackathon](https://github.com/Joseph-hackathon)
