import { Send, Zap, Sliders, Smartphone, Terminal, Globe, Plus, Instagram, Link as LinkIcon } from 'lucide-react';
import { Language, MetaAccountConfig } from '../types';
import { getT } from '../utils/translations';

interface NavbarProps {
  currentTab: 'reel_url' | 'rules' | 'simulator' | 'logs' | 'meta';
  setCurrentTab: (tab: 'reel_url' | 'rules' | 'simulator' | 'logs' | 'meta') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onNewRule: () => void;
  onNewTab: () => void;
  metaConfig: MetaAccountConfig;
  onOpenMetaModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  onNewRule,
  onNewTab,
  metaConfig,
  onOpenMetaModal,
}) => {
  const t = getT(lang);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0c0f17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Send className="w-5 h-5 -rotate-12 translate-x-0.5" />
          </div>
          <div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setCurrentTab('rules'); }}
              className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>InstaLink</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400 font-extrabold">AutoDM</span>
            </a>
          </div>
        </div>

        {/* Zone 2: 4 single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setCurrentTab('reel_url')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'reel_url'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-rose-400" />
            <span>{t.navReelUrlMode}</span>
          </button>

          <button
            onClick={() => setCurrentTab('rules')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'rules'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>{t.navAutomations}</span>
          </button>

          <button
            onClick={() => setCurrentTab('simulator')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'simulator'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>{t.navSimulator}</span>
          </button>

          <button
            onClick={() => setCurrentTab('logs')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'logs'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>{t.navLogs}</span>
          </button>
        </nav>

        {/* Zone 3: Actions - Language switcher, account badge & primary CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'kn' ? 'en' : 'kn')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors whitespace-nowrap"
            title="Switch Language / ಭಾಷೆ ಬದಲಿಸಿ"
          >
            <Globe className="w-3.5 h-3.5 text-rose-400" />
            <span>{lang === 'kn' ? 'ಕನ್ನಡ' : 'English'}</span>
          </button>

          {/* Primary Action Button (New Tab when in reel_url, or New Automation) */}
          {currentTab === 'reel_url' ? (
            <button
              onClick={onNewTab}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-md shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t.newTabBtn}</span>
            </button>
          ) : (
            <button
              onClick={onNewRule}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-md shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t.newAutomationBtn}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
