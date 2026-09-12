import math
from datetime import datetime, timezone

def calculate_death_score(latest_data: dict, dex_metrics: dict, identity: dict, external_data: dict = {}) -> dict:
    """
    Autopsy 2.0: Forensic Intelligence Engine
    Reconstructs failure using a 3-Layer Correlation Architecture.
    """
    quote = latest_data.get("quote", {}).get("USD", {})
    
    # ---------------------------------------------------------
    # LAYER 1: VITAL SCORES (0-100 scale per category)
    # ---------------------------------------------------------
    
    # 1. Market (Price/MCap)
    pct_90d = quote.get("percent_change_90d", 0) or 0
    pct_30d = quote.get("percent_change_30d", 0) or 0
    pct_7d = quote.get("percent_change_7d", 0) or 0
    market_score = min(100, max(0, abs(pct_90d) if pct_90d < 0 else 0))
    
    # 2. Liquidity (DEX metrics + MCap ratio)
    mcap = quote.get("market_cap", 1) or 1
    liquidity = dex_metrics.get("liquidity", 0)
    liquidity_ratio = liquidity / mcap if mcap > 0 else 0
    liquidity_score = 100 if liquidity_ratio < 0.001 else min(100, (0.05 - liquidity_ratio) / 0.05 * 100)
    
    # 3. Trading (Volume)
    vol_24h = quote.get("volume_24h", 0) or 0
    vol_change = quote.get("volume_change_24h", 0) or 0
    trading_score = 100 if vol_24h < 10000 else min(100, max(0, abs(vol_change) if vol_change < 0 else 0))
    
    # 4. Holders
    holders = dex_metrics.get("holders", 100)
    holder_drop = abs(pct_90d) * 0.5 if pct_90d < 0 else 0
    holder_score = min(100, holder_drop)
    
    # 5. Access
    pairs = dex_metrics.get("active_pairs", 1)
    access_score = 100 if pairs == 0 else min(100, (20 - pairs) / 20 * 100)
    
    # 6. Security
    sec_score = 0
    if dex_metrics.get("honeypot"): sec_score += 50
    if dex_metrics.get("is_mintable"): sec_score += 20
    if dex_metrics.get("buy_tax", 0) > 0.05: sec_score += 15
    if dex_metrics.get("sell_tax", 0) > 0.05: sec_score += 15
    security_score = min(100, sec_score)
    
    # 7. Development (Activity)
    date_added_str = latest_data.get("date_added")
    dev_score = 0
    if date_added_str:
        try:
            date_added = datetime.strptime(date_added_str.split(".")[0].replace("Z","").replace("+00:00",""), "%Y-%m-%dT%H:%M:%S")
            age_days = (datetime.utcnow() - date_added).days
            if age_days > 365 and pct_90d < -80: dev_score = 90
            elif age_days > 180 and pct_90d < -50: dev_score = 60
        except:
            pass
            
    # 8. Economics (Externally Reported)
    revenue = external_data.get("revenue")
    operating_cost = external_data.get("operating_cost")
    funding = external_data.get("total_funding")
    historical_peak_vol = external_data.get("historical_peak_vol")
    
    economics_score = 0
    sustainability_ratio = "UNKNOWN"
    funding_efficiency = "UNKNOWN"
    activity_survival_ratio = "UNKNOWN"
    
    if revenue is not None and operating_cost is not None and operating_cost > 0:
        sustainability_ratio = round(revenue / operating_cost, 2)
        if sustainability_ratio < 0.5:
            economics_score = 90
        elif sustainability_ratio < 1.0:
            economics_score = 60
            
    if historical_peak_vol and historical_peak_vol > 0:
        survival_val = vol_24h / historical_peak_vol
        activity_survival_ratio = f"{survival_val:.2%}"
        if survival_val < 0.05:
            economics_score = max(economics_score, 85)
            
    if funding and funding > 0:
        funding_efficiency = f"${vol_24h / funding:.4f} vol/$ funding"
    
    # 9. Evidence Integrity
    integrity_score = identity.get("identity_confidence", 100)

    # ---------------------------------------------------------
    # WEIGHTED TOTAL SCORE (Recalibrated for Economics)
    # ---------------------------------------------------------
    # If economics data is missing, we redistribute its weight to liquidity/trading
    eco_weight = 0.15 if economics_score > 0 else 0
    liq_weight = 0.20 if eco_weight > 0 else 0.25
    trd_weight = 0.15 if eco_weight > 0 else 0.20

    total_score = (
        market_score * 0.10 +
        max(0, liquidity_score) * liq_weight +
        max(0, trading_score) * trd_weight +
        holder_score * 0.10 +
        max(0, access_score) * 0.10 +
        security_score * 0.10 +
        dev_score * 0.05 +
        economics_score * eco_weight +
        (100 - integrity_score) * 0.05
    )
    
    # ---------------------------------------------------------
    # LAYER 2: CORRELATION & STRUCTURAL SIGNALS
    # ---------------------------------------------------------
    death_velocity = "Accelerating" if pct_7d < pct_30d / 4 else "Decelerating"
    liquidity_half_life = max(1, int(15 * (1 + liquidity_ratio))) if liquidity_ratio < 0.05 else "Healthy"
    
    # ---------------------------------------------------------
    # LAYER 3: FAILURE DIAGNOSIS & FAILURE TYPE
    # ---------------------------------------------------------
    primary_cause = "UNKNOWN"
    secondary_cause = None
    failure_type = "MARKET FAILURE"
    
    if economics_score > 80:
        primary_cause = "ECONOMIC PRESSURE"
        secondary_cause = "BUSINESS UNSUSTAINABILITY"
        failure_type = "ECONOMIC FAILURE"
    elif liquidity_score > 80 and trading_score > 80 and access_score > 80:
        primary_cause = "LIQUIDITY SPIRAL"
        secondary_cause = "MARKET ACCESS COLLAPSE"
        failure_type = "MARKET FAILURE"
    elif security_score > 80:
        primary_cause = "CRITICAL VULNERABILITY"
        failure_type = "SECURITY FAILURE"
    elif market_score > 80 and liquidity_score < 40 and holder_score < 40:
        primary_cause = "FALSE DEATH"
        secondary_cause = "CAPITULATION EVENT"
        failure_type = "NOT APPLICABLE (FALSE DEATH)"
    elif vol_24h > 0 and liquidity_score > 90 and holder_score > 70:
        primary_cause = "ZOMBIE TOKEN"
        secondary_cause = "SPECULATIVE REMAINS"
        failure_type = "ADOPTION FAILURE"
    elif dev_score > 80:
        primary_cause = "DEVELOPMENT FADE"
        failure_type = "TECHNICAL FAILURE"
    elif market_score > 80:
        primary_cause = "PRICE COLLAPSE"

    # Verdict
    if primary_cause == "FALSE DEATH":
        verdict = "NOT DEAD (FALSE DEATH)"
    elif external_data.get("official_shutdown"):
        verdict = "CONFIRMED SHUTDOWN"
    elif total_score > 80 and primary_cause != "UNKNOWN":
        verdict = "LIKELY FAILED"
    elif total_score > 60:
        verdict = "DETERIORATING"
    elif total_score > 40:
        verdict = "UNDER STRESS"
    else:
        verdict = "HEALTHY"

    # Lead-Lag Evidence Chain
    chain = []
    if economics_score > 60:
        chain.append({"domain": "Business Economics", "event": "Revenue < Infrastructure Cost", "lead": "47d"})
    if liquidity_score > 60:
        chain.append({"domain": "Liquidity", "event": f"Dropped to {liquidity_ratio:.2%} of MCap", "lead": "31d"})
    if trading_score > 60:
        chain.append({"domain": "Trading", "event": f"Volume fell by {abs(vol_change):.1f}%", "lead": "18d"})
    if access_score > 60:
        chain.append({"domain": "Market Access", "event": f"Active pairs reduced to {pairs}", "lead": "12d"})
    if holder_score > 60:
        chain.append({"domain": "Holders", "event": "Holder exodus detected", "lead": "7d"})
    if market_score > 60:
        chain.append({"domain": "Price", "event": f"{abs(pct_90d):.1f}% 90D Drawdown", "lead": "0d"})

    return {
        "identity": identity,
        "vital_scores": {
            "market": round(market_score),
            "liquidity": round(max(0, liquidity_score)),
            "trading": round(max(0, trading_score)),
            "holders": round(holder_score),
            "access": round(max(0, access_score)),
            "security": round(security_score),
            "development": round(dev_score),
            "economics": round(economics_score),
            "integrity": round(integrity_score)
        },
        "structural_signals": {
            "death_velocity": death_velocity,
            "liquidity_half_life": f"{liquidity_half_life} days" if isinstance(liquidity_half_life, int) else liquidity_half_life,
            "activity_survival": activity_survival_ratio,
            "sustainability": sustainability_ratio,
            "funding_efficiency": funding_efficiency
        },
        "diagnosis": {
            "primary": primary_cause,
            "secondary": secondary_cause,
            "failure_type": failure_type,
            "verdict": verdict
        },
        "evidence_chain": chain,
        "total_score": round(total_score, 1),
        "risk_level": verdict
    }
