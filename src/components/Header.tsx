import { Activity, ShieldCheck, Zap, Globe } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLanguage } from '../context/LanguageContext';

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-12 h-12 rounded-xl bg-[#0B0E14] border border-white/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-400 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>

            <div className="hidden md:block">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                SINGULARITY
                <span className="text-[10px] font-mono py-0.5 px-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                  Beta v2.0
                </span>
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{t('systemStatus')}</span>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold rounded ${language === 'en' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('id')}
                className={`px-2 py-1 text-xs font-semibold rounded ${language === 'id' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                ID
              </button>
            </div>

            {/* Status Indicators (Desktop) */}
            <div className="hidden lg:flex items-center gap-4 mr-4 border-r border-white/5 pr-6">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>{t('currentApy')}: <span className="text-white font-mono">14.2%</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span>{t('audited')}</span>
              </div>
            </div>

            {/* Connect Wallet */}
            <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" label={t('connectWallet')} />
          </div>
        </div>
      </div>
    </header>
  );
}
