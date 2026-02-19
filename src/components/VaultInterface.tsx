import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export function VaultInterface() {
  const { theme } = useTheme();
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDT');
  const [userBalance, setUserBalance] = useState(15847.32);
  const [userDeposited, setUserDeposited] = useState(5420.00);
  const [earnings, setEarnings] = useState(127.84);
  const [isDepositing, setIsDepositing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setEarnings(prev => prev + 0.0001 + Math.random() * 0.0005);
      setUserDeposited(prev => prev + 0.0001 + Math.random() * 0.0003);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleDeposit = () => {
    if (!depositAmount) return;
    setIsDepositing(true);
    setTimeout(() => {
      setUserDeposited(prev => prev + parseFloat(depositAmount));
      setUserBalance(prev => prev - parseFloat(depositAmount));
      setDepositAmount('');
      setIsDepositing(false);
    }, 2000);
  };

  const cardClass = theme === 'dark' 
    ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50' 
    : 'bg-white border-slate-200 shadow-lg';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Deposit Gateway */}
      <div className={`rounded-2xl border p-6 ${cardClass}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Single Deposit Gateway</h3>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>One click. Infinite strategies.</p>
          </div>
        </div>

        {/* Token Selector */}
        <div className="flex gap-2 mb-4">
          {['USDT', 'BNB', 'BUSD'].map(token => (
            <button
              key={token}
              onClick={() => setSelectedToken(token)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
                selectedToken === token
                  ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/50'
                  : theme === 'dark' 
                    ? 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {token}
            </button>
          ))}
        </div>

        {/* Amount Input */}
        <div className="relative mb-4">
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Enter amount"
            className={`w-full px-4 py-4 rounded-xl border text-lg focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 ${
              theme === 'dark' 
                ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          <button 
            onClick={() => setDepositAmount(userBalance.toString())}
            className={`absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-sm transition-colors ${
              theme === 'dark' 
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            MAX
          </button>
        </div>

        <div className={`flex justify-between text-sm mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>Available Balance</span>
          <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{userBalance.toLocaleString()} {selectedToken}</span>
        </div>

        {/* Deploy Button */}
        <button
          onClick={handleDeposit}
          disabled={!depositAmount || isDepositing}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isDepositing ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deploying to Singularity...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              DEPLOY TO SINGULARITY
            </>
          )}
        </button>

        <p className={`text-center text-xs mt-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
          No staking, no harvesting, no compounding needed. The engine handles everything.
        </p>
      </div>

      {/* Position Hologram */}
      <div className="space-y-4">
        {/* Personal Position */}
        <div className={`rounded-2xl border p-6 ${cardClass}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Your Position</h3>
            <span className="flex items-center gap-1 text-emerald-500 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Auto-compounding
            </span>
          </div>

          {/* Animated Balance Display */}
          <div className="text-center py-6">
            <div className={`text-sm mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Total Deposited Value</div>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-pulse">
              ${userDeposited.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-emerald-500">+${earnings.toFixed(4)} earned</span>
            </div>
          </div>

          {/* Mini Chart Visualization */}
          <div className="h-20 flex items-end gap-1 px-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-emerald-500/50 to-cyan-500/50 rounded-t"
                style={{ height: `${30 + Math.sin(i * 0.5) * 20 + Math.random() * 30}%` }}
              />
            ))}
          </div>
          <div className={`flex justify-between text-xs px-4 mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>24h ago</span>
            <span>Now</span>
          </div>
        </div>

        {/* Withdrawal Button */}
        <div className={`rounded-2xl border p-6 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-red-500/20' 
            : 'bg-white border-red-200 shadow-lg'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Emergency Unwind</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>No lock-up. Withdraw anytime.</p>
            </div>
          </div>
          
          <button className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 font-semibold hover:bg-red-500/20 transition-all">
            Withdraw All Funds
          </button>
          
          <p className={`text-center text-xs mt-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            ⚠️ No admin can prevent withdrawal. Fully non-custodial.
          </p>
        </div>
      </div>
    </div>
  );
}
