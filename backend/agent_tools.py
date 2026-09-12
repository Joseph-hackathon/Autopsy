import json
from cmc_api import CMCClient
import score_engine

def generate_evidence_graph(symbol: str) -> dict:
    """
    Autopsy 2.0: Core Orchestration Agent.
    Fetches actual CMC data across Identity, Vital Signs, DEX Metrics, and historical records.
    Runs the 3-Layer Score Engine and constructs the final Forensic Evidence Chain.
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
        
        info_res = CMCClient.get_info(identity["slug"])
        
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
        
        # 4. Forensic Score Engine (3-Layer Architecture)
        analysis = score_engine.calculate_death_score(latest_data, dex_metrics, identity)
        
        # 5. Extract UI Metadata
        logo = info_data.get("logo", "")
        description = info_data.get("description", "")
        urls = info_data.get("urls", {})
        website = urls.get("website", [""])[0] if urls.get("website") else ""
        twitter = urls.get("twitter", [""])[0] if urls.get("twitter") else ""
        explorer = urls.get("explorer", [""])[0] if urls.get("explorer") else ""
        
        category = "Unknown"
        if info_data.get("category"):
            category = info_data["category"]
            
        # 6. Build Causes based on Layer 3 Diagnosis
        causes = []
        diagnosis = analysis["diagnosis"]
        
        if diagnosis["primary"] == "LIQUIDITY SPIRAL":
            causes.append({
                "title": "Liquidity Spiral",
                "evidence": f"Severe structural collapse detected. Liquidity has drained to {dex_metrics['liquidity']:,.0f}, while volume collapsed. This creates a self-reinforcing death loop where slippage prevents holders from exiting, leading to complete market abandonment.",
                "source": "CMC DEX Liquidity + Market Volume Lead-Lag Analysis",
                "data_viz": {"type": "none"}
            })
        elif diagnosis["primary"] == "FALSE DEATH":
            causes.append({
                "title": "False Death (Capitulation Event)",
                "evidence": "Despite a massive price drawdown, underlying market participation remains intact. Active trading volume and holder metrics have NOT collapsed, suggesting a panic redistribution event rather than structural ecosystem death.",
                "source": "Price-Volume Divergence Analysis",
                "data_viz": {"type": "none"}
            })
        elif diagnosis["primary"] == "ZOMBIE TOKEN":
            causes.append({
                "title": "Zombie Token State",
                "evidence": "Price action continues superficially, but the underlying ecosystem is dead. Liquidity is dangerously low and holder exodus is confirmed. The token is merely trading as a speculative husk without functional market depth.",
                "source": "CMC Network Participation Metrics",
                "data_viz": {"type": "none"}
            })
        elif diagnosis["primary"] == "HOLDER EXODUS":
            causes.append({
                "title": "Holder Exodus",
                "evidence": "A massive flight of capital and participants from the asset. Wallet metrics indicate early adopters and retail participants are simultaneously abandoning their positions.",
                "source": "DEX Holder Trend Analysis",
                "data_viz": {"type": "none"}
            })
        elif diagnosis["primary"] == "MARKET ISOLATION":
            causes.append({
                "title": "Market Access Collapse",
                "evidence": "The asset has lost critical exchange listings and trading pairs. Trading is now isolated to highly illiquid decentralized pools, effectively trapping remaining capital.",
                "source": "CMC Market Pairs Decay",
                "data_viz": {"type": "none"}
            })
        elif diagnosis["primary"] == "PRICE COLLAPSE":
            causes.append({
                "title": "Severe Market Drawdown",
                "evidence": "The token has experienced a catastrophic loss of value over a prolonged period, wiping out the vast majority of investor capital.",
                "source": "Historical Quote Telemetry",
                "data_viz": {"type": "none"}
            })
        else:
            causes.append({
                "title": "Healthy Market Dynamics",
                "evidence": "The project exhibits stable liquidity, active trading participation, and steady holder metrics. No structural failures detected.",
                "source": "Autopsy 2.0 Global Heuristics",
                "data_viz": {"type": "none"}
            })

        # Add Security Risk if present
        if analysis["vital_scores"]["security"] > 50:
            causes.append({
                "title": "Critical Security Failure",
                "evidence": "On-chain scanning reveals honeypot characteristics or extreme taxation mechanisms. The smart contract itself poses an existential risk to holders independent of price action.",
                "source": "CMC DEX Security Detail",
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
            "causes": causes
        }
        
        return evidence

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": f"Agent processing failed: {str(e)}"}
