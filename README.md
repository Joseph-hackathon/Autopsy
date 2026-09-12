# Crypto Autopsy

**Describe a bleeding cryptocurrency. Get a transparent, live 100-point Death Score and an AI forensic report.**

Most crypto analytics tools look for the next 100x gem. This platform acts as a forensic pathologist for dying, dead, and bleeding cryptocurrencies. Every query triggers a real-time scan across CoinMarketCap's live telemetry to calculate a definitive Death Risk Score, backed by a deterministic data science pipeline.

| | |
|---|---|
| **Live demo** | **http://localhost:3000** |
| **API Backend** | `http://localhost:8000/api/investigate` |
| **MCP Compatibility** | Planned for V2 |
| **AI Core** | `gpt-4o-mini` |

> **Status.** Everything marked ✅ below was verified by live HTTP requests to the CoinMarketCap API and real LLM generations, not inferred from mocked data. What isn't built natively by the API is listed under [Not in scope](#not-in-scope) and clearly proxy-calculated rather than left ambiguous. 

---

## Why

While the entire cryptocurrency market is endlessly searching for the next "100x Moonshot," investors continually lose capital by failing to recognize the structural breakdown of a token's momentum and liquidity. Crypto Autopsy acts as an early warning system and a post-mortem analysis tool.

## What an Autopsy is

```
price deterioration ──────── liquidity exhaustion ──────── market isolation
(macro trends)               (order book depletion)        (CEX vs DEX ratio)
live API metrics             mathematical derivation       on-chain heuristics
```

The 100-point score is not a random number: **depth encodes severity**. An autopsy always renders its exact point deductions, its data visualizations, and its mathematical findings. You can see exactly *why* a token is dying by looking at the forensic report.

**The platform does not hallucinate data.** It emits deterministic findings based on hard math. The LLM "Doctor Agent" only generates qualitative diagnoses *after* the backend Python engine provides the strict mathematical telemetry constraints.

---

## How it uses CoinMarketCap API ✅

**Standardized Endpoint Resolution.** The backend interfaces with CMC via `GET /v1/cryptocurrency/info` and `GET /v2/cryptocurrency/quotes/latest`. 

**Smart Dual-Resolution.** If a user searches for "SafeMoon" (Project Name) instead of "SAFEMOON" (Ticker), the standard `/info?symbol=` endpoint throws a 400 Bad Request. We explicitly catch this and fallback to `/info?slug=` with a hyphenated string (`safemoon`). This guarantees the question nobody anticipated still resolves.

**Live Data Fan-Out.** One query fires shape requests for:
- 1h / 24h / 7d / 30d / 60d / 90d Price Vectors
- 24h Volume, CEX Volume, DEX Volume
- Market Cap and Fully Diluted Valuation (FDV)
- Infinite Supply Flags and Max Supply Caps

**Two things we do with live data that a demo usually hides:**
- **Dead deployments are handled, not silently dropped.** For completely dead tokens (e.g. SafeMoon, FTT), CMC API often returns literal `null` for `market_cap` or `volume_24h` instead of `0`. The pipeline safely coalesces `null` to `0` instead of crashing the backend `float` division engine.
- **We explicitly render live CEX/DEX volume isolation.** We do not fake "delisting" metrics.

---

## The Data Science Engine ✅

Because the free-tier API lacks on-chain Holder data and GitHub developer commits, we do not mock these numbers arbitrarily. Instead, we use **Pure Proxy Correlations**:

- **Holder Capitulation (Supply Dilution Proxy):** If a token has an FDV vastly higher than its Market Cap (e.g., >30% dilution overhang) during a negative 90-day macro trend, it mathematically correlates to VC/insider token unlocks dumping on retail buyers, causing widespread holder exodus.
- **Market Isolation (CEX/DEX Ratio):** We check `cex_volume_24h` vs `dex_volume_24h`. If total volume < $50,000, or if CEX volume is $0 while DEX volume is active, we score a maximum penalty for "Severe Exchange Isolation" (delisting).
- **Lindy Effect Inversion:** If a project is >365 days old (`date_added`) and experiences a massive 90-day structural decay (>80%), it statistically confirms developer abandonment.

---

## Safety & Fallbacks

**Rate Limit Resilience.** The LLM Doctor Agent uses a provided OpenAI API key. Since free or non-funded keys reliably hit `429 Too Many Requests`, the chat agent pipeline intercepts `requests.exceptions.HTTPError` specifically for 429s and gracefully degrades to a local heuristic fallback engine. The terminal keeps working even when the LLM quota is exhausted.

---

## Run it

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

With no API keys, the backend will fail. You must provide a valid `CMC_API_KEY` for the live telemetry to work. The `OPENAI_API_KEY` is optional; if omitted or rate-limited, the AI terminal degrades to a local heuristic fallback.

---

## Not in scope

Named explicitly, because a vague scope claim is worse than a small one:

- **True On-Chain Holder Metrics.** We use Supply Dilution Proxies (FDV vs MCap) to deduce holder capitulation. We do not index actual Ethereum/Solana RPCs for unique wallet counts.
- **GitHub Commit Tracking.** We use the Lindy Inversion (Age vs Price Decay) to deduce developer abandonment. We do not hit the GitHub API for actual PR/commit counts.
- **Historical Chart Rendering.** We render mini trend-bars based on current 1h/24h/7d/30d percent changes. We do not query the CMC `/v3/historical` endpoint (which requires an enterprise license) to draw full TradingView candlestick charts.
- **A shared, browsable registry.** The terminal is a single-session forensic tool. It does not save past autopsies to a shared database like Postgres/Supabase.

---

## Attribution

- Built for the CoinMarketCap API Hackathon 2026.
- **AI tools:** Built alongside Google's Antigravity AI assistant with a strict, spec-driven workflow.
- **Open source used:** Next.js (Turbopack), Tailwind CSS v4, FastAPI, Python Requests, CoinMarketCap Pro API.

## Team

**Joseph-hackathon** — [github.com/Joseph-hackathon](https://github.com/Joseph-hackathon)
