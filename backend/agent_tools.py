import json
from cmc_api import CMCClient
import score_engine
from forensic_telemetry import ForensicTelemetryCollector

def generate_evidence_graph(symbol: str) -> dict:
    """
    Autopsy 2.0: Core Forensic Orchestration Agent.
    Aggregates multi-vector telemetry across:
    1. CoinMarketCap PRO API (Identity, Quotes, DEX metrics, historical pairs)
    2. On-Chain Blockchain Explorers (Blastscan, Etherscan transaction velocity & contract freezing)
    3. Social & Governance Signals (Official shutdown announcements on X/Twitter)
    4. Macro Multi-Year Structural Economics (TVL drain, revenue vs cost deficits)
    """
    try:
        # 1. Token Identity Resolution
        identity = CMCClient.resolve_token_identity(symbol)
        if "error" in identity:
            return {"error": f"Failed to identify token {symbol}: {identity['error']}"}

        # 2. Fetch Latest Quotes & Info
        latest_res = CMCClient.get_latest_quotes(identity["id"])
        if "error" in latest_res:
            return {"error": f"Failed to fetch market data: {latest_res['error']}"}
        
        info_res = CMCClient.get_info(identity["id"])
        
        # Parse basic info
        latest_list = list(latest_res["data"].values())[0] if isinstance(latest_res["data"], dict) else latest_res["data"][0]
        latest_data = latest_list[0] if isinstance(latest_list, list) else latest_list
        
        info_list = list(info_res["data"].values())[0] if isinstance(info_res["data"], dict) else info_res["data"][0]
        info_data = info_list[0] if isinstance(info_list, list) else info_list
        
        quote = latest_data.get("quote", {}).get("USD", {})
        mcap = quote.get("market_cap", 1) or 1
        
        # 3. Fetch DEX/Real Metrics
        dex_metrics = CMCClient.get_dex_metrics(
            cmc_id=identity["id"],
            contract_address=identity["contract_address"],
            platform_id=identity["platform"]["id"] if identity.get("platform") else None,
            mcap=mcap
        )
        
        # 4. Multi-Source Forensic Telemetry Collector
        # Ingests on-chain explorer data, official X/social shutdown statements, and macro economics
        external_data = ForensicTelemetryCollector.collect_telemetry(
            symbol=identity["symbol"],
            contract_address=identity.get("contract_address"),
            name=identity.get("name")
        )
            
        analysis = score_engine.calculate_death_score(latest_data, dex_metrics, identity, external_data)
        
        # 5. Extract UI Metadata
        logo = info_data.get("logo", "")
        description = info_data.get("description", "")
        urls = info_data.get("urls", {})
        website = urls.get("website", [""])[0] if urls.get("website") else ""
        twitter = urls.get("twitter", [""])[0] if urls.get("twitter") else ""
        explorer = urls.get("explorer", [""])[0] if urls.get("explorer") else ""
        
        # Fallback to verified explorer if available in forensic telemetry
        if external_data.get("onchain", {}).get("explorer_url") and not explorer:
            explorer = external_data["onchain"]["explorer_url"]
        
        category = "Unknown"
        if info_data.get("category"):
            category = info_data["category"]
            
        # 6. Build Multi-Vector Causes of Death
        causes = []
        diagnosis = analysis["diagnosis"]
        
        # (A) Social / Official Governance Sunset Vector
        if external_data.get("official_shutdown") and external_data.get("announcement"):
            ann = external_data["announcement"]
            causes.append({
                "title": "Official Project Termination (Social Vector)",
                "evidence": f"Core operations terminated. {ann['summary']} The core team has confirmed protocol deprecation via their verified public broadcast channel.",
                "source": f"Official Announcement on {ann['platform']}",
                "source_url": ann["url"],
                "data_viz": {"type": "announcement_badge"}
            })

        # (B) On-Chain Explorer Telemetry Vector (Blastscan, Etherscan)
        onchain = external_data.get("onchain", {})
        if onchain.get("daily_tx_count") is not None and onchain.get("tx_decay_rate") is not None:
            causes.append({
                "title": f"On-Chain Transaction & Activity Freeze ({onchain.get('explorer_name', 'Explorer')})",
                "evidence": f"Smart contract analysis ({onchain.get('contract_address')}) demonstrates a catastrophic {onchain.get('tx_decay_rate', 0):.1%} collapse in daily transactions from peak ({onchain.get('peak_daily_tx', 0):,} txs/day down to {onchain.get('daily_tx_count', 0):,} txs/day). Active 24h interacting wallets dropped to {onchain.get('active_wallets_24h', 0)}, indicating terminal user abandonment.",
                "source": f"{onchain.get('explorer_name', 'Explorer')} Token Telemetry",
                "source_url": onchain.get("explorer_url", explorer),
                "data_viz": {"type": "onchain_decay"}
            })

        # (C) Macro Structural & Economic Drain
        macro = external_data.get("macro_economics", {})
        if macro.get("revenue") is not None and macro.get("operating_cost") is not None:
            rev = macro["revenue"]
            cost = macro["operating_cost"]
            causes.append({
                "title": "Economic Unsustainability & TVL Drain",
                "evidence": f"Severe structural deficit. Monthly protocol revenue (${rev:,}) covers only {(rev/max(1,cost)):.1%} of estimated infrastructure & sequencer operating costs (${cost:,}/mo). Following the cessation of farming incentives, TVL collapsed by {macro.get('tvl_decay', 0):.1%}.",
                "source": "L2 Ecosystem Financial & TVL Telemetry",
                "source_url": None,
                "data_viz": {"type": "macro_economic"}
            })
        elif diagnosis["primary"] == "ECONOMIC PRESSURE":
            causes.append({
                "title": "Economic Unsustainability",
                "evidence": f"Severe business failure. Revenue covered only a fraction of estimated operating costs. Historical peak activity has collapsed by {analysis['structural_signals']['activity_survival']}, leading to an economically unsustainable protocol.",
                "source": "Externally Reported Financials & Funding Efficiency",
                "source_url": None,
                "data_viz": {"type": "none"}
            })
            
        # (D) Liquidity & DEX Spiral Vectors
        if diagnosis["primary"] == "LIQUIDITY SPIRAL" or (dex_metrics.get("liquidity", 0) < 50000 and quote.get("volume_24h", 0) > 0):
            causes.append({
                "title": "Liquidity Spiral & Slippage Trap",
                "evidence": f"Severe structural liquidity drain detected. Verifiable DEX depth has depleted to ${dex_metrics['liquidity']:,.0f}, creating an irreversible death loop where slippage prevents holders from orderly liquidation.",
                "source": "CMC DEX Liquidity + Market Volume Lead-Lag Analysis",
                "source_url": "https://coinmarketcap.com/dex/",
                "data_viz": {"type": "none"}
            })
            
        if diagnosis["primary"] == "PRICE COLLAPSE":
            causes.append({
                "title": "Severe Market Drawdown",
                "evidence": "The token has experienced a catastrophic loss of value over a prolonged period, wiping out the vast majority of investor capital.",
                "source": "Historical Quote Telemetry",
                "source_url": None,
                "data_viz": {"type": "none"}
            })

        if not causes:
            causes.append({
                "title": "Healthy Market Dynamics",
                "evidence": "The project exhibits stable liquidity, active trading participation, and steady holder metrics. No structural failures detected.",
                "source": "Autopsy 2.0 Global Heuristics",
                "source_url": None,
                "data_viz": {"type": "none"}
            })

        # Add Security Risk if present
        if analysis["vital_scores"]["security"] > 50:
            causes.append({
                "title": "Critical Security Failure",
                "evidence": "On-chain scanning reveals honeypot characteristics or extreme taxation mechanisms. The smart contract itself poses an existential risk to holders independent of price action.",
                "source": "CMC DEX Security Detail",
                "source_url": None,
                "data_viz": {"type": "none"}
            })

        # Generate Timeline (Visual evidence chain)
        timeline = []
        for ev in analysis["evidence_chain"]:
            timeline.append({
                "day": ev["lead"],
                "status": f"{ev['domain']} Collapse",
                "event": ev["event"]
            })
            
        if not timeline:
            timeline.append({"day": "T-0d", "status": "Stable", "event": "No significant structural failures detected in the timeline."})

        # Final Payload Structure
        evidence = {
            "token": identity["symbol"],
            "name": identity["name"],
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
                "volume_24h": quote.get("volume_24h", 0),
                "percent_change_1h": quote.get("percent_change_1h", 0),
                "percent_change_24h": quote.get("percent_change_24h", 0),
                "percent_change_7d": quote.get("percent_change_7d", 0),
                "percent_change_30d": quote.get("percent_change_30d", 0),
                "percent_change_60d": quote.get("percent_change_60d", 0),
                "percent_change_90d": quote.get("percent_change_90d", 0),
                "fdv": quote.get("fully_diluted_market_cap", 0)
            },
            "identity": identity,
            "vital_scores": analysis["vital_scores"],
            "structural_signals": analysis["structural_signals"],
            "diagnosis": analysis["diagnosis"],
            "score": analysis["total_score"],
            "risk_level": analysis["risk_level"],
            "timeline": timeline,
            "causes": causes,
            "forensic_telemetry": external_data
        }
        
        return evidence

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": f"Agent processing failed: {str(e)}"}
