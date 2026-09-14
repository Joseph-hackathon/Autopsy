const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf-8');

// 1. Add "methodology" to the tabs array
content = content.replace('const [activeTab, setActiveTab] = useState("overview");', 'const [activeTab, setActiveTab] = useState("overview");');
// Find the mapping of tabs
content = content.replace(/\{"\[\'overview\', \'evidence\', \'ai_terminal\'\]"\.map/g, '{"[\'overview\', \'evidence\', \'methodology\', \'ai_terminal\']".map');
// Wait, the actual code is ['overview', 'evidence', 'ai_terminal'].map((tab) => (
content = content.replace(/\['overview', 'evidence', 'ai_terminal'\]\.map/g, "['overview', 'evidence', 'methodology', 'ai_terminal'].map");

// 2. Inject the METHODOLOGY tab content right before AI TERMINAL
const methodologyTab = 
            {/* TAB CONTENT: METHODOLOGY */}
            {activeTab === "methodology" && (
              <div className="border border-[#333333] rounded-none bg-[#1c1d1c] p-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center justify-between mb-8 border-b border-[#333333] pb-4">
                  <h3 className="text-lg font-blender text-white tracking-widest flex items-center gap-3 uppercase">
                    <svg className="w-5 h-5 text-[var(--color-winter-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    DATA CORRELATION & METHODOLOGY
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Telemetry & Sources */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--color-winter-green)] mb-3 tracking-widest uppercase">Data Sources</h4>
                      <p className="text-sm text-[#ececec] font-sans leading-relaxed">
                        Data is aggregated via the <span className="font-mono text-white">CoinMarketCap API</span>. We fetch identity mappings, live quotes, historical order-book depth, and on-chain DEX metrics (liquidity pairs, holder counts, honeypot analysis).
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[var(--color-winter-green)] mb-3 tracking-widest uppercase">Raw Telemetry Sourced</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(result.raw_metrics || {}).map(([key, val], idx) => (
                          <div key={idx} className="bg-[#252725] p-3 border border-[#333333] flex flex-col">
                            <span className="text-[10px] text-[#888888] font-mono uppercase truncate">{key.replace(/_/g, ' ')}</span>
                            <span className="text-sm font-blender text-white">
                              {typeof val === 'number' && key.includes('percent') ? val.toFixed(2) + '%' : typeof val === 'number' ? val.toLocaleString() : val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Engine Logic */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--color-winter-green)] mb-3 tracking-widest uppercase">Correlation Analysis Engine</h4>
                      <p className="text-sm text-[#888888] font-sans leading-relaxed mb-4">
                        The Autopsy Score Engine performs a 3-Layer diagnostic analysis to compute the Death Score. We do not rely on a single metric; instead, we analyze structural relationships between metrics.
                      </p>
                      
                      <ul className="space-y-4">
                        <li className="bg-[#252725] p-4 border-l-2 border-[var(--color-winter-purple)]">
                          <h5 className="font-bold text-white text-xs mb-1 uppercase tracking-wider">1. Market Dynamics (Volume/Mcap Ratio)</h5>
                          <p className="text-xs text-[#888888]">We cross-reference 24h trading volume against Fully Diluted Valuation (FDV). Low volume on a high FDV indicates heavy supply overhang and 'ghost chain' properties.</p>
                        </li>
                        <li className="bg-[#252725] p-4 border-l-2 border-[var(--color-winter-purple)]">
                          <h5 className="font-bold text-white text-xs mb-1 uppercase tracking-wider">2. Liquidity Exhaustion</h5>
                          <p className="text-xs text-[#888888]">Liquidity depth is mapped against market cap. If less than 1% of the asset's value is backed by actual DEX/CEX liquidity, a death spiral is imminent upon any sell pressure.</p>
                        </li>
                        <li className="bg-[#252725] p-4 border-l-2 border-[var(--color-winter-purple)]">
                          <h5 className="font-bold text-white text-xs mb-1 uppercase tracking-wider">3. Structural Decay (Drawdown Matrix)</h5>
                          <p className="text-xs text-[#888888]">We evaluate continuous drawdown over 30d, 60d, and 90d periods. Persistent decay without mean reversion confirms terminal holder capitulation.</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
;

content = content.replace('{/* TAB CONTENT: AI TERMINAL */}', methodologyTab + '\n              {/* TAB CONTENT: AI TERMINAL */}');

fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf-8');
