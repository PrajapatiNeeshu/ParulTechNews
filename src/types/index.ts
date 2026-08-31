export type RoleType = 'super_admin' | 'editor' | 'author' | 'contributor' | 'subscriber';

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  avatar: string;
  bio?: string;
  permissions: string[];
  createdAt: string;
  articlesCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  iconName: string;
  postCount: number;
  isFeatured?: boolean;
}

export interface SeoMetadata {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  focusKeywords: string[];
  googleNewsHeadline?: string;
  ogImage?: string;
  seoScore: number;
  readabilityScore?: number;
  schemaType: 'NewsArticle' | 'BlogPosting' | 'TechArticle';
  recommendations?: string[];
}

export interface Comment {
  id: string;
  articleId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  subCategory?: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    bio?: string;
  };
  featuredImage: string;
  imageCaption?: string;
  status: 'published' | 'draft' | 'scheduled' | 'in_review' | 'trash';
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  views: number;
  likes: number;
  shares?: number;
  sharesCount?: number;
  bookmarksCount?: number;
  seo: SeoMetadata;
  inshortsSummary: string; // 60-word concise bullet format
  isBreaking?: boolean;
  isTrending?: boolean;
  isEditorPick?: boolean;
  isSponsored?: boolean;
  comments: Comment[];
}

export interface AdUnit {
  id: string;
  name: string;
  placement: 'leaderboard' | 'responsive' | 'sidebar' | 'in_article' | 'footer';
  slotCode: string;
  dimensions: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  revenueUsd: number;
}

export interface AdSlot {
  id: string;
  name: string;
  type: 'leaderboard' | 'responsive' | 'sidebar' | 'in_article';
  enabled: boolean;
  cpm: number;
  impressions: number;
  clicks: number;
  revenue: number;
  advertiserName: string;
  bannerImage?: string;
  targetUrl?: string;
}

export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  readTimeAvgMinutes: number;
  sharesCount: number;
  aiTokensUsed: number;
  newsletterSubscribers: number;
  estimatedRevenue: number;
  dailyViews: { date: string; views: number; visitors: number }[];
  topCategories: { category: string; count: number; percentage: number }[];
  trafficSources: { source: string; percentage: number; color: string }[];
  deviceBreakdown: { device: string; percentage: number }[];
  realtimeActiveUsers: number;
}

export interface MediaItem {
  id: string;
  filename?: string;
  title?: string;
  url: string;
  folder?: string;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy?: string;
  altText: string;
  dimensions?: string;
}

export interface NotificationJob {
  id: string;
  type: 'whatsapp' | 'email' | 'telegram' | 'browser';
  title: string;
  message: string;
  target: string;
  status: 'sent' | 'queued' | 'failed';
  sentAt: string;
  recipientCount: number;
  openRate?: string;
}

export type ActiveTab = 'portal' | 'inshorts' | 'admin' | 'ai-lab';

export type AdminSubView = 
  | 'dashboard'
  | 'posts'
  | 'editor'
  | 'ai-studio'
  | 'seo'
  | 'categories'
  | 'media'
  | 'users'
  | 'ads'
  | 'notifications'
  | 'settings';
