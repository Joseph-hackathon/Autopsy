import json
from cmc_api import CMCClient
import score_engine
from forensic_telemetry import ForensicTelemetryCollector
from external_data_providers import ExternalForensicProviders
from aif_framework import (
    AIFStatisticalEngine,
    AIFNetworkDependencyEngine,
    AIFStateTransitionEngine,
    AIFCounterfactualEngine,
    AIFSurvivalKnowledgeEngine
)

def generate_evidence_graph(symbol: str) -> dict:
    """
    Autopsy 2.0: Core Forensic Orchestration Agent with Multi-Source Data Federation:
    1. CoinMarketCap PRO API (Identity, Quotes, DEX metrics, historical pairs)
    2. DexScreener API (Real-time live DEX pool liquidity, 24h buys/sells transactions, pair volume)
    3. DefiLlama API (Historical TVL collapse, peak-to-trough exhaustion, protocol revenue)
    4. Dune Analytics (Audited SQL whale net flow and contract event telemetry)
    5. Universal On-Chain Block Explorers (Etherscan, BscScan, Solscan, Blastscan, Arbiscan, etc.)
    6. Social & Governance Signals (Official X/Twitter broadcast accounts & verified announcements)
    7. AIF 5-Engine Scientific Analytics (Statistical change points, network dependency, state transitions, counterfactuals, survival intelligence)
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
        
        info_res = CMCClient.get_info(identity["id"], identity_hint=identity)
        
        # Parse basic info
        latest_list = list(latest_res["data"].values())[0] if isinstance(latest_res["data"], dict) else latest_res["data"][0]
        latest_data = latest_list[0] if isinstance(latest_list, list) else latest_list
        
        info_list = list(info_res["data"].values())[0] if isinstance(info_res["data"], dict) else info_res["data"][0]
        info_data = info_list[0] if isinstance(info_list, list) else info_list
        
        quote = latest_data.get("quote", {}).get("USD", {})
        mcap = quote.get("market_cap", 1) or 1
        vol_24h = quote.get("volume_24h", 0) or 0
        pct_90d = quote.get("percent_change_90d", 0) or 0
        pct_30d = quote.get("percent_change_30d", 0) or 0
        turnover_ratio = (vol_24h / mcap * 100.0) if mcap > 0 else 0.0
        contract_addr = identity.get("contract_address")
        
        # 3. Fetch DEX/Real Metrics
        dex_metrics = CMCClient.get_dex_metrics(
            cmc_id=identity["id"],
            contract_address=contract_addr,
            platform_id=identity["platform"]["id"] if identity.get("platform") else None,
            mcap=mcap
        )
        
        # 4. Ingest External Real-Time Forensic Providers (DexScreener, DefiLlama, Dune)
        platform_name = identity["platform"]["name"] if identity.get("platform") and isinstance(identity["platform"], dict) else None
        dexscreener_data = ExternalForensicProviders.fetch_dexscreener_telemetry(contract_addr, identity["symbol"])
        defillama_data = ExternalForensicProviders.fetch_defillama_telemetry(identity.get("slug") or identity["name"], platform_name or identity["name"])
        dune_data = ExternalForensicProviders.fetch_dune_forensics(identity["symbol"], contract_addr)
        
        # If DexScreener has live liquidity, inject it to enrich CMC DEX metrics
        if dexscreener_data.get("available") and dexscreener_data.get("liquidity_usd", 0) > 0:
            dex_metrics["liquidity"] = dexscreener_data["liquidity_usd"]
            if dexscreener_data.get("pair_count", 0) > 0:
                dex_metrics["active_pairs"] = dexscreener_data["pair_count"]
                
        # 5. Universal Multi-Source Forensic Telemetry Collector
        external_data = ForensicTelemetryCollector.collect_telemetry(
            symbol=identity["symbol"],
            name=identity.get("name", ""),
            info_data=info_data,
            quote=quote,
            dex_metrics=dex_metrics,
            identity=identity
        )
        
        # Overwrite/Enrich with DefiLlama verified TVL data if available
        if defillama_data.get("available"):
            external_data["macro_economics"]["tvl_peak"] = defillama_data.get("peak_tvl_usd")
            external_data["macro_economics"]["tvl_current"] = defillama_data.get("current_tvl_usd")
            external_data["macro_economics"]["tvl_decay"] = defillama_data.get("tvl_exhaustion_rate")
            
        analysis = score_engine.calculate_death_score(latest_data, dex_metrics, identity, external_data)
        
        # 6. Extract UI Metadata
        logo = info_data.get("logo", "")
        description = info_data.get("description", "")
        urls = info_data.get("urls", {})
        website = urls.get("website", [""])[0] if urls.get("website") else ""
        twitter = urls.get("twitter", [""])[0] if urls.get("twitter") else ""
        explorer = urls.get("explorer", [""])[0] if urls.get("explorer") else ""
        
        if external_data.get("onchain", {}).get("explorer_url"):
            explorer = external_data["onchain"]["explorer_url"]
        if external_data.get("announcement", {}).get("url"):
            twitter = external_data["announcement"]["url"]

        if identity.get("symbol") in ["SCR", "SCROLL"] or identity.get("slug") == "scroll":
            website = "https://scroll.org/"
            twitter = "https://twitter.com/Scroll_ZKP"
            explorer = "https://scrollscan.com/token/0xd29687c813d741e2f938f4ac377128810e217b1b#transactions"
        
        category = "Unknown"
        if info_data.get("category"):
            category = info_data["category"]
            
        # -------------------------------------------------------------
        # 7. AIF MULTI-ENGINE EXECUTION (SCIENTIFIC FORENSICS)
        # -------------------------------------------------------------
        onchain_info = external_data.get("onchain", {})
        # If DexScreener has live txns, use actual 24h count
        if dexscreener_data.get("available") and dexscreener_data.get("total_dex_txns_24h", 0) > 0:
            daily_txs = dexscreener_data["total_dex_txns_24h"]
            onchain_info["daily_tx_count"] = daily_txs
        else:
            daily_txs = onchain_info.get("daily_tx_count", 500) or 500
            
        tx_decay = onchain_info.get("tx_decay_rate", 0.0) or 0.0
        is_shutdown = external_data.get("official_shutdown", False)
        
        # AIF-01: Temporal Change-Point Detection
        change_points = AIFStatisticalEngine.detect_change_points(pct_90d, pct_30d, turnover_ratio)
        
        # AIF-02: Cross-Domain Network Dependency & Fragility
        network_fragility = AIFNetworkDependencyEngine.evaluate_dependencies(info_data, dex_metrics, onchain_info)
        
        # AIF-03: Multidimensional State Transition & Cross-Domain Divergence
        state_transition = AIFStateTransitionEngine.compute_state_and_divergence(
            vitals=analysis["vital_scores"],
            mcap=mcap,
            vol_24h=vol_24h,
            onchain_txs=daily_txs,
            turnover_ratio=turnover_ratio
        )
        
        # AIF-04: Counterfactual Failure & Macro vs Endogenous Decomposition
        counterfactual = AIFCounterfactualEngine.decompose_failure_origin(pct_90d, pct_30d, is_shutdown)
        
        # AIF-05: Survival Knowledge & Historical Case Matching
        survival_intel = AIFSurvivalKnowledgeEngine.match_historical_case_and_extract_lessons(
            symbol=identity["symbol"],
            pct_90d=pct_90d,
            tx_decay=tx_decay,
            dev_score=analysis["vital_scores"].get("development", 50),
            failure_type=analysis["diagnosis"].get("failure_type", "MARKET FAILURE")
        )

        aif_report = {
            "change_points": change_points,
            "network_fragility": network_fragility,
            "state_transition": state_transition,
            "counterfactual": counterfactual,
            "survival_intelligence": survival_intel
        }

        # -------------------------------------------------------------
        # 8. Build Multi-Vector Causes of Death (With Confidence Levels)
        # -------------------------------------------------------------
        causes = []
        diagnosis = analysis["diagnosis"]
        
        # (A) Social / Official Governance Sunset Vector (X/Twitter)
        ann = external_data.get("announcement")
        if ann and ann.get("url"):
            if is_shutdown:
                causes.append({
                    "title": "Official Project Termination (Social Vector)",
                    "evidence": f"Core operations terminated. {ann['summary']} The core team has confirmed protocol deprecation via their verified public broadcast channel.",
                    "source": f"Official Announcement on {ann['platform']}",
                    "source_url": ann["url"],
                    "confidence": "Confirmed",
                    "data_viz": {"type": "announcement_badge"}
                })
            else:
                causes.append({
                    "title": "Developer Activity & Social Vector (X Telemetry)",
                    "evidence": f"{ann['summary']} Telemetry continuously monitors project updates, community retention, and key developer broadcasts.",
                    "source": f"Verified Post on {ann['platform']}",
                    "source_url": ann["url"],
                    "confidence": "Strongly Supported",
                    "data_viz": {"type": "announcement_badge"}
                })

        # (B) DexScreener Live On-Chain Orderbook & Sell Pressure Vector
        if dexscreener_data.get("available"):
            causes.append({
                "title": f"Live On-Chain Liquidity & Sell Pressure (DexScreener)",
                "evidence": f"Real-time DEX pool depth on {dexscreener_data['dex_name']} shows ${dexscreener_data['liquidity_usd']:,.2f} in verifiable liquidity across {dexscreener_data['pair_count']} pool(s). Trailing 24H transactions recorded {dexscreener_data['buys_24h']} buys vs {dexscreener_data['sells_24h']} sells ({dexscreener_data['sell_pressure_pct']}% sell pressure).",
                "source": "DexScreener Real-Time DEX Telemetry",
                "source_url": dexscreener_data["pair_url"],
                "confidence": "Confirmed",
                "data_viz": {"type": "dexscreener_badge"}
            })

        # (C) DefiLlama Historical TVL Collapse Vector
        if defillama_data.get("available") and defillama_data.get("tvl_exhaustion_rate", 0) > 0.4:
            causes.append({
                "title": f"Verified TVL Depletion & Capital Flight (DefiLlama)",
                "evidence": f"DefiLlama historical audit confirms {defillama_data['type']} experienced an catastrophic {defillama_data['tvl_exhaustion_pct']} TVL collapse from peak (${defillama_data['peak_tvl_usd']:,.0f} down to ${defillama_data['current_tvl_usd']:,.0f}). Verified across {defillama_data['datapoints_tracked']} tracked checkpoints.",
                "source": "DefiLlama Verified Protocol TVL Index",
                "source_url": defillama_data["llama_url"],
                "confidence": "Confirmed",
                "data_viz": {"type": "defillama_badge"}
            })

        # (D) On-Chain Explorer Telemetry Vector
        if onchain_info.get("explorer_url"):
            causes.append({
                "title": f"On-Chain Transaction & Activity Telemetry ({onchain_info.get('explorer_name', 'Explorer')})",
                "evidence": f"Smart contract telemetry ({onchain_info.get('contract_address')}) indicates daily transaction throughput of {daily_txs:,} txs/day ({onchain_info.get('tx_decay_rate', 0):.1%} velocity drop from peak). Interacting 24h active wallets: ~{onchain_info.get('active_wallets_24h', 0)}. Contract state: {onchain_info.get('contract_status')}. Net 30D liquidity movement: {onchain_info.get('net_outflow_30d')}.",
                "source": f"{onchain_info.get('explorer_name', 'Explorer')} Token Telemetry",
                "source_url": onchain_info.get("explorer_url", explorer),
                "confidence": "Confirmed" if onchain_info.get("tx_decay_rate", 0) > 0.9 else "Strongly Supported",
                "data_viz": {"type": "onchain_decay"}
            })

        # (E) Cross-Domain Divergence & Synthetic Volume (AIF Cause)
        if state_transition["cross_domain_divergence_score"] > 55.0:
            causes.append({
                "title": "Cross-Domain Divergence (Synthetic Volume)",
                "evidence": state_transition["divergence_narrative"],
                "source": "AIF Cross-Domain Divergence Engine",
                "source_url": None,
                "confidence": "Strongly Supported",
                "data_viz": {"type": "none"}
            })

        # (F) Macro Structural & Economic Drain
        macro = external_data.get("macro_economics", {})
        if macro.get("revenue") is not None and macro.get("operating_cost") is not None:
            rev = macro["revenue"]
            cost = macro["operating_cost"]
            causes.append({
                "title": "Macro Structural Economics & Margin Health",
                "evidence": f"Long-term economic balance: Estimated monthly revenue (${rev:,}) vs. required infrastructure & node operating costs (${cost:,}/mo). Cumulative drawdown from peak is {macro.get('ath_drawdown', 0):.1%}, with an estimated TVL exhaustion of {macro.get('tvl_decay', 0):.1%}. Supply overhang ratio: {macro.get('supply_overhang_ratio', 1.0):.2f}x.",
                "source": "Macro Financial & Protocol Telemetry",
                "source_url": None,
                "confidence": "Probable",
                "data_viz": {"type": "macro_economic"}
            })
            
        # (G) Liquidity & DEX Spiral Vectors
        if diagnosis["primary"] == "LIQUIDITY SPIRAL" or (dex_metrics.get("liquidity", 0) < 50000 and quote.get("volume_24h", 0) > 0):
            causes.append({
                "title": "Liquidity Spiral & Slippage Trap",
                "evidence": f"Severe structural liquidity drain detected. Verifiable DEX depth has depleted to ${dex_metrics['liquidity']:,.0f}, creating an irreversible death loop where slippage prevents holders from orderly liquidation.",
                "source": "CMC DEX Liquidity + Market Volume Lead-Lag Analysis",
                "source_url": "https://coinmarketcap.com/dex/",
                "confidence": "Confirmed",
                "data_viz": {"type": "none"}
            })
            
        if not causes:
            causes.append({
                "title": "Healthy Market Dynamics",
                "evidence": "The project exhibits stable liquidity, active trading participation, and steady holder metrics. No structural failures detected.",
                "source": "Autopsy 2.0 Global Heuristics",
                "source_url": None,
                "confidence": "Confirmed",
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

        # Final Multi-Provider Forensic Payload Structure
        evidence = {
            "token": identity["symbol"],
            "name": identity["name"],
            "category": category,
            "logo": logo,
            "description": description,
            "links": {
                "website": website,
                "twitter": twitter,
                "explorer": explorer,
                "dexscreener": dexscreener_data.get("pair_url") if dexscreener_data.get("available") else None,
                "defillama": defillama_data.get("llama_url") if defillama_data.get("available") else None,
                "dune": dune_data.get("dune_workspace_url")
            },
            "raw_metrics": {
                "price": quote.get("price", 0),
                "market_cap": mcap,
                "volume_24h": vol_24h,
                "percent_change_1h": quote.get("percent_change_1h", 0),
                "percent_change_24h": quote.get("percent_change_24h", 0),
                "percent_change_7d": quote.get("percent_change_7d", 0),
                "percent_change_30d": pct_30d,
                "percent_change_60d": quote.get("percent_change_60d", 0),
                "percent_change_90d": pct_90d,
                "fdv": quote.get("fully_diluted_market_cap", 0),
                "turnover_ratio": round(turnover_ratio, 2)
            },
            "identity": identity,
            "vital_scores": analysis["vital_scores"],
            "structural_signals": analysis["structural_signals"],
            "diagnosis": analysis["diagnosis"],
            "score": analysis["total_score"],
            "risk_level": analysis["risk_level"],
            "timeline": timeline,
            "causes": causes,
            "forensic_telemetry": external_data,
            "external_providers": {
                "dexscreener": dexscreener_data,
                "defillama": defillama_data,
                "dune": dune_data
            },
            "aif_framework": aif_report
        }
        
        return evidence

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": f"Agent processing failed: {str(e)}"}
