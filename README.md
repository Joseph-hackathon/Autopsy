# 🕵️‍♂️ Crypto Autopsy

**The Crypto Death Investigation Agent**  
*Built for the CoinMarketCap API Hackathon 2026*

---

## 📌 Project Overview
While the rest of the market is endlessly searching for the next "100x Moonshot," **Crypto Autopsy** takes the opposite approach. We act as forensic pathologists for dying and dead cryptocurrencies. 

Using live telemetry from the CoinMarketCap API, Crypto Autopsy investigates tokens experiencing severe drawdowns, liquidity collapses, or hyper-inflationary death spirals. It calculates a definitive **Death Risk Score (0-100)** and generates a comprehensive visual forensic report, complete with an AI "Doctor Agent" that allows users to interrogate the data in real-time.

## ✨ Key Features
- **Algorithmic Death Score**: Mathematically calculates the risk of token collapse based on 24h/7d/30d/90d price vectors, volume-to-mcap ratios, and FDV inflation overhangs.
- **Forensic Evidence Terminal**: A highly polished, Skynet-inspired UI that visualizes the exact causes of a token's failure using data-rich graphs and progress bars.
- **Doctor Agent (AI Terminal)**: An integrated AI chat agent (powered by OpenAI) that acts as a forensic expert. It ingests the CMC telemetry as context and answers your specific questions about a token's demise.
- **Built-in Rate Limit Resilience**: Features a dynamic heuristic fallback engine if the LLM core is unreachable, ensuring the terminal always operates during critical investigations.

## 🛠 CoinMarketCap API Integration
Crypto Autopsy relies heavily on the precision of CMC's live data pipelines:
1. `GET /v1/cryptocurrency/info`: Used to extract token identity, category tags, official website/social links, and max supply data.
2. `GET /v2/cryptocurrency/quotes/latest`: The core engine of our forensics. Extracts real-time price, 1h/24h/7d/30d/60d/90d percent changes, 24h volume, market cap, and fully diluted valuation (FDV).

*Note: By synthesizing the 30d/60d/90d data from the `/latest` endpoint, we successfully emulate macro-trend analysis without requiring the enterprise `/historical` endpoints.*

## 🚀 How to Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- A valid [CoinMarketCap API Key](https://pro.coinmarketcap.com/)
- A valid [OpenAI API Key](https://platform.openai.com/)

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

# Create a .env file and add your keys
echo "CMC_API_KEY=your_cmc_key_here" > .env
echo "OPENAI_API_KEY=your_openai_key_here" >> .env

# Run the server
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup (Next.js & Tailwind v4)
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:3000` to access the Forensic Terminal.

---
*Disclaimer: Crypto Autopsy is an educational and analytical tool built for a hackathon. It does not constitute financial advice.*
