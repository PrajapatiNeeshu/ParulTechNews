import React, { useState, useEffect } from 'react';
import { 
  Article, 
  Category, 
  User, 
  AdUnit, 
  MediaItem, 
  RoleType 
} from './types';
import { 
  MOCK_CATEGORIES, 
  MOCK_ARTICLES, 
  MOCK_USERS, 
  MOCK_ADS, 
  MOCK_MEDIA 
} from '../../src/data/mockData';
import { Header } from '../../src/components/Header';
import { BreakingTicker } from '../../src/components/BreakingTicker';
import { ArticleCard } from '../../src/components/ArticleCard';
import { ArticleReader } from '../../src/components/ArticleReader';
import { InshortsView } from '../../src/components/InshortsView';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { SearchModal } from '../../src/components/SearchModal';
import { BookmarksDrawer } from '../../src/components/BookmarksDrawer';
import { Footer } from '../../src/components/Footer';
import { AdminDashboard } from '../../src/components/admin/AdminDashboard';
import { 
  TrendingUp, 
  Sparkles, 
  Flame, 
  Zap, 
  ChevronRight, 
  Globe, 
  ArrowUpRight,
  Filter,
  CheckCircle
} from 'lucide-react';

export default function App() {
  // App Core State
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('presscore_articles');
    return saved ? JSON.parse(saved) : MOCK_ARTICLES;
  });

  const [categories] = useState<Category[]>(MOCK_CATEGORIES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [ads, setAds] = useState<AdUnit[]>(MOCK_ADS);
  const [media, setMedia] = useState<MediaItem[]>(MOCK_MEDIA);

  // Active session user (for testing RBAC switching)
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);

  // Routing / View State: 'website' | 'inshorts' | 'admin'
  const [currentView, setCurrentView] = useState<'website' | 'inshorts' | 'admin'>('website');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [whatsAppArticle, setWhatsAppArticle] = useState<Article | null>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  // Bookmarks state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('presscore_bookmarks');
    return saved ? JSON.parse(saved) : ['art-1', 'art-3'];
  });

  // Save articles and bookmarks to local storage
  useEffect(() => {
    localStorage.setItem('presscore_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('presscore_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleOpenWhatsAppShare = (article: Article) => {
    setWhatsAppArticle(article);
    setIsWhatsAppModalOpen(true);
  };

  const handleSelectArticle = (article: Article) => {
    // Increment view count
    setArticles(prev =>
      prev.map(a => (a.id === article.id ? { ...a, views: a.views + 1 } : a))
    );
    setReadingArticle({ ...article, views: article.views + 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // RBAC User Actions
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
  };

  const handleUpdateUserRole = (userId: string, newRole: RoleType) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
    }
  };

  const handleAddUser = (newUserData: Partial<User>) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: newUserData.name || 'New Staff',
      email: newUserData.email || 'staff@presscore.io',
      role: newUserData.role || 'author',
      avatar: newUserData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: newUserData.bio || 'Editorial Contributor',
      permissions: newUserData.permissions || ['Create Posts', 'Edit Own Posts'],
      articlesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers([newUser, ...users]);
  };

  // Article CRUD Actions
  const handleCreateArticle = (articleData: Partial<Article>) => {
    const newArt: Article = {
      id: `art-${Date.now()}`,
      title: articleData.title || 'Untitled Article',
      slug: articleData.slug || `article-${Date.now()}`,
      excerpt: articleData.excerpt || '',
      content: articleData.content || '',
      category: articleData.category || 'Technology',
      subCategory: articleData.subCategory,
      tags: articleData.tags || ['News'],
      featuredImage: articleData.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      inshortsSummary: articleData.inshortsSummary || articleData.excerpt || '',
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: currentUser.role,
      },
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTimeMinutes: articleData.readTimeMinutes || 3,
      views: 1,
      likes: 0,
      sharesCount: 0,
      status: articleData.status || 'published',
      isBreaking: !!articleData.isBreaking,
      isTrending: !!articleData.isTrending,
      isEditorPick: !!articleData.isEditorPick,
      seo: articleData.seo || {
        metaTitle: articleData.title || '',
        metaDescription: articleData.excerpt || '',
        focusKeywords: articleData.tags || ['news'],
        googleNewsHeadline: articleData.title || '',
        seoScore: 95,
        schemaType: 'NewsArticle',
      },
      comments: [],
    };
    setArticles([newArt, ...articles]);
  };

  const handleUpdateArticle = (updatedArticle: Article) => {
    setArticles(prev =>
      prev.map(a => (a.id === updatedArticle.id ? updatedArticle : a))
    );
    if (readingArticle?.id === updatedArticle.id) {
      setReadingArticle(updatedArticle);
    }
  };

  const handleDeleteArticle = (articleId: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setArticles(prev => prev.filter(a => a.id !== articleId));
      if (readingArticle?.id === articleId) {
        setReadingArticle(null);
      }
    }
  };

  // Media Actions
  const handleUploadMedia = (item: Partial<MediaItem>) => {
    const newItem: MediaItem = {
      id: `med-${Date.now()}`,
      title: item.title || 'Asset',
      url: item.url || '',
      altText: item.altText || item.title || '',
      dimensions: item.dimensions || '1200x800',
      sizeBytes: item.sizeBytes || 240000,
      mimeType: item.mimeType || 'image/jpeg',
      folder: item.folder || 'Editorial',
      uploadedBy: currentUser.name,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setMedia([newItem, ...media]);
  };

  const handleDeleteMedia = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id));
  };

  // AdSense status toggle
  const handleToggleAdStatus = (adId: string) => {
    setAds(prev =>
      prev.map(ad => (ad.id === adId ? { ...ad, isActive: !ad.isActive } : ad))
    );
  };

  // Filtered public articles
  const publishedArticles = articles.filter(a => a.status === 'published');
  const filteredArticles = selectedCategorySlug
    ? publishedArticles.filter(
        a => a.category.toLowerCase() === selectedCategorySlug.toLowerCase()
      )
    : publishedArticles;

  const leadHeroArticle = filteredArticles[0] || publishedArticles[0];
  const trendingArticles = publishedArticles.filter(a => a.isTrending).slice(0, 5);
  const gridArticles = filteredArticles.filter(a => a.id !== leadHeroArticle?.id);
  const bookmarkedArticlesList = articles.filter(a => bookmarkedIds.includes(a.id));

  // Switch to Admin View
  if (currentView === 'admin') {
    return (
      <AdminDashboard
        articles={articles}
        categories={categories}
        users={users}
        ads={ads}
        media={media}
        currentUser={currentUser}
        onUpdateArticle={handleUpdateArticle}
        onCreateArticle={handleCreateArticle}
        onDeleteArticle={handleDeleteArticle}
        onSwitchUser={handleSwitchUser}
        onUpdateUserRole={handleUpdateUserRole}
        onAddUser={handleAddUser}
        onUploadMedia={handleUploadMedia}
        onDeleteMedia={handleDeleteMedia}
        onToggleAdStatus={handleToggleAdStatus}
        onViewWebsite={() => setCurrentView('website')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col justify-between selection:bg-[#F27D26] selection:text-white">
      {/* 1. Top Real-Time Breaking News Ticker */}
      <BreakingTicker
        articles={articles}
        onSelectArticle={handleSelectArticle}
      />

      {/* 2. Global Header Navigation */}
      <Header
        categories={categories}
        selectedCategory={selectedCategorySlug}
        onSelectCategory={(slug) => {
          setSelectedCategorySlug(slug);
          setReadingArticle(null);
          if (currentView !== 'website') setCurrentView('website');
        }}
        activeTab={currentView === 'website' ? 'portal' : currentView === 'inshorts' ? 'inshorts' : 'admin'}
        onTabChange={(tab) => {
          if (tab === 'portal') setCurrentView('website');
          else if (tab === 'inshorts') setCurrentView('inshorts');
          else if (tab === 'ai-lab' || tab === 'admin') setCurrentView('admin');
          setReadingArticle(null);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenWhatsAppModal={() => {
          setWhatsAppArticle(publishedArticles[0]);
          setIsWhatsAppModalOpen(true);
        }}
        bookmarksCount={bookmarkedIds.length}
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
      />

      {/* 3. Main View Area */}
      <div className="flex-1">
        {/* VIEW A: Single Article Reader View */}
        {readingArticle ? (
          <ArticleReader
            article={readingArticle}
            onBack={() => setReadingArticle(null)}
            onSelectRelated={handleSelectArticle}
            relatedArticles={publishedArticles
              .filter(a => a.id !== readingArticle.id && a.category === readingArticle.category)
              .slice(0, 4)}
            isBookmarked={bookmarkedIds.includes(readingArticle.id)}
            onToggleBookmark={handleToggleBookmark}
            onOpenWhatsAppShare={handleOpenWhatsAppShare}
          />
        ) : currentView === 'inshorts' ? (
          /* VIEW B: Inshorts 60-Second Flash Card Feed */
          <InshortsView
            articles={publishedArticles}
            categories={categories}
            onSelectArticle={handleSelectArticle}
            onOpenWhatsAppShare={handleOpenWhatsAppShare}
            isBookmarked={(id) => bookmarkedIds.includes(id)}
            onToggleBookmark={handleToggleBookmark}
          />
        ) : (
          /* VIEW C: Default News Website Homepage */
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* Top Billboard AdSense Placement */}
            <div className="bg-[#0D0D0D] border border-white/10 rounded-3xl p-3 text-center">
              <div className="text-[10px] uppercase font-mono font-bold text-[#00FF41] tracking-[0.2em] mb-1.5">
                // SPONSORED BILLBOARD • LEADERBOARD 728X90
              </div>
              <div className="bg-black text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
                <div className="flex items-center gap-3 text-left">
                  <span className="px-2.5 py-1 bg-[#F27D26] text-white rounded-full font-black text-xs uppercase tracking-wider">
                    CLOUD ENGINE
                  </span>
                  <div>
                    <div className="text-sm font-black uppercase tracking-tight text-white">Google Cloud Vertex AI Enterprise Suite</div>
                    <div className="text-xs text-white/60 font-mono">Deploy high-performance multimodal models with zero latency overhead.</div>
                  </div>
                </div>
                <a
                  href="https://cloud.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white hover:bg-[#F27D26] text-black hover:text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full transition shrink-0"
                >
                  Explore Free Tier
                </a>
              </div>
            </div>

            {/* Category Title Heading (if filtered) */}
            {selectedCategorySlug && (
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#F27D26]"></span>
                  <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                    {selectedCategorySlug.replace('-', ' ')} STORIES
                  </h1>
                </div>
                <button
                  onClick={() => setSelectedCategorySlug(null)}
                  className="text-xs font-mono font-bold text-[#00FF41] uppercase tracking-wider hover:underline"
                >
                  Clear filter // View all
                </button>
              </div>
            )}

            {/* Lead Hero + Trending Stories Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Lead Hero Story (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                {leadHeroArticle ? (
                  <ArticleCard
                    article={leadHeroArticle}
                    variant="lead"
                    onSelect={handleSelectArticle}
                    isBookmarked={bookmarkedIds.includes(leadHeroArticle.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenWhatsAppShare={handleOpenWhatsAppShare}
                  />
                ) : (
                  <div className="p-12 text-center text-white/40 bg-[#0D0D0D] rounded-3xl border border-white/10 font-mono">
                    No stories found in this category.
                  </div>
                )}
              </div>

              {/* Right: Trending Now Sidebar (4 Cols) */}
              <aside className="lg:col-span-4 space-y-6">
                <div className="bg-[#0D0D0D] p-6 rounded-3xl border border-white/10 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                    <div className="flex items-center gap-2 text-[#F27D26] font-black text-xs uppercase tracking-widest">
                      <Flame className="w-4 h-4" />
                      <span>TRENDING NOW</span>
                    </div>
                    <span className="text-[10px] text-white/40 font-mono uppercase">REAL-TIME VIEWS</span>
                  </div>

                  <div className="space-y-3">
                    {trendingArticles.map((art) => (
                      <ArticleCard
                        key={art.id}
                        article={art}
                        variant="trending"
                        onSelect={handleSelectArticle}
                        isBookmarked={bookmarkedIds.includes(art.id)}
                        onToggleBookmark={handleToggleBookmark}
                        onOpenWhatsAppShare={handleOpenWhatsAppShare}
                      />
                    ))}
                  </div>
                </div>

                {/* Inshorts 60s Fast Pitch Box */}
                <div className="bg-[#F27D26] text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/90 mb-2">
                    <Zap className="w-4 h-4" />
                    <span>INSHORTS FAST MODE</span>
                  </div>
                  <h3 className="font-black text-2xl uppercase tracking-tight leading-tight mb-2">
                    CATCH UP ON 10 STORIES IN 3 MINUTES
                  </h3>
                  <p className="text-xs text-white/90 leading-relaxed mb-5 font-medium">
                    Experience bite-sized 60-word briefs with neural voice playback and 1-click WhatsApp digests.
                  </p>
                  <button
                    onClick={() => setCurrentView('inshorts')}
                    className="w-full bg-black text-white hover:bg-white hover:text-black text-xs font-black uppercase tracking-wider py-3 rounded-full transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>Launch 60s Flash Feed</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </aside>
            </section>

            {/* Latest Editorial Feed Grid */}
            <section className="space-y-6 pt-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00FF41] animate-pulse"></span>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                    LATEST EDITORIAL STORIES &amp; REPORTS
                  </h2>
                </div>
                <div className="text-xs font-mono text-white/40 uppercase">
                  [{gridArticles.length} STORIES PUBLISHED]
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridArticles.map((art) => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    variant="standard"
                    onSelect={handleSelectArticle}
                    isBookmarked={bookmarkedIds.includes(art.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenWhatsAppShare={handleOpenWhatsAppShare}
                  />
                ))}
              </div>
            </section>
          </main>
        )}
      </div>

      {/* 4. Global Footer */}
      <Footer
        categories={categories}
        onSelectCategory={(slug) => {
          setSelectedCategorySlug(slug);
          setReadingArticle(null);
          setCurrentView('website');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenWhatsAppModal={() => {
          setWhatsAppArticle(publishedArticles[0]);
          setIsWhatsAppModalOpen(true);
        }}
      />

      {/* 5. Modals and Overlays */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={publishedArticles}
        categories={categories}
        onSelectArticle={handleSelectArticle}
      />

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedArticles={bookmarkedArticlesList}
        onSelectArticle={handleSelectArticle}
        onRemoveBookmark={handleToggleBookmark}
      />

      <WhatsAppShareModal
        article={whatsAppArticle}
        onClose={() => {
          setIsWhatsAppModalOpen(false);
          setWhatsAppArticle(null);
        }}
      />
    </div>
  );
}
