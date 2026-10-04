# Autopsy (Forensic Intelligence Engine)

**A deterministic data science pipeline for diagnosing cryptocurrency failures.**

Most crypto analytics tools look for the next "100x Moonshot." Autopsy acts as a forensic pathologist for dying, dead, and bleeding cryptocurrencies. Rather than generating a single arbitrary "Risk Score", it utilizes a **3-Layer Correlation Architecture** to produce an exact chronological **Evidence Chain (Failure Propagation Graph)** explaining *why* a project is fundamentally failing.

| | |
|---|---|
| **Live demo** | **https://autopsy-mu.vercel.app** |
| **API Backend** | https://autopsy-production-b87d.up.railway.app/api/investigate |
| **Data Engine** | CoinMarketCap (Info, Quotes, Map, DEX) + Universal On-Chain Explorers |
| **AI Core** | OpenAI gpt-4o-mini |

---

## 🔬 What's New in Autopsy 2.0 & Recent Tech Updates

Autopsy has evolved from a simple pricing analytics tool into an **Institutional-Grade Forensic Intelligence Platform**:

### 1. Multi-Source Forensic Telemetry Pipeline (`forensic_telemetry.py`)
Single-source price feeds often present a "False Negative" where dead tokens appear healthy due to synthetic market-making volume. Autopsy cross-correlates three independent data vectors for **ANY** queried cryptocurrency:
- **Universal On-Chain Explorer Telemetry:** Automatically maps to verified block explorers (**Etherscan, BscScan, Solscan, Blastscan, Arbiscan, Polygonscan, BaseScan**). Detects contract freezing, daily transaction decay rates (-99%+ collapse), 24h active interacting wallets, and net 30-day liquidity drain.
- **Social & Governance Broadcast Monitoring:** Direct ingestion of official X (Twitter) channels and governance announcements. Catches verified project deprecations, developer disengagement, and official shutdown declarations (e.g. Blast, SafeMoon, FTX, Terra).
- **Multi-Year Macro Structural Economics:** Audits long-term unit economics by comparing estimated monthly protocol revenue against infrastructure & sequencer operating costs (revealing deficit traps where revenue covers less than 5% of node expenses).

### 2. Institutional Forensic Research Report Modal (4Pillars-Inspired Format)
Directly within the web interface, users can generate a comprehensive, multi-page **Post-Mortem Research Paper**:
- **01. Executive Summary & Forensic Verdict:** Algorithmic verdict, Terminal Death Score, and official broadcast signal verification.
- **02. Macro Drawdown & Market Anatomy:** Multi-quarter trajectory, 90D/30D drawdown velocity, and FDV supply overhang ratio.
- **03. 8-Organ Vital Sign Decomposition:** Quantitative 0-100 severity matrix across Market, Liquidity, Trading, Holders, Access, Security, Development, and Economics.
- **04. On-Chain Activity & Freezing Analysis:** Verified smart contract throughput, user abandonment metrics, and interactive links to cross-examine on block explorers.
- **05. Economic Sustainability & Deficit Audit:** Monthly protocol fee revenue vs. runtime operating overhead (L2 sequencer, RPC infrastructure).
- **06. Post-Mortem Taxonomy & Lessons:** Institutional takeaways highlighting synthetic volume illusions and incentive-driven retention decay.
- **Print & Export Ready:** Full support for inline modal reading and browser PDF/Print export.

### 3. Smart Rank-Based Token Identity Resolver (`/v1/cryptocurrency/map`)
Resolves ambiguous ticker collisions. Searching for common symbols (e.g. `BLAST`, `ROUTE`) queries CoinMarketCap's Map API and sorts by verified **CMC Market Cap Rank**, ensuring the engine targets the legitimate primary protocol rather than defunct legacy tokens.

---

## 🏛️ The 3-Layer Forensic Architecture

Autopsy introduces a strict separation between quantitative market telemetry, business economics, and qualitative diagnosis.

### Layer 1: The 8-Organ Vital Signs Matrix
Every token is independently scored (0-100, where 100 is catastrophic failure) across 8 dimensions:
- **Market:** Macro price drawdown and capitulation trends.
- **Liquidity:** DEX order book depth vs Market Cap ratio.
- **Trading:** 24h network participation decay and on-chain tx velocity.
- **Holders:** Wallet capitulation metrics and 24h active interacting addresses.
- **Access:** Active trading pair isolation and CEX/DEX delisting status.
- **Security:** Honeypot detection, buy/sell tax hazards, and contract mintability.
- **Development:** Protocol age vs engineering deprecation / roadmap termination.
- **Economics:** Revenue sustainability, infrastructure cost coverage, and funding efficiency.

### Layer 2: Structural Signals & Business Economics
The engine classifies failure not just by price, but by **Core Unit Economics**:
- **Death Velocity:** Acceleration of token collapse across timeframes (Terminal vs Accelerating).
- **Liquidity Half-Life:** Estimated days until total liquidity pool exhaustion.
- **Activity Survival Ratio:** Current trading volume divided by historical peak activity.
- **Economic Sustainability:** Protocol Revenue vs Operating Infrastructure Cost.
- **Supply Overhang Ratio:** FDV divided by circulating market capitalization.

### Layer 3: Failure Type Classification (AI Diagnosis)
The AI agent acts as a forensic pathologist. The Python data science backend calculates the exact Cause of Death, and the AI outputs a strict diagnosis:
- `PROTOCOL SUNSET & SHUTDOWN` (Official team termination / cessation of operations)
- `ECONOMIC FAILURE` (Operating costs outpace protocol fee capture)
- `MARKET FAILURE` (Liquidity Spiral & Slippage Trap)
- `SECURITY FAILURE` (Exploit, honeypot, or critical vulnerability)
- `ADOPTION COLLAPSE` (On-chain transaction freezing & user abandonment)
- `NOT APPLICABLE` (False Death / Panic Capitulation without structural decay)

---

## 📡 CoinMarketCap API Integration & Multi-Vector Telemetry

Autopsy is deeply anchored in the data breadth of the **CoinMarketCap Pro API** and verified blockchain telemetry:

### 1. Identity Resolution & Rank Disambiguation (`/v1/cryptocurrency/map` & `/v1/cryptocurrency/info`)
- Eliminates ambiguous coin duplicates by cross-referencing CMC Rank.
- Extracts contract addresses, official social feeds (X/Twitter), and blockchain explorer endpoints.

### 2. Market Dynamics & Drawdown Matrices (`/v2/cryptocurrency/quotes/latest`)
- Calculates Supply Overhang Ratios using `volume_24h` and `fully_diluted_market_cap`.
- Evaluates lack of mean reversion across multi-timeframe quotes (1h, 24h, 7d, 30d, 60d, 90d).

### 3. On-Chain Liquidity & Security Profiling (`/v3/dex/quotes/latest`)
- Queries decentralized pool depth to measure real slippage risk.
- Extracts security signals including honeypot flags, malicious proxies, and tax thresholds.

### 4. Cross-Verification with On-Chain Explorers & Social Broadcasts
- Cross-examines centralized quote telemetry with real block explorers (**Blastscan, Etherscan, BscScan, Solscan, Arbiscan**).
- Validates official operational status against verified public broadcasts and governance records.

### 5. Resilient Fallback Engine
- Features deterministic heuristics with synthetic simulation proxies if rate limits or enterprise endpoints are constrained, guaranteeing 100% demo uptime.

---

## 🛠️ Run it Locally

```bash
# 1. Clone Repository
git clone https://github.com/Joseph-hackathon/Autopsy.git
cd Autopsy

# 2. Backend Setup
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
# Add CMC API key in backend/.env:
# CMC_PRO_API_KEY=your_key_here

uvicorn main:app --reload --port 8000

# 3. Frontend Setup
cd ../frontend
npm install
npm run dev
```

---

## 🏆 Hackathon Submission & Attribution

- **Hackathon:** Build with CMC: API Hackathon (DoraHacks 2026)
- **Track:** Data and Visualisation / AI Track
- **Core Stack:** Next.js 16 (Turbopack), Tailwind CSS, FastAPI, Python Requests, CoinMarketCap Pro API, Block Explorers (Blastscan, Etherscan, Solscan).
- **Repository:** [github.com/Joseph-hackathon/Autopsy](https://github.com/Joseph-hackathon/Autopsy)

---

## 👥 Team

**Joseph-hackathon** - [github.com/Joseph-hackathon](https://github.com/Joseph-hackathon)
