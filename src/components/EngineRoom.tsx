import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const strategies = [
  { id: 'asterdex', name: 'AsterDEX', status: 'active', allocation: 35 },
  { id: 'pancake', name: 'PancakeSwap', status: 'active', allocation: 28 },
  { id: 'riquid', name: 'Riquid Pools', status: 'active', allocation: 22 },
  { id: 'venus', name: 'Venus Protocol', status: 'standby', allocation: 10 },
  { id: 'hedge', name: 'Stablecoin Hedge', status: 'active', allocation: 5 },
];

const riskMetrics = [
  { label: 'Volatility', value: 35 },
  { label: 'Impermanent Loss', value: 22 },
  { label: 'Smart Contract', value: 15 },
  { label: 'Liquidity', value: 88 },
  { label: 'Protocol Trust', value: 92 },
  { label: 'APY Stability', value: 78 },
];

export function EngineRoom() {
  const { theme } = useTheme();
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [flowAnimation, setFlowAnimation] = useState(0);
  const [hedgingActive, setHedgingActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlowAnimation(prev => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHedgingActive(Math.random() > 0.7);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const cardClass = theme === 'dark' 
    ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50' 
    : 'bg-white border-slate-200 shadow-lg';

  const nodeClass = (isActive: boolean, color: string) => {
    if (isActive) {
      return theme === 'dark'
        ? `bg-${color}-500/20 border-${color}-500 shadow-lg shadow-${color}-500/30`
        : `bg-${color}-50 border-${color}-400 shadow-lg shadow-${color}-200`;
    }
    return theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Strategy Flowchart */}
      <div className={`rounded-2xl border p-6 ${cardClass}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Strategy Flowchart</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Real-time capital flow visualization</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 text-xs font-mono border border-emerald-500/30">
            ENGINE RUNNING
          </span>
        </div>

        {/* Flow Diagram */}
        <div className="relative py-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px] relative">
            {/* Deposit Node */}
            <div 
              className={`relative z-10 w-28 p-4 rounded-xl border-2 transition-all duration-500 ${
                flowAnimation === 0 
                  ? theme === 'dark' ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-emerald-50 border-emerald-400 shadow-lg'
                  : theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
              onMouseEnter={() => setActiveNode('deposit')}
              onMouseLeave={() => setActiveNode(null)}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Deposit</div>
                <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>User Funds</div>
              </div>
              {flowAnimation === 0 && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
              )}
            </div>

            {/* Arrow 1 */}
            <div className={`flex-1 h-1 mx-2 rounded transition-all duration-500 ${
              flowAnimation >= 1 ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
            }`} />

            {/* Smart Router Node */}
            <div 
              className={`relative z-10 w-28 p-4 rounded-xl border-2 transition-all duration-500 ${
                flowAnimation === 1 
                  ? theme === 'dark' ? 'bg-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/30' : 'bg-cyan-50 border-cyan-400 shadow-lg'
                  : theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
              onMouseEnter={() => setActiveNode('router')}
              onMouseLeave={() => setActiveNode(null)}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🧠</div>
                <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Router</div>
                <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>AI Optimizer</div>
              </div>
              {flowAnimation === 1 && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full animate-ping" />
              )}
            </div>

            {/* Arrow 2 */}
            <div className={`flex-1 h-1 mx-2 rounded transition-all duration-500 ${
              flowAnimation >= 2 ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
            }`} />

            {/* Strategies Node */}
            <div 
              className={`relative z-10 w-28 p-4 rounded-xl border-2 transition-all duration-500 ${
                flowAnimation === 2 
                  ? theme === 'dark' ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/30' : 'bg-purple-50 border-purple-400 shadow-lg'
                  : theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
              onMouseEnter={() => setActiveNode('strategies')}
              onMouseLeave={() => setActiveNode(null)}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Strategies</div>
                <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Multi-Protocol</div>
              </div>
              {flowAnimation === 2 && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 rounded-full animate-ping" />
              )}
            </div>

            {/* Arrow 3 */}
            <div className={`flex-1 h-1 mx-2 rounded transition-all duration-500 ${
              flowAnimation >= 3 ? 'bg-gradient-to-r from-purple-500 to-emerald-500' : theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
            }`} />

            {/* Yield Node */}
            <div 
              className={`relative z-10 w-28 p-4 rounded-xl border-2 transition-all duration-500 ${
                flowAnimation === 3 
                  ? theme === 'dark' ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-emerald-50 border-emerald-400 shadow-lg'
                  : theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
              onMouseEnter={() => setActiveNode('yield')}
              onMouseLeave={() => setActiveNode(null)}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🌾</div>
                <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Yield</div>
                <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Auto-compound</div>
              </div>
              {flowAnimation === 3 && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
              )}
            </div>
          </div>

          {/* Active Node Info */}
          {activeNode && (
            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-sm ${
              theme === 'dark' ? 'bg-slate-900 border border-slate-700 text-slate-300' : 'bg-white border border-slate-200 text-slate-600 shadow-lg'
            }`}>
              {activeNode === 'deposit' && 'Users deposit USDT/BNB into the unified vault'}
              {activeNode === 'router' && 'AI analyzes 100+ pools to find optimal allocation'}
              {activeNode === 'strategies' && 'Capital deployed across AsterDEX, PancakeSwap, Riquid'}
              {activeNode === 'yield' && 'Harvested yields auto-compound every 4 hours'}
            </div>
          )}
        </div>

        {/* Strategy Allocation */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {strategies.map(strategy => (
            <div 
              key={strategy.id}
              className={`p-3 rounded-xl border transition-all ${
                strategy.status === 'active' 
                  ? theme === 'dark' ? 'bg-slate-800/50 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                  : theme === 'dark' ? 'bg-slate-900/50 border-slate-700/50 opacity-60' : 'bg-slate-100 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{strategy.name}</span>
                <span className={`w-2 h-2 rounded-full ${
                  strategy.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'
                }`} />
              </div>
              <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {strategy.allocation}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Radar */}
      <div className={`rounded-2xl border p-6 ${cardClass}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Risk & Hedging Radar</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Real-time risk assessment</p>
            </div>
          </div>
          {hedgingActive && (
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-500 text-xs font-mono border border-orange-500/30 animate-pulse">
              🛡️ HEDGING PROTOCOL ACTIVE
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {riskMetrics.map((metric, index) => (
            <div key={index} className={`p-4 rounded-xl border ${
              theme === 'dark' ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{metric.label}</span>
                <span className={`text-sm font-bold ${
                  metric.value > 70 ? 'text-emerald-500' : metric.value > 40 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {metric.value}%
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    metric.value > 70 
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' 
                      : metric.value > 40 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : 'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Hedging Status */}
        <div className={`mt-6 p-4 rounded-xl border ${
          theme === 'dark' ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
              hedgingActive 
                ? 'border-orange-500 bg-orange-500/20' 
                : 'border-emerald-500 bg-emerald-500/20'
            }`}>
              <span className="text-2xl">{hedgingActive ? '🛡️' : '✅'}</span>
            </div>
            <div>
              <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {hedgingActive ? 'Hedging Protocol Activated' : 'Market Conditions: Stable'}
              </h4>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {hedgingActive 
                  ? 'High volatility detected. 15% of funds moved to stablecoin vault for protection.'
                  : 'All risk metrics within acceptable range. Maximum yield strategies deployed.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
