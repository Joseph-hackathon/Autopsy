def calculate_death_score(latest_data: dict, historical_data: dict = None, category_data: dict = None) -> dict:
    """
    Calculate Death Score based on REAL live data from CMC.
    Using percent_change metrics, volume, and market cap from the latest quote.
    """
    score = 0
    breakdown = {}

    try:
        quote = latest_data.get("quote", {}).get("USD", {})
        
        # 1. Short-term Price Collapse (25%)
        # Based on 7-day change
        pct_7d = quote.get("percent_change_7d", 0)
        # If drop is more than 50%, max score. If positive, 0 score.
        short_term_score = 0
        if pct_7d < 0:
            short_term_score = min(25, abs(pct_7d) / 50.0 * 25)
        score += short_term_score
        breakdown["short_term_score"] = round(short_term_score, 1)

        # 2. Long-term Deterioration (25%)
        # Based on 30-day or 60-day change
        pct_30d = quote.get("percent_change_30d", 0)
        long_term_score = 0
        if pct_30d < 0:
            long_term_score = min(25, abs(pct_30d) / 70.0 * 25) # 70% drop is max penalty
        score += long_term_score
        breakdown["long_term_score"] = round(long_term_score, 1)

        # 3. Liquidity/Volume Health (25%)
        # Measured by volume_24h to market_cap ratio. 
        # A healthy token trades at least 5-10% of its mcap daily.
        volume_24h = quote.get("volume_24h", 0)
        mcap = quote.get("market_cap", 1) # prevent div by zero
        if mcap == 0: mcap = 1
        vol_mcap_ratio = volume_24h / mcap
        
        liquidity_score = 0
        if vol_mcap_ratio < 0.05:
            # If volume is less than 5% of mcap, penalize
            # 0.01 ratio -> heavily penalized
            penalty_factor = (0.05 - vol_mcap_ratio) / 0.05
            liquidity_score = min(25, penalty_factor * 25)
        score += liquidity_score
        breakdown["liquidity_score"] = round(liquidity_score, 1)

        # 4. Immediate Dumping / Volatility (25%)
        # Based on 24h change
        pct_24h = quote.get("percent_change_24h", 0)
        dump_score = 0
        if pct_24h < -5:
            # Drop more than 5% in 24h starts getting penalized, max at 20%
            dump_score = min(25, (abs(pct_24h) - 5) / 15.0 * 25)
        score += dump_score
        breakdown["dump_score"] = round(dump_score, 1)

    except Exception as e:
        print(f"Score calculation error: {e}")
        # fallback
        score = 50

    breakdown["total_score"] = round(score, 1)

    # Determine Risk Level
    if score <= 20:
        level = "🟢 Healthy"
    elif score <= 40:
        level = "🟡 Watch"
    elif score <= 60:
        level = "🟠 Stress"
    elif score <= 80:
        level = "🔴 Critical"
    else:
        level = "☠️ Death Watch"
    
    breakdown["risk_level"] = level

    return breakdown
