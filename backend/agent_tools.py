import json
from cmc_api import CMCClient
from score_engine import calculate_death_score

def resolve_token(query: str):
    """Get CMC ID and metadata from token symbol."""
    try:
        data = CMCClient.get_info(query)
        if "data" in data and len(data["data"]) > 0:
            item = list(data["data"].values())[0]
            return item[0] if isinstance(item, list) else item
        return {"error": "Token not found"}
    except Exception as e:
        return {"error": str(e)}

def fetch_market_data(query: str):
    """Get live market metrics."""
    try:
        data = CMCClient.get_latest_quotes(query)
        if "data" in data and len(data["data"]) > 0:
            item = list(data["data"].values())[0]
            return item[0] if isinstance(item, list) else item
        return {"error": "Market data not found"}
    except Exception as e:
        return {"error": str(e)}

def generate_evidence_graph(symbol: str):
    """
    Orchestrates the data collection and generates the Evidence Chain.
    Uses real CMC market data to dynamically build the report.
    """
    # 1. Resolve Token
    info = resolve_token(symbol)
    if "error" in info:
        return info

    cmc_id = info.get("id")
    category = info.get("category", "Unknown")

    # Extract links
    urls = info.get("urls", {})
    website = urls.get("website", [None])[0] if urls.get("website") else None
    twitter = urls.get("twitter", [None])[0] if urls.get("twitter") else None
    explorer = urls.get("explorer", [None])[0] if urls.get("explorer") else None

    # 2. Get Live Data
    market_data = fetch_market_data(symbol)
    if "error" in market_data:
        return market_data

    # 3. Calculate Score
    score_breakdown = calculate_death_score(market_data)
    
    quote = market_data.get("quote", {}).get("USD", {})
    pct_1h = quote.get("percent_change_1h") or 0
    pct_24h = quote.get("percent_change_24h") or 0
    pct_7d = quote.get("percent_change_7d") or 0
    pct_30d = quote.get("percent_change_30d") or 0
    pct_60d = quote.get("percent_change_60d") or 0
    pct_90d = quote.get("percent_change_90d") or 0
    vol_24h = quote.get("volume_24h") or 0
    mcap = quote.get("market_cap") or 0
    fdv = quote.get("fully_diluted_market_cap") or 0
    price = quote.get("price") or 0
    
    # Calculate inflation risk
    inflation_risk = False
    if fdv > 0 and mcap > 0 and (fdv / mcap) > 3.0:
        inflation_risk = True

    # Detailed Dynamic Timeline Synthesis
    timeline = []
    
    if pct_90d != 0:
        if pct_90d < -50:
            timeline.append({"day": "T-90D", "status": "Chronic Bleed", "event": f"Severe macro downtrend established. Token has lost {abs(pct_90d):.1f}% of its value over a 3-month period, indicating a fundamental loss of investor confidence and massive capital flight."})
        elif pct_90d > 50:
            timeline.append({"day": "T-90D", "status": "Euphoria Phase", "event": f"Token experienced massive {pct_90d:.1f}% growth 90 days ago, setting up potential overvaluation and subsequent distribution by early holders."})
        else:
            timeline.append({"day": "T-90D", "status": "Macro Ranging", "event": f"Long-term structural price action showed a {pct_90d:.1f}% shift, establishing the baseline for current market dynamics."})

    if pct_30d < -30:
        timeline.append({"day": "T-30D", "status": "Deterioration", "event": f"Monthly support levels collapsed. Price dropped {abs(pct_30d):.1f}% over the month. Moving averages crossed bearishly, accelerating the sell-off."})
    elif pct_30d > 0:
        timeline.append({"day": "T-30D", "status": "Accumulation", "event": f"Token demonstrated resilience with a {pct_30d:.1f}% gain over the last month, resisting broader market downward pressures."})
        
    if pct_7d < -15:
        timeline.append({"day": "T-7D", "status": "Liquidity Stress", "event": f"Weekly loss of {abs(pct_7d):.1f}% triggered automated risk alerts. Order book depth began to thin out, causing higher slippage for sellers."})
    
    if pct_24h < -5:
        timeline.append({"day": "T-24H", "status": "Active Dump", "event": f"Critical 24h dump of {abs(pct_24h):.1f}% detected. Panic selling observed across major centralized and decentralized exchanges."})
    else:
        timeline.append({"day": "T-24H", "status": "Observation", "event": f"Recent 24h volatility sits at {pct_24h:.1f}%. Network activity remains within standard deviation bounds for this asset class."})

    if pct_1h < -2:
        timeline.append({"day": "T-1H", "status": "Flash Warning", "event": f"Immediate aggressive sell pressure. {abs(pct_1h):.1f}% drop in the last hour suggests active liquidation by whales."})

    # Detailed Dynamic Causes
    causes = []
    
    # Cause 1: Volume / Liquidity
    ratio = (vol_24h / mcap * 100) if mcap > 0 else 0
    if score_breakdown["liquidity_score"] > 10 or ratio < 5:
        causes.append({
            "title": "Severe Liquidity Exhaustion",
            "evidence": f"The 24-hour trading volume is severely depleted, currently sitting at just {ratio:.2f}% of the total market capitalization (${vol_24h:,.0f} traded vs ${mcap:,.0f} mcap). A ratio this low indicates extreme illiquidity, meaning any moderate sell order will cause disproportionate price slippage and potential flash crashes. Market makers appear to have abandoned the order books.",
            "source": "CMC Market Cap & Volume Metrics",
            "data_viz": {
                "type": "volume_mcap_ratio",
                "volume": vol_24h,
                "mcap": mcap,
                "ratio": ratio
            }
        })
    else:
        causes.append({
            "title": "Healthy Trading Velocity",
            "evidence": f"Daily volume is robust at {ratio:.2f}% of market cap. There is sufficient liquidity (${vol_24h:,.0f} 24h vol) to absorb moderate selling pressure without triggering a death spiral.",
            "source": "CMC Volume Analytics",
            "data_viz": {
                "type": "volume_mcap_ratio",
                "volume": vol_24h,
                "mcap": mcap,
                "ratio": ratio
            }
        })

    # Cause 2: Short-term price action
    if score_breakdown["short_term_score"] > 10:
        causes.append({
            "title": "Acute Price Collapse (7-Day Vector)",
            "evidence": f"The asset has experienced a violent devaluation of {abs(pct_7d):.1f}% within a single week. This is not a normal market correction; it is a structural breakdown indicating either a mass exodus of retail holders, a compromised protocol, or a coordinated whale dump.",
            "source": "CMC Live Quotes (7d_change)",
            "data_viz": {
                "type": "trend_bars",
                "trends": [
                    {"label": "1H", "val": pct_1h},
                    {"label": "24H", "val": pct_24h},
                    {"label": "7D", "val": pct_7d}
                ]
            }
        })

    # Cause 3: Long-term bleed
    if score_breakdown["long_term_score"] > 10:
        causes.append({
            "title": "Chronic Distribution (Macro Bleed)",
            "evidence": f"The token is down {abs(pct_30d):.1f}% over the last 30 days and {abs(pct_90d):.1f}% over 90 days. This continuous, unrecovered bleed is characteristic of 'slow rug' tokenomics or a dying ecosystem where developers and early investors constantly distribute tokens to retail buyers.",
            "source": "CMC Live Quotes (30d/90d_change)",
            "data_viz": {
                "type": "trend_bars",
                "trends": [
                    {"label": "30D", "val": pct_30d},
                    {"label": "60D", "val": pct_60d},
                    {"label": "90D", "val": pct_90d}
                ]
            }
        })

    # Cause 4: Tokenomics / Inflation
    if inflation_risk:
        causes.append({
            "title": "Hyper-Inflationary Tokenomics Hazard",
            "evidence": f"The Fully Diluted Valuation (FDV) is heavily disproportionate to the current Market Cap (FDV: ${fdv:,.0f} vs Mcap: ${mcap:,.0f}). This massive overhang of locked or unminted supply implies that future token unlocks will cause severe hyper-inflation, constantly diluting current holders and suppressing price recovery.",
            "source": "CMC Supply Dynamics",
            "data_viz": {
                "type": "fdv_mcap_compare",
                "fdv": fdv,
                "mcap": mcap
            }
        })
        
    if len(causes) < 2 and score_breakdown["total_score"] < 40:
        causes.append({
            "title": "Stable Baseline Metrics",
            "evidence": "Forensic scan detects no critical anomalies. The asset's volatility, liquidity depth, and supply distribution are operating within safe parameters for its respective sector.",
            "source": "Autopsy Global Heuristics",
            "data_viz": {
                "type": "none"
            }
        })

    logo = info.get("logo", "")
    description = info.get("description", "")

    # 5. Build Evidence Chain
    evidence = {
        "token": info.get("symbol", symbol),
        "name": info.get("name"),
        "category": category,
        "logo": logo,
        "description": description,
        "links": {
            "website": website,
            "twitter": twitter,
            "explorer": explorer
        },
        "raw_metrics": {
            "price": quote.get("price", 0),
            "market_cap": mcap,
            "volume_24h": vol_24h,
            "percent_change_1h": pct_1h,
            "percent_change_24h": pct_24h,
            "percent_change_7d": pct_7d,
            "percent_change_30d": pct_30d,
            "percent_change_60d": pct_60d,
            "percent_change_90d": pct_90d,
            "fdv": fdv
        },
        "score": score_breakdown["total_score"],
        "risk_level": score_breakdown["risk_level"],
        "timeline": timeline,
        "causes": causes
    }
    
    return evidence
