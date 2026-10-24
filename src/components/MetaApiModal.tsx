import React, { useState } from 'react';
import { X, Copy, Check, Terminal, ExternalLink, ShieldCheck, Key, RefreshCw, Send, CheckCircle2, Code2 } from 'lucide-react';
import { MetaAccountConfig, Language, AutomationRule, CommentEvent } from '../types';
import { getT } from '../utils/translations';

interface MetaApiModalProps {
  metaConfig: MetaAccountConfig;
  lang: Language;
  rules: AutomationRule[];
  onClose: () => void;
  onUpdateMetaConfig: (config: MetaAccountConfig) => void;
  onDispatchSimulatedWebhook: (event: CommentEvent) => void;
}

export const MetaApiModal: React.FC<MetaApiModalProps> = ({
  metaConfig,
  lang,
  rules,
  onClose,
  onUpdateMetaConfig,
  onDispatchSimulatedWebhook,
}) => {
  const t = getT(lang);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [handle, setHandle] = useState(metaConfig.instagramHandle);
  const [token, setToken] = useState(metaConfig.pageAccessToken);
  const [activeTab, setActiveTab] = useState<'instructions' | 'raw_test' | 'code_snippet'>('instructions');

  // Raw Webhook Payload Sample for testing
  const [rawPayload, setRawPayload] = useState(
    JSON.stringify(
      {
        object: 'instagram',
        entry: [
          {
            id: metaConfig.instagramUserId,
            time: Math.floor(Date.now() / 1000),
            changes: [
              {
                field: 'comments',
                value: {
                  id: '179920193850192',
                  text: 'ಹಲೋ ಬ್ರದರ್ LINK ಕಳ್ಸಿ please!',
                  from: {
                    id: '17841400012345',
                    username: 'kannada_tester_99',
                  },
                  media: {
                    id: '17841400998877',
                    media_product_type: 'REELS',
                  },
                },
              },
            ],
          },
        ],
      },
      null,
      2
    )
  );

  const [testResult, setTestResult] = useState<string | null>(null);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveConfig = () => {
    onUpdateMetaConfig({
      ...metaConfig,
      instagramHandle: handle.trim(),
      pageAccessToken: token.trim(),
      connected: true,
      status: 'active',
    });
  };

  const handleRunRawWebhook = () => {
    try {
      const parsed = JSON.parse(rawPayload);
      const commentChange = parsed?.entry?.[0]?.changes?.[0]?.value;
      const commentText = commentChange?.text || 'LINK';
      const username = commentChange?.from?.username || 'meta_webhook_user';

      // Match against rules
      const matched = rules.find((r) =>
        r.triggerKeywords.some((kw) =>
          commentText.toLowerCase().includes(kw.toLowerCase())
        )
      );

      const newEvt: CommentEvent = {
        id: `wh-${Date.now()}`,
        timestamp: 'Just now',
        reelId: 'reel-101',
        reelTitle: 'Instagram Reel via Meta Webhook',
        username,
        userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        commentText,
        matchedRuleId: matched?.id || null,
        matchedRuleName: matched?.name || null,
        matchedKeyword: matched ? matched.triggerKeywords[0] : null,
        dmStatus: matched ? 'delivered' : 'ignored',
        dmContent: matched
          ? matched.dmMessage.replace(/@{username}/g, `@${username}`)
          : null,
        linkUrl: matched ? matched.linkUrl : null,
        buttonLabel: matched ? matched.buttonLabel : undefined,
        publicReplyText: matched ? matched.publicReplyVariants[0].replace(/@{username}/g, `@${username}`) : null,
        latencyMs: 142,
      };

      onDispatchSimulatedWebhook(newEvt);
      setTestResult(
        matched
          ? `✅ 200 OK: Rule "${matched.name}" matched! Sent DM to @${username} with link ${matched.linkUrl}`
          : `⚠️ 200 OK: Comment processed, but no keyword matched. No DM sent.`
      );
    } catch {
      setTestResult('❌ Error: Invalid JSON in raw webhook payload.');
    }
  };

  const sampleServerCode = `// Express.js Meta Webhook & Instagram Graph API Endpoint
import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// 1. Meta Webhook Verification Challenge (GET)
app.get('/api/webhook/instagram', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// 2. Incoming Comment Webhook Handler (POST)
app.post('/api/webhook/instagram', async (req, res) => {
  const body = req.body;
  if (body.object === 'instagram') {
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.field === 'comments') {
          const { id: commentId, text, from } = change.value;
          const username = from.username;

          // Check keyword
          if (/\\b(LINK|ಲಿಂಕ್|INFO)\\b/i.test(text)) {
            // A. Send Direct Message (DM) with Link
            await axios.post(
              'https://graph.facebook.com/v19.0/me/messages',
              {
                recipient: { id: from.id },
                message: {
                  attachment: {
                    type: 'template',
                    payload: {
                      template_type: 'button',
                      text: \`Hey @\${username}! Here is your link:\`,
                      buttons: [
                        {
                          type: 'web_url',
                          url: 'https://yourwebsite.com/guide',
                          title: '🔗 Get Link'
                        }
                      ]
                    }
                  }
                }
              },
              { headers: { Authorization: \`Bearer \${PAGE_ACCESS_TOKEN}\` } }
            );

            // B. Post Public Reply on Reel Comment
            await axios.post(
              \`https://graph.facebook.com/v19.0/\${commentId}/replies\`,
              { message: \`Check your DM @\${username}! Link sent 📩\` },
              { headers: { Authorization: \`Bearer \${PAGE_ACCESS_TOKEN}\` } }
            );
          }
        }
      }
    }
    return res.status(200).send('EVENT_RECEIVED');
  }
  return res.sendStatus(404);
});`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-[#121622] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{t.metaTitle}</h2>
              <p className="text-xs text-slate-400">{t.metaSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-white/10 bg-black/20 text-xs">
          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'instructions'
                ? 'border-rose-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'kn' ? 'ಸೆಟಪ್ ಮಾರ್ಗದರ್ಶಿ (Guide)' : 'Setup Guide'}
          </button>
          <button
            onClick={() => setActiveTab('raw_test')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'raw_test'
                ? 'border-rose-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'kn' ? 'Raw Webhook ಟೆಸ್ಟರ್' : 'Webhook JSON Tester'}
          </button>
          <button
            onClick={() => setActiveTab('code_snippet')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'code_snippet'
                ? 'border-rose-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'kn' ? 'Backend Node.js ಕೋಡ್' : 'Backend Code Snippet'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {activeTab === 'instructions' && (
            <div className="space-y-5 text-xs">
              {/* Account credentials */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <span className="font-semibold text-white block">
                  {lang === 'kn' ? 'ನಿಮ್ಮ Instagram ಖಾತೆ ವಿವರಗಳು' : 'Connected Instagram Account Details'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Instagram Handle (@)
                    </label>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/10 text-white font-mono text-xs focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Meta Page Access Token
                    </label>
                    <input
                      type="password"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/10 text-white font-mono text-xs focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveConfig}
                    className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs"
                  >
                    {lang === 'kn' ? 'ಉಳಿಸಿ & ಅಪ್‌ಡೇಟ್ ಮಾಡಿ' : 'Save Credentials'}
                  </button>
                </div>
              </div>

              {/* Step 1 */}
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">{t.step1Title}</h4>
                <p className="text-slate-400 leading-relaxed">{t.step1Desc}</p>
                <a
                  href="https://developers.facebook.com/apps/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-rose-400 hover:underline pt-1"
                >
                  <span>Meta Developers Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Step 2: Webhook Credentials */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">{t.step2Title}</h4>
                <p className="text-slate-400">{t.step2Desc}</p>

                <div className="space-y-2 pt-1">
                  <div>
                    <div className="text-[11px] text-slate-400 mb-1">{t.webhookUrlLabel}</div>
                    <div className="flex items-center gap-2 p-2 bg-black/60 rounded-lg border border-white/10 font-mono text-rose-300 break-all">
                      <span className="flex-1 text-[11px]">{metaConfig.webhookCallbackUrl}</span>
                      <button
                        onClick={() => handleCopy(metaConfig.webhookCallbackUrl, 'url')}
                        className="px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-white shrink-0 text-[11px] flex items-center gap-1"
                      >
                        {copiedField === 'url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'url' ? t.copiedBtn : t.copyBtn}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400 mb-1">{t.verifyTokenLabel}</div>
                    <div className="flex items-center gap-2 p-2 bg-black/60 rounded-lg border border-white/10 font-mono text-amber-300">
                      <span className="flex-1 text-[11px]">{metaConfig.webhookVerifyToken}</span>
                      <button
                        onClick={() => handleCopy(metaConfig.webhookVerifyToken, 'token')}
                        className="px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-white shrink-0 text-[11px] flex items-center gap-1"
                      >
                        {copiedField === 'token' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'token' ? t.copiedBtn : t.copyBtn}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Required Permissions */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">{t.step3Title}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-emerald-300">instagram_manage_comments</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-emerald-300">instagram_manage_messages</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-emerald-300">pages_show_list</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-emerald-300">pages_read_engagement</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'raw_test' && (
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-semibold text-white block mb-1">{t.testWebhookJsonTitle}</span>
                <p className="text-slate-400 mb-2">
                  {lang === 'kn'
                    ? 'Instagram ಸರ್ವರ್‌ಗಳು ಕಳುಹಿಸುವ ನೈಜ Webhook JSON ಪೇಲೋಡ್ ಅನ್ನು ಕೆಳಗೆ ಎಡಿಟ್ ಮಾಡಿ ಟೆಸ್ಟ್ ಮಾಡಬಹುದು:'
                    : 'Simulate an incoming HTTP POST event directly from Meta Webhook servers:'}
                </p>
                <textarea
                  rows={10}
                  value={rawPayload}
                  onChange={(e) => setRawPayload(e.target.value)}
                  className="w-full p-3 rounded-lg bg-black border border-white/10 font-mono text-[11px] text-emerald-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                onClick={handleRunRawWebhook}
                className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.sendTestPayloadBtn}</span>
              </button>

              {testResult && (
                <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-white">
                  {testResult}
                </div>
              )}
            </div>
          )}

          {activeTab === 'code_snippet' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Production Express.js Webhook Server</span>
                <button
                  onClick={() => handleCopy(sampleServerCode, 'code')}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-white text-[11px] flex items-center gap-1 font-semibold"
                >
                  {copiedField === 'code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'code' ? t.copiedBtn : t.copyBtn}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-black border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-96">
                {sampleServerCode}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
