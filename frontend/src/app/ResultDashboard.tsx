"use client";

import { useState } from "react";

export default function ResultDashboard({ result, onBack }: { result: any, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || val === null) return "N/A";
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const formatPct = (val: number | undefined) => {
    if (val === undefined || val === null) return <span className="text-zinc-500">N/A</span>;
    const isPos = val > 0;
    return (
      <span className={`text-xs font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'} flex items-center gap-0.5`}>
        {isPos ? '\u25B2' : '\u25BC'} {Math.abs(val).toFixed(2)}%
      </span>
    );
  };

  // The 8 organ nodes mapped to their positions in the radial graph
  const organNodes = [
    { id: "market", label: "Market", score: result?.vital_scores?.market ?? 0, insight: result?.causes?.find((c:any) => c.title.includes("Market") || c.title.includes("Price"))?.evidence || "Market telemetry stable.", x: "20%", y: "15%" },
    { id: "liquidity", label: "Liquidity", score: result?.vital_scores?.liquidity ?? 0, insight: result?.causes?.find((c:any) => c.title.includes("Liquidity"))?.evidence || "DEX depth analyzed.", x: "15%", y: "38%" },
    { id: "trading", label: "Trading", score: result?.vital_scores?.trading ?? 0, insight: "Volume metrics checked.", x: "15%", y: "62%" },
    { id: "holders", label: "Holders", score: result?.vital_scores?.holders ?? 0, insight: result?.causes?.find((c:any) => c.title.includes("Holder"))?.evidence || "Wallet behavior tracked.", x: "20%", y: "85%" },
    { id: "economics", label: "Economics", score: result?.vital_scores?.economics ?? 0, insight: result?.causes?.find((c:any) => c.title.includes("Economic"))?.evidence || "Revenue sustainability assessed.", x: "80%", y: "15%" },
    { id: "security", label: "Security", score: result?.vital_scores?.security ?? 0, insight: result?.causes?.find((c:any) => c.title.includes("Security"))?.evidence || "Contract risks evaluated.", x: "85%", y: "38%" },
    { id: "sentiment", label: "Sentiment", score: result?.vital_scores?.sentiment ?? 0, insight: "Social metrics analyzed.", x: "85%", y: "62%" },
    { id: "development", label: "Development", score: result?.vital_scores?.development ?? 0, insight: "GitHub activity verified.", x: "80%", y: "85%" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#161618] text-white flex overflow-hidden font-sans animate-in fade-in duration-500">
      
      <style>{`
        @keyframes dashFlow {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-flow {
          animation: dashFlow 2s linear infinite;
        }
        .animate-flow-fast {
          animation: dashFlow 1s linear infinite;
        }
      `}</style>

      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      
      {/* GLOBAL EXIT BUTTON */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 z-40 px-4 py-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white rounded shadow-lg transition-colors flex items-center gap-2 font-bold text-xs"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        EXIT FORENSICS
      </button>

      {/* LEFT SIDEBAR (METASLEUTH STYLE MODAL) */}
      <div 
        className={`absolute left-0 top-0 z-50 w-[420px] h-full bg-[#1e1e20] border-r border-zinc-800 shadow-[20px_0_50px_rgba(0,0,0,0.5)] flex flex-col transform transition-transform duration-500 ease-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex items-center gap-2">
              {result?.logo ? <img src={result.logo} alt={result.name} className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700" /> : <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700"></div>}
              <h2 className="font-bold text-lg tracking-tight text-zinc-100 flex items-center gap-2">
                {result?.name || "Unknown"}
              </h2>
            </div>
          </div>
          <div className="flex gap-2">
             <div className="px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-xs font-mono">{result?.token || ""}</div>
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
                  <div className={`px-2 py-1 border rounded text-[10px] font-bold uppercase tracking-widest ${(result?.score ?? 0) > 80 ? 'bg-rose-950/30 text-rose-400 border-rose-900/50' : (result?.score ?? 0) > 40 ? 'bg-amber-950/30 text-amber-400 border-amber-900/50' : 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50'}`}>
                    Risk Score: {result?.score ?? 0} / 100
                  </div>
                  {result?.risk_level && (
                    <div className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {result.risk_level}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <div className="text-[10px] text-zinc-500 mb-1 uppercase font-bold">Price</div>
                    <div className="font-mono text-sm">{formatCurrency(result?.raw_metrics?.price)}</div>
                    <div className="mt-1">{formatPct(result?.raw_metrics?.percent_change_24h)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 mb-1 uppercase font-bold">Market Cap</div>
                    <div className="font-mono text-sm">{formatCurrency(result?.raw_metrics?.market_cap)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 mb-1 uppercase font-bold">24h Volume</div>
                    <div className="font-mono text-sm">{formatCurrency(result?.raw_metrics?.volume_24h)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 mb-1 uppercase font-bold">Vol / Mcap Ratio</div>
                    <div className="font-mono text-sm text-amber-400">
                      {result?.raw_metrics?.volume_24h && result?.raw_metrics?.market_cap ? (result.raw_metrics.volume_24h / result.raw_metrics.market_cap).toFixed(4) : "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Entities / Organs List */}
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
                        <div className={`w-2 h-2 rounded-full ${node.score > 70 ? 'bg-rose-500 shadow-[0_0_5px_#f43f5e]' : node.score > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                        <span className="text-xs font-medium text-zinc-300">{node.label}</span>
                      </div>
                      <div className="w-1/4 flex justify-center">
                        {node.score > 70 ? (
                          <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        ) : (
                          <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        )}
                      </div>
                      <div className="w-1/4 text-right">
                        <span className="text-xs font-mono text-zinc-400">{node.score}</span>
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
                {result?.causes?.map((cause: any, idx: number) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#1e1e20] ${cause.title.includes("Failure") || cause.title.includes("Collapse") ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                    <div className="bg-[#1a1a1c] border border-zinc-800/80 p-3 rounded hover:border-zinc-700 transition-colors cursor-default">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cause.title.includes("Failure") || cause.title.includes("Collapse") ? 'bg-rose-950/50 text-rose-400' : 'bg-amber-950/50 text-amber-400'}`}>
                          {cause.title}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 mt-2">{cause.evidence}</p>
                      <p className="text-[9px] text-zinc-500 mt-2 italic">Source: {cause.source}</p>
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
                  {result?.diagnosis?.reasoning ? (
                    <div dangerouslySetInnerHTML={{ __html: result.diagnosis.reasoning.replace(/\n/g, '<br/>') }} />
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
      <div className="flex-1 relative z-20 overflow-hidden w-full h-full" style={{ cursor: 'grab' }}>
        
        {/* SVG LINES (NOW INSIDE THE CANVAS TO ALIGN PERFECTLY) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0, 0.8))" }}>
          {organNodes.map((node) => {
            const isDanger = node.score > 70;
            const isHovered = hoveredNode === node.id || hoveredNode === 'center';
            return (
              <g key={`line-${node.id}`}>
                {/* Base Dim Line */}
                <path 
                  d={`M 50% 50% L ${node.x} ${node.y}`}
                  fill="none"
                  stroke={isDanger ? "#881337" : "#064e3b"} 
                  strokeWidth="2"
                  className={"transition-all duration-500 " + (hoveredNode && !isHovered ? 'opacity-10' : 'opacity-80')}
                />
                {/* Flowing Light Line */}
                <path 
                  d={`M 50% 50% L ${node.x} ${node.y}`}
                  fill="none"
                  stroke={isDanger ? "#f43f5e" : "#10b981"} 
                  strokeWidth={isHovered ? "3" : "2"}
                  strokeDasharray="10 30"
                  className={"transition-all duration-500 animate-flow " + (hoveredNode && !isHovered ? 'opacity-0' : 'opacity-100') + (isHovered ? ' animate-flow-fast' : '')}
                  style={{ filter: isDanger ? "drop-shadow(0 0 6px #f43f5e)" : "drop-shadow(0 0 6px #10b981)" }}
                />
              </g>
            );
          })}
        </svg>

        {/* Central Node */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          onMouseEnter={() => setHoveredNode('center')}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={() => setIsSidebarOpen(true)}
        >
          <div className={`relative flex flex-col items-center justify-center p-4 rounded-xl bg-[#232326] border shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer ${(result?.score ?? 0) > 60 ? 'border-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.2)]' : 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]'}`}>
            <div className="flex items-center gap-3">
               {result?.logo ? (
                <img src={result.logo} alt={result.name} className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-700 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center font-black text-sm text-zinc-300">
                  {result?.token?.charAt(0) || "?"}
                </div>
              )}
              <div>
                <h1 className="text-sm font-bold text-white leading-tight">{result?.token || "Unknown"} Root</h1>
                <div className="text-[10px] text-zinc-400">Score {result?.score ?? 0}</div>
              </div>
            </div>
            {!isSidebarOpen && (
              <div className="absolute -bottom-6 text-[10px] text-zinc-500 animate-pulse font-bold whitespace-nowrap">
                Click to open forensics
              </div>
            )}
          </div>
        </div>

        {/* Organ Nodes (Satellites) */}
        {organNodes.map((node) => {
          const isActive = hoveredNode === node.id;
          const isDanger = node.score > 70;
          return (
            <div 
              key={node.id}
              className="absolute z-20 transition-all duration-500 ease-out"
              style={{ top: node.y, left: node.x, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => {
                setHoveredNode(node.id);
                setIsSidebarOpen(true);
              }}
            >
              <div className={`group flex flex-col w-56 transition-all duration-300 ${isActive ? 'scale-105 z-50' : 'scale-100 opacity-90'} cursor-pointer`}>
                <div className={`w-full bg-[#1e1e20] border rounded-lg overflow-hidden shadow-lg transition-all ${isDanger ? 'border-rose-900 hover:border-rose-500' : 'border-zinc-800 hover:border-emerald-500'} ${isActive ? 'ring-1 ring-zinc-500' : ''}`}>
                  <div className={`px-3 py-1.5 border-b flex justify-between items-center ${isDanger ? 'bg-rose-950/20 border-rose-900/30' : 'bg-zinc-900/50 border-zinc-800'}`}>
                    <span className="text-[10px] font-bold text-zinc-300">{node.label} Node</span>
                    <span className={`text-[10px] font-mono px-1 rounded ${isDanger ? 'bg-rose-900/30 text-rose-300' : 'bg-zinc-800 text-zinc-400'}`}>
                      {node.score}
                    </span>
                  </div>
                  <div className="p-2.5 bg-[#1a1a1c]/80 backdrop-blur-sm min-h-[50px] flex items-center">
                    <p className={`text-[9px] font-medium leading-relaxed line-clamp-3 ${isDanger ? 'text-rose-200/80' : 'text-zinc-400'}`}>
                      {node.insight}
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
