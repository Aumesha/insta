import React, { useState } from 'react';
import { X, Plus, Trash2, Globe, Film, Send, Sparkles, MessageCircle, Link as LinkIcon, Info } from 'lucide-react';
import { AutomationRule, ReelItem, Language, ReelScope, MatchMode } from '../types';
import { getT } from '../utils/translations';

interface AutomationEditorModalProps {
  rule: AutomationRule | null; // null if creating
  reels: ReelItem[];
  lang: Language;
  onSave: (rule: AutomationRule) => void;
  onClose: () => void;
}

export const AutomationEditorModal: React.FC<AutomationEditorModalProps> = ({
  rule,
  reels,
  lang,
  onSave,
  onClose,
}) => {
  const t = getT(lang);

  const [name, setName] = useState(rule?.name || '');
  const [reelScope, setReelScope] = useState<ReelScope>(rule?.reelScope || 'all');
  const [targetReelIds, setTargetReelIds] = useState<string[]>(rule?.targetReelIds || []);
  const [keywords, setKeywords] = useState<string[]>(
    rule?.triggerKeywords || ['LINK', 'ಲಿಂಕ್', 'INFO']
  );
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [matchMode, setMatchMode] = useState<MatchMode>(rule?.matchMode || 'contains');
  const [linkUrl, setLinkUrl] = useState(
    rule?.linkUrl || 'https://mywebsite.com/special-access'
  );
  const [buttonLabel, setButtonLabel] = useState(
    rule?.buttonLabel || (lang === 'kn' ? '🔗 ಲಿಂಕ್ ಪಡೆಯಿರಿ' : '🔗 Get Link Now')
  );
  const [linkTitle, setLinkTitle] = useState(
    rule?.linkTitle || 'Exclusive Resource Access'
  );
  const [linkDescription, setLinkDescription] = useState(
    rule?.linkDescription || 'Click below to view the full resource and free downloads.'
  );
  const [dmMessage, setDmMessage] = useState(
    rule?.dmMessage ||
      (lang === 'kn'
        ? 'ಹಲೋ @{username}! 👋\n\nನಮ್ಮ Instagram Reel ನಲ್ಲಿ ನೀವು ಕೇಳಿದ ಲಿಂಕ್ ಇಲ್ಲಿದೆ. ಈ ಕೆಳಗಿನ ಬಟನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ:'
        : 'Hey @{username}! 👋\n\nThanks for reaching out! Here is the link you requested from our Reel. Tap the button below to access:')
  );
  const [sendPublicReply, setSendPublicReply] = useState(
    rule ? rule.sendPublicReply : true
  );
  const [publicReply, setPublicReply] = useState(
    rule?.publicReplyVariants[0] ||
      (lang === 'kn'
        ? 'ನಿಮ್ಮ DM ಚೆಕ್ ಮಾಡಿ @{username}! ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ 📩✨'
        : 'Check your DM @{username}! Sent the link 📩🚀')
  );

  const handleAddKeyword = () => {
    const trimmed = newKeywordInput.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setNewKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleKeyDownKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const toggleReelSelection = (id: string) => {
    if (targetReelIds.includes(id)) {
      setTargetReelIds(targetReelIds.filter((r) => r !== id));
    } else {
      setTargetReelIds([...targetReelIds, id]);
    }
  };

  const handleInsertTag = (tag: string) => {
    setDmMessage((prev) => prev + ` ${tag}`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (keywords.length === 0) return;
    if (!linkUrl.trim()) return;

    const updatedRule: AutomationRule = {
      id: rule?.id || `rule-${Date.now()}`,
      name: name.trim(),
      nameKn: name.trim(),
      reelScope,
      targetReelIds: reelScope === 'all' ? [] : targetReelIds,
      triggerKeywords: keywords,
      matchMode,
      caseSensitive: false,
      dmMessage,
      linkUrl: linkUrl.trim(),
      buttonLabel: buttonLabel.trim(),
      linkTitle,
      linkDescription,
      sendPublicReply,
      publicReplyVariants: [publicReply.trim()],
      cooldownHours: rule?.cooldownHours || 24,
      delaySeconds: rule?.delaySeconds || 1,
      enabled: rule ? rule.enabled : true,
      createdAt: rule?.createdAt || new Date().toISOString().split('T')[0],
      triggeredCount: rule?.triggeredCount || 0,
      dmDeliveredCount: rule?.dmDeliveredCount || 0,
      clicksCount: rule?.clicksCount || 0,
    };

    onSave(updatedRule);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-[#121622] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              {rule ? t.modalEditTitle : t.modalCreateTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'kn'
                ? 'ರೀಲ್ಸ್‌ಗೆ ಕಾಮೆಂಟ್ ಬಂದಾಗ ತಕ್ಷಣ ಲಿಂಕ್ DM ಕಳುಹಿಸುವ ಸಂಪೂರ್ಣ ನಿಯಮ'
                : 'Configure trigger keywords and direct message response'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Rule Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.ruleNameLabel} <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.ruleNamePlaceholder}
              required
              className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Reel Scope Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              {t.reelTargetLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  reelScope === 'all'
                    ? 'bg-rose-500/10 border-rose-500/40 text-white'
                    : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="reelScope"
                  value="all"
                  checked={reelScope === 'all'}
                  onChange={() => setReelScope('all')}
                  className="mt-0.5 text-rose-500"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-rose-400" />
                    <span>{t.targetAllReelsOption}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {lang === 'kn'
                      ? 'ನಿಮ್ಮ ಪೇಜ್‌ನ ಯಾವುದೇ ರೀಲ್‌ಗೆ ಈ ಕಾಮೆಂಟ್ ಬಂದರೂ ಈ ಲಿಂಕ್ DM ಹೋಗುತ್ತದೆ (ಬಳಕೆದಾರರ ಆದ್ಯತೆ).'
                      : 'Triggers on every current and upcoming reel on your Instagram account.'}
                  </p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  reelScope === 'specific'
                    ? 'bg-purple-500/10 border-purple-500/40 text-white'
                    : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="reelScope"
                  value="specific"
                  checked={reelScope === 'specific'}
                  onChange={() => setReelScope('specific')}
                  className="mt-0.5 text-purple-500"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-purple-400" />
                    <span>{t.targetSpecificReelsOption}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {lang === 'kn'
                      ? 'ನಿರ್ದಿಷ್ಟವಾದ 1 ಅಥವಾ ಹೆಚ್ಚು ರೀಲ್ಸ್‌ಗಳನ್ನು ಮಾತ್ರ ಆರಿಸಿ.'
                      : 'Only runs on selected reels from your published feed.'}
                  </p>
                </div>
              </label>
            </div>

            {/* If Specific Reels is selected */}
            {reelScope === 'specific' && (
              <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/10">
                <div className="text-xs font-semibold text-slate-300 mb-2">
                  {t.selectReelsLabel}:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {reels.map((reel) => {
                    const isSelected = targetReelIds.includes(reel.id);
                    return (
                      <div
                        key={reel.id}
                        onClick={() => toggleReelSelection(reel.id)}
                        className={`p-2 rounded-lg border cursor-pointer flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-purple-500/20 border-purple-500 text-white'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <img
                          src={reel.thumbnailUrl}
                          alt={reel.title}
                          className="w-10 h-12 object-cover rounded"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-white truncate">
                            {reel.title}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {reel.commentsCount} comments
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Trigger Keywords */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.triggerKeywordsLabel} <span className="text-rose-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newKeywordInput}
                onChange={(e) => setNewKeywordInput(e.target.value)}
                onKeyDown={handleKeyDownKeyword}
                placeholder={t.keywordsHelper}
                className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ಸೇರಿಸಿ' : 'Add'}</span>
              </button>
            </div>

            {/* Keyword tags */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
                >
                  <span>"{kw}"</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="text-amber-400 hover:text-amber-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {lang === 'kn'
                  ? 'ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಎರಡೂ ಕೀವರ್ಡ್‌ಗಳನ್ನು ಸೇರಿಸಬಹುದು (ಉದಾ: LINK, ಲಿಂಕ್, INFO, ಮಾಹಿತಿ).'
                  : 'Case-insensitive. Matches whether the user comments "link", "LINK", or "Please send link".'}
              </span>
            </div>
          </div>

          {/* Match Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                matchMode === 'contains'
                  ? 'bg-rose-500/10 border-rose-500/40 text-white'
                  : 'bg-black/30 border-white/10 text-slate-400'
              }`}
            >
              <input
                type="radio"
                name="matchMode"
                value="contains"
                checked={matchMode === 'contains'}
                onChange={() => setMatchMode('contains')}
                className="mt-0.5 text-rose-500"
              />
              <div>
                <span className="text-xs font-semibold text-white block">
                  {t.modeContains}
                </span>
                <span className="text-[11px] text-slate-400">
                  "send link bro" → matches "link"
                </span>
              </div>
            </label>

            <label
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                matchMode === 'exact'
                  ? 'bg-rose-500/10 border-rose-500/40 text-white'
                  : 'bg-black/30 border-white/10 text-slate-400'
              }`}
            >
              <input
                type="radio"
                name="matchMode"
                value="exact"
                checked={matchMode === 'exact'}
                onChange={() => setMatchMode('exact')}
                className="mt-0.5 text-rose-500"
              />
              <div>
                <span className="text-xs font-semibold text-white block">
                  {t.modeExact}
                </span>
                <span className="text-[11px] text-slate-400">
                  Only if entire comment is "LINK"
                </span>
              </div>
            </label>
          </div>

          {/* Target Link & Button Label */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.targetLinkLabel} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder={t.targetLinkPlaceholder}
                  required
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.buttonLabelText}
              </label>
              <input
                type="text"
                value={buttonLabel}
                onChange={(e) => setButtonLabel(e.target.value)}
                placeholder={t.buttonPlaceholder}
                className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Direct Message (DM) Composer */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                {t.dmMessageLabel}
              </label>
              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-slate-400">{t.insertTagHelper}</span>
                <button
                  type="button"
                  onClick={() => handleInsertTag('@{username}')}
                  className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-rose-300 font-mono text-[10px]"
                >
                  @{'{username}'}
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              value={dmMessage}
              onChange={(e) => setDmMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Auto Public Comment Reply (Algorithm Booster) */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold text-white">
                  {t.publicReplyToggle}
                </span>
              </div>
              <input
                type="checkbox"
                checked={sendPublicReply}
                onChange={(e) => setSendPublicReply(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500"
              />
            </div>
            {sendPublicReply && (
              <div>
                <input
                  type="text"
                  value={publicReply}
                  onChange={(e) => setPublicReply(e.target.value)}
                  placeholder={t.publicReplyPlaceholder}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {lang === 'kn'
                    ? 'Instagram ರೀಲ್‌ನ ಕಾಮೆಂಟ್‌ನಲ್ಲಿ ಪೋಸ್ಟ್ ಆಗುತ್ತದೆ, ಇದು ರೀಲ್ ಎಂಗೇಜ್‌ಮೆಂಟ್ ಹೆಚ್ಚಿಸುತ್ತದೆ!'
                    : 'Increases engagement algorithm score by replying to the user on the reel itself.'}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-md transition-all"
            >
              {t.saveRuleBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
