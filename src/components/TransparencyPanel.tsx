import { useState } from 'react';
import { Contract } from '../types';

const contracts: Contract[] = [
  { 
    name: 'Singularity Vault', 
    address: '0x7a23F8b4c9d2E1a6B8c3D4e5F6a7B8c9D0e1F2a3', 
    description: 'Main vault contract holding user deposits',
    verified: true 
  },
  { 
    name: 'Strategy Router', 
    address: '0x3b91A2c7E8f4D5b6C7d8E9f0A1b2C3d4E5f6G7h8', 
    description: 'Smart routing and yield optimization logic',
    verified: true 
  },
  { 
    name: 'Keeper Bounty', 
    address: '0x9f42B1a8C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8', 
    description: 'Bounty distribution for keeper executions',
    verified: true 
  },
  { 
    name: 'AsterDEX Adapter', 
    address: '0x1c55D4e9F0a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5', 
    description: 'Integration with AsterDEX protocol',
    verified: true 
  },
  { 
    name: 'PancakeSwap Adapter', 
    address: '0x8e77F3g2H1i0J9k8L7m6N5o4P3q2R1s0T9u8V7w6', 
    description: 'Integration with PancakeSwap farms',
    verified: true 
  },
  { 
    name: 'Hedging Module', 
    address: '0x5d66E2f1G0h9I8j7K6l5M4n3O2p1Q0r9S8t7U6v5', 
    description: 'Risk management and hedging strategies',
    verified: true 
  },
];

export function TransparencyPanel() {
  const [showPhilosophy, setShowPhilosophy] = useState(false);

  return (
    <div className="space-y-6">
      {/* Contract Registry */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Contract Address Registry</h3>
              <p className="text-xs text-slate-400">All deployed smart contracts</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            ✓ All Verified
          </span>
        </div>

        <div className="space-y-3">
          {contracts.map((contract, index) => (
            <div 
              key={index}
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-blue-500/30 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium">{contract.name}</h4>
                    {contract.verified && (
                      <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{contract.description}</p>
                  <code className="text-xs font-mono text-cyan-400 bg-slate-800/50 px-2 py-1 rounded">
                    {contract.address}
                  </code>
                </div>
                <a 
                  href={`https://bscscan.com/address/${contract.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy Button & Modal */}
      <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Philosophy of Design</h3>
              <p className="text-sm text-slate-400">Understand why this architecture is superior</p>
            </div>
          </div>
          <button
            onClick={() => setShowPhilosophy(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25"
          >
            Read Manifesto
          </button>
        </div>
      </div>

      {/* Philosophy Modal */}
      {showPhilosophy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Philosophy of Design</h2>
              <button
                onClick={() => setShowPhilosophy(false)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6 text-slate-300">
              <section>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">🎯 The Problem</h3>
                <p>Traditional DeFi protocols require users to manually stake, harvest, compound, and manage positions across multiple platforms. This creates friction, requires constant attention, and often results in suboptimal yields due to human error or timing.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">⚡ Our Solution</h3>
                <p>Project Singularity abstracts away all complexity. Users deposit once, and the autonomous engine handles everything: yield optimization, auto-compounding, risk hedging, and cross-protocol rebalancing.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">🔒 True Decentralization</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Admin Keys Burned:</strong> No one can modify the protocol or access user funds</li>
                  <li><strong>No Off-Chain Dependencies:</strong> All logic runs on-chain via smart contracts</li>
                  <li><strong>Keeper Incentives:</strong> Anyone can trigger executions and earn rewards</li>
                  <li><strong>No Lock-ups:</strong> Users can withdraw instantly, anytime</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">🏆 Why This Wins</h3>
                <p>This architecture proves that DeFi can be both powerful AND accessible. We've eliminated single points of failure, removed trust requirements, and created a self-sustaining economic engine that serves users 24/7 without human intervention.</p>
              </section>

              <div className="pt-6 border-t border-slate-700">
                <p className="text-center text-sm text-slate-500">
                  "The best system is one that requires no administrator." — Project Singularity
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit & Security */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <div className="text-3xl mb-2">🔐</div>
          <div className="text-white font-semibold">100% Non-Custodial</div>
          <div className="text-xs text-slate-400">Your keys, your crypto</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <div className="text-3xl mb-2">📜</div>
          <div className="text-white font-semibold">Open Source</div>
          <div className="text-xs text-slate-400">Fully auditable code</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <div className="text-3xl mb-2">🛡️</div>
          <div className="text-white font-semibold">Battle Tested</div>
          <div className="text-xs text-slate-400">6+ months in production</div>
        </div>
      </div>
    </div>
  );
}
