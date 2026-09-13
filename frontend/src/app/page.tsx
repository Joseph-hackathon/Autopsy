"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ResultDashboard from "./ResultDashboard";

const EXPLORER_PROJECTS = [
  { symbol: "ROUTE", name: "Router Protocol", score: 63, reason: "ECONOMIC FAILURE", velocity: "Accelerating", halfLife: "15 days", sustainability: "0.20", trend: [-10, -20, -50, -65, -80], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/8782.png", drawdown: "-87.3%", summary: "Revenue fails to cover infrastructure costs, causing a liquidity spiral and heavy reliance on inflationary emissions." },
  { symbol: "SAFEMOON", name: "SafeMoon", score: 99, reason: "LIQUIDITY SPIRAL", velocity: "Terminal", halfLife: "0 days", sustainability: "0.00", trend: [-50, -70, -90, -99, -99], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/8757.png", drawdown: "-99.9%", summary: "Complete depletion of liquidity pool. Toxic tokenomics led to an irreversible death spiral and zero market confidence." },
  { symbol: "FTT", name: "FTX Token", score: 100, reason: "HOLDER EXODUS", velocity: "Terminal", halfLife: "Dead", sustainability: "0.00", trend: [-80, -95, -99, -100, -100], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/4195.png", drawdown: "-99.5%", summary: "Catastrophic loss of utility and backing. Collapsed due to centralized fraud and immediate holder capitulation." },
  { symbol: "LUNA", name: "Terra", score: 100, reason: "MARKET COLLAPSE", velocity: "Terminal", halfLife: "Dead", sustainability: "0.00", trend: [-40, -90, -100, -100, -100], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/4172.png", drawdown: "-99.9%", summary: "Algorithmic depeg caused hyper-inflationary minting, wiping out $40B in market cap within a matter of days." },
  { symbol: "CEL", name: "Celsius", score: 100, reason: "BANKRUPT", velocity: "Terminal", halfLife: "Dead", sustainability: "0.00", trend: [-90, -95, -99, -100, -100], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2700.png", drawdown: "-99.8%", summary: "Platform insolvency and massive fraud. Token frozen with zero underlying utility or economic future." },
  { symbol: "VGX", name: "Voyager", score: 100, reason: "BANKRUPT", velocity: "Terminal", halfLife: "Dead", sustainability: "0.00", trend: [-85, -90, -95, -99, -100], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1817.png", drawdown: "-99.5%", summary: "Centralized lending collapse. Total loss of customer funds eradicated any fundamental value in the platform token." },
  { symbol: "USTC", name: "TerraClassicUSD", score: 100, reason: "DEPEGGED", velocity: "Terminal", halfLife: "Dead", sustainability: "0.00", trend: [-95, -98, -99, -99, -99], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/7129.png", drawdown: "-97.5%", summary: "Permanent algorithmic depeg. Confidence destroyed with no mathematical path to repegging to $1." },
  { symbol: "EOS", name: "EOS", score: 85, reason: "ABANDONED", velocity: "Terminal", halfLife: "30 days", sustainability: "0.10", trend: [-30, -50, -60, -70, -80], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1765.png", drawdown: "-96.5%", summary: "Initial $4B ICO capital dissipated. Completely abandoned by core founders and failing to attract any new developer ecosystem." },
  { symbol: "NEO", name: "NEO", score: 90, reason: "GHOST CHAIN", velocity: "Terminal", halfLife: "45 days", sustainability: "0.15", trend: [-40, -50, -65, -75, -85], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1376.png", drawdown: "-92.5%", summary: "Zero active developer ecosystem or meaningful dApps. Retail volume completely dried up, leaving only historical bagholders." },
  { symbol: "ALGO", name: "Algorand", score: 75, reason: "ECONOMIC FAILURE", velocity: "Accelerating", halfLife: "120 days", sustainability: "0.25", trend: [-20, -30, -45, -55, -60], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png", drawdown: "-95.8%", summary: "Severe token inflation outpaced network demand. Excellent technology unable to find product-market fit or user velocity." },
  { symbol: "LTC", name: "Litecoin", score: 68, reason: "OBSOLESCENCE", velocity: "Accelerating", halfLife: "180 days", sustainability: "0.50", trend: [-20, -25, -30, -35, -40], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png", drawdown: "-78.4%", summary: "Legacy payments network losing mindshare to L2s and stablecoins. Transaction fee revenue too low to sustain future security." },
  { symbol: "CRV", name: "Curve DAO", score: 65, reason: "LIQUIDATION RISK", velocity: "Accelerating", halfLife: "90 days", sustainability: "0.60", trend: [-15, -30, -45, -50, -55], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/6538.png", drawdown: "-94.2%", summary: "Founder over-leverage created systemic liquidation spirals. Revenue is strong but structural tokenomics are highly dilutive." },
  { symbol: "DOT", name: "Polkadot", score: 60, reason: "DEVELOPER BLEED", velocity: "Accelerating", halfLife: "200 days", sustainability: "0.35", trend: [-5, -15, -30, -40, -45], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png", drawdown: "-88.1%", summary: "Complex architecture leading to developer exodus. Treasury spending vastly outpaces network revenue generation." },
  { symbol: "ADA", name: "Cardano", score: 55, reason: "STAGNANT", velocity: "Accelerating", halfLife: "365 days", sustainability: "0.45", trend: [-10, -15, -20, -25, -30], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png", drawdown: "-85.2%", summary: "Severe lack of on-chain utility and user velocity. High market cap supported entirely by speculative holder conviction." },
  { symbol: "COMP", name: "Compound", score: 55, reason: "STAGNANT", velocity: "Accelerating", halfLife: "300 days", sustainability: "0.55", trend: [-5, -15, -25, -20, -30], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png", drawdown: "-93.5%", summary: "Losing lending market share to competitors. Governance token utility remains weak compared to actual protocol TVL." },
  { symbol: "SNX", name: "Synthetix", score: 50, reason: "UNDER STRESS", velocity: "Decelerating", halfLife: "250 days", sustainability: "0.70", trend: [-10, -15, -20, -15, -10], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2586.png", drawdown: "-89.4%", summary: "High inflationary rewards required to maintain system debt. Struggling to migrate to a truly sustainable real-yield model." },
  { symbol: "WLD", name: "Worldcoin", score: 45, reason: "UNDER STRESS", velocity: "Accelerating", halfLife: "120 days", sustainability: "0.85", trend: [-5, -15, -25, -20, -35], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/26997.png", drawdown: "-72.1%", summary: "Aggressive VC unlock schedule applying constant sell pressure despite high foundational backing and global rollout." },
  { symbol: "XRP", name: "XRP", score: 45, reason: "UNDER STRESS", velocity: "Decelerating", halfLife: "Infinite", sustainability: "0.60", trend: [-5, 5, -10, -5, 2], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png", drawdown: "-82.4%", summary: "Ongoing regulatory overhang suppresses institutional adoption. Massive supply held in escrow continues to dilute retail float." },
  { symbol: "UNI", name: "Uniswap", score: 35, reason: "HEALTHY", velocity: "Decelerating", halfLife: "Infinite", sustainability: "0.90", trend: [10, -5, -10, 15, 30], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png", drawdown: "-75.6%", summary: "Massive market share in DEX volume. Regulatory threats are the primary risk, while protocol economics remain highly robust." },
  { symbol: "SHIB", name: "Shiba Inu", score: 30, reason: "HEALTHY", velocity: "Decelerating", halfLife: "Infinite", sustainability: "UNKNOWN", trend: [2, 5, 10, -5, 8], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png", drawdown: "-79.2%", summary: "Extremely strong retail community. Surprisingly resilient liquidity profile despite lack of fundamental economic infrastructure." },
  { symbol: "AVAX", name: "Avalanche", score: 25, reason: "HEALTHY", velocity: "Stable", halfLife: "Infinite", sustainability: "0.78", trend: [5, -2, 8, 12, 10], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png", drawdown: "-78.1%", summary: "Solid sub-net architecture adoption. High token inflation is being slowly offset by strong transactional burn mechanisms." },
  { symbol: "AAVE", name: "Aave", score: 25, reason: "HEALTHY", velocity: "Stable", halfLife: "Infinite", sustainability: "0.88", trend: [10, 15, 10, 20, 25], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png", drawdown: "-72.4%", summary: "Dominant lending market protocol. Revenue cleanly covers safety module incentives, creating a highly sustainable flywheel." },
  { symbol: "MKR", name: "Maker", score: 22, reason: "HEALTHY", velocity: "Stable", halfLife: "Infinite", sustainability: "0.95", trend: [15, 20, 25, 15, 30], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1518.png", drawdown: "-45.3%", summary: "RWA integration generating massive real-world yield. Buyback and burn mechanisms creating mathematically sound deflation." },
  { symbol: "DOGE", name: "Dogecoin", score: 20, reason: "HEALTHY", velocity: "Stable", halfLife: "Infinite", sustainability: "UNKNOWN", trend: [5, 2, -5, 10, 15], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png", drawdown: "-75.8%", summary: "Original memetic asset with L1 security. Constant inflation is easily absorbed by massive, cult-like global liquidity." },
  { symbol: "BNB", name: "BNB", score: 18, reason: "HEALTHY", velocity: "Stable", halfLife: "Infinite", sustainability: "0.80", trend: [1, 2, 0, -2, 5], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png", drawdown: "-18.5%", summary: "Sustained by massive exchange revenue and active burn mechanism. High centralization risk but perfect economic sustainability." },
  { symbol: "PEPE", name: "Pepe", score: 15, reason: "HEALTHY", velocity: "Decelerating", halfLife: "Healthy", sustainability: "UNKNOWN", trend: [10, 5, -5, -2, 10], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png", drawdown: "-45.2%", summary: "Pure memetic asset with zero infrastructure cost. Sustained by high trading volume and strong community retention." },
  { symbol: "LINK", name: "Chainlink", score: 15, reason: "HEALTHY", velocity: "Stable", halfLife: "Infinite", sustainability: "0.85", trend: [0, -5, 10, 15, 20], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png", drawdown: "-65.0%", summary: "Monopoly on oracle services with heavy institutional adoption. Tokenomics upgrading to capture real protocol revenue." },
  { symbol: "SOL", name: "Solana", score: 12, reason: "HEALTHY", velocity: "Stable", halfLife: "Infinite", sustainability: "0.75", trend: [15, 25, 30, 20, 45], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png", drawdown: "-35.0%", summary: "High throughput ecosystem with extreme user activity. Strong liquidity inflows offset relatively high validator inflation." },
  { symbol: "ETH", name: "Ethereum", score: 8, reason: "HEALTHY", velocity: "Stable", halfLife: "Infinite", sustainability: "0.92", trend: [2, 5, 8, 10, 12], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png", drawdown: "-22.1%", summary: "Dominant smart contract platform. Fee revenue heavily outweighs operational emission costs, sustaining structural growth." },
  { symbol: "BTC", name: "Bitcoin", score: 5, reason: "HEALTHY", velocity: "Stable", halfLife: "Infinite", sustainability: "0.95", trend: [5, 10, 2, -1, 15], icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png", drawdown: "-15.4%", summary: "Global reserve asset with massive decentralized security and deep structural liquidity across all market venues." },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(EXPLORER_PROJECTS.length / itemsPerPage);
  const currentProjects = EXPLORER_PROJECTS.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const performInvestigation = async (symbolToSearch: string) => {
    if (!symbolToSearch) return;
    setQuery(symbolToSearch);
    setLoading(true);
    setError("");
    setResult(null);
    setChatHistory([]);
    setActiveTab("overview");

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE_URL}/api/investigate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: symbolToSearch }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to investigate");
      
      setResult(data.data);
      setChatHistory([{ role: "doctor", text: `Autopsy complete. Risk assessed at ${data.data.score}/100. How can I assist?` }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInvestigate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    performInvestigation(query);
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.chat.value;
    if(!input) return;
    
    setChatHistory(prev => [...prev, { role: "user", text: input }]);
    form.chat.value = "";

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, token_context: result?.token }),
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: "doctor", text: data.reply }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: "doctor", text: "Connection error." }]);
    }
  };

  const formatCurrency = (val: number | null | undefined) => {
    if (val === null || val === undefined) return "$0.00";
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})}`;
  };

  const formatPct = (val: number | null | undefined) => {
    if (val === null || val === undefined) return <span className="text-zinc-500 bg-zinc-800/10 px-2 py-1 rounded font-sans font-medium text-sm border border-transparent flex items-center gap-1 w-fit">0.00%</span>;
    const isPositive = val >= 0;
    const color = isPositive ? "text-emerald-400" : "text-[var(--color-spark-magenta)]";
    const bg = isPositive ? "bg-emerald-500/10" : "bg-[var(--color-spark-magenta)]/10";
    const sign = isPositive ? "▲" : "▼";
    return <span className={`${color} ${bg} px-2 py-1 rounded font-sans font-medium text-sm border border-transparent flex items-center gap-1 w-fit`}>{sign} {Math.abs(val).toFixed(2)}%</span>;
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return "text-rose-600 border-rose-600 stroke-rose-600 shadow-rose-600";
    if (score > 60) return "text-[var(--color-spark-magenta)] border-[var(--color-spark-magenta)] stroke-[var(--color-spark-magenta)] shadow-[var(--color-spark-magenta)]";
    if (score > 40) return "text-amber-500 border-amber-500 stroke-amber-500 shadow-amber-500";
    if (score > 20) return "text-yellow-400 border-yellow-400 stroke-yellow-400 shadow-yellow-400";
    return "text-emerald-500 border-emerald-500 stroke-emerald-500 shadow-emerald-500";
  };

  const getBgColor = (score: number) => {
    if (score > 80) return "bg-fuchsia-950/20 border-fuchsia-900/50";
    if (score > 60) return "bg-fuchsia-950/10 border-fuchsia-900/30";
    if (score > 40) return "bg-amber-950/10 border-amber-900/30";
    return "bg-emerald-950/10 border-emerald-900/30";
  };

  return (
    <div className="min-h-screen bg-transparent text-zinc-300 font-sans selection:bg-teal-900 selection:text-cyan-100 overflow-x-hidden relative">

      {/* HEADER */}
      <header className=" bg-transparent p-4 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => { setResult(null); setError(""); setQuery(""); }}>
            <img src="/autopsy_white.png" alt="Crypto Autopsy Logo" className="h-8 md:h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
          </div>
          
          <form onSubmit={handleInvestigate} className="flex w-full max-w-md relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-zinc-500 group-focus-within:text-[var(--color-spark-teal)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Target Identifier (Ticker)"
              className="w-full glass-pill pl-10 pr-24 py-2.5 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-[var(--color-spark-teal)]/50 focus:ring-1 focus:ring-[var(--color-spark-teal)]/50 transition-all uppercase placeholder-zinc-600 shadow-inner"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 glass-pill hover:bg-white/10 hover:text-white px-4 rounded text-xs font-bold text-zinc-400 transition-colors flex items-center gap-2 border border-zinc-700">
              {loading ? (
                <><div className="w-2 h-2 bg-[var(--color-spark-teal)] rounded-full animate-pulse"></div> SCANNING</>
              ) : "EXECUTE"}
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 md:p-6 mt-2 relative z-10">
        
        {/* Empty State: Explorer Table */}
        {!result && !loading && !error && (
          <div className="w-full mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-[var(--color-spark-magenta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  AUTOPSY EXPLORER
                </h1>
                <p className="text-zinc-500 text-sm mt-1">Live failure metrics and structural decay telemetry for tracked assets.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-xs font-bold text-zinc-400 bg-zinc-900/50 border border-zinc-800 rounded hover:bg-zinc-800 transition-colors">Filter: High Risk</button>
                <button className="px-4 py-2 text-xs font-bold text-zinc-400 bg-zinc-900/50 border border-zinc-800 rounded hover:bg-zinc-800 transition-colors">Sector</button>
              </div>
            </div>

            <div className="w-full border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-950/50 shadow-2xl backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs text-zinc-500 font-bold uppercase tracking-wider">
                      <th className="px-6 py-4 cursor-pointer hover:text-zinc-300 w-1/3">Target Asset & Forensic Summary</th>
                      <th className="px-6 py-4 cursor-pointer hover:text-zinc-300">Risk Profile</th>
                      <th className="px-6 py-4 cursor-pointer hover:text-zinc-300">Drawdown & Trend</th>
                      <th className="px-6 py-4 cursor-pointer hover:text-zinc-300">Structural Decay</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {currentProjects.map((proj, idx) => (
                      <tr key={idx} className="hover:bg-zinc-900/60 transition-colors group cursor-pointer" onClick={() => performInvestigation(proj.symbol)}>
                        <td className="px-6 py-4 whitespace-normal">
                          <div className="flex items-start gap-4">
                            <img src={proj.icon} alt={proj.name} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700/50 object-cover mt-1 flex-shrink-0 shadow-lg" />
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-zinc-100 text-base tracking-tight">{proj.name}</span>
                                <span className="text-xs font-bold text-zinc-500 bg-zinc-800/50 px-1.5 py-0.5 rounded">{proj.symbol}</span>
                              </div>
                              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                                {proj.summary}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="flex flex-col gap-2 mt-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-xl font-black ${proj.score > 80 ? 'text-[var(--color-spark-magenta)] drop-shadow-[0_0_5px_rgba(225,29,72,0.5)]' : proj.score > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {proj.score}
                              </span>
                              <span className="text-zinc-600 text-xs font-bold">/100</span>
                            </div>
                            <div>
                              <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${proj.score > 80 ? 'bg-rose-950/30 text-rose-400 border-rose-900/50' : proj.score > 40 ? 'bg-amber-950/30 text-amber-400 border-amber-900/50' : 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50'}`}>
                                {proj.reason}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="flex flex-col gap-2 mt-1">
                            <span className="text-sm font-black text-rose-400">{proj.drawdown}</span>
                            <div className="flex items-end gap-0.5 h-6">
                              {proj.trend.map((val, i) => (
                                <div 
                                  key={i} 
                                  className={`w-1.5 rounded-t-sm ${val > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                  style={{ height: `${Math.max(10, Math.min(100, Math.abs(val)))}%`, opacity: 0.5 + (i * 0.1) }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="flex flex-col gap-1.5 mt-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-zinc-500">Velocity:</span>
                              <span className={`font-bold ${proj.velocity === 'Accelerating' || proj.velocity === 'Terminal' ? 'text-rose-400' : proj.velocity === 'Decelerating' ? 'text-emerald-400' : 'text-zinc-400'}`}>
                                {proj.velocity}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-zinc-500">Half-Life:</span>
                              <span className={`font-bold ${proj.halfLife === 'Dead' || proj.halfLife === '0 days' ? 'text-zinc-600' : proj.halfLife === 'Healthy' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {proj.halfLife}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-zinc-500">Econ Sust:</span>
                              <span className="font-mono text-zinc-300 bg-zinc-900 px-1 rounded">{proj.sustainability}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right align-top">
                          <button 
                            className="mt-2 px-4 py-2 bg-zinc-900 border border-zinc-700 hover:border-[var(--color-spark-teal)] text-zinc-300 hover:text-[var(--color-spark-teal)] text-xs font-bold rounded shadow-lg transition-all group-hover:bg-zinc-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              performInvestigation(proj.symbol);
                            }}
                          >
                            Full Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-900/40">
                <div className="text-xs text-zinc-500">
                  Showing <span className="font-bold text-zinc-300">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-zinc-300">{Math.min(currentPage * itemsPerPage, EXPLORER_PROJECTS.length)}</span> of <span className="font-bold text-zinc-300">{EXPLORER_PROJECTS.length}</span> assets
                </div>
                <div className="flex gap-2">
                  <button 
                    className="px-3 py-1.5 text-xs font-bold text-zinc-400 bg-zinc-900 border border-zinc-700 rounded hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button 
                    className="px-3 py-1.5 text-xs font-bold text-zinc-400 bg-zinc-900 border border-zinc-700 rounded hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-40 bg-transparent backdrop-blur-md flex flex-col items-center justify-center min-h-[600px] border border-teal-900/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.1)]">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-2 border-zinc-800 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-[var(--color-spark-teal)] rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-[var(--color-spark-teal)] font-sans font-medium text-sm animate-pulse">CONNECTING</div>
              {/* Radar sweep */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="w-1/2 h-1/2 bg-gradient-to-tr from-[var(--color-spark-teal)]/20 to-transparent origin-bottom-right hidden"></div>
              </div>
            </div>
            <div className="w-96 bg-zinc-950 border border-zinc-800 p-4 rounded font-sans font-medium text-xs text-[var(--color-spark-teal)]/80 space-y-2">
              <p className="flex items-center gap-2"><span className="text-emerald-500">✔</span> Establishing CMC API Link...</p>
              <p className="flex items-center gap-2"><span className="text-emerald-500">✔</span> Fetching Telemetry Data...</p>
              <p className="flex items-center gap-2 animate-pulse"><span className="w-2 h-2 bg-[var(--color-spark-teal)] rounded-full"></span> Calculating Death Score Engine...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="w-full glass-panel border-fuchsia-900/50 rounded-xl p-6 text-[var(--color-spark-magenta)] font-sans font-medium flex items-start space-x-4 mb-8">
            <div className="p-3 bg-fuchsia-950/50 rounded-lg">
              <svg className="w-6 h-6 text-[var(--color-spark-magenta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div>
              <h3 className="font-bold text-rose-300 text-lg">INVESTIGATION FAILED</h3>
              <p className="text-sm mt-1 text-[var(--color-spark-magenta)]/80">{error}</p>
            </div>
          </div>
        )}

        {/* Results Dashboard */}
        {result && !loading && (
          <ResultDashboard result={result} onBack={() => setResult(null)} />
        )}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(24, 24, 27, 0.5); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(63, 63, 70, 0.8); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(113, 113, 122, 1); 
        }
      `}</style>
    </div>
  );
}
