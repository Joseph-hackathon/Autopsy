"use client";

import { useState } from "react";

export default function ResultDashboard({ result, onBack }: { result: any, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined) return "N/A";
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const formatPct = (val: number | undefined) => {
    if (val === undefined) return <span className="text-zinc-500">N/A</span>;
    const isPos = val > 0;
    return (
      <span className={`text-xs font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'} flex items-center gap-0.5`}>
        {isPos ? '\u25B2' : '\u25BC'} {Math.abs(val).toFixed(2)}%
      </span>
    );
  };

  // The 8 organ nodes mapped to their positions in the radial graph
  const organNodes = [
    { id: "market", label: "Market", data: result?.metrics?.market, x: "20%", y: "15%" },
    { id: "liquidity", label: "Liquidity", data: result?.metrics?.liquidity, x: "15%", y: "38%" },
    { id: "trading", label: "Trading", data: result?.metrics?.trading, x: "15%", y: "62%" },
    { id: "holders", label: "Holders", data: result?.metrics?.holders, x: "20%", y: "85%" },
    { id: "economics", label: "Economics", data: result?.metrics?.economics, x: "80%", y: "15%" },
    { id: "security", label: "Security", data: result?.metrics?.security, x: "85%", y: "38%" },
    { id: "sentiment", label: "Sentiment", data: result?.metrics?.sentiment, x: "85%", y: "62%" },
    { id: "development", label: "Development", data: result?.metrics?.development, x: "80%", y: "85%" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#161618] text-white flex overflow-hidden font-sans animate-in fade-in duration-500">
      
      {/* BACKGROUND GRID & SVG LINES */}
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ filter: "drop-shadow(0 0 8px rgba(var(--color-spark-teal-rgb), 0.3))" }}>
        {organNodes.map((node) => {
          const isDanger = node.data?.score > 70;
          return (
            <path 
              key={`line-${node.id}`}
              d={`M 50% 50% Q 50% ${node.y} ${node.x} ${node.y}`}
              fill="none"
              stroke={isDanger ? "#f43f5e" : "#10b981"} 
              strokeWidth={hoveredNode === node.id || hoveredNode === 'center' ? "3" : "1"}
              strokeDasharray={isDanger ? "5,5" : "none"}
              className={"transition-all duration-500 " + (hoveredNode && hoveredNode !== node.id && hoveredNode !== 'center' ? 'opacity-20' : 'opacity-80') + (isDanger ? ' animate-[dash_2s_linear_infinite]' : '')}
            />
          );
        })}
      </svg>

      {/* LEFT SIDEBAR (METASLEUTH STYLE MODAL) */}
      <div className="relative z-30 w-[420px] h-full bg-[#1e1e20] border-r border-zinc-800 shadow-[20px_0_50px_rgba(0,0,0,0.5)] flex flex-col transform transition-transform duration-500">
        
        {/* Sidebar Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex items-center gap-2">
              {result.logo && <img src={result.logo} alt={result.name} className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700" />}
              <h2 className="font-bold text-lg tracking-tight text-zinc-100 flex items-center gap-2">
                {result.name}
              </h2>
            </div>
          </div>
          <div className="flex gap-2">
             <div className="px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-xs font-mono">{result.token}</div>
          </div>
        </div>

        {/* Sidebar Tabs */}
        <div className="flex border-b border-zinc-800 text-xs font-bold bg-[#1a1a1c]">
          <button className={`flex-1 py-3 text-center border-b-2 transition-colors ${activeTab === 'overview' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`flex-1 py-3 text-center border-b-2 transition-colors ${activeTab === 'evidence' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`} onClick={() => setActiveTab('evidence')}>Events</button>
          <button className={`flex-1 py-3 text-center border-b-2 transition-colors ${activeTab === 'ai' ? 'border-[var(--color-spark-magenta)] text-[var(--color-spark-magenta)]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`} onClick={() => setActiveTab('ai')}>AI Analysis</button>
        </div>

        {/* Sidebar Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 p-0">
          
          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
              {/* Vitals Summary */}
              <div className="p-5 border-b border-zinc-800/50 bg-[#1e1e20]">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`px-2 py-1 border rounded text-[10px] font-bold uppercase tracking-widest ${result.score > 80 ? 'bg-rose-950/30 text-rose-400 border-rose-900/50' : result.score > 40 ? 'bg-amber-950/30 text-amber-400 border-amber-900/50' : 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50'}`}>
                    Risk Score: {result.score} / 100
                  </div>
                  {result.verdict && (
                    <div className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {result.verdict}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <div className="text-[10px] text-zinc-500 mb-1 uppercase font-bold">Price</div>
                    <div className="font-mono text-sm">{formatCurrency(result.raw_metrics?.price)}</div>
                    <div className="mt-1">{formatPct(result.raw_metrics?.percent_change_24h)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 mb-1 uppercase font-bold">Market Cap</div>
                    <div className="font-mono text-sm">{formatCurrency(result.raw_metrics?.market_cap)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 mb-1 uppercase font-bold">24h Volume</div>
                    <div className="font-mono text-sm">{formatCurrency(result.raw_metrics?.volume_24h)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 mb-1 uppercase font-bold">Vol / Mcap Ratio</div>
                    <div className="font-mono text-sm text-amber-400">
                      {result.raw_metrics?.volume_24h && result.raw_metrics?.market_cap ? (result.raw_metrics.volume_24h / result.raw_metrics.market_cap).toFixed(4) : "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Entities / Organs List (MetaSleuth style Counterparty list) */}
              <div className="p-0">
                <div className="flex px-4 py-2 bg-[#1a1a1c] border-b border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase">
                  <div className="w-1/2">Module</div>
                  <div className="w-1/4 text-center">Risk</div>
                  <div className="w-1/4 text-right">Score</div>
                </div>
                <div className="divide-y divide-zinc-800/50">
                  {organNodes.map(node => (
                    <div key={`list-${node.id}`} className="flex items-center px-4 py-3 hover:bg-zinc-800/30 cursor-pointer transition-colors" onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)}>
                      <div className="w-1/2 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${node.data?.score > 70 ? 'bg-rose-500 shadow-[0_0_5px_#f43f5e]' : node.data?.score > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                        <span className="text-xs font-medium text-zinc-300">{node.label}</span>
                      </div>
                      <div className="w-1/4 flex justify-center">
                        {node.data?.score > 70 ? (
                          <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        ) : (
                          <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        )}
                      </div>
                      <div className="w-1/4 text-right">
                        <span className="text-xs font-mono text-zinc-400">{node.data?.score ?? 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300 p-5">
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4">Event Flow & Alerts</div>
              <div className="relative pl-4 border-l-2 border-zinc-800 space-y-6">
                {result.structural_signals?.map((sig: any, idx: number) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#1e1e20] ${sig.severity === 'CRITICAL' ? 'bg-rose-500' : sig.severity === 'HIGH' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                    <div className="bg-[#1a1a1c] border border-zinc-800/80 p-3 rounded hover:border-zinc-700 transition-colors cursor-default">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${sig.severity === 'CRITICAL' ? 'bg-rose-950/50 text-rose-400' : sig.severity === 'HIGH' ? 'bg-amber-950/50 text-amber-400' : 'bg-emerald-950/50 text-emerald-400'}`}>
                          {sig.severity}
                        </span>
                        <span className="text-[10px] text-zinc-600 font-mono">{sig.category}</span>
                      </div>
                      <p className="text-xs text-zinc-300 mt-2">{sig.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300 p-5 h-full flex flex-col">
              <div className="bg-[#1a1a1c] border border-zinc-800 rounded p-4 flex-1 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[var(--color-spark-magenta)] to-transparent opacity-50"></div>
                <div className="text-xs font-bold text-[var(--color-spark-magenta)] mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  LLM Forensic Synthesis
                </div>
                <div className="prose prose-invert prose-sm prose-p:leading-relaxed prose-p:text-zinc-400 text-xs overflow-y-auto pr-2 scrollbar-thin">
                  {result.llm_analysis ? (
                    <div dangerouslySetInnerHTML={{ __html: result.llm_analysis.replace(/\n/g, '<br/>') }} />
                  ) : (
                    <p className="italic text-zinc-500">Awaiting AI diagnostic response...</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* RIGHT CANVAS (GRAPH VISUALIZER) */}
      <div className="flex-1 relative z-20 overflow-hidden" style={{ cursor: 'grab' }}>
        
        {/* Central Node */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          onMouseEnter={() => setHoveredNode('center')}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <div className={`relative flex flex-col items-center justify-center p-4 rounded-xl bg-[#232326] border shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer ${result.score > 60 ? 'border-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.2)]' : 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]'}`}>
            <div className="flex items-center gap-3">
               {result.logo ? (
                <img src={result.logo} alt={result.name} className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-700 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center font-black text-sm text-zinc-300">
                  {result.token.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-sm font-bold text-white leading-tight">{result.token} Root</h1>
                <div className="text-[10px] text-zinc-400">Score {result.score}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Organ Nodes (Satellites) */}
        {organNodes.map((node) => {
          const isActive = hoveredNode === node.id;
          const isDanger = node.data?.score > 70;
          return (
            <div 
              key={node.id}
              className="absolute z-20 transition-all duration-500 ease-out"
              style={{ top: node.y, left: node.x, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className={`group flex flex-col w-56 transition-all duration-300 ${isActive ? 'scale-105 z-50' : 'scale-100 opacity-90'} cursor-pointer`}>
                <div className={`w-full bg-[#1e1e20] border rounded-lg overflow-hidden shadow-lg transition-all ${isDanger ? 'border-rose-900 hover:border-rose-500' : 'border-zinc-800 hover:border-emerald-500'} ${isActive ? 'ring-1 ring-zinc-500' : ''}`}>
                  <div className={`px-3 py-1.5 border-b flex justify-between items-center ${isDanger ? 'bg-rose-950/20 border-rose-900/30' : 'bg-zinc-900/50 border-zinc-800'}`}>
                    <span className="text-[10px] font-bold text-zinc-300">{node.label} Node</span>
                    <span className={`text-[10px] font-mono px-1 rounded ${isDanger ? 'bg-rose-900/30 text-rose-300' : 'bg-zinc-800 text-zinc-400'}`}>
                      {node.data?.score ?? 0}
                    </span>
                  </div>
                  <div className="p-2.5 bg-[#1a1a1c]/80 backdrop-blur-sm min-h-[50px] flex items-center">
                    <p className={`text-[9px] font-medium leading-relaxed line-clamp-3 ${isDanger ? 'text-rose-200/80' : 'text-zinc-400'}`}>
                      {node.data?.insight || "Data stream active. Awaiting heuristic consensus..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Global HUD Elements on Canvas */}
        <div className="absolute bottom-6 right-6 flex items-center gap-4 text-[10px] font-mono text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-lg border border-zinc-800 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Network Active
          </div>
          <div className="w-px h-3 bg-zinc-700"></div>
          <div>Zoom: 87%</div>
          <div className="flex gap-1 ml-2">
            <button className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors">+</button>
            <button className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors">-</button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
