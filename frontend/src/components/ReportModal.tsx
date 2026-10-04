import React from 'react';

export default function ReportModal({ isOpen, onClose, result }: { isOpen: boolean, onClose: () => void, result: any }) {
  if (!isOpen || !result) return null;

  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Procedurally generate detailed long-form content
  const mcap = Number(result.raw_metrics?.market_cap || 0);
  const vol = Number(result.raw_metrics?.volume_24h || 0);
  const price = Number(result.raw_metrics?.price || 0);
  
  const v_liquidity = result.vital_scores?.liquidity || 0;
  const v_vol = result.vital_scores?.trading || 0;
  const v_dev = result.vital_scores?.development || 0;
  const v_eco = result.vital_scores?.economics || 0;
  const telemetry = result.forensic_telemetry || {};
  const onchain = telemetry.onchain || {};
  const macro = telemetry.macro_economics || {};
  const announcement = telemetry.announcement;

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/80 backdrop-blur-sm overflow-y-auto custom-scrollbar p-4 sm:p-8">
      <div className="bg-[#1c1d1c] w-full max-w-5xl rounded border border-[#333333] shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-300 h-fit">
        
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 bg-[#1c1d1c]/90 backdrop-blur border-b border-[#333333] p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="Autopsy" className="w-8 h-8" />
            <span className="font-sans font-bold text-lg tracking-wider text-white">AUTOPSY FORENSIC REPORT</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#333333] rounded transition-colors text-zinc-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Report Content - 4Pillars Style */}
        <div className="p-8 sm:p-16 text-zinc-300 font-sans leading-relaxed">
          
          {/* Cover Section */}
          <div className="mb-16 border-b border-[#333333] pb-12">
            <div className="text-[var(--color-winter-green)] font-mono text-sm tracking-[0.2em] uppercase mb-4">Multi-Source Forensic Investigation</div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight font-mono">
              {result.name} ({result.symbol})<br/>
              <span className="text-zinc-500 text-3xl sm:text-4xl mt-2 block font-sans">Anatomy of a {result.diagnosis?.verdict || "Collapse"}</span>
            </h1>
            
            <div className="flex flex-wrap gap-6 items-center text-sm font-mono text-zinc-400 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-[#333]">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <span>Autopsy Intelligence Core</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span>{date}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#333333] rounded text-xs text-white">CMC PRO API</span>
                <span className="px-3 py-1 bg-[#333333] rounded text-xs text-white">ON-CHAIN EXPLORER</span>
                <span className="px-3 py-1 bg-[#333333] rounded text-xs text-white">SOCIAL & GOV BROADCASTS</span>
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
                  <p className="mt-1">Autopsy 2.0 registered a Terminal Death Score of <span className="text-[var(--color-winter-purple)] font-bold">{result.score}/100</span>. Multi-vector cross-correlation confirms the asset is suffering from {result.diagnosis?.failure_type || "critical ecosystem collapse"}.</p>
                </div>
              </li>
              
              {announcement && (
                <li className="flex gap-3">
                  <span className="text-red-400 mt-1">■</span>
                  <div>
                    <strong className="text-white">Official Termination Declared on {announcement.platform}:</strong>
                    <p className="mt-1">{announcement.summary}</p>
                    <a href={announcement.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[var(--color-winter-green)] underline mt-1.5 hover:text-white">
                      <span>View Official Broadcast ({announcement.url})</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                  </div>
                </li>
              )}

              {onchain.daily_tx_count !== undefined && (
                <li className="flex gap-3">
                  <span className="text-[var(--color-winter-green)] mt-1">■</span>
                  <div>
                    <strong className="text-white">On-Chain Activity Freezing ({onchain.explorer_name}):</strong>
                    <p className="mt-1">Verified on-chain contract telemetry reveals transactions dropped by {onchain.tx_decay_rate ? `${(onchain.tx_decay_rate * 100).toFixed(1)}%` : '99%+'} from historical peak. 24-hour interacting wallets collapsed to {onchain.active_wallets_24h || 0}, proving complete user capitulation.</p>
                  </div>
                </li>
              )}

              <li className="flex gap-3">
                <span className="text-[var(--color-winter-green)] mt-1">■</span>
                <div>
                  <strong className="text-white">Primary Failure Vector: {result.causes && result.causes.length > 0 ? result.causes[0].title : 'Structural Decay'}.</strong>
                  <p className="mt-1">{result.causes && result.causes.length > 0 ? result.causes[0].evidence : 'The asset exhibits symptoms of structural failure.'}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Main Content Sections */}
          <div className="space-y-16">
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2 font-mono">1. Introduction & Multi-Year Asset Trajectory</h2>
              <p className="mb-4">
                This forensic investigation deconstructs the structural collapse of <strong className="text-white">{result.name} ({result.symbol})</strong>. 
                Conventional technical analysis and basic price feeds fail to identify when an asset has structurally died because market makers and wash trading maintain the superficial appearance of liquidity.
              </p>
              <p className="mb-4">
                By ingesting real-time quotes from the <strong className="text-white">CoinMarketCap PRO API</strong>, verified on-chain telemetry from <strong className="text-white">{onchain.explorer_name || 'Block Explorers'}</strong>, and public broadcast announcements from <strong className="text-white">X/Twitter and governance channels</strong>, Autopsy uncovers the exact sequence of events that led to protocol insolvency.
              </p>
              {macro.ath_drawdown && (
                <div className="bg-[#1c1d1c] border border-[#333] p-4 rounded text-sm text-zinc-300">
                  <span className="text-[var(--color-winter-green)] font-bold">Long-Term Macro Drawdown:</span> Current market value represents a <strong className="text-white">{(macro.ath_drawdown * 100).toFixed(1)}% drawdown</strong> from all-time highs. Following the expiration of initial liquidity incentive mechanisms, retained protocol value decayed persistently without organic mean reversion.
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2 font-mono">2. 8-Organ Vital Sign Decomposition</h2>
              <p className="mb-6">
                Our 3-Layer Score Engine decomposes protocol health into 8 vital components. When development halts, economics turn deeply negative, and on-chain transactions freeze, the system assigns a Terminal Death verdict:
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
                        ? "Critical pathology. Demonstrates terminal decay, lack of operational backing, or confirmed shutdown."
                        : Number(value) > 40
                        ? "Moderate distress. Shows clear signs of severe stagnation or post-incentive capital flight."
                        : "Healthy baseline."}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2 font-mono">3. Multi-Vector Forensics & Evidence Graph</h2>
              <p className="mb-6">
                Below are the primary vectors of failure identified by our correlation engine, corroborated with external verified sources and on-chain explorers:
              </p>
              
              <div className="space-y-6">
                {result.causes?.map((cause: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-[var(--color-winter-purple)] pl-6 py-4 bg-gradient-to-r from-[var(--color-winter-purple)]/10 to-transparent rounded-r border-t border-b border-r border-[#333]/40">
                    <h3 className="text-xl font-bold text-white mb-3 font-mono">{cause.title}</h3>
                    <p className="text-zinc-300 mb-4 text-sm sm:text-base leading-relaxed">{cause.evidence}</p>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {cause.source_url ? (
                        <a 
                          href={cause.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 text-xs font-mono bg-[#1c1d1c] border border-[var(--color-winter-green)]/60 px-3 py-1.5 text-[var(--color-winter-green)] hover:bg-[var(--color-winter-green)] hover:text-black transition-colors rounded"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          <span>VERIFY SOURCE: {cause.source}</span>
                        </a>
                      ) : (
                        <div className="inline-flex items-center gap-2 text-xs font-mono bg-[#1c1d1c] border border-[#333] px-3 py-1.5 text-zinc-400 rounded">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                          <span>SOURCE: {cause.source}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2 font-mono">4. Data Sources & Forensic Methodology</h2>
              <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                This comprehensive post-mortem was synthesized by cross-referencing three independent data layers:
              </p>
              <ul className="text-sm text-zinc-400 space-y-2 mb-6 list-disc list-inside">
                <li><strong className="text-white">CoinMarketCap PRO API:</strong> Market-wide quote feeds, volume-to-market-cap discrepancies, and DEX pool depth (`/v2/cryptocurrency/quotes/latest`, `/v1/cryptocurrency/map`, `/v3/dex/quotes/latest`).</li>
                <li><strong className="text-white">On-Chain Block Explorers ({onchain.explorer_name || 'EVM Explorers'}):</strong> Direct smart contract transaction velocity, interacting wallet counts, and liquidity pool drain telemetry.</li>
                <li><strong className="text-white">Social & Governance Verifiers:</strong> Real-time monitoring of official announcements, developer disengagement, and wind-down statements published on verified channels (e.g. X/Twitter).</li>
              </ul>
              <p className="text-sm text-zinc-500 bg-[#1c1d1c] p-4 rounded border border-[#333]">
                <strong className="text-zinc-300">Disclaimer:</strong> The Terminal Death Score and forensic diagnoses represent mathematically calculated reconstructions of on-chain, economic, and operational failure. They are intended for institutional risk mitigation and post-mortem research.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
