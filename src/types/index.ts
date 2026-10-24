export type MatchMode = 'contains' | 'exact' | 'regex';
export type ReelScope = 'all' | 'specific';
export type DMStatus = 'delivered' | 'ignored' | 'rate_limited' | 'failed';

export interface AutomationRule {
  id: string;
  name: string;
  nameKn?: string;
  reelScope: ReelScope;
  targetReelIds: string[];
  triggerKeywords: string[];
  matchMode: MatchMode;
  caseSensitive: boolean;
  dmMessage: string;
  linkUrl: string;
  buttonLabel: string;
  linkTitle: string;
  linkDescription: string;
  sendPublicReply: boolean;
  publicReplyVariants: string[];
  cooldownHours: number;
  delaySeconds: number;
  enabled: boolean;
  createdAt: string;
  triggeredCount: number;
  dmDeliveredCount: number;
  clicksCount: number;
}

export interface ReelItem {
  id: string;
  title: string;
  caption: string;
  thumbnailUrl: string;
  permalink: string;
  postedAt: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
}

export interface CommentEvent {
  id: string;
  timestamp: string;
  reelId: string;
  reelTitle: string;
  username: string;
  userAvatar: string;
  commentText: string;
  matchedRuleId: string | null;
  matchedRuleName: string | null;
  matchedKeyword: string | null;
  dmStatus: DMStatus;
  dmContent: string | null;
  linkUrl: string | null;
  buttonLabel?: string;
  publicReplyText: string | null;
  latencyMs: number;
}

export interface MetaAccountConfig {
  connected: boolean;
  instagramHandle: string;
  instagramName: string;
  instagramUserId: string;
  facebookPageId: string;
  metaAppId: string;
  pageAccessToken: string;
  webhookVerifyToken: string;
  webhookCallbackUrl: string;
  status: 'active' | 'paused' | 'disconnected';
  isLiveWebhookMode: boolean;
}

export interface ReelUrlTabCampaign {
  id: string;
  tabTitle: string;
  reelUrl: string;
  thumbnailUrl: string;
  reelTitle: string;
  reelCaption: string;
  triggerKeywords: string[];
  dmResponseText: string;
  targetLinkUrl: string;
  buttonLabel: string;
  autoPublicReply: boolean;
  publicReplyText: string;
  enabled: boolean;
  dmsSentCount: number;
}

export type Language = 'kn' | 'en';
