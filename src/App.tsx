import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { ReelUrlAutomationStudio } from './components/ReelUrlAutomationStudio';
import { AutomationsList } from './components/AutomationsList';
import { LiveSimulator } from './components/LiveSimulator';
import { LogsView } from './components/LogsView';
import { AutomationEditorModal } from './components/AutomationEditorModal';
import { MetaApiModal } from './components/MetaApiModal';
import { ApkGuideModal } from './components/ApkGuideModal';
import { initialMetaConfig, initialReels, initialRules, initialEvents } from './data/initialData';
import { AutomationRule, CommentEvent, MetaAccountConfig, Language, ReelItem, ReelUrlTabCampaign } from './types';
import { getT } from './utils/translations';
import { Zap, Play, Plus, CheckCircle, Info, Sparkles, ExternalLink, Terminal, ShieldCheck, Link as LinkIcon, Smartphone, Github } from 'lucide-react';

const initialReelTabs: ReelUrlTabCampaign[] = [
  {
    id: 'tab-1',
    tabTitle: 'Reel 1: Creator Guide',
    reelUrl: 'https://www.instagram.com/reel/C8x9Kl1pA2/',
    thumbnailUrl: '/src/assets/images/reel_cover_ecommerce_1792848111325.jpg',
    reelTitle: 'Digital Creator Toolkit & E-book',
    reelCaption: 'ಕಂಟೆಂಟ್ ಕ್ರಿಯೇಟರ್ ಆಗಲು ಬೇಕಾದ ಟಾಪ್ 10 ಟೂಲ್ಸ್! ಪಡೆಯಲು "LINK" ಎಂದು ಕಾಮೆಂಟ್ ಮಾಡಿ.',
    triggerKeywords: ['LINK', 'ಲಿಂಕ್', 'INFO', 'GUIDE'],
    dmResponseText: 'ಹಲೋ @{username}! 👋\n\nನೀವು ಈ Reel ನಲ್ಲಿ ಕೇಳಿದ ಡಿಜಿಟಲ್ ರಿಸೋರ್ಸ್ ಲಿಂಕ್ ಇಲ್ಲಿದೆ. ಈ ಕೆಳಗಿನ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ತಕ್ಷಣ ಪ್ರವೇಶ ಪಡೆಯಿರಿ:',
    targetLinkUrl: 'https://creatorhub.kannada.digital/free-toolkit',
    buttonLabel: '🔗 ಲಿಂಕ್ ಪಡೆಯಿರಿ (Get Link)',
    autoPublicReply: true,
    publicReplyText: 'ನಿಮ್ಮ DM ಚೆಕ್ ಮಾಡಿ @{username}! ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ 📩✨',
    enabled: true,
    dmsSentCount: 142,
  },
  {
    id: 'tab-2',
    tabTitle: 'Reel 2: Fitness Plan',
    reelUrl: 'https://www.instagram.com/reel/C7m1No2pB4/',
    thumbnailUrl: '/src/assets/images/reel_cover_fitness_1792848112133.jpg',
    reelTitle: '30-Day Fitness & Diet Routine',
    reelCaption: 'ಜಿಮ್ ಇಲ್ಲದೆ ಮನೆಯಲ್ಲೇ ಫಿಟ್ ಆಗಲು 30 ದಿನಗಳ ಪ್ಲಾನ್! "FIT" ಎಂದು ಕಾಮೆಂಟ್ ಮಾಡಿ.',
    triggerKeywords: ['FIT', 'ಫಿಟ್', 'DIET', 'PDF'],
    dmResponseText: 'ನಮಸ್ಕಾರ @{username}! 💪\n\nನೀವು ವಿನಂತಿಸಿದ 30-ದಿನಗಳ ಫಿಟ್‌ನೆಸ್ ಗೈಡ್ PDF ಲಿಂಕ್ ಇಲ್ಲಿದೆ:',
    targetLinkUrl: 'https://fitlife.kannada.digital/30-day-guide.pdf',
    buttonLabel: '📥 ಡೌನ್‌ಲೋಡ್ PDF',
    autoPublicReply: true,
    publicReplyText: 'Check your DM @{username}! Sent the diet guide 🥗💪',
    enabled: true,
    dmsSentCount: 98,
  },
];

export default function App() {
  const [lang, setLang] = useState<Language>('kn');
  const [currentTab, setCurrentTab] = useState<'reel_url' | 'rules' | 'simulator' | 'logs' | 'meta'>('reel_url');

  // Reel URL Tabs State
  const [reelTabs, setReelTabs] = useState<ReelUrlTabCampaign[]>(() => {
    const saved = localStorage.getItem('instalink_reel_tabs');
    return saved ? JSON.parse(saved) : initialReelTabs;
  });
  const [activeReelTabId, setActiveReelTabId] = useState<string>(reelTabs[0]?.id || 'tab-1');

  // Stored state
  const [rules, setRules] = useState<AutomationRule[]>(() => {
    const saved = localStorage.getItem('instalink_rules');
    return saved ? JSON.parse(saved) : initialRules;
  });

  const [reels] = useState<ReelItem[]>(initialReels);

  const [events, setEvents] = useState<CommentEvent[]>(() => {
    const saved = localStorage.getItem('instalink_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [metaConfig, setMetaConfig] = useState<MetaAccountConfig>(() => {
    const saved = localStorage.getItem('instalink_meta_config');
    return saved ? JSON.parse(saved) : initialMetaConfig;
  });

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
  const [isApkGuideOpen, setIsApkGuideOpen] = useState(false);
  const [preselectedRuleForSim, setPreselectedRuleForSim] = useState<AutomationRule | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('instalink_reel_tabs', JSON.stringify(reelTabs));
  }, [reelTabs]);

  useEffect(() => {
    localStorage.setItem('instalink_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('instalink_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('instalink_meta_config', JSON.stringify(metaConfig));
  }, [metaConfig]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add a new tab
  const handleAddNewReelTab = () => {
    const newIndex = reelTabs.length + 1;
    const newTabId = `tab-${Date.now()}`;
    const newTab: ReelUrlTabCampaign = {
      id: newTabId,
      tabTitle: `Reel ${newIndex}: New Campaign`,
      reelUrl: `https://www.instagram.com/reel/new_${Date.now().toString().slice(-6)}/`,
      thumbnailUrl: '/src/assets/images/reel_cover_tech_1792848112276.jpg',
      reelTitle: `Reel ${newIndex} Auto-DM`,
      reelCaption: 'Reel details and custom caption',
      triggerKeywords: ['LINK', 'ಲಿಂಕ್', 'INFO'],
      dmResponseText: `ಹಲೋ @{username}! 👋\n\nನೀವು ಈ Reel ನಲ್ಲಿ ಕೇಳಿದ ಲಿಂಕ್ ಇಲ್ಲಿದೆ. ಕೆಳಗಿನ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ:`,
      targetLinkUrl: 'https://mysite.com/exclusive-offer',
      buttonLabel: '🔗 ಲಿಂಕ್ ಪಡೆಯಿರಿ / Get Link',
      autoPublicReply: true,
      publicReplyText: 'ನಿಮ್ಮ DM ಚೆಕ್ ಮಾಡಿ @{username}! ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ 📩✨',
      enabled: true,
      dmsSentCount: 0,
    };

    setReelTabs([...reelTabs, newTab]);
    setActiveReelTabId(newTabId);
    setCurrentTab('reel_url');
    showToast(
      lang === 'kn'
        ? `ಹೊಸ ಟ್ಯಾಬ್ "Reel ${newIndex}" ರಚಿಸಲಾಗಿದೆ! ಈಗ Reel URL ಮತ್ತು ಕೀವರ್ಡ್ ಹಾಕಿ.`
        : `New Tab "Reel ${newIndex}" created! Ready for URL & keywords.`
    );
  };

  const handleRemoveReelTab = (tabId: string) => {
    if (reelTabs.length <= 1) return;
    const filtered = reelTabs.filter((t) => t.id !== tabId);
    setReelTabs(filtered);
    if (activeReelTabId === tabId) {
      setActiveReelTabId(filtered[0]?.id || '');
    }
    showToast(lang === 'kn' ? 'ಟ್ಯಾಬ್ ಅಳಿಸಲಾಗಿದೆ.' : 'Tab closed.');
  };

  const handleUpdateReelTab = (updatedTab: ReelUrlTabCampaign) => {
    setReelTabs(reelTabs.map((t) => (t.id === updatedTab.id ? updatedTab : t)));

    // Also sync to global rules so simulator and audit logs see it!
    setRules((prev) => {
      const exists = prev.some((r) => r.id === updatedTab.id);
      const syncedRule: AutomationRule = {
        id: updatedTab.id,
        name: updatedTab.tabTitle,
        nameKn: updatedTab.tabTitle,
        reelScope: 'all',
        targetReelIds: [],
        triggerKeywords: updatedTab.triggerKeywords,
        matchMode: 'contains',
        caseSensitive: false,
        dmMessage: updatedTab.dmResponseText,
        linkUrl: updatedTab.targetLinkUrl,
        buttonLabel: updatedTab.buttonLabel,
        linkTitle: updatedTab.reelTitle,
        linkDescription: updatedTab.reelCaption,
        sendPublicReply: updatedTab.autoPublicReply,
        publicReplyVariants: [updatedTab.publicReplyText],
        cooldownHours: 24,
        delaySeconds: 1,
        enabled: updatedTab.enabled,
        createdAt: '2026-10-24',
        triggeredCount: updatedTab.dmsSentCount,
        dmDeliveredCount: updatedTab.dmsSentCount,
        clicksCount: Math.round(updatedTab.dmsSentCount * 0.7),
      };

      if (exists) {
        return prev.map((r) => (r.id === updatedTab.id ? syncedRule : r));
      }
      return [syncedRule, ...prev];
    });
  };

  const handleTestReelTabInSimulator = (tab: ReelUrlTabCampaign) => {
    // Construct rule representation and pass to simulator
    const tempRule: AutomationRule = {
      id: tab.id,
      name: tab.tabTitle,
      reelScope: 'all',
      targetReelIds: [],
      triggerKeywords: tab.triggerKeywords,
      matchMode: 'contains',
      caseSensitive: false,
      dmMessage: tab.dmResponseText,
      linkUrl: tab.targetLinkUrl,
      buttonLabel: tab.buttonLabel,
      linkTitle: tab.reelTitle,
      linkDescription: tab.reelCaption,
      sendPublicReply: tab.autoPublicReply,
      publicReplyVariants: [tab.publicReplyText],
      cooldownHours: 24,
      delaySeconds: 1,
      enabled: true,
      createdAt: '2026-10-24',
      triggeredCount: tab.dmsSentCount,
      dmDeliveredCount: tab.dmsSentCount,
      clicksCount: 10,
    };

    setPreselectedRuleForSim(tempRule);
    setCurrentTab('simulator');
  };

  // Rule Handlers
  const handleSaveRule = (savedRule: AutomationRule) => {
    setRules((prev) => {
      const exists = prev.some((r) => r.id === savedRule.id);
      if (exists) {
        return prev.map((r) => (r.id === savedRule.id ? savedRule : r));
      }
      return [savedRule, ...prev];
    });
    setIsEditorOpen(false);
    setEditingRule(null);
    showToast(
      lang === 'kn'
        ? `ಆಟೋಮೇಷನ್ ನಿಯಮ "${savedRule.name}" ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!`
        : `Automation rule "${savedRule.name}" saved successfully!`
    );
  };

  const handleDeleteRule = (ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId);
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
    showToast(
      lang === 'kn'
        ? `ನಿಯಮ "${rule?.name || ''}" ಅಳಿಸಲಾಗಿದೆ.`
        : `Rule deleted successfully.`
    );
  };

  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === ruleId) {
          const nextState = !r.enabled;
          showToast(
            nextState
              ? lang === 'kn' ? `ನಿಯಮ ಸಕ್ರಿಯಗೊಂಡಿದೆ (Active)` : `Rule activated`
              : lang === 'kn' ? `ನಿಯಮ ವಿರಾಮಗೊಳಿಸಲಾಗಿದೆ (Paused)` : `Rule paused`
          );
          return { ...r, enabled: nextState };
        }
        return r;
      })
    );
  };

  const handleTestInSimulator = (rule: AutomationRule) => {
    setPreselectedRuleForSim(rule);
    setCurrentTab('simulator');
  };

  const handleEventGenerated = (newEvent: CommentEvent) => {
    setEvents((prev) => [newEvent, ...prev]);

    // Update rule stats
    if (newEvent.matchedRuleId) {
      setRules((prev) =>
        prev.map((r) => {
          if (r.id === newEvent.matchedRuleId) {
            return {
              ...r,
              triggeredCount: r.triggeredCount + 1,
              dmDeliveredCount:
                newEvent.dmStatus === 'delivered'
                  ? r.dmDeliveredCount + 1
                  : r.dmDeliveredCount,
            };
          }
          return r;
        })
      );

      // Also update tab stats if matched
      setReelTabs((prev) =>
        prev.map((t) =>
          t.id === newEvent.matchedRuleId
            ? { ...t, dmsSentCount: t.dmsSentCount + 1 }
            : t
        )
      );
    }
  };

  const t = getT(lang);

  return (
    <div className="min-h-screen bg-[#0c0f17] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        onNewRule={() => {
          setEditingRule(null);
          setIsEditorOpen(true);
        }}
        onNewTab={handleAddNewReelTab}
        metaConfig={metaConfig}
        onOpenMetaModal={() => setIsMetaModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Banner / Direct Reel URL Highlight */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-blue-950/20 border border-white/10 p-5 sm:p-6 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>
                  {lang === 'kn'
                    ? 'ಅತ್ಯುತ್ತಮ ಐಡಿಯಾ: ನೇರ Reel URL & ಹೊಸ ಟ್ಯಾಬ್ ಆಟೋಮೇಷನ್'
                    : 'Direct Instagram Reel URL & Multi-Tab Automation Studio'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {lang === 'kn'
                  ? 'Instagram ಪೇಜ್ ಕನೆಕ್ಟ್ ಮಾಡದೆ, ನೇರವಾಗಿ Reel URL ಹಾಕಿ, ಕೀವರ್ಡ್ ಮತ್ತು DM ಲಿಂಕ್ ಸೆಟ್ ಮಾಡಿ!'
                  : 'Paste Reel URL Directly, Set Your Keywords, and Automate Instant DM Responses'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lang === 'kn'
                  ? 'ಹೌದು ಗೆಳೆಯಾ! ಇದು ಅತ್ಯಂತ ಅದ್ಭುತವಾದ ಐಡಿಯಾ. ಯಾವುದೇ ಸಂಕೀರ್ಣ ಸೆಟಪ್ ಇಲ್ಲದೆ ನಿಮ್ಮ ಯಾವುದೇ Reel URL ಅನ್ನು ಹಾಕಿ ಕೀವರ್ಡ್ ಮತ್ತು DM ಉತ್ತರ ಸೆಟ್ ಮಾಡಬಹುದು. ಇನ್ನೂ ಹೆಚ್ಚು ರೀಲ್ಸ್‌ಗಳನ್ನು ಸೇರಿಸಲು "+ ಹೊಸ ಟ್ಯಾಬ್ (+ New Tab)" ಬಟನ್ ಬಳಸಿ!'
                  : 'Fast, hassle-free URL-based automation with individual tabs for each of your Reels. Click "+ New Tab" to add as many reel automations as you need!'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                onClick={handleAddNewReelTab}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-lg shadow-rose-500/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>{t.newTabBtn}</span>
              </button>

              <button
                onClick={() => setCurrentTab('simulator')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span>{lang === 'kn' ? 'ಸಿಮ್ಯುಲೇಟರ್‌ನಲ್ಲಿ ಟೆಸ್ಟ್ ಮಾಡಿ' : 'Open Live Simulator'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Analytics Cards */}
        <StatsCards lang={lang} rules={rules} events={events} />

        {/* Tab View Router */}
        {currentTab === 'reel_url' && (
          <ReelUrlAutomationStudio
            tabs={reelTabs}
            activeTabId={activeReelTabId}
            lang={lang}
            onSelectTab={setActiveReelTabId}
            onAddTab={handleAddNewReelTab}
            onRemoveTab={handleRemoveReelTab}
            onUpdateTab={handleUpdateReelTab}
            onTestInFullSimulator={handleTestReelTabInSimulator}
            onDispatchEvent={handleEventGenerated}
            onOpenApkGuide={() => setIsApkGuideOpen(true)}
          />
        )}

        {currentTab === 'rules' && (
          <AutomationsList
            rules={rules}
            reels={reels}
            lang={lang}
            onEditRule={(rule) => {
              setEditingRule(rule);
              setIsEditorOpen(true);
            }}
            onDeleteRule={handleDeleteRule}
            onToggleRule={handleToggleRule}
            onTestRuleInSimulator={handleTestInSimulator}
            onNewRule={() => {
              setEditingRule(null);
              setIsEditorOpen(true);
            }}
          />
        )}

        {currentTab === 'simulator' && (
          <LiveSimulator
            reels={reels}
            rules={rules}
            lang={lang}
            metaConfig={metaConfig}
            preselectedRule={preselectedRuleForSim}
            onEventGenerated={handleEventGenerated}
          />
        )}

        {currentTab === 'logs' && (
          <LogsView events={events} lang={lang} />
        )}

        {currentTab === 'meta' && (
          <div className="bg-[#121622] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-blue-400" />
                  <span>{t.metaTitle}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {t.metaSubtitle}
                </p>
              </div>

              <button
                onClick={() => setIsMetaModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-2 self-start sm:self-auto"
              >
                <span>{lang === 'kn' ? 'ಸೆಟಪ್ ವಿಝಾರ್ಡ್ ತೆರೆಯಿರಿ' : 'Open Setup Wizard'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-slate-400 block font-medium">1. Connected Page</span>
                <span className="text-white font-bold text-sm block">@{metaConfig.instagramHandle}</span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Webhook Verified</span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-slate-400 block font-medium">2. Callback URL</span>
                <span className="text-rose-300 font-mono text-[11px] block truncate">
                  {metaConfig.webhookCallbackUrl}
                </span>
                <span className="text-[11px] text-slate-400">Subscribed to: `comments`</span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-slate-400 block font-medium">3. Verification Token</span>
                <span className="text-amber-300 font-mono text-[11px] block truncate">
                  {metaConfig.webhookVerifyToken}
                </span>
                <span className="text-[11px] text-slate-400">SHA-256 HMAC validated</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#090c13] mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            <span className="font-semibold text-white">InstaLink AutoDM Studio</span>
            <span className="mx-2">·</span>
            <span>
              {lang === 'kn'
                ? 'Instagram Reels ನೇರ URL & ಕಾಮೆಂಟ್-ಟು-DM ಆಟೋಮೇಷನ್'
                : 'Instagram Reels Direct URL & Comment-to-Direct Message Automation'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsApkGuideOpen(true)}
              className="hover:text-emerald-400 text-emerald-400/90 transition-colors flex items-center gap-1 font-semibold"
            >
              <Github className="w-3.5 h-3.5" />
              <span>{lang === 'kn' ? 'Android APK ಡೌನ್‌ಲೋಡ್' : 'Download Android APK'}</span>
            </button>
            <button
              onClick={() => setIsMetaModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              Meta Graph API Docs
            </button>
            <button
              onClick={() => setLang(lang === 'kn' ? 'en' : 'kn')}
              className="text-rose-400 hover:underline"
            >
              {lang === 'kn' ? 'Switch to English' : 'ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ'}
            </button>
          </div>
        </div>
      </footer>

      {/* Editor Modal */}
      {isEditorOpen && (
        <AutomationEditorModal
          rule={editingRule}
          reels={reels}
          lang={lang}
          onSave={handleSaveRule}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingRule(null);
          }}
        />
      )}

      {/* Meta API & Webhook Modal */}
      {isMetaModalOpen && (
        <MetaApiModal
          metaConfig={metaConfig}
          lang={lang}
          rules={rules}
          onClose={() => setIsMetaModalOpen(false)}
          onUpdateMetaConfig={(newCfg) => {
            setMetaConfig(newCfg);
            showToast(
              lang === 'kn'
                ? 'Meta Instagram ಕಾನ್ಫಿಗರೇಶನ್ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ!'
                : 'Meta Instagram configuration updated!'
            );
          }}
          onDispatchSimulatedWebhook={handleEventGenerated}
        />
      )}

      {/* Android APK GitHub Actions Guide Modal */}
      {isApkGuideOpen && (
        <ApkGuideModal
          lang={lang}
          onClose={() => setIsApkGuideOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-white/20 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
