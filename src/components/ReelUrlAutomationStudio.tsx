import React, { useState } from 'react';
import { Plus, X, Link as LinkIcon, Film, Send, Sparkles, Check, Play, ExternalLink, MessageCircle, Info, CheckCircle2, ChevronDown, ChevronUp, Copy, Smartphone, Download, Github } from 'lucide-react';
import { ReelUrlTabCampaign, Language, CommentEvent } from '../types';
import { getT } from '../utils/translations';

interface ReelUrlAutomationStudioProps {
  tabs: ReelUrlTabCampaign[];
  activeTabId: string;
  lang: Language;
  onSelectTab: (id: string) => void;
  onAddTab: () => void;
  onRemoveTab: (id: string) => void;
  onUpdateTab: (tab: ReelUrlTabCampaign) => void;
  onTestInFullSimulator: (tab: ReelUrlTabCampaign) => void;
  onDispatchEvent: (event: CommentEvent) => void;
  onOpenApkGuide?: () => void;
}

export const ReelUrlAutomationStudio: React.FC<ReelUrlAutomationStudioProps> = ({
  tabs,
  activeTabId,
  lang,
  onSelectTab,
  onAddTab,
  onRemoveTab,
  onUpdateTab,
  onTestInFullSimulator,
  onDispatchEvent,
  onOpenApkGuide,
}) => {
  const t = getT(lang);

  // Set of expanded tab IDs so users can view one or multiple stacked cards
  const [expandedTabIds, setExpandedTabIds] = useState<string[]>([activeTabId || tabs[0]?.id || 'tab-1']);
  const [keywordInputs, setKeywordInputs] = useState<{ [tabId: string]: string }>({});
  const [testComments, setTestComments] = useState<{ [tabId: string]: string }>({});
  const [testResults, setTestResults] = useState<{
    [tabId: string]: { success: boolean; message: string; matchedKw?: string } | null;
  }>({});

  const toggleExpand = (tabId: string) => {
    onSelectTab(tabId);
    if (expandedTabIds.includes(tabId)) {
      setExpandedTabIds(expandedTabIds.filter((id) => id !== tabId));
    } else {
      setExpandedTabIds([...expandedTabIds, tabId]);
    }
  };

  const handleExpandAll = () => {
    setExpandedTabIds(tabs.map((t) => t.id));
  };

  const handleCollapseAll = () => {
    setExpandedTabIds([]);
  };

  // Quick Reel presets
  const sampleReels = [
    {
      url: 'https://www.instagram.com/reel/C8x9Kl1pA2/',
      title: 'Digital Creator Toolkit E-book',
      keywords: ['LINK', 'ಲಿಂಕ್', 'INFO', 'GUIDE'],
      link: 'https://creatorhub.kannada.digital/free-toolkit',
      img: '/src/assets/images/reel_cover_ecommerce_1792848111325.jpg',
    },
    {
      url: 'https://www.instagram.com/reel/C7m1No2pB4/',
      title: '30-Day Fitness & Diet Routine',
      keywords: ['FIT', 'ಫಿಟ್', 'DIET', 'PDF'],
      link: 'https://fitlife.kannada.digital/30-day-guide.pdf',
      img: '/src/assets/images/reel_cover_fitness_1792848112133.jpg',
    },
    {
      url: 'https://www.instagram.com/reel/C6t3Vw4qC8/',
      title: 'Top Desk Setup Gadgets Deals',
      keywords: ['TECH', 'ಟೆಕ್', 'SETUP', 'PRICE'],
      link: 'https://techgear.kannada.digital/desk-setup-deals',
      img: '/src/assets/images/reel_cover_tech_1792848112276.jpg',
    },
  ];

  const handleApplySample = (tab: ReelUrlTabCampaign, sample: typeof sampleReels[0]) => {
    onUpdateTab({
      ...tab,
      reelUrl: sample.url,
      reelTitle: sample.title,
      triggerKeywords: sample.keywords,
      targetLinkUrl: sample.link,
      thumbnailUrl: sample.img,
    });
  };

  const handleAddKeyword = (tab: ReelUrlTabCampaign) => {
    const input = keywordInputs[tab.id]?.trim() || '';
    if (input && !tab.triggerKeywords.includes(input)) {
      onUpdateTab({
        ...tab,
        triggerKeywords: [...tab.triggerKeywords, input],
      });
      setKeywordInputs({ ...keywordInputs, [tab.id]: '' });
    }
  };

  const handleRemoveKeyword = (tab: ReelUrlTabCampaign, kw: string) => {
    onUpdateTab({
      ...tab,
      triggerKeywords: tab.triggerKeywords.filter((k) => k !== kw),
    });
  };

  const handleQuickTestComment = (tab: ReelUrlTabCampaign) => {
    const comment = (testComments[tab.id] || 'ಲಿಂಕ್ ಕಳ್ಸಿ ಬ್ರದರ್ LINK please!').trim();
    if (!comment) return;

    const matched = tab.triggerKeywords.find((kw) =>
      comment.toLowerCase().includes(kw.toLowerCase())
    );

    if (matched) {
      setTestResults({
        ...testResults,
        [tab.id]: {
          success: true,
          message:
            lang === 'kn'
              ? `ಕೀವರ್ಡ್ "${matched}" ಪತ್ತೆಯಾಗಿದೆ! "${tab.targetLinkUrl}" ಲಿಂಕ್ ಬಳಕೆದಾರರ DM ಗೆ ಕಳುಹಿಸಲಾಯಿತು.`
              : `Keyword "${matched}" matched! Dispatched link "${tab.targetLinkUrl}" to user's DM.`,
          matchedKw: matched,
        },
      });

      const event: CommentEvent = {
        id: `reelurl-evt-${Date.now()}`,
        timestamp: 'Just now',
        reelId: tab.id,
        reelTitle: tab.reelTitle || 'Direct Reel URL',
        username: 'test_user_blr',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DirectTester',
        commentText: comment,
        matchedRuleId: tab.id,
        matchedRuleName: tab.tabTitle,
        matchedKeyword: matched,
        dmStatus: 'delivered',
        dmContent: tab.dmResponseText.replace(/@{username}/g, '@test_user_blr'),
        linkUrl: tab.targetLinkUrl,
        buttonLabel: tab.buttonLabel,
        publicReplyText: tab.autoPublicReply
          ? tab.publicReplyText.replace(/@{username}/g, '@test_user_blr')
          : null,
        latencyMs: 165,
      };

      onDispatchEvent(event);
    } else {
      setTestResults({
        ...testResults,
        [tab.id]: {
          success: false,
          message:
            lang === 'kn'
              ? `ಕಾಮೆಂಟ್‌ನಲ್ಲಿ ಸೆಟ್ ಮಾಡಲಾದ ಕೀವರ್ಡ್ (${tab.triggerKeywords.join(', ')}) ಕಂಡುಬಂದಿಲ್ಲ. ಯಾವುದೇ DM ಕಳುಹಿಸಿಲ್ಲ.`
              : `No matching keyword found in comment. Ignored.`,
        },
      });
    }

    setTimeout(() => {
      setTestResults((prev) => ({ ...prev, [tab.id]: null }));
    }, 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-rose-400" />
            <span>{t.reelUrlTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            {lang === 'kn'
              ? 'ಪ್ರತಿಯೊಂದು Reel URL ಅನ್ನು ಒಂದರ ಕೆಳಗೆ ಒಂದರಂತೆ (ವರ್ಟಿಕಲ್ ಆಗಿ) ಸುಲಭವಾಗಿ ಸೆಟ್ ಮಾಡಿಕೊಳ್ಳಿ. ಇನ್ನೂ ಹೆಚ್ಚು ರೀಲ್ಸ್‌ಗಳನ್ನು ಸೇರಿಸಲು "+ ಹೊಸ ಟ್ಯಾಬ್ (+ New Tab)" ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ!'
              : 'Stacked vertical cards for each Reel URL. Paste links, set triggers, and easily add more reels with the "+ New Tab" button.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenApkGuide && (
            <button
              onClick={onOpenApkGuide}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>{lang === 'kn' ? 'GitHub APK ವರ್ಕ್‌ಫ್ಲೋ' : 'GitHub APK Build'}</span>
            </button>
          )}

          <button
            onClick={onAddTab}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-lg shadow-rose-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newTabBtn}</span>
          </button>
        </div>
      </div>

      {/* Expand / Collapse All helper row */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">
            {tabs.length} {lang === 'kn' ? 'ರೀಲ್ಸ್ ಆಟೋಮೇಷನ್ ಕಾರ್ಡ್‌ಗಳು' : 'Reel Automations (Stacked)'}
          </span>
          <span className="text-[11px] text-slate-500">· {lang === 'kn' ? 'ಒಂದರ ನಂತರ ಒಂದು ಕೆಳಗಡೆ' : 'Ordered vertically'}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExpandAll}
            className="hover:text-white transition-colors underline underline-offset-2"
          >
            {lang === 'kn' ? 'ಎಲ್ಲವನ್ನೂ ವಿಸ್ತರಿಸಿ' : 'Expand All'}
          </button>
          <span>·</span>
          <button
            onClick={handleCollapseAll}
            className="hover:text-white transition-colors underline underline-offset-2"
          >
            {lang === 'kn' ? 'ಕುಗ್ಗಿಸಿ' : 'Collapse All'}
          </button>
        </div>
      </div>

      {/* STACKED VERTICAL CARDS (ಒಂದರ ನಂತರ ಒಂದು ಕೆಳಗಡೆ) */}
      <div className="space-y-4">
        {tabs.map((tab, index) => {
          const isExpanded = expandedTabIds.includes(tab.id);
          const currentComment = testComments[tab.id] !== undefined 
            ? testComments[tab.id] 
            : 'ಲಿಂಕ್ ಕಳ್ಸಿ ಬ್ರದರ್ LINK please!';
          const currentKeywordInput = keywordInputs[tab.id] || '';
          const result = testResults[tab.id];

          return (
            <div
              key={tab.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-[#121622] border-white/20 shadow-xl'
                  : 'bg-[#0f131d] border-white/10 hover:border-white/15'
              }`}
            >
              {/* Card Header Bar (Click to Expand / Collapse) */}
              <div
                onClick={() => toggleExpand(tab.id)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Number Badge */}
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center font-mono font-bold text-xs text-rose-300 shrink-0">
                    #{index + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                        {tab.tabTitle || `Reel ${index + 1}`}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded truncate max-w-[200px] sm:max-w-xs">
                        {tab.reelUrl}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 flex-wrap">
                      <span>{tab.triggerKeywords.length} {lang === 'kn' ? 'ಕೀವರ್ಡ್‌ಗಳು' : 'keywords'}:</span>
                      <div className="flex items-center gap-1">
                        {tab.triggerKeywords.slice(0, 3).map((kw, i) => (
                          <span key={i} className="font-mono text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            {kw}
                          </span>
                        ))}
                        {tab.triggerKeywords.length > 3 && (
                          <span className="text-[10px] text-slate-500">+{tab.triggerKeywords.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Header Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Delete Tab Button */}
                  {tabs.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTab(tab.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title={t.closeTab}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Expand / Collapse Icon */}
                  <div className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Card Expanded Content Body */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-white/10 space-y-6 animate-in fade-in duration-150">
                  {/* Row 1: Tab Title & Reel URL input */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.tabNamePrompt}
                      </label>
                      <input
                        type="text"
                        value={tab.tabTitle}
                        onChange={(e) => onUpdateTab({ ...tab, tabTitle: e.target.value })}
                        placeholder="e.g. Ebook Reel, Discount Reel"
                        className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-white text-xs font-medium focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-8">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.pasteReelUrlLabel} <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="url"
                          value={tab.reelUrl}
                          onChange={(e) => onUpdateTab({ ...tab, reelUrl: e.target.value })}
                          placeholder={t.pasteReelUrlPlaceholder}
                          className="w-full pl-9 pr-24 py-2 rounded-lg bg-black/50 border border-white/10 text-rose-300 font-mono text-xs focus:border-rose-500 focus:outline-none"
                        />
                        <span className="absolute right-2.5 top-2 text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                          URL Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick sample reels selector to test instantly */}
                  <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                    <span className="text-slate-400">
                      {lang === 'kn' ? 'ಉದಾಹರಣೆ ರೀಲ್ಸ್ ಲಿಂಕ್ ಪರೀಕ್ಷಿಸಿ:' : 'Quick Reel Presets:'}
                    </span>
                    {sampleReels.map((sample, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleApplySample(tab, sample)}
                        className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] transition-colors"
                      >
                        {sample.title}
                      </button>
                    ))}
                  </div>

                  {/* Row 2: Reel Preview & Keyword Setup */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2 border-t border-white/10">
                    {/* Reel thumbnail & details */}
                    <div className="lg:col-span-4 p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3">
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-slate-800 shrink-0 relative">
                        <img
                          src={tab.thumbnailUrl || '/src/assets/images/reel_cover_ecommerce_1792848111325.jpg'}
                          alt="Reel preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1">
                          <span className="text-[9px] font-mono text-white">REEL</span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="text-xs font-bold text-white truncate">
                          {tab.reelTitle || 'Instagram Reel'}
                        </div>
                        <p className="text-[11px] font-mono text-slate-400 truncate">
                          {tab.reelUrl}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>{lang === 'kn' ? 'ಆಟೋಮೇಷನ್ ಸಕ್ರಿಯ' : 'Automation Active'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Trigger Keywords for this Reel */}
                    <div className="lg:col-span-8 space-y-2">
                      <label className="block text-xs font-semibold text-slate-300">
                        {t.triggerKeywordsLabel} <span className="text-rose-400">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentKeywordInput}
                          onChange={(e) => setKeywordInputs({ ...keywordInputs, [tab.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              handleAddKeyword(tab);
                            }
                          }}
                          placeholder={lang === 'kn' ? 'ಕೀವರ್ಡ್ ಟೈಪ್ ಮಾಡಿ Enter ಒತ್ತಿ (ಉದಾ: LINK, ಲಿಂಕ್, INFO, PDF)' : 'Type keyword & hit Enter (e.g. LINK, INFO, OFFER)'}
                          className="flex-1 px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-white placeholder-slate-500 text-xs focus:border-rose-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddKeyword(tab)}
                          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                        >
                          {lang === 'kn' ? 'ಸೇರಿಸಿ' : 'Add'}
                        </button>
                      </div>

                      {/* Keyword tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {tab.triggerKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
                          >
                            <span>"{kw}"</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveKeyword(tab, kw)}
                              className="text-amber-400 hover:text-amber-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Target Link to Send in DM & Button Text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.targetLinkLabel} <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="url"
                          value={tab.targetLinkUrl}
                          onChange={(e) => onUpdateTab({ ...tab, targetLinkUrl: e.target.value })}
                          placeholder="https://yourwebsite.com/my-link"
                          className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.buttonLabelText}
                      </label>
                      <input
                        type="text"
                        value={tab.buttonLabel}
                        onChange={(e) => onUpdateTab({ ...tab, buttonLabel: e.target.value })}
                        placeholder={lang === 'kn' ? '🔗 ಲಿಂಕ್ ಪಡೆಯಿರಿ / Get Link' : '🔗 Get Link Now'}
                        className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 4: DM Response Message Template */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">
                        {t.dmMessageLabel}
                      </label>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400">{t.insertTagHelper}</span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateTab({
                              ...tab,
                              dmResponseText: tab.dmResponseText + ' @{username}',
                            })
                          }
                          className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-rose-300 font-mono text-[10px]"
                        >
                          @{'{username}'}
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={tab.dmResponseText}
                      onChange={(e) => onUpdateTab({ ...tab, dmResponseText: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs leading-relaxed focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  {/* Row 5: Auto Public Reply Toggle */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-semibold text-white">
                          {t.publicReplyToggle}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={tab.autoPublicReply}
                        onChange={(e) =>
                          onUpdateTab({ ...tab, autoPublicReply: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-rose-500"
                      />
                    </div>
                    {tab.autoPublicReply && (
                      <input
                        type="text"
                        value={tab.publicReplyText}
                        onChange={(e) =>
                          onUpdateTab({ ...tab, publicReplyText: e.target.value })
                        }
                        placeholder="ನಿಮ್ಮ DM ಚೆಕ್ ಮಾಡಿ @{username}! ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ 📩"
                        className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Row 6: Interactive In-Card Test & Full Simulator Trigger */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/20 via-purple-950/20 to-black/40 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white">
                          {lang === 'kn' ? 'ಈ Reel URL ಆಟೋಮೇಷನ್ ಪರೀಕ್ಷಿಸಿ (Quick Comment Test)' : 'Test This Reel URL Trigger'}
                        </span>
                      </div>
                      <button
                        onClick={() => onTestInFullSimulator(tab)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 flex items-center gap-1 transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{t.testThisReelBtn}</span>
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentComment}
                        onChange={(e) => setTestComments({ ...testComments, [tab.id]: e.target.value })}
                        placeholder="ಕಾಮೆಂಟ್ ಪರೀಕ್ಷೆ (ಉದಾ: LINK ಕೊಡಿ)..."
                        className="flex-1 px-3.5 py-2 rounded-lg bg-black/60 border border-white/10 text-white text-xs placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleQuickTestComment(tab)}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-md flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{lang === 'kn' ? 'ಪರೀಕ್ಷಿಸಿ' : 'Test Comment'}</span>
                      </button>
                    </div>

                    {result && (
                      <div
                        className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                          result.success
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                        }`}
                      >
                        {result.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Info className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span>{result.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Prominent '+ New Tab' Bottom Button */}
      <div className="pt-2">
        <button
          onClick={onAddTab}
          className="w-full py-3.5 rounded-2xl border-2 border-dashed border-rose-500/40 hover:border-rose-500 bg-rose-500/5 hover:bg-rose-500/10 text-rose-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group"
        >
          <div className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <span>{lang === 'kn' ? '+ ಹೊಸ ಟ್ಯಾಬ್ ಸೇರಿಸಿ (ಇನ್ನೊಂದು Reel URL ಸೇರಿಸಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ)' : '+ Add Another Reel URL Tab'}</span>
        </button>
      </div>
    </div>
  );
};
