import React from 'react';

export default function ReportModal({ isOpen, onClose, result }: { isOpen: boolean, onClose: () => void, result: any }) {
  if (!isOpen || !result) return null;

  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Procedurally generate detailed long-form content
  const mcap = Number(result.raw_metrics?.market_cap || 0);
  const vol = Number(result.raw_metrics?.volume_24h || 0);
  const price = Number(result.raw_metrics?.price || 0);
  
  const v_liquidity = result.vital_scores?.liquidity || 0;
  const v_vol = result.vital_scores?.volume_health || 0;
  const v_net = result.vital_scores?.network_activity || 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/80 backdrop-blur-sm overflow-y-auto custom-scrollbar p-4 sm:p-8">
      <div className="bg-[#1c1d1c] w-full max-w-5xl rounded border border-[#333333] shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 bg-[#1c1d1c]/90 backdrop-blur border-b border-[#333333] p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="Autopsy" className="w-8 h-8" />
            <span className="font-sans font-bold text-lg tracking-wider text-white">AUTOPSY INTELLIGENCE</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#333333] rounded transition-colors text-zinc-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Report Content - 4Pillars Style */}
        <div className="p-8 sm:p-16 text-zinc-300 font-sans leading-relaxed">
          
          {/* Cover Section */}
          <div className="mb-16 border-b border-[#333333] pb-12">
            <div className="text-[var(--color-winter-green)] font-mono text-sm tracking-[0.2em] uppercase mb-4">Forensic Research Report</div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight font-mono">
              {result.name} ({result.symbol})<br/>
              <span className="text-zinc-500 text-3xl sm:text-4xl mt-2 block font-sans">Anatomy of a {result.diagnosis?.verdict || "Collapse"}</span>
            </h1>
            
            <div className="flex flex-wrap gap-6 items-center text-sm font-mono text-zinc-400 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-[#333]">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <span>Autopsy Data Science Team</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span>{date}</span>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-[#333333] rounded text-xs text-white">ON-CHAIN FORENSICS</span>
                <span className="px-3 py-1 bg-[#333333] rounded text-xs text-white">MARKET STRUCTURE</span>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="bg-[#252725] border border-[#333333] p-8 mb-16 rounded">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 font-mono">
              <svg className="w-5 h-5 text-[var(--color-winter-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Executive Summary & Key Takeaways
            </h2>
            <ul className="space-y-4 text-zinc-300">
              <li className="flex gap-3">
                <span className="text-[var(--color-winter-green)] mt-1">■</span>
                <div>
                  <strong className="text-white">Algorithmic Verdict: {result.diagnosis?.verdict || "N/A"}.</strong> 
                  <p className="mt-1">The asset registered a Terminal Death Score of {result.score}/100. This indicates a severe structural compromise in either liquidity, network participation, or economic sustainability.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--color-winter-green)] mt-1">■</span>
                <div>
                  <strong className="text-white">Primary Failure Vector: {result.causes && result.causes.length > 0 ? result.causes[0].title : 'Market Decay'}.</strong>
                  <p className="mt-1">{result.causes && result.causes.length > 0 ? result.causes[0].evidence : 'The asset exhibits symptoms of structural failure.'}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--color-winter-green)] mt-1">■</span>
                <div>
                  <strong className="text-white">Market Reality vs. Perception.</strong>
                  <p className="mt-1">While the asset maintains a nominal market capitalization of ${mcap.toLocaleString()}, the 24-hour verifiable trading volume is only ${vol.toLocaleString()}, revealing a dangerous liquidity mismatch.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Main Content Sections */}
          <div className="space-y-16">
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2 font-mono">1. Introduction & Asset Overview</h2>
              <p className="mb-4">
                The objective of this forensic report is to unpack the underlying market realities of <strong className="text-white">{result.name} ({result.symbol})</strong>. 
                Unlike standard price-action analytics that rely on superficial charting, the Autopsy Intelligence Engine reconstructs the internal structural health of the asset using telemetry powered by the CoinMarketCap PRO API.
              </p>
              <p className="mb-4">
                At the time of this investigation, {result.name} is trading at <strong className="text-white">${price.toFixed(6)}</strong>. However, price alone is a lagging indicator of protocol death. To understand the true state of the asset, we must examine the internal flow of capital, liquidity depth, and verifiable on-chain participation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2 font-mono">2. Structural Health & Liquidity Analysis</h2>
              <p className="mb-6">
                Our proprietary 3-Layer Score Engine decomposes the asset's health into 8 distinct vital signs. 
                These metrics act as the "organs" of the digital asset ecosystem. When multiple organs fail, a terminal spiral is mathematically inevitable.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {Object.entries(result.vital_scores || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-[#1c1d1c] border border-[#333] p-6 rounded relative overflow-hidden group hover:border-[#555] transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: Number(value) < 40 ? 'var(--color-winter-green)' : Number(value) < 70 ? '#f59e0b' : 'var(--color-winter-purple)' }}></div>
                    <div className="text-xs font-mono text-zinc-500 uppercase mb-2 ml-2">{key.replace('_', ' ')}</div>
                    <div className="text-4xl font-bold mb-3 ml-2" style={{ color: Number(value) < 40 ? 'var(--color-winter-green)' : Number(value) < 70 ? '#f59e0b' : 'var(--color-winter-purple)' }}>
                      {value} <span className="text-sm font-normal text-zinc-500">/ 100</span>
                    </div>
                    <p className="text-sm text-zinc-400 ml-2">
                      {Number(value) > 70 
                        ? "Critical decay detected. This sector is actively hemorrhaging capital or participation, contributing significantly to the structural failure."
                        : Number(value) > 40
                        ? "Moderate distress. While not terminal on its own, this metric shows clear signs of stagnation and declining momentum."
                        : "Healthy baseline. This specific metric remains structurally intact despite broader ecosystem decay."}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mb-4">
                <strong className="text-white">Liquidity & Volume Depth:</strong> A critical observation is the relationship between Liquidity (Score: {v_liquidity}) and Volume (Score: {v_vol}). 
                A healthy protocol maintains a dense liquidity buffer to absorb volume shocks. In the case of {result.symbol}, we observe {v_liquidity > 50 ? "a catastrophic draining of decentralized exchange pools, making the current market capitalization an illusion" : "relatively stable but underutilized liquidity pools"}.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2 font-mono">3. Forensics & The Failure Vector</h2>
              <p className="mb-6">
                Protocols do not die randomly; they follow predictable mathematical spirals. Based on the integration of {result.causes?.length || 0} distinct data points, the Autopsy engine has mapped the precise timeline and vector of collapse for {result.symbol}.
              </p>
              
              <div className="space-y-6">
                {result.causes?.map((cause: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-[var(--color-winter-purple)] pl-6 py-2 bg-gradient-to-r from-[var(--color-winter-purple)]/10 to-transparent">
                    <h3 className="text-xl font-bold text-white mb-3 font-mono">{cause.title}</h3>
                    <p className="text-zinc-300 mb-4 text-sm sm:text-base leading-relaxed">{cause.evidence}</p>
                    <div className="inline-flex items-center gap-2 text-xs font-mono bg-[#1c1d1c] border border-[#333] px-3 py-1.5 text-[var(--color-winter-green)]">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                      SOURCE: {cause.source}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2 font-mono">4. Methodology & Disclaimer</h2>
              <p className="text-sm text-zinc-400 mb-4">
                This report was procedurally generated by the Autopsy Data Science Pipeline. All underlying data telemetry is sourced directly from the <strong className="text-white">CoinMarketCap PRO API</strong> (`/v2/cryptocurrency/info`, `/v2/cryptocurrency/quotes/latest`, `/v3/dex/quotes/latest`).
              </p>
              <p className="text-sm text-zinc-500 bg-[#1c1d1c] p-4 rounded border border-[#333]">
                <strong className="text-zinc-300">Disclaimer:</strong> The Terminal Death Score and associated diagnostics are algorithmic interpretations of market structure and liquidity depth. They do not constitute financial advice. The classification of a protocol as a "Zombie", "False Death", or "Liquidity Spiral" is a mathematical assessment of network health, not a definitive prediction of future price action.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
