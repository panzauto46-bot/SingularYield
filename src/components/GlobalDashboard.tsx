import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { StrategyAction } from '../types';

export function GlobalDashboard() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [tvl, setTvl] = useState(12847593.42);
  const [apy, setApy] = useState(23.47);
  const [activeStrategies] = useState(7);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);

  // Actions are now dynamic based on language
  const actions: StrategyAction[] = [
    { id: '1', timestamp: new Date(), action: t('rebalance'), type: 'rebalance' },
    { id: '2', timestamp: new Date(), action: t('harvest'), type: 'harvest' },
    { id: '3', timestamp: new Date(), action: t('compound'), type: 'compound' },
    { id: '4', timestamp: new Date(), action: t('hedge'), type: 'hedge' },
    { id: '5', timestamp: new Date(), action: t('router'), type: 'rebalance' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTvl(prev => prev + (Math.random() - 0.3) * 1000);
      setApy(prev => Math.max(15, Math.min(35, prev + (Math.random() - 0.5) * 0.5)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActionIndex(prev => (prev + 1) % actions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [actions.length]);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'rebalance': return '⚡';
      case 'harvest': return '🌾';
      case 'compound': return '🔄';
      case 'hedge': return '🛡️';
      default: return '📊';
    }
  };

  const cardClass = theme === 'dark'
    ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50'
    : 'bg-white border-slate-200 shadow-lg';

  return (
    <div className="space-y-6">
      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TVL Card */}
        <div className={`relative overflow-hidden rounded-2xl border p-6 ${cardClass}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className={`flex items-center gap-2 text-sm mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('tvl')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              ${tvl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-emerald-500 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {t('tvlChange')}
            </div>
          </div>
        </div>

        {/* APY Card */}
        <div className={`relative overflow-hidden rounded-2xl border p-6 ${cardClass}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className={`flex items-center gap-2 text-sm mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {t('dynamicApy')}
            </div>
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-1">
              {apy.toFixed(2)}%
            </div>
            <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('apySubtitle')}
            </div>
          </div>
        </div>

        {/* Active Strategies Card */}
        <div className={`relative overflow-hidden rounded-2xl border p-6 ${cardClass}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className={`flex items-center gap-2 text-sm mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              {t('activeStrategies')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {activeStrategies}
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-500 text-sm">{t('systemOperational')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Strategy Feed */}
      <div className={`rounded-2xl border overflow-hidden ${cardClass}`}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'
          }`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('liveFeed')}</h3>
          </div>
          <span className={`text-xs font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t('realTimeTerminal')}</span>
        </div>

        <div className={`p-4 font-mono text-sm ${theme === 'dark' ? 'bg-black/30' : 'bg-slate-50'}`}>
          <div className="space-y-2">
            {actions.map((action, index) => (
              <div
                key={action.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-500 ${index === currentActionIndex
                    ? theme === 'dark'
                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                      : 'bg-emerald-50 border border-emerald-200'
                    : 'opacity-50'
                  }`}
              >
                <span className="text-lg">{getActionIcon(action.type)}</span>
                <div className="flex-1">
                  <p className={index === currentActionIndex
                    ? 'text-emerald-600'
                    : theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }>
                    {action.action}
                  </p>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
                    {new Date().toLocaleTimeString()} • {t('block')} #38,472,{Math.floor(Math.random() * 999)}
                  </p>
                </div>
                {index === currentActionIndex && (
                  <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-600 border border-emerald-500/30">
                    {t('live')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
