import React, { useState, useEffect } from 'react';
import { Play, Send, Film, MessageCircle, Sparkles, CheckCircle2, AlertCircle, ArrowRight, CornerDownRight, ExternalLink, Heart, Bookmark, Share2, MoreHorizontal, User, RefreshCw, Zap } from 'lucide-react';
import { ReelItem, AutomationRule, CommentEvent, Language, MetaAccountConfig } from '../types';
import { getT } from '../utils/translations';

interface LiveSimulatorProps {
  reels: ReelItem[];
  rules: AutomationRule[];
  lang: Language;
  metaConfig: MetaAccountConfig;
  preselectedRule?: AutomationRule | null;
  onEventGenerated: (event: CommentEvent) => void;
}

export const LiveSimulator: React.FC<LiveSimulatorProps> = ({
  reels,
  rules,
  lang,
  metaConfig,
  preselectedRule,
  onEventGenerated,
}) => {
  const t = getT(lang);

  const [selectedReelId, setSelectedReelId] = useState<string>(
    preselectedRule?.targetReelIds[0] || reels[0]?.id || ''
  );
  const [commenterUsername, setCommenterUsername] = useState('praveen_blr_dev');
  const [commentText, setCommentText] = useState('ದಯವಿಟ್ಟು ಲಿಂಕ್ ಕಳ್ಸಿ ಬ್ರದರ್ LINK please!');
  const [phoneTab, setPhoneTab] = useState<'comments' | 'dm'>('comments');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [lastDeliveredEvent, setLastDeliveredEvent] = useState<CommentEvent | null>(null);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // Comments feed inside the simulated reel
  const [simulatedComments, setSimulatedComments] = useState<
    Array<{
      id: string;
      username: string;
      text: string;
      timeAgo: string;
      likes: number;
      reply?: {
        username: string;
        text: string;
        timeAgo: string;
      };
    }>
  >([
    {
      id: 'c1',
      username: 'anand_creative',
      text: 'Super informative! Waiting for the details 👏',
      timeAgo: '15m',
      likes: 4,
    },
    {
      id: 'c2',
      username: 'sneha_gowda',
      text: 'ಲಿಂಕ್ ಕಳ್ಸಿ LINK please 🙏',
      timeAgo: '8m',
      likes: 2,
      reply: {
        username: metaConfig.instagramHandle,
        text: 'ನಿಮ್ಮ DM ಚೆಕ್ ಮಾಡಿ @sneha_gowda! ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ 📩✨',
        timeAgo: '8m',
      },
    },
  ]);

  const selectedReel = reels.find((r) => r.id === selectedReelId) || reels[0];

  const quickChips = [
    { label: 'LINK', text: 'Please send me the LINK! 🙌' },
    { label: 'ಲಿಂಕ್ ಕಳ್ಸಿ', text: 'ಲಿಂಕ್ ಕಳ್ಸಿ ಬ್ರದರ್ (LINK)' },
    { label: 'FIT', text: 'FIT plan please! Want to start today' },
    { label: 'TECH', text: 'Need the TECH setup links 🔥' },
    { label: 'ಕೇವಲ ಹೊಗಳಿಕೆ (No Keyword)', text: 'Great content, loved the editing! 🔥' },
  ];

  // If a preselected rule was passed in, set comment text to match its first keyword
  useEffect(() => {
    if (preselectedRule && preselectedRule.triggerKeywords[0]) {
      setCommentText(`Send me the ${preselectedRule.triggerKeywords[0]} please!`);
    }
  }, [preselectedRule]);

  // Execute Simulation
  const handleRunSimulation = () => {
    if (!commentText.trim() || isProcessing) return;

    setIsProcessing(true);
    setProcessingStep(1); // Step 1: Webhook payload received

    const startTime = performance.now();
    const cleanComment = commentText.trim();

    setTimeout(() => {
      setProcessingStep(2); // Step 2: Keyword scanning & Rule matching

      setTimeout(() => {
        // Find matching active rule
        const matchedRule = rules.find((rule) => {
          if (!rule.enabled) return false;
          // Check scope: all reels OR matches current reel ID
          const matchesReel =
            rule.reelScope === 'all' ||
            rule.targetReelIds.includes(selectedReel.id);
          if (!matchesReel) return false;

          // Check keywords
          return rule.triggerKeywords.some((kw) => {
            if (rule.matchMode === 'exact') {
              return cleanComment.toLowerCase() === kw.toLowerCase();
            } else {
              // Contains keyword
              const regex = new RegExp(`\\b${kw}\\b`, 'i');
              return (
                regex.test(cleanComment) ||
                cleanComment.toLowerCase().includes(kw.toLowerCase())
              );
            }
          });
        });

        const matchedKeyword = matchedRule
          ? matchedRule.triggerKeywords.find((kw) =>
              cleanComment.toLowerCase().includes(kw.toLowerCase())
            ) || matchedRule.triggerKeywords[0]
          : null;

        const latency = Math.round(performance.now() - startTime);

        if (matchedRule) {
          setProcessingStep(3); // Public Reply & DM Dispatch

          // Prepare customized DM
          const dmText = matchedRule.dmMessage
            .replace(/@{username}/g, `@${commenterUsername}`)
            .replace(/{username}/g, commenterUsername)
            .replace(/{reel_title}/g, selectedReel.title)
            .replace(/{keyword}/g, matchedKeyword || 'LINK');

          // Prepare Public Reply
          const publicReplyText = matchedRule.sendPublicReply
            ? matchedRule.publicReplyVariants[0]
                .replace(/@{username}/g, `@${commenterUsername}`)
                .replace(/{username}/g, commenterUsername)
            : null;

          const newEvent: CommentEvent = {
            id: `evt-${Date.now()}`,
            timestamp: 'Just now',
            reelId: selectedReel.id,
            reelTitle: selectedReel.title,
            username: commenterUsername,
            userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${commenterUsername}`,
            commentText: cleanComment,
            matchedRuleId: matchedRule.id,
            matchedRuleName: matchedRule.name,
            matchedKeyword: matchedKeyword || 'LINK',
            dmStatus: 'delivered',
            dmContent: dmText,
            linkUrl: matchedRule.linkUrl,
            buttonLabel: matchedRule.buttonLabel,
            publicReplyText,
            latencyMs: latency,
          };

          // Update comments inside reel feed
          setSimulatedComments((prev) => [
            {
              id: `c-${Date.now()}`,
              username: commenterUsername,
              text: cleanComment,
              timeAgo: 'Just now',
              likes: 0,
              reply: publicReplyText
                ? {
                    username: metaConfig.instagramHandle,
                    text: publicReplyText,
                    timeAgo: 'Just now',
                  }
                : undefined,
            },
            ...prev,
          ]);

          setLastDeliveredEvent(newEvent);
          onEventGenerated(newEvent);

          // Trigger Instagram Notification Banner on Phone
          setNotificationBanner(
            `Instagram: @${metaConfig.instagramHandle} sent you a link in DM!`
          );

          setTimeout(() => {
            setProcessingStep(4); // Finished
            setIsProcessing(false);
          }, 400);

          setTimeout(() => {
            setNotificationBanner(null);
          }, 6000);
        } else {
          // No rule matched
          const ignoredEvent: CommentEvent = {
            id: `evt-${Date.now()}`,
            timestamp: 'Just now',
            reelId: selectedReel.id,
            reelTitle: selectedReel.title,
            username: commenterUsername,
            userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${commenterUsername}`,
            commentText: cleanComment,
            matchedRuleId: null,
            matchedRuleName: null,
            matchedKeyword: null,
            dmStatus: 'ignored',
            dmContent: null,
            linkUrl: null,
            publicReplyText: null,
            latencyMs: latency,
          };

          setSimulatedComments((prev) => [
            {
              id: `c-${Date.now()}`,
              username: commenterUsername,
              text: cleanComment,
              timeAgo: 'Just now',
              likes: 0,
            },
            ...prev,
          ]);

          setLastDeliveredEvent(ignoredEvent);
          onEventGenerated(ignoredEvent);
          setProcessingStep(4);
          setIsProcessing(false);
        }
      }, 350);
    }, 350);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Test Bench (7 cols) */}
      <div className="lg:col-span-7 space-y-5">
        {/* Title */}
        <div className="border-b border-white/10 pb-3">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{t.simTitle}</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Interactive Test Bench
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.simSubtitle}
          </p>
        </div>

        {/* 1. Select Reel */}
        <div className="bg-[#121622] border border-white/10 rounded-xl p-4 space-y-3">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>{t.selectReelToTest}</span>
            <span className="text-[11px] text-slate-400">
              {reels.length} {lang === 'kn' ? 'ರೀಲ್ಸ್‌ಗಳು ಲಭ್ಯ' : 'Reels Available'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {reels.map((reel) => {
              const isSelected = reel.id === selectedReel.id;
              return (
                <div
                  key={reel.id}
                  onClick={() => setSelectedReelId(reel.id)}
                  className={`p-2 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-rose-500/10 border-rose-500 shadow-lg shadow-rose-500/5'
                      : 'bg-black/30 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="relative aspect-[9/12] w-full rounded-lg overflow-hidden bg-slate-900">
                    <img
                      src={reel.thumbnailUrl}
                      alt={reel.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2">
                      <span className="text-[11px] font-bold text-white leading-tight line-clamp-2">
                        {reel.title}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                    <span className="font-mono tabular-nums">{reel.commentsCount} comments</span>
                    <span className="text-rose-400 font-semibold">{isSelected ? 'Active' : 'Select'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Comment Composer */}
        <div className="bg-[#121622] border border-white/10 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              {lang === 'kn' ? 'ಕಾಮೆಂಟ್ ಪರೀಕ್ಷೆ (Simulate User Comment)' : 'Comment Test Input'}
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">{lang === 'kn' ? 'ಬಳಕೆದಾರ:' : 'Username:'}</span>
              <input
                type="text"
                value={commenterUsername}
                onChange={(e) => setCommenterUsername(e.target.value)}
                className="bg-black/40 border border-white/10 rounded px-2 py-0.5 text-xs text-rose-300 font-mono focus:outline-none focus:border-rose-500 w-36"
              />
            </div>
          </div>

          {/* Quick chips */}
          <div className="space-y-1.5">
            <div className="text-[11px] text-slate-400 font-medium">
              {t.quickTestChips}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCommentText(chip.text)}
                  className="px-2.5 py-1 rounded-md text-xs bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t.postCommentPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isProcessing || !commentText.trim()}
            className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{lang === 'kn' ? 'ಪ್ರಕ್ರಿಯೆ ನಡೆಯುತ್ತಿದೆ...' : 'Processing Webhook & Rules...'}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t.postCommentBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* 3. Live Pipeline Visualization */}
        <div className="bg-[#121622] border border-white/10 rounded-xl p-4 space-y-3">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'kn' ? 'ಲೈವ್ ಆಟೋಮೇಷನ್ ಪ್ರಕ್ರಿಯೆ (Pipeline Steps)' : 'Execution Pipeline Flow'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Step 1 */}
            <div
              className={`p-2.5 rounded-lg border transition-all ${
                processingStep >= 1
                  ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                  : 'bg-black/20 border-white/5 text-slate-500'
              }`}
            >
              <div className="font-semibold flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-mono">1</span>
                <span>Meta Webhook</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {lang === 'kn' ? 'ಕಾಮೆಂಟ್ ಈವೆಂಟ್ ಸ್ವೀಕರಿಸಲಾಗಿದೆ' : 'Instagram comment received'}
              </p>
            </div>

            {/* Step 2 */}
            <div
              className={`p-2.5 rounded-lg border transition-all ${
                processingStep >= 2
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-black/20 border-white/5 text-slate-500'
              }`}
            >
              <div className="font-semibold flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-mono">2</span>
                <span>Keyword Match</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {lastDeliveredEvent?.matchedKeyword
                  ? `Matched: "${lastDeliveredEvent.matchedKeyword}"`
                  : lang === 'kn' ? 'ಕೀವರ್ಡ್ ಸ್ಕ್ಯಾನ್' : 'Pattern evaluated'}
              </p>
            </div>

            {/* Step 3 */}
            <div
              className={`p-2.5 rounded-lg border transition-all ${
                processingStep >= 3 && lastDeliveredEvent?.dmStatus === 'delivered'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : processingStep >= 3 && lastDeliveredEvent?.dmStatus === 'ignored'
                  ? 'bg-slate-500/10 border-slate-500/40 text-slate-400'
                  : 'bg-black/20 border-white/5 text-slate-500'
              }`}
            >
              <div className="font-semibold flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono">3</span>
                <span>Instant Auto-DM</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {lastDeliveredEvent?.dmStatus === 'delivered'
                  ? `Delivered in ${lastDeliveredEvent.latencyMs}ms`
                  : lastDeliveredEvent?.dmStatus === 'ignored'
                  ? 'No keyword match'
                  : 'Ready'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: High-Fidelity Phone Simulator (5 cols) */}
      <div className="lg:col-span-5 flex flex-col items-center">
        {/* View Toggle Bar */}
        <div className="w-full max-w-[340px] flex items-center justify-between p-1 rounded-xl bg-white/5 border border-white/10 mb-3 text-xs">
          <button
            onClick={() => setPhoneTab('comments')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              phoneTab === 'comments'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{t.phoneTabComments}</span>
          </button>
          <button
            onClick={() => setPhoneTab('dm')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              phoneTab === 'dm'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.phoneTabDM}</span>
          </button>
        </div>

        {/* Smartphone Hardware Frame */}
        <div className="relative w-full max-w-[340px] h-[640px] bg-[#000000] border-4 border-slate-700 rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
          {/* Dynamic Island / Speaker Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 mr-3" />
            <div className="w-2 h-2 rounded-full bg-blue-950/60" />
          </div>

          {/* Status Bar */}
          <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-semibold text-white/80 z-20">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* Incoming DM Push Notification Overlay */}
          {notificationBanner && (
            <div
              onClick={() => {
                setPhoneTab('dm');
                setNotificationBanner(null);
              }}
              className="absolute top-8 left-3 right-3 z-40 bg-slate-900/95 border border-white/20 rounded-2xl p-3 shadow-2xl cursor-pointer animate-in fade-in slide-in-from-top-3 duration-300"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-[9px] text-white">
                  📸
                </div>
                <span className="text-[11px] font-bold text-white">Instagram</span>
                <span className="text-[10px] text-slate-400 ml-auto">now</span>
              </div>
              <p className="text-xs text-white font-medium">@{metaConfig.instagramHandle}</p>
              <p className="text-[11px] text-slate-300 truncate">
                {lastDeliveredEvent?.dmContent || 'Sent you a link in Direct Message'}
              </p>
            </div>
          )}

          {/* Phone Screen Content */}
          <div className="flex-1 overflow-y-auto bg-[#0a0a0a] text-white flex flex-col">
            {phoneTab === 'comments' ? (
              /* TAB 1: REEL COMMENTS SCREEN */
              <div className="flex-1 flex flex-col">
                {/* Reel Header preview */}
                <div className="relative h-44 bg-slate-900 overflow-hidden shrink-0 border-b border-white/10">
                  <img
                    src={selectedReel.thumbnailUrl}
                    alt={selectedReel.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-between p-3">
                    <div className="flex items-center justify-between text-xs text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-[10px] font-bold">
                          U
                        </div>
                        <span className="font-semibold text-xs text-white">
                          @{metaConfig.instagramHandle}
                        </span>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-white" />
                    </div>

                    <div>
                      <p className="text-xs text-white line-clamp-2 leading-snug">
                        {selectedReel.caption}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comments Section Title */}
                <div className="px-3.5 py-2 border-b border-white/5 flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Comments ({simulatedComments.length})</span>
                  <span className="text-[11px] text-slate-500">Filtered for top</span>
                </div>

                {/* Comments Feed */}
                <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                  {simulatedComments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 overflow-hidden shrink-0">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`}
                            alt={comment.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white truncate">
                              {comment.username}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {comment.timeAgo}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 mt-0.5 break-words">
                            {comment.text}
                          </p>
                        </div>
                        <Heart className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-1" />
                      </div>

                      {/* Creator Automated Reply */}
                      {comment.reply && (
                        <div className="ml-7 pl-3 border-l-2 border-rose-500/40 flex items-start gap-2 bg-rose-500/5 p-2 rounded-r-lg">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-[9px] text-white shrink-0 font-bold">
                            U
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-white flex items-center gap-1">
                                <span>{comment.reply.username}</span>
                                <span className="text-[9px] px-1 rounded bg-rose-500 text-white font-semibold">Creator</span>
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono">
                                {comment.reply.timeAgo}
                              </span>
                            </div>
                            <p className="text-xs text-rose-200 mt-0.5">
                              {comment.reply.text}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom comment box mimic */}
                <div className="p-2 border-t border-white/10 flex items-center gap-2 bg-black">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
                    👤
                  </div>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    disabled
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[11px] text-slate-400"
                  />
                  <span className="text-[11px] font-semibold text-rose-400">Post</span>
                </div>
              </div>
            ) : (
              /* TAB 2: DIRECT MESSAGES (DM) INBOX SCREEN */
              <div className="flex-1 flex flex-col bg-[#050505]">
                {/* DM Chat Header */}
                <div className="px-3 py-2.5 border-b border-white/10 flex items-center justify-between bg-[#111]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-[11px] text-white font-bold">
                      U
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{metaConfig.instagramHandle}</span>
                        <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-400/20" />
                      </div>
                      <div className="text-[9px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Active now</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">···</div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-3 space-y-3 overflow-y-auto flex flex-col justify-end">
                  <div className="text-center my-2">
                    <span className="text-[10px] text-slate-500 font-mono">Today</span>
                  </div>

                  {/* Incoming DM from Creator */}
                  {lastDeliveredEvent && lastDeliveredEvent.dmStatus === 'delivered' ? (
                    <div className="space-y-2 max-w-[90%]">
                      {/* Text Bubble */}
                      <div className="p-3 rounded-2xl rounded-tl-sm bg-[#262626] text-white text-xs whitespace-pre-wrap leading-relaxed shadow">
                        {lastDeliveredEvent.dmContent}
                      </div>

                      {/* Interactive Rich Link Preview Card */}
                      {lastDeliveredEvent.linkUrl && (
                        <div className="rounded-xl overflow-hidden bg-[#1e1e1e] border border-white/10 shadow-lg">
                          <div className="h-24 w-full bg-slate-900 relative">
                            <img
                              src={selectedReel.thumbnailUrl}
                              alt="Link preview"
                              className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                              <span className="text-[11px] font-bold text-white truncate">
                                {lastDeliveredEvent.matchedRuleName || 'Official Link'}
                              </span>
                            </div>
                          </div>

                          <div className="p-2.5 space-y-1.5">
                            <p className="text-[10px] font-mono text-slate-400 truncate">
                              {lastDeliveredEvent.linkUrl}
                            </p>
                            <a
                              href={lastDeliveredEvent.linkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                            >
                              <span>{lastDeliveredEvent.buttonLabel || '🔗 Open Link'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      )}

                      <span className="text-[9px] text-slate-500 font-mono pl-1">
                        Delivered in {lastDeliveredEvent.latencyMs}ms · Seen
                      </span>
                    </div>
                  ) : (
                    <div className="text-center py-10 px-4">
                      <Send className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">
                        {lang === 'kn'
                          ? 'ರೀಲ್‌ಗೆ ಕೀವರ್ಡ್ ಕಾಮೆಂಟ್ ಮಾಡಿದ ತಕ್ಷಣ ಇಲ್ಲಿ DM ಕಾಣಿಸುತ್ತದೆ!'
                          : 'Post a comment with trigger keywords to see the instant DM preview here!'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Message input bar mimic */}
                <div className="p-2.5 border-t border-white/10 bg-[#111] flex items-center gap-2">
                  <div className="flex-1 bg-white/10 rounded-full px-3 py-1.5 text-xs text-slate-400 flex items-center justify-between">
                    <span>Message...</span>
                    <span>🎙️</span>
                  </div>
                  <Heart className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
