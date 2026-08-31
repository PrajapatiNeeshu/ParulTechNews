import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  Globe, 
  Image as ImageIcon, 
  Users, 
  DollarSign, 
  Send, 
  Settings, 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Flame, 
  ArrowUpRight,
  Shield,
  Layers,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { Article, Category, User, AdUnit, MediaItem, RoleType } from '../../types';
import { PostEditor } from './PostEditor';
import { SeoCenter } from './SeoCenter';
import { RbacManager } from './RbacManager';
import { MediaLibrary } from './MediaLibrary';
import { AdSenseManager } from './AdSenseManager';
import { NotificationDispatcher } from './NotificationDispatcher';
import { AiStudioLab } from './AiStudioLab';

interface AdminDashboardProps {
  articles: Article[];
  categories: Category[];
  users: User[];
  ads: AdUnit[];
  media: MediaItem[];
  currentUser: User;
  onUpdateArticle: (article: Article) => void;
  onCreateArticle: (articleData: Partial<Article>) => void;
  onDeleteArticle: (articleId: string) => void;
  onSwitchUser: (user: User) => void;
  onUpdateUserRole: (userId: string, newRole: RoleType) => void;
  onAddUser: (user: Partial<User>) => void;
  onUploadMedia: (media: Partial<MediaItem>) => void;
  onDeleteMedia: (id: string) => void;
  onToggleAdStatus: (adId: string) => void;
  onViewWebsite: () => void;
}

type AdminTab = 'overview' | 'posts' | 'editor' | 'ai_lab' | 'seo' | 'media' | 'rbac' | 'adsense' | 'broadcast' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  articles,
  categories,
  users,
  ads,
  media,
  currentUser,
  onUpdateArticle,
  onCreateArticle,
  onDeleteArticle,
  onSwitchUser,
  onUpdateUserRole,
  onAddUser,
  onUploadMedia,
  onDeleteMedia,
  onToggleAdStatus,
  onViewWebsite,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [postFilterStatus, setPostFilterStatus] = useState<string>('all');
  const [postFilterCategory, setPostFilterCategory] = useState<string>('all');
  const [postSearchQuery, setPostSearchQuery] = useState('');

  // Platform Settings State
  const [siteName, setSiteName] = useState('PressCore AI News');
  const [googleNewsPubId, setGoogleNewsPubId] = useState('PUB-9824-PRESSCORE');
  const [adsensePubId, setAdsensePubId] = useState('ca-pub-9842839218491823');
  const [analyticsId, setAnalyticsId] = useState('G-PRSSCR9201');
  const [cacheTtlSeconds, setCacheTtlSeconds] = useState(300);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Filtered posts for Post Manager
  const filteredPosts = articles.filter(a => {
    const matchesStatus = postFilterStatus === 'all' || a.status === postFilterStatus;
    const matchesCategory = postFilterCategory === 'all' || a.category.toLowerCase() === postFilterCategory.toLowerCase();
    const matchesQuery = !postSearchQuery || a.title.toLowerCase().includes(postSearchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesQuery;
  });

  // Calculate high-level stats
  const totalViews = articles.reduce((acc, a) => acc + a.views, 0);
  const totalLikes = articles.reduce((acc, a) => acc + a.likes, 0);
  const totalComments = articles.reduce((acc, a) => acc + (a.comments?.length || 0), 0);
  const totalAdRevenue = ads.reduce((acc, a) => acc + a.revenueUsd, 0);

  const handleStartCreatePost = () => {
    setEditingArticle(null);
    setActiveTab('editor');
  };

  const handleStartEditPost = (article: Article) => {
    setEditingArticle(article);
    setActiveTab('editor');
  };

  const handleSavePost = (articleData: Partial<Article>) => {
    if (editingArticle) {
      onUpdateArticle({
        ...editingArticle,
        ...articleData,
        updatedAt: new Date().toISOString(),
      } as Article);
    } else {
      onCreateArticle(articleData);
    }
    setActiveTab('posts');
  };

  const handleCreateFromAi = (articleData: Partial<Article>) => {
    onCreateArticle(articleData);
    setActiveTab('posts');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row font-sans">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0A0A0A] text-white/70 p-4 shrink-0 flex flex-col justify-between border-r border-white/10">
        <div>
          {/* Logo / Brand */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F27D26] text-white flex items-center justify-center font-black">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="font-black text-white text-sm tracking-tight">PRESSCORE</div>
                <div className="text-[9px] font-mono text-[#00FF41] uppercase tracking-wider">// ADMIN OS</div>
              </div>
            </div>

            <button
              onClick={onViewWebsite}
              className="text-xs bg-white/10 hover:bg-[#F27D26] text-white p-2 rounded-full transition cursor-pointer"
              title="Return to Public News Site"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Active User Mini Pill */}
          <div className="bg-[#141414] p-3 rounded-2xl border border-white/10 mb-4 flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-[#F27D26]"
            />
            <div className="min-w-0">
              <div className="font-bold text-xs text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] font-mono text-[#F27D26] uppercase font-bold tracking-wider">{currentUser.role.replace('_', ' ')}</div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'posts', label: 'All Posts Manager', icon: FileText, count: articles.length },
              { id: 'editor', label: 'Post Editor & AI Tools', icon: Edit3 },
              { id: 'ai_lab', label: 'Gemini AI Studio', icon: Sparkles, badge: 'Flash' },
              { id: 'seo', label: 'Google News & SEO', icon: Globe },
              { id: 'media', label: 'Media Library', icon: ImageIcon },
              { id: 'rbac', label: 'Users & RBAC Roles', icon: Users },
              { id: 'adsense', label: 'AdSense & Revenue', icon: DollarSign },
              { id: 'broadcast', label: 'WhatsApp Broadcast', icon: Send },
              { id: 'settings', label: 'Platform Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'editor' && !editingArticle) {
                      setEditingArticle(null);
                    }
                    setActiveTab(item.id as AdminTab);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-black uppercase text-[11px] tracking-wider'
                      : 'hover:bg-white/5 text-white/60 hover:text-white font-medium text-xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-black text-white' : 'bg-white/10 text-white/70'
                    }`}>
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className="text-[9px] font-mono bg-[#F27D26] text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Quick Action */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={handleStartCreatePost}
            className="w-full bg-[#F27D26] hover:bg-[#d96a1a] text-white font-black uppercase text-xs tracking-wider py-3 px-3 rounded-full flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
        {/* VIEW: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0D0D0D] p-5 rounded-3xl border border-white/10 shadow-lg">
                <div className="flex items-center justify-between text-white/50 mb-2 font-mono">
                  <span className="text-[10px] font-bold uppercase tracking-wider">// READERS &amp; VIEWS</span>
                  <Eye className="w-4 h-4 text-[#00FF41]" />
                </div>
                <div className="text-3xl font-black text-white">{totalViews.toLocaleString()}</div>
                <div className="text-[10px] font-mono text-[#00FF41] font-bold mt-1">↑ +28.4% THIS WEEK</div>
              </div>

              <div className="bg-[#0D0D0D] p-5 rounded-3xl border border-white/10 shadow-lg">
                <div className="flex items-center justify-between text-white/50 mb-2 font-mono">
                  <span className="text-[10px] font-bold uppercase tracking-wider">// PUBLISHED STORIES</span>
                  <FileText className="w-4 h-4 text-[#F27D26]" />
                </div>
                <div className="text-3xl font-black text-white">{articles.length}</div>
                <div className="text-[10px] font-mono text-white/40 mt-1">{categories.length} CATEGORIES ACTIVE</div>
              </div>

              <div className="bg-[#0D0D0D] p-5 rounded-3xl border border-white/10 shadow-lg">
                <div className="flex items-center justify-between text-white/50 mb-2 font-mono">
                  <span className="text-[10px] font-bold uppercase tracking-wider">// ADSENSE (30D)</span>
                  <DollarSign className="w-4 h-4 text-[#00FF41]" />
                </div>
                <div className="text-3xl font-black text-white">${totalAdRevenue.toFixed(2)}</div>
                <div className="text-[10px] font-mono text-[#00FF41] font-bold mt-1">eCPM $4.10 ESTIMATED</div>
              </div>

              <div className="bg-[#0D0D0D] p-5 rounded-3xl border border-white/10 shadow-lg">
                <div className="flex items-center justify-between text-white/50 mb-2 font-mono">
                  <span className="text-[10px] font-bold uppercase tracking-wider">// WHATSAPP REACH</span>
                  <Send className="w-4 h-4 text-[#F27D26]" />
                </div>
                <div className="text-3xl font-black text-white">14,280</div>
                <div className="text-[10px] font-mono text-[#00FF41] font-bold mt-1">98.2% DELIVERABILITY</div>
              </div>
            </div>

            {/* Quick Actions & Traffic Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#0D0D0D] p-6 rounded-3xl border border-white/10 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-base text-white uppercase tracking-tight">Real-Time Traffic &amp; Hourly Pulse</h3>
                  <span className="text-[10px] font-mono font-bold text-[#00FF41] bg-[#00FF41]/10 px-3 py-1 rounded-full border border-[#00FF41]/20">
                    ● LIVE 1,420 VIEWERS
                  </span>
                </div>

                {/* Simulated Chart Bars */}
                <div className="h-40 flex items-end gap-2 pt-6 pb-2 border-b border-white/10">
                  {[45, 60, 52, 78, 92, 110, 95, 140, 160, 190, 230, 280, 310, 290, 340, 420].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                      <div
                        className="w-full bg-[#F27D26] group-hover:bg-[#00FF41] rounded-t transition-all duration-300"
                        style={{ height: `${(val / 420) * 100}%` }}
                      />
                      <span className="text-[9px] text-white/40 font-mono hidden sm:inline">
                        {idx + 8}:00
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-white/50 pt-3 uppercase">
                  <span>Google Discover: 62%</span>
                  <span>Direct / WhatsApp: 24%</span>
                  <span>Google News RSS: 14%</span>
                </div>
              </div>

              {/* Quick AI Generator Launch Card */}
              <div className="bg-[#141414] text-white p-6 rounded-3xl border border-[#F27D26]/40 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#F27D26] text-xs font-mono font-bold uppercase mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini AI Editorial Lab</span>
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tight leading-tight mb-2">
                    Draft Instant Breaking Story
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed mb-4 font-sans">
                    Turn raw facts, wire alerts, or breaking headlines into an AP-style article with Inshorts brief.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('ai_lab')}
                  className="bg-[#F27D26] hover:bg-[#d96a1a] text-white font-black uppercase text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 transition cursor-pointer shadow-lg tracking-wider"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch AI Studio</span>
                </button>
              </div>
            </div>

            {/* Top Performing Articles Table */}
            <div className="bg-[#0D0D0D] rounded-3xl border border-white/10 shadow-lg overflow-hidden">
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-black text-sm text-white uppercase tracking-tight">Recent &amp; Trending Stories</h3>
                <button
                  onClick={() => setActiveTab('posts')}
                  className="text-xs font-mono font-bold text-[#00FF41] hover:underline uppercase"
                >
                  View All Posts →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black border-b border-white/10 text-white/50 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Article Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">SEO Score</th>
                      <th className="p-4">Views</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {articles.slice(0, 5).map((art) => (
                      <tr key={art.id} className="hover:bg-white/5">
                        <td className="p-4 font-bold text-white max-w-xs truncate uppercase tracking-tight">
                          {art.title}
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-mono font-bold text-[#F27D26] bg-[#F27D26]/10 px-2 py-0.5 rounded-full border border-[#F27D26]/20 uppercase">
                            {art.category}
                          </span>
                        </td>
                        <td className="p-4 text-white/60">{art.author.name}</td>
                        <td className="p-4">
                          <span className="text-[10px] font-mono font-bold text-[#00FF41] bg-[#00FF41]/10 px-2 py-0.5 rounded-full border border-[#00FF41]/20">
                            {art.seo?.seoScore || 95}%
                          </span>
                        </td>
                        <td className="p-4 font-mono text-white/80 font-bold">{art.views.toLocaleString()}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleStartEditPost(art)}
                            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
                            title="Edit Article"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteArticle(art.id)}
                            className="p-2 text-white/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: POSTS MANAGER */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D0D0D] p-6 rounded-3xl border border-white/10 shadow-lg">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white">Post &amp; Content Management</h2>
                <p className="text-xs text-white/50 mt-1 font-mono uppercase">
                  // Manage, filter, draft, and publish articles across all news categories.
                </p>
              </div>

              <button
                onClick={handleStartCreatePost}
                className="bg-[#F27D26] hover:bg-[#d96a1a] text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-full flex items-center gap-2 transition cursor-pointer shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Write New Post</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#0D0D0D] p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2 font-mono">
                <select
                  value={postFilterStatus}
                  onChange={(e) => setPostFilterStatus(e.target.value)}
                  className="bg-black border border-white/10 rounded-xl p-2.5 font-bold text-white text-xs"
                >
                  <option value="all">ALL STATUSES</option>
                  <option value="published">PUBLISHED</option>
                  <option value="draft">DRAFT</option>
                  <option value="scheduled">SCHEDULED</option>
                  <option value="in_review">IN REVIEW</option>
                </select>

                <select
                  value={postFilterCategory}
                  onChange={(e) => setPostFilterCategory(e.target.value)}
                  className="bg-black border border-white/10 rounded-xl p-2.5 font-bold text-white text-xs uppercase"
                >
                  <option value="all">ALL CATEGORIES</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-white/40" />
                <input
                  type="text"
                  placeholder="Filter by title..."
                  value={postSearchQuery}
                  onChange={(e) => setPostSearchQuery(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#F27D26] outline-none"
                />
              </div>
            </div>

            {/* Posts Table */}
            <div className="bg-[#0D0D0D] rounded-3xl border border-white/10 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black border-b border-white/10 text-white/50 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Headline &amp; Slug</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Views</th>
                      <th className="p-4">SEO</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {filteredPosts.map((art) => (
                      <tr key={art.id} className="hover:bg-white/5">
                        <td className="p-4">
                          <div className="font-black text-white text-sm max-w-sm line-clamp-1 uppercase tracking-tight">
                            {art.title}
                          </div>
                          <div className="text-white/40 text-[10px] font-mono truncate max-w-xs">
                            /{art.slug}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-mono font-bold text-[#F27D26] bg-[#F27D26]/10 px-2 py-0.5 rounded-full border border-[#F27D26]/20 uppercase">
                            {art.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                            art.status === 'published' ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20' : 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                          }`}>
                            {art.status}
                          </span>
                        </td>
                        <td className="p-4 text-white/60">{art.author.name}</td>
                        <td className="p-4 font-mono font-bold text-white/80">{art.views.toLocaleString()}</td>
                        <td className="p-4">
                          <span className="text-[10px] font-mono font-bold text-[#00FF41] bg-[#00FF41]/10 px-2 py-0.5 rounded-full border border-[#00FF41]/20">
                            {art.seo?.seoScore || 94}%
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleStartEditPost(art)}
                            className="bg-white/10 hover:bg-white hover:text-black text-white font-mono font-bold text-[10px] px-3 py-1.5 rounded-full transition uppercase cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteArticle(art.id)}
                            className="p-2 text-white/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: POST EDITOR */}
        {activeTab === 'editor' && (
          <PostEditor
            article={editingArticle}
            categories={categories}
            currentUser={currentUser}
            onSave={handleSavePost}
            onCancel={() => setActiveTab('posts')}
          />
        )}

        {/* VIEW: AI STUDIO LAB */}
        {activeTab === 'ai_lab' && (
          <AiStudioLab
            categories={categories}
            onCreateArticleFromAi={handleCreateFromAi}
          />
        )}

        {/* VIEW: SEO & GOOGLE NEWS CENTER */}
        {activeTab === 'seo' && (
          <SeoCenter
            articles={articles}
            categories={categories}
            onSelectArticleToEdit={handleStartEditPost}
          />
        )}

        {/* VIEW: MEDIA LIBRARY */}
        {activeTab === 'media' && (
          <MediaLibrary
            media={media}
            onUploadMedia={onUploadMedia}
            onDeleteMedia={onDeleteMedia}
          />
        )}

        {/* VIEW: USERS & RBAC */}
        {activeTab === 'rbac' && (
          <RbacManager
            users={users}
            currentUser={currentUser}
            onSwitchUser={onSwitchUser}
            onUpdateUserRole={onUpdateUserRole}
            onAddUser={onAddUser}
          />
        )}

        {/* VIEW: ADSENSE & MONETIZATION */}
        {activeTab === 'adsense' && (
          <AdSenseManager
            ads={ads}
            onToggleAdStatus={onToggleAdStatus}
          />
        )}

        {/* VIEW: WHATSAPP & BROADCAST */}
        {activeTab === 'broadcast' && (
          <NotificationDispatcher
            articles={articles}
          />
        )}

        {/* VIEW: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-[#0D0D0D] rounded-3xl border border-white/10 shadow-lg p-6 max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Platform Core Settings</h2>
              <p className="text-xs text-white/50 mt-1 font-mono uppercase">// Configure Google News identifiers, AdSense IDs, and Redis caching.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div>
                <label className="block font-mono font-bold text-white/70 uppercase mb-1.5">// SITE BRAND NAME</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl p-3 font-bold text-white focus:border-[#F27D26] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono font-bold text-white/70 uppercase mb-1.5">// GOOGLE NEWS PUBLICATION ID</label>
                  <input
                    type="text"
                    value={googleNewsPubId}
                    onChange={(e) => setGoogleNewsPubId(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-2xl p-3 font-mono text-white focus:border-[#F27D26] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono font-bold text-white/70 uppercase mb-1.5">// GOOGLE ADSENSE PUBLISHER ID</label>
                  <input
                    type="text"
                    value={adsensePubId}
                    onChange={(e) => setAdsensePubId(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-2xl p-3 font-mono text-white focus:border-[#F27D26] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono font-bold text-white/70 uppercase mb-1.5">// GOOGLE ANALYTICS 4 ID</label>
                  <input
                    type="text"
                    value={analyticsId}
                    onChange={(e) => setAnalyticsId(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-2xl p-3 font-mono text-white focus:border-[#F27D26] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono font-bold text-white/70 uppercase mb-1.5">// REDIS CDN CACHE TTL (SECONDS)</label>
                  <input
                    type="number"
                    value={cacheTtlSeconds}
                    onChange={(e) => setCacheTtlSeconds(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-2xl p-3 font-mono text-white focus:border-[#F27D26] outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-[#F27D26] hover:bg-[#d96a1a] text-white font-black uppercase tracking-wider text-xs px-6 py-3 rounded-full transition cursor-pointer shadow-lg"
                >
                  Save Platform Configuration
                </button>

                {settingsSaved && (
                  <span className="text-[#00FF41] font-mono font-bold text-xs flex items-center gap-1.5 uppercase">
                    <CheckCircle className="w-4 h-4" /> // Settings updated successfully!
                  </span>
                )}
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
