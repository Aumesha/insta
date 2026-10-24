import React, { useState } from 'react';
import { ExternalLink, Edit2, Trash2, Play, Copy, Check, Sparkles, Film, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AutomationRule, ReelItem, Language } from '../types';
import { getT } from '../utils/translations';

interface AutomationsListProps {
  rules: AutomationRule[];
  reels: ReelItem[];
  lang: Language;
  onEditRule: (rule: AutomationRule) => void;
  onDeleteRule: (ruleId: string) => void;
  onToggleRule: (ruleId: string) => void;
  onTestRuleInSimulator: (rule: AutomationRule) => void;
  onNewRule: () => void;
}

export const AutomationsList: React.FC<AutomationsListProps> = ({
  rules,
  reels,
  lang,
  onEditRule,
  onDeleteRule,
  onToggleRule,
  onTestRuleInSimulator,
  onNewRule,
}) => {
  const t = getT(lang);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header section with title and description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{t.rulesTitle}</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {rules.length} {lang === 'kn' ? 'ನಿಯಮಗಳು' : 'active'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            {t.rulesDescription}
          </p>
        </div>

        <button
          onClick={onNewRule}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-md transition-all whitespace-nowrap"
        >
          {t.newAutomationBtn}
        </button>
      </div>

      {/* Rules Cards */}
      {rules.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed border-white/10 bg-[#121622]/50">
          <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">{t.noRulesFound}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {lang === 'kn'
              ? 'ಕಾಮೆಂಟ್‌ನಲ್ಲಿ ಕೀವರ್ಡ್ ಬಂದರೆ ತಕ್ಷಣ DM ಕಳುಹಿಸಲು ಮೊದಲ ನಿಯಮವನ್ನು ರಚಿಸಿ.'
              : 'Add keywords like "LINK" to automatically dispatch direct messages.'}
          </p>
          <button
            onClick={onNewRule}
            className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600 transition-colors"
          >
            {t.createFirstRule}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {rules.map((rule) => {
            const targetedReels = rule.reelScope === 'all' 
              ? [] 
              : reels.filter(r => rule.targetReelIds.includes(r.id));

            return (
              <div
                key={rule.id}
                className={`rounded-xl border transition-all ${
                  rule.enabled
                    ? 'bg-[#121622] border-white/10 hover:border-white/20'
                    : 'bg-[#0f131d]/60 border-white/5 opacity-70'
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Info */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base font-bold text-white tracking-tight truncate">
                          {lang === 'kn' && rule.nameKn ? rule.nameKn : rule.name}
                        </h3>

                        {/* Scope Indicator */}
                        {rule.reelScope === 'all' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Film className="w-3.5 h-3.5" />
                            <span>{t.ruleScopeAll}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <Film className="w-3.5 h-3.5" />
                            <span>{targetedReels.length} {lang === 'kn' ? 'ರೀಲ್ಸ್‌ಗಳು' : 'Reels'}</span>
                          </span>
                        )}

                        <span className="text-xs text-slate-500 font-mono tabular-nums">
                          {rule.dmDeliveredCount} {lang === 'kn' ? 'DM ರವಾನೆ' : 'DMs sent'}
                        </span>
                      </div>

                      {/* Keywords list */}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="text-slate-400 shrink-0 font-medium">
                          {t.keywordsLabel}:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {rule.triggerKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className="font-mono text-xs px-2 py-0.5 rounded bg-white/5 text-amber-300 border border-white/10 font-medium"
                            >
                              "{kw}"
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Target Link */}
                      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-300">
                        <span className="text-slate-400 shrink-0 font-medium">
                          {t.linkSentLabel}:
                        </span>
                        <a
                          href={rule.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs text-rose-400 hover:text-rose-300 underline underline-offset-2 truncate max-w-xs sm:max-w-md flex items-center gap-1"
                        >
                          <span className="truncate">{rule.linkUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                        <button
                          onClick={() => handleCopyLink(rule.linkUrl, rule.id)}
                          className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                          title="Copy Link"
                        >
                          {copiedId === rule.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Public reply info */}
                      {rule.sendPublicReply && (
                        <div className="text-xs text-slate-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="italic truncate">
                            {lang === 'kn' ? 'ಆಟೋ ಕಾಮೆಂಟ್ ರಿಪ್ಲೈ ಸಕ್ರಿಯವಾಗಿದೆ:' : 'Auto public reply active:'} "{rule.publicReplyVariants[0]}"
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                      {/* Test in Simulator button */}
                      <button
                        onClick={() => onTestRuleInSimulator(rule)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors"
                        title={lang === 'kn' ? 'ಸಿಮ್ಯುಲೇಟರ್‌ನಲ್ಲಿ ಪರೀಕ್ಷಿಸಿ' : 'Test in simulator'}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{t.testInSimulator}</span>
                      </button>

                      {/* Enable/Disable Toggle */}
                      <button
                        onClick={() => onToggleRule(rule.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          rule.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                        title={rule.enabled ? 'Pause Rule' : 'Activate Rule'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            rule.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => onEditRule(rule)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        title={t.editRule}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDeleteRule(rule.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title={t.deleteRule}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
