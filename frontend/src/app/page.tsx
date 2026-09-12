"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  const handleInvestigate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query) return;
    setLoading(true);
    setError("");
    setResult(null);
    setChatHistory([]);
    setActiveTab("overview");

    try {
      const res = await fetch("http://localhost:8000/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: query }),
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

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.chat.value;
    if(!input) return;
    
    setChatHistory(prev => [...prev, { role: "user", text: input }]);
    form.chat.value = "";

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
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
          <div className="flex items-center space-x-4">
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
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* HERO METRICS BANNER */}
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
              {/* Dynamic decorative background glow */}
              <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000 ${result.score > 60 ? 'bg-rose-600' : 'bg-cyan-600'}`}></div>
              
              <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start relative z-10">
                {/* Token Identity */}
                <div className="flex items-center gap-6 lg:w-1/3">
                  <div className="w-20 h-20 rounded-2xl glass-pill flex items-center justify-center p-2 shadow-xl relative">
                    {result.logo ? (
                      <img src={result.logo} alt={result.name} className="w-full h-full object-contain drop-shadow-lg" />
                    ) : (
                      <span className="text-2xl font-bold">{result.token.charAt(0)}</span>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-zinc-800 border border-zinc-600 rounded-full flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${result.score > 60 ? 'bg-[var(--color-spark-magenta)] animate-pulse shadow-[0_0_8px_#f43f5e]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tight flex items-baseline gap-3">
                      {result.name}
                      <span className="text-xl font-sans font-medium text-zinc-500 font-medium">{result.token}</span>
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2.5 py-1 glass-pill rounded-full text-xs font-sans font-medium text-zinc-400 uppercase tracking-wider">{result.category || "Token"}</span>
                      {result.links?.website && (
                        <a href={result.links.website} target="_blank" rel="noreferrer" className="px-2.5 py-1 glass-pill hover:border-[var(--color-spark-teal)] hover:text-[var(--color-spark-teal)] rounded text-xs font-sans font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1 transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                          Website
                        </a>
                      )}
                      {result.links?.twitter && (
                        <a href={result.links.twitter} target="_blank" rel="noreferrer" className="px-2.5 py-1 glass-pill hover:border-[var(--color-spark-teal)] hover:text-[var(--color-spark-teal)] rounded text-xs font-sans font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1 transition-colors">
                          Twitter
                        </a>
                      )}
                      {result.links?.explorer && (
                        <a href={result.links.explorer} target="_blank" rel="noreferrer" className="px-2.5 py-1 glass-pill hover:border-[var(--color-spark-teal)] hover:text-[var(--color-spark-teal)] rounded text-xs font-sans font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1 transition-colors">
                          Explorer
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Core Metrics Grid */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 hover:bg-zinc-800/50 transition-colors">
                    <div className="text-xs text-zinc-500 font-sans font-medium mb-1 uppercase tracking-widest">Price</div>
                    <div className="text-2xl font-sans font-medium text-white mb-2">{formatCurrency(result.raw_metrics.price)}</div>
                    {formatPct(result.raw_metrics.percent_change_24h)}
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 hover:bg-zinc-800/50 transition-colors">
                    <div className="text-xs text-zinc-500 font-sans font-medium mb-1 uppercase tracking-widest">Market Cap</div>
                    <div className="text-2xl font-sans font-medium text-white mb-2">{formatCurrency(result.raw_metrics.market_cap)}</div>
                    <div className="text-xs text-zinc-500 font-sans font-medium flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> CMC Verified</div>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 hover:bg-zinc-800/50 transition-colors">
                    <div className="text-xs text-zinc-500 font-sans font-medium mb-1 uppercase tracking-widest">24h Volume</div>
                    <div className="text-2xl font-sans font-medium text-white mb-2">{formatCurrency(result.raw_metrics.volume_24h)}</div>
                    <div className="text-xs font-sans font-medium text-zinc-400">Vol/Mcap: {result.raw_metrics.market_cap > 0 ? ((result.raw_metrics.volume_24h / result.raw_metrics.market_cap) * 100).toFixed(2) : 0}%</div>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 hover:bg-zinc-800/50 transition-colors">
                    <div className="text-xs text-zinc-500 font-sans font-medium mb-1 uppercase tracking-widest">Macro Trend</div>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-1">
                        <span className="text-zinc-400">7 Days</span>
                        {formatPct(result.raw_metrics.percent_change_7d)}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-400">30 Days</span>
                        {formatPct(result.raw_metrics.percent_change_30d)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex gap-2 border-b border-zinc-800 px-2">
              {['overview', 'evidence', 'ai_terminal'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-sans font-medium text-sm tracking-wider uppercase transition-all relative ${activeTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {tab.replace('_', ' ')}
                  {activeTab === tab && (
                    <div className={`absolute bottom-0 left-0 w-full h-0.5 shadow-[0_-2px_10px_rgba(255,255,255,0.5)] ${result.score > 60 ? 'bg-[var(--color-spark-magenta)] shadow-[var(--color-spark-magenta)]/50' : 'bg-[var(--color-spark-teal)] shadow-[var(--color-spark-teal)]/50'}`}></div>
                  )}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
                
                {/* LARGE SCORE GAUGE */}
                <div className={`lg:col-span-5 glass-panel rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden ${getBgColor(result.score)}`}>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
                  
                  <div className="text-center w-full mb-8 relative z-10">
                    <h3 className="text-sm font-bold text-zinc-400 tracking-[0.2em] uppercase mb-1 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                      Forensic Health Score
                    </h3>
                    <p className="text-xs text-zinc-500">Powered by Agentic Data Analysis</p>
                  </div>
                  
                  <div className="relative flex items-center justify-center w-64 h-64 mb-6 z-10">
                    {/* Background Track */}
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl" viewBox="0 0 36 36">
                      <path className="text-zinc-800/80" strokeWidth="2" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeLinecap="round" />
                      {/* Active Track with glow */}
                      <path 
                        className={`${getScoreColor(result.score).split(' ')[0]} transition-all duration-1500 ease-out`} 
                        strokeDasharray={`${result.score}, 100`} 
                        strokeWidth="2.5" 
                        stroke="currentColor" 
                        fill="none" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        strokeLinecap="round" 
                        style={{ filter: `drop-shadow(0 0 8px currentColor)` }}
                      />
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className={`text-6xl font-black tracking-tighter ${getScoreColor(result.score).split(' ')[0]} ${result.score > 60 ? 'neon-text-red' : ''}`}>
                        {result.score}
                      </div>
                      <div className="text-zinc-500 text-sm font-sans font-medium mt-1">/ 100</div>
                    </div>

                    {/* Decorative ticks */}
                    <div className="absolute inset-0 border-[0.5px] border-zinc-700 rounded-full border-dashed animate-[spin_60s_linear_infinite] opacity-30 pointer-events-none"></div>
                  </div>
                  
                  <div className="text-center w-full z-10">
                    <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest border ${getScoreColor(result.score).split(' ').slice(0,2).join(' ')} ${getBgColor(result.score)}`}>
                      {result.score > 60 && <div className="w-2 h-2 rounded-full bg-[var(--color-spark-magenta)] animate-ping"></div>}
                      {result.risk_level.replace(/[^a-zA-Z ]/g, '').trim()}
                    </div>
                  </div>
                </div>

                {/* TIMELINE & DESCRIPTION */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {/* Token Description */}
                  <div className="glass-panel rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-zinc-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Project Profile
                    </h3>
                    <p className="text-sm text-zinc-300 leading-relaxed max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                      {result.description || "No official description available from CMC for this asset."}
                    </p>
                  </div>

                  {/* Vertical Timeline */}
                  <div className="glass-panel rounded-2xl p-6 flex-1">
                    <h3 className="text-sm font-bold text-zinc-400 tracking-widest uppercase mb-6 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Deterioration Timeline
                    </h3>
                    
                    <div className="relative pl-4 space-y-8 before:absolute before:inset-0 before:ml-[21px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-700 before:to-transparent">
                      {result.timeline.map((item: any, idx: number) => {
                        const isCritical = item.status === "Critical" || item.status === "Stress" || item.status === "Deterioration";
                        return (
                          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            {/* Marker */}
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full border-4 border-zinc-950 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md ${isCritical ? 'bg-[var(--color-spark-magenta)] shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-zinc-500'}`}></div>
                            {/* Content */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl shadow-lg hover:border-zinc-600 transition-colors">
                              <div className="flex items-center justify-between mb-1">
                                <time className="font-sans font-medium text-xs font-medium text-[var(--color-spark-teal)]">{item.day}</time>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${isCritical ? 'bg-fuchsia-950 text-[var(--color-spark-magenta)] border border-fuchsia-900' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>{item.status}</span>
                              </div>
                              <p className="text-sm text-zinc-300">{item.event}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: EVIDENCE */}
            {activeTab === "evidence" && (
              <div className="glass-panel rounded-2xl p-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
                  <h3 className="text-lg font-black text-white tracking-widest flex items-center gap-3">
                    <svg className="w-5 h-5 text-[var(--color-spark-magenta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    FORENSIC FINDINGS (CAUSES)
                  </h3>
                  <div className="text-sm font-sans font-medium text-zinc-500 bg-zinc-900 px-3 py-1 rounded border border-zinc-800">
                    Matches Found: <span className="text-white">{result.causes.length}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {result.causes.map((cause: any, idx: number) => {
                    const isSevere = cause.title.includes("Severe") || cause.title.includes("Collapse") || cause.title.includes("Chronic") || cause.title.includes("Hazard");
                    return (
                      <div key={idx} className={`glass-card rounded-3xl p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col ${isSevere ? 'border-fuchsia-900/50 hover:border-[var(--color-spark-magenta)]' : 'border-zinc-800 hover:border-zinc-600'}`}>
                        {/* decorative background element */}
                        <div className="absolute -right-4 -top-4 text-zinc-800 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
                          <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                        </div>
                        
                        <div className="relative z-10 flex-1 flex flex-col">
                          <div className={`inline-block px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase mb-4 border w-fit ${isSevere ? 'bg-fuchsia-950 text-[var(--color-spark-magenta)] border-fuchsia-900' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                            {isSevere ? 'CRITICAL FINDING' : 'OBSERVATION'}
                          </div>
                          <h4 className="text-lg font-bold text-white mb-3 leading-tight">{cause.title}</h4>
                          <p className="text-sm text-zinc-400 mb-6 leading-relaxed flex-1">{cause.evidence}</p>
                          
                          {/* DYNAMIC DATA VISUALIZATION */}
                          {cause.data_viz && cause.data_viz.type !== 'none' && (
                            <div className="mb-6 bg-white/5 border border-white/10 p-4 rounded-2xl">
                              
                              {/* Type 1: Volume vs Mcap Ratio */}
                              {cause.data_viz.type === 'volume_mcap_ratio' && (
                                <div>
                                  <div className="flex justify-between text-xs font-sans font-medium text-zinc-500 mb-2">
                                    <span>24h Vol: {formatCurrency(cause.data_viz.volume)}</span>
                                    <span>MCap: {formatCurrency(cause.data_viz.mcap)}</span>
                                  </div>
                                  <div className="w-full bg-zinc-800 rounded-full h-2.5 mb-1 overflow-hidden flex">
                                    <div className={`h-2.5 rounded-full ${cause.data_viz.ratio < 5 ? 'bg-[var(--color-spark-magenta)]' : 'bg-emerald-500'}`} style={{ width: `${Math.min(cause.data_viz.ratio, 100)}%` }}></div>
                                  </div>
                                  <div className="text-right text-[10px] font-sans font-medium text-[var(--color-spark-teal)]">{cause.data_viz.ratio.toFixed(2)}% Ratio</div>
                                </div>
                              )}

                              {/* Type 2: Trend Bars */}
                              {cause.data_viz.type === 'trend_bars' && (
                                <div className="space-y-3">
                                  {cause.data_viz.trends.map((t: any, i: number) => (
                                    <div key={i}>
                                      <div className="flex justify-between text-xs font-sans font-medium mb-1">
                                        <span className="text-zinc-500">{t.label}</span>
                                        <span className={t.val >= 0 ? "text-emerald-500" : "text-[var(--color-spark-magenta)]"}>{t.val.toFixed(2)}%</span>
                                      </div>
                                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden flex">
                                        {/* Midpoint is 50%, so we offset based on value */}
                                        <div className="w-1/2 flex justify-end">
                                          {t.val < 0 && <div className="h-full bg-[var(--color-spark-magenta)] rounded-l-full" style={{ width: `${Math.min(Math.abs(t.val), 100)}%` }}></div>}
                                        </div>
                                        <div className="w-1/2 flex justify-start">
                                          {t.val > 0 && <div className="h-full bg-emerald-500 rounded-r-full" style={{ width: `${Math.min(t.val, 100)}%` }}></div>}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Type 3: FDV vs Mcap Compare */}
                              {cause.data_viz.type === 'fdv_mcap_compare' && (
                                <div className="space-y-3">
                                  <div>
                                    <div className="flex justify-between text-xs font-sans font-medium mb-1">
                                      <span className="text-zinc-500">Market Cap</span>
                                      <span className="text-zinc-300">{formatCurrency(cause.data_viz.mcap)}</span>
                                    </div>
                                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                                      <div className="bg-[var(--color-spark-teal)] h-full" style={{ width: `${(cause.data_viz.mcap / Math.max(cause.data_viz.fdv, 1)) * 100}%` }}></div>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex justify-between text-xs font-sans font-medium mb-1">
                                      <span className="text-zinc-500">FDV (Fully Diluted)</span>
                                      <span className="text-[var(--color-spark-magenta)]">{formatCurrency(cause.data_viz.fdv)}</span>
                                    </div>
                                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                                      <div className="bg-[var(--color-spark-magenta)] h-full w-full"></div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-xs text-[var(--color-spark-teal)] font-sans font-medium mt-auto">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            <span>SOURCE: {cause.source}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: AI TERMINAL */}
            {activeTab === "ai_terminal" && (
              <div className="glass-card flex flex-col h-[600px] shadow-[0_0_30px_rgba(6,182,212,0.1)] overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500 relative">
                
                {/* Background scanning effect */}
                <div className="absolute inset-0 bg-teal-900/5 opacity-20 pointer-events-none hidden"></div>

                {/* Chat Header */}
                <div className="p-4 border-b border-teal-900/50 flex items-center justify-between bg-transparent backdrop-blur-xl relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded bg-teal-950 border border-teal-800">
                      <svg className="w-5 h-5 text-[var(--color-spark-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path></svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-cyan-100 tracking-widest uppercase">DOCTOR AGENT OVERRIDE</h3>
                      <p className="text-[10px] font-sans font-medium text-[var(--color-spark-teal)]/70">SECURE ENCRYPTED COMM CHANNEL</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-spark-teal)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-spark-teal)]"></span>
                    </span>
                    <span className="text-[10px] font-sans font-medium text-[var(--color-spark-teal)] uppercase">Agent Online</span>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6 font-sans font-medium text-sm relative z-10 custom-scrollbar">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-xl shadow-lg leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-teal-900/40 border border-teal-800/50 text-cyan-100 rounded-br-none' 
                          : 'bg-white/5 border border-white/10 text-zinc-300 rounded-bl-none backdrop-blur-md'
                      }`}>
                        {msg.role === 'doctor' && (
                          <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
                            <svg className="w-3 h-3 text-[var(--color-spark-teal)]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
                            <span className="text-[10px] text-[var(--color-spark-teal)] font-bold tracking-widest uppercase">Agent Response</span>
                          </div>
                        )}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Chat Input */}
                <div className="p-4 border-t border-teal-900/50 bg-zinc-950/80 relative z-10">
                  <form onSubmit={handleChat} className="flex space-x-2 relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[var(--color-spark-teal)] font-black">
                      &gt;_
                    </div>
                    <input 
                      name="chat" 
                      type="text" 
                      className="flex-1 bg-zinc-900 border border-zinc-800 pl-12 pr-4 py-3 rounded-lg text-sm text-cyan-100 focus:outline-none focus:border-[var(--color-spark-teal)]/50 focus:ring-1 focus:ring-[var(--color-spark-teal)]/50 font-sans font-medium placeholder-zinc-600 transition-all shadow-inner" 
                      placeholder="Type query to Doctor Agent..." 
                      autoComplete="off"
                    />
                    <button type="submit" className="glass-pill hover:bg-white/10 text-[var(--color-spark-teal)] px-6 py-3 rounded-lg transition-colors flex items-center justify-center font-bold tracking-widest uppercase text-xs">
                      Send
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
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
