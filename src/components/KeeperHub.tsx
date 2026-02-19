import { useState } from 'react';

const recentKeepers = [
  { address: '0x7a23...8f4d', time: '2 mins ago', reward: '$2.50', tx: '0xabc123' },
  { address: '0x3b91...2c7e', time: '6 mins ago', reward: '$2.50', tx: '0xdef456' },
  { address: '0x9f42...1a8b', time: '10 mins ago', reward: '$2.50', tx: '0xghi789' },
  { address: '0x1c55...4d9a', time: '14 mins ago', reward: '$2.50', tx: '0xjkl012' },
  { address: '0x8e77...3f2c', time: '18 mins ago', reward: '$2.50', tx: '0xmno345' },
];

export function KeeperHub() {
  const [isTriggering, setIsTriggering] = useState(false);
  const [bountyPool, setBountyPool] = useState(127.50);
  const [lastExecution, setLastExecution] = useState('2 mins ago');

  const handleTrigger = () => {
    setIsTriggering(true);
    setTimeout(() => {
      setIsTriggering(false);
      setBountyPool(prev => prev - 2.50);
      setLastExecution('Just now');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Proving Autonomy: No Off-Chain Triggers</h2>
            <p className="text-slate-400 text-sm">
              This protocol operates without any centralized servers or admin intervention. 
              Anyone can trigger the system execution and earn a bounty reward. This proves 
              the system is driven by market incentives, not by our servers.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bounty Pool Card */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Open Bounty Pool</h3>
              <p className="text-xs text-slate-400">Available rewards for keepers</p>
            </div>
          </div>

          <div className="text-center py-8">
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 mb-2">
              ${bountyPool.toFixed(2)}
            </div>
            <div className="text-slate-400">USDT Available</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-center">
              <div className="text-2xl font-bold text-white">$2.50</div>
              <div className="text-xs text-slate-400">Per Execution</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-center">
              <div className="text-2xl font-bold text-white">{lastExecution}</div>
              <div className="text-xs text-slate-400">Last Execution</div>
            </div>
          </div>
        </div>

        {/* Trigger Button Card */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/30 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">The Trigger Matrix</h3>
              <p className="text-xs text-slate-400">Public execution button</p>
            </div>
          </div>

          <div className="py-4">
            <button
              onClick={handleTrigger}
              disabled={isTriggering}
              className={`w-full py-6 rounded-2xl font-bold text-xl transition-all relative overflow-hidden ${
                isTriggering 
                  ? 'bg-slate-700 text-slate-400 cursor-wait'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50'
              }`}
            >
              {isTriggering ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Executing Strategy...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  autoRun()
                </div>
              )}
            </button>
          </div>

          <p className="text-center text-sm text-slate-400 mt-4">
            Click to execute system strategy and claim <span className="text-emerald-400 font-semibold">$2.50</span> reward.
          </p>

          <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Any wallet can trigger this function. No special permissions required.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Keepers */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold">Recent Keeper Executions</h3>
          <span className="text-xs text-slate-500">Last 5 transactions</span>
        </div>

        <div className="space-y-3">
          {recentKeepers.map((keeper, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <span className="text-sm">🤖</span>
                </div>
                <div>
                  <div className="font-mono text-white text-sm">{keeper.address}</div>
                  <div className="text-xs text-slate-500">{keeper.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-semibold">{keeper.reward}</span>
                <a 
                  href="#" 
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  View TX
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
