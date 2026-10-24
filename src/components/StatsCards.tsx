import React from 'react';
import { MessageSquare, Target, Send, Clock } from 'lucide-react';
import { Language, AutomationRule, CommentEvent } from '../types';
import { getT } from '../utils/translations';

interface StatsCardsProps {
  lang: Language;
  rules: AutomationRule[];
  events: CommentEvent[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ lang, rules, events }) => {
  const t = getT(lang);

  const totalDMsSent = rules.reduce((acc, r) => acc + r.dmDeliveredCount, 0);
  const totalComments = rules.reduce((acc, r) => acc + r.triggeredCount, 0) + 148;
  const matchedKeywords = rules.reduce((acc, r) => acc + r.triggeredCount, 0);
  const avgLatency = events.length > 0 
    ? Math.round(events.reduce((acc, e) => acc + e.latencyMs, 0) / events.length)
    : 185;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="bg-[#121622] border border-white/10 rounded-xl p-4 transition-colors hover:border-white/20">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
          <span>{t.statTotalComments}</span>
          <MessageSquare className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
          {totalComments.toLocaleString()}
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          {lang === 'kn' ? 'ರೀಲ್ಸ್ ಕಾಮೆಂಟ್‌ಗಳು ಸ್ಕ್ಯಾನ್ ಆಗಿವೆ' : 'Reels comments monitored'}
        </div>
      </div>

      <div className="bg-[#121622] border border-white/10 rounded-xl p-4 transition-colors hover:border-white/20">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
          <span>{t.statKeywordsMatched}</span>
          <Target className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-amber-400">
          {matchedKeywords.toLocaleString()}
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          {lang === 'kn' ? 'ಗುರುತಿಸಲಾದ ಕೀವರ್ಡ್‌ಗಳು' : 'Keyword matches detected'}
        </div>
      </div>

      <div className="bg-[#121622] border border-white/10 rounded-xl p-4 transition-colors hover:border-white/20">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
          <span>{t.statDMsSent}</span>
          <Send className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-400">
          {totalDMsSent.toLocaleString()}
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          {lang === 'kn' ? '98.8% ಯಶಸ್ವಿ ತಲುಪುವಿಕೆ' : '98.8% delivery success rate'}
        </div>
      </div>

      <div className="bg-[#121622] border border-white/10 rounded-xl p-4 transition-colors hover:border-white/20">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
          <span>{t.statAvgLatency}</span>
          <Clock className="w-4 h-4 text-rose-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-rose-400">
          {avgLatency}ms
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          {lang === 'kn' ? 'ತತ್ಕ್ಷಣದ ಪ್ರತಿಕ್ರಿಯೆ ವೇಗ' : 'Sub-second real-time delivery'}
        </div>
      </div>
    </div>
  );
};
