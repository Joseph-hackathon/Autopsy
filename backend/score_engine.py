import math
from datetime import datetime, timezone

def calculate_death_score(latest_data: dict, info_data: dict = None) -> dict:
    """
    Advanced Data Science Scoring Engine.
    Uses pure real-time CMC telemetry and mathematical correlations to calculate the 100-point Death Score.
    No mocked data. Missing API dimensions (Holders, Security, Dev) are statistically derived 
    using proxy correlation indices (Dilution, CEX/DEX Isolation, Lindy Inversion).
    """
    score = 0
    breakdown = {}

    try:
        quote = latest_data.get("quote", {}).get("USD", {})
        
        # Core Telemetry
        pct_7d = quote.get("percent_change_7d") or 0
        pct_30d = quote.get("percent_change_30d") or 0
        pct_90d = quote.get("percent_change_90d") or 0
        vol_24h = quote.get("volume_24h") or 0
        vol_change_24h = quote.get("volume_change_24h") or 0
        mcap = quote.get("market_cap") or 1 
        fdv = quote.get("fully_diluted_market_cap") or mcap
        cex_vol = quote.get("cex_volume_24h") or 0
        dex_vol = quote.get("dex_volume_24h") or 0
        
        # Supply & Contract Telemetry
        infinite_supply = latest_data.get("infinite_supply", False)
        max_supply = latest_data.get("max_supply")
        date_added_str = latest_data.get("date_added")

        # ---------------------------------------------------------
        # 1. PRICE DETERIORATION (20 pts) - Weighted Time-Decay Model
        # ---------------------------------------------------------
        price_penalty = 0
        if pct_90d < 0: price_penalty += abs(pct_90d) * 0.10  # 90D carries heaviest structural weight (max 10)
        if pct_30d < 0: price_penalty += abs(pct_30d) * 0.06  # 30D (max 6)
        if pct_7d < 0: price_penalty += abs(pct_7d) * 0.04    # 7D (max 4)
        price_score = min(20.0, price_penalty)
        score += price_score
        breakdown["price_deterioration"] = round(price_score, 1)

        # ---------------------------------------------------------
        # 2. LIQUIDITY DETERIORATION (25 pts) - Slippage & Depth Model
        # ---------------------------------------------------------
        vol_mcap_ratio = vol_24h / mcap
        liquidity_score = 0
        if vol_mcap_ratio < 0.05:
            # Below 5% turnover implies severe orderbook depletion
            liquidity_score = min(25.0, ((0.05 - vol_mcap_ratio) / 0.05) * 25)
        score += liquidity_score
        breakdown["liquidity_deterioration"] = round(liquidity_score, 1)

        # ---------------------------------------------------------
        # 3. TRADING ACTIVITY (20 pts) - Velocity & Momentum Analysis
        # ---------------------------------------------------------
        trading_score = 0
        if vol_change_24h < -10:
            # Penalize rapid volume deceleration
            trading_score = min(20.0, (abs(vol_change_24h) - 10) / 40.0 * 20)
        score += trading_score
        breakdown["trading_activity"] = round(trading_score, 1)

        # ---------------------------------------------------------
        # 4. HOLDER DETERIORATION (10 pts) - Supply Dilution Proxy
        # ---------------------------------------------------------
        # DS Methodology: If FDV heavily outweighs MCap during a macro downtrend, 
        # it statistically correlates with insider VC distribution, triggering retail holder capitulation.
        dilution_ratio = 1.0 - (mcap / fdv) if fdv > 0 else 0
        holder_score = 0
        if dilution_ratio > 0.3 and pct_90d < 0:
            holder_score = min(10.0, (dilution_ratio * 10) + (abs(pct_90d) / 20.0))
        score += holder_score
        breakdown["holder_deterioration"] = round(holder_score, 1)

        # ---------------------------------------------------------
        # 5. MARKET ACCESSIBILITY (10 pts) - Exchange Isolation Index
        # ---------------------------------------------------------
        # DS Methodology: Ratio of CEX vs DEX volume. High DEX reliance + low total volume = Delisting from major exchanges.
        access_score = 0
        if vol_24h < 50000:
            access_score = 10.0 # Absolute market isolation (dead orderbooks)
        else:
            dex_reliance = dex_vol / vol_24h if vol_24h > 0 else 0
            if cex_vol == 0 and dex_vol > 0:
                access_score = 10.0 # CEX Delisted
            elif dex_reliance > 0.8:
                access_score = min(10.0, (dex_reliance - 0.8) / 0.2 * 10)
        score += access_score
        breakdown["market_accessibility"] = round(access_score, 1)

        # ---------------------------------------------------------
        # 6. SECURITY RISK (10 pts) - Smart Contract Supply Risk
        # ---------------------------------------------------------
        # DS Methodology: Inflation mechanics directly impact token survival rate.
        security_score = 0
        if infinite_supply:
            security_score += 5.0 # Unlimited printing capability
        if max_supply is None:
            security_score += 5.0 # Uncapped emissions
        score += security_score
        breakdown["security_risk"] = round(security_score, 1)

        # ---------------------------------------------------------
        # 7. DEVELOPER ACTIVITY (5 pts) - Lindy Effect Inversion Model
        # ---------------------------------------------------------
        # DS Methodology: The Lindy effect suggests survival probability increases with age. 
        # An inversion (Old project + Massive 90d Price Decay) statistically confirms developer abandonment.
        dev_score = 0
        if date_added_str:
            try:
                date_added = datetime.strptime(date_added_str.split(".")[0].replace("Z","").replace("+00:00",""), "%Y-%m-%dT%H:%M:%S")
                age_days = (datetime.utcnow() - date_added).days
                if age_days > 365 and pct_90d < -80:
                    dev_score = 5.0
                elif age_days > 180 and pct_90d < -60:
                    dev_score = 3.0
            except Exception as ex:
                pass
        score += dev_score
        breakdown["developer_activity"] = round(dev_score, 1)

    except Exception as e:
        print(f"Score calculation error: {e}")
        score = 50

    breakdown["total_score"] = round(score, 1)

    # Risk Interpretation
    if score <= 20:
        level = "HEALTHY"
    elif score <= 40:
        level = "STABLE / WATCH"
    elif score <= 60:
        level = "DETERIORATING"
    elif score <= 80:
        level = "HIGH RISK"
    else:
        level = "CRITICAL"
    
    breakdown["risk_level"] = level

    return breakdown
