import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Heart, 
  Bookmark, 
  Share2, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Check, 
  Copy, 
  MessageSquare, 
  Send, 
  Flame, 
  Search, 
  FileText,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Article, Comment, GroundingSource, FactCheckResult, ThemeMode } from '../types';
import { geminiService } from '../services/geminiService';

interface ArticleReaderProps {
  article: Article;
  onBack: () => void;
  onSelectRelated: (article: Article) => void;
  relatedArticles: Article[];
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
  onOpenWhatsAppShare: (article: Article) => void;
  theme?: ThemeMode;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  article,
  onBack,
  onSelectRelated,
  relatedArticles,
  isBookmarked,
  onToggleBookmark,
  onOpenWhatsAppShare,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [likes, setLikes] = useState(article.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showSeoModal, setShowSeoModal] = useState(false);
  const [showFlashSummary, setShowFlashSummary] = useState(true);
  const [comments, setComments] = useState<Comment[]>(article.comments || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentName, setNewCommentName] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Live Google Search Grounding & Fact Check
  const [isVerifying, setIsVerifying] = useState(false);
  const [liveVerification, setLiveVerification] = useState<FactCheckResult | null>(null);
  const [dynamicSources, setDynamicSources] = useState<GroundingSource[]>(article.groundingSources || []);
  const [dynamicQueries, setDynamicQueries] = useState<string[]>(article.searchQueries || []);
  const [showFactCheckPanel, setShowFactCheckPanel] = useState(false);

  // Auto-sync when article changes
  useEffect(() => {
    setDynamicSources(article.groundingSources || []);
    setDynamicQueries(article.searchQueries || []);
    setLiveVerification(null);
    setShowFactCheckPanel(false);
  }, [article.id]);

  const handleLiveFactCheck = async () => {
    setIsVerifying(true);
    setShowFactCheckPanel(true);
    try {
      const result = await geminiService.factCheckArticle(article.title, article.content);
      setLiveVerification(result);
      if (result.sources && result.sources.length > 0) {
        setDynamicSources(prev => {
          const existing = new Set(prev.map(s => s.uri));
          const toAdd = result.sources.filter(s => !existing.has(s.uri));
          return [...prev, ...toAdd];
        });
      }
      if (result.searchQueries && result.searchQueries.length > 0) {
        setDynamicQueries(prev => Array.from(new Set([...prev, ...result.searchQueries])));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  // Reading progress scroll tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup Web Speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. Summary: ${article.inshortsSummary || article.excerpt}. Published in ${article.category}.`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      articleId: article.id,
      userName: newCommentName.trim() || 'Reader ' + Math.floor(Math.random() * 900 + 100),
      userAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
      content: newCommentText.trim(),
      createdAt: 'Just now',
      likes: 0,
      replies: [],
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
    setNewCommentName('');
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;

    const updated = comments.map(c => {
      if (c.id === parentId) {
        const replyItem: Comment = {
          id: `r-${Date.now()}`,
          articleId: article.id,
          userName: 'Reader',
          userAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
          content: replyText.trim(),
          createdAt: 'Just now',
          likes: 0
        };
        return {
          ...c,
          replies: [...(c.replies || []), replyItem]
        };
      }
      return c;
    });

    setComments(updated);
    setReplyingToId(null);
    setReplyText('');
  };

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#FAFAFA] text-zinc-900'}`}>
      {/* Top reading progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#F27D26] via-white to-[#00FF41] z-50 transition-all duration-100"
        style={{ width: `${readingProgress}%` }}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation & Controls header */}
        <div className={`flex items-center justify-between mb-8 pb-4 border-b ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
          <button
            onClick={onBack}
            className={`flex items-center gap-2 font-mono font-bold text-xs px-4 py-2 rounded-full transition cursor-pointer uppercase tracking-wider border ${
              isDark 
                ? 'text-white hover:text-[#00FF41] bg-[#111111] hover:bg-[#1a1a1a] border-white/10' 
                : 'text-zinc-900 hover:text-emerald-700 bg-white hover:bg-zinc-100 border-zinc-300 shadow-2xs'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All News</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSeoModal(true)}
              className={`flex items-center gap-1.5 border text-xs font-mono font-bold px-3 py-2 rounded-full transition cursor-pointer uppercase ${
                isDark 
                  ? 'bg-[#00FF41]/10 border-[#00FF41]/30 text-[#00FF41] hover:bg-[#00FF41]/20' 
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
              }`}
              title="Google News & SEO Inspector"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>SEO: {article.seo?.seoScore || 95}%</span>
            </button>

            <button
              onClick={toggleSpeech}
              className={`px-3 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer border ${
                isPlayingAudio 
                  ? 'bg-[#F27D26] border-[#F27D26] text-white animate-pulse' 
                  : (isDark ? 'bg-[#111111] border-white/10 hover:bg-[#1a1a1a] text-white' : 'bg-white border-zinc-300 hover:bg-zinc-100 text-zinc-900 shadow-2xs')
              }`}
              title={isPlayingAudio ? 'Stop reading' : 'Listen with Audio Reader'}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Stop Audio' : 'Listen'}</span>
            </button>

            <button
              onClick={() => onOpenWhatsAppShare(article)}
              className={`p-2.5 rounded-full transition cursor-pointer border ${
                isDark 
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20' 
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
              }`}
              title="Share on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2.5 rounded-full transition cursor-pointer border ${
                isBookmarked 
                  ? 'bg-[#F27D26]/20 border-[#F27D26]/40 text-[#F27D26]' 
                  : (isDark ? 'bg-[#111111] border-white/10 hover:bg-[#1a1a1a] text-white' : 'bg-white border-zinc-300 hover:bg-zinc-100 text-zinc-800 shadow-2xs')
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark story'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#F27D26]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category & Tags Header */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {article.isBreaking && (
            <span className="flex items-center gap-1 bg-[#F27D26] text-white font-black text-xs uppercase px-3 py-1 rounded-full animate-pulse shadow-lg tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              Breaking News
            </span>
          )}
          <span className={`font-black text-xs uppercase px-3 py-1 rounded-full shadow-md tracking-wider ${
            isDark ? 'bg-white text-black' : 'bg-black text-white'
          }`}>
            {article.category}
          </span>
          {article.subCategory && (
            <span className={`border font-mono font-bold text-xs px-3 py-1 rounded-full ${
              isDark ? 'bg-[#111111] border-white/10 text-white/70' : 'bg-white border-zinc-300 text-zinc-700'
            }`}>
              {article.subCategory}
            </span>
          )}
          <span className={`text-xs ${isDark ? 'text-white/30' : 'text-zinc-300'}`}>•</span>
          <span className={`text-xs font-mono flex items-center gap-1 uppercase ${
            isDark ? 'text-[#00FF41]' : 'text-emerald-700 font-bold'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            {article.readTimeMinutes} min read
          </span>
        </div>

        {/* Main Headline */}
        <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[1.05] mb-6 ${
          isDark ? 'text-white' : 'text-zinc-950'
        }`}>
          {article.title}
        </h1>

        {/* Excerpt / Sub-headline */}
        <p className={`text-lg sm:text-2xl leading-relaxed mb-8 font-normal ${
          isDark ? 'text-white/70' : 'text-zinc-700'
        }`}>
          {article.excerpt}
        </p>

        {/* Author Bio Bar */}
        <div className={`flex items-center justify-between py-4 border-y mb-8 px-6 rounded-2xl ${
          isDark ? 'border-white/10 bg-[#0D0D0D]' : 'border-zinc-200 bg-white shadow-2xs'
        }`}>
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className={`w-12 h-12 rounded-full object-cover border-2 ${
                isDark ? 'border-white/20' : 'border-zinc-300'
              }`}
            />
            <div>
              <div className={`font-black text-sm uppercase tracking-tight ${
                isDark ? 'text-white' : 'text-zinc-950'
              }`}>{article.author.name}</div>
              <div className={`text-xs font-mono uppercase ${
                isDark ? 'text-white/40' : 'text-zinc-500'
              }`}>{article.author.role} • {formattedDate}</div>
            </div>
          </div>

          <div className={`flex items-center gap-4 text-xs font-mono ${
            isDark ? 'text-white/60' : 'text-zinc-600'
          }`}>
            <span className="flex items-center gap-1.5">
              <Eye className={`w-4 h-4 ${isDark ? 'text-[#00FF41]' : 'text-emerald-600'}`} />
              {article.views.toLocaleString()} VIEWS
            </span>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition cursor-pointer font-bold ${
                isLiked 
                  ? 'bg-[#F27D26]/20 border-[#F27D26] text-[#F27D26]' 
                  : (isDark ? 'bg-[#111111] border-white/10 hover:border-white/30 text-white' : 'bg-zinc-100 border-zinc-300 hover:border-zinc-400 text-zinc-800')
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#F27D26]' : ''}`} />
              <span>{likes}</span>
            </button>
          </div>
        </div>

        {/* Hero Featured Image */}
        <div className={`rounded-3xl overflow-hidden mb-8 bg-black border shadow-2xl ${
          isDark ? 'border-white/15' : 'border-zinc-200'
        }`}>
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full max-h-[520px] object-cover"
          />
          {article.imageCaption && (
            <div className={`p-3.5 border-t text-xs font-mono ${
              isDark ? 'bg-[#0D0D0D] border-white/10 text-white/50' : 'bg-white border-zinc-200 text-zinc-600'
            }`}>
              PHOTO CAPTION: {article.imageCaption}
            </div>
          )}
        </div>

        {/* AI Inshorts 60-Second Flash Synopsis Card */}
        {article.inshortsSummary && (
          <div className={`border rounded-3xl p-6 mb-10 shadow-2xl relative overflow-hidden ${
            isDark ? 'bg-[#0D0D0D] border-white/15 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-md'
          }`}>
            <div className={`flex items-center justify-between mb-3 pb-3 border-b ${
              isDark ? 'border-white/10' : 'border-zinc-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-[#F27D26] text-white rounded-full font-black">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className={`font-black text-sm uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-zinc-950'
                }`}>
                  Inshorts 60-Second Flash Brief
                </span>
              </div>
              <button
                onClick={() => setShowFlashSummary(!showFlashSummary)}
                className={`text-xs font-mono hover:underline uppercase cursor-pointer ${
                  isDark ? 'text-[#00FF41]' : 'text-emerald-700 font-bold'
                }`}
              >
                {showFlashSummary ? '[Collapse]' : '[Expand]'}
              </button>
            </div>
            {showFlashSummary && (
              <p className={`text-base sm:text-lg leading-relaxed font-normal p-4 rounded-2xl border ${
                isDark 
                  ? 'text-white/80 bg-black/60 border-white/10' 
                  : 'text-zinc-800 bg-zinc-50 border-zinc-200'
              }`}>
                {article.inshortsSummary}
              </p>
            )}
          </div>
        )}

        {/* Article Body Content */}
        <div className={`prose max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-h2:text-3xl prose-h3:text-2xl prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed mb-10 ${
          isDark 
            ? 'prose-invert prose-p:text-white/80 prose-blockquote:border-l-[#00FF41] prose-blockquote:bg-[#0D0D0D] prose-blockquote:text-white' 
            : 'text-zinc-900 prose-p:text-zinc-800 prose-blockquote:border-l-emerald-600 prose-blockquote:bg-white prose-blockquote:text-zinc-900 shadow-2xs'
        }`}>
          {article.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={index} className={`text-2xl sm:text-3xl font-black uppercase tracking-tight mt-10 mb-4 ${isDark ? 'text-white' : 'text-zinc-950'}`}>{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={index} className={`text-xl sm:text-2xl font-black uppercase tracking-tight mt-8 mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>{paragraph.replace('### ', '')}</h3>;
            }
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote key={index} className={`border-l-4 p-5 rounded-r-2xl my-6 text-lg font-medium ${
                  isDark ? 'border-[#00FF41] bg-[#0D0D0D] text-white' : 'border-emerald-600 bg-zinc-50 text-zinc-950 shadow-2xs'
                }`}>
                  {paragraph.replace('> ', '')}
                </blockquote>
              );
            }
            if (paragraph.startsWith('```')) {
              return (
                <pre key={index} className={`p-5 rounded-2xl text-xs font-mono overflow-x-auto my-6 border ${
                  isDark ? 'bg-black text-[#00FF41] border-white/10' : 'bg-zinc-950 text-emerald-400 border-zinc-800'
                }`}>
                  {paragraph.replace(/```[a-z]*/g, '')}
                </pre>
              );
            }
            return <p key={index} className={`text-base sm:text-lg leading-relaxed mb-6 ${isDark ? 'text-white/80' : 'text-zinc-800'}`}>{paragraph}</p>;
          })}
        </div>

        {/* Google Search Grounding & Real-Time Fact-Check Unit */}
        <div className={`border rounded-3xl p-6 mb-10 shadow-2xl relative overflow-hidden font-mono ${
          isDark 
            ? 'bg-[#0D0D0D] border-[#4285F4]/30 text-white' 
            : 'bg-white border-[#4285F4]/40 text-zinc-900 shadow-md'
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b ${
            isDark ? 'border-white/10' : 'border-zinc-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl border shrink-0 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-200'
              }`}>
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#4285F4] uppercase">
                  <span>// GOOGLE SEARCH GROUNDING &amp; CITATION ENGINE</span>
                  <span className={isDark ? 'text-white/30' : 'text-zinc-300'}>•</span>
                  <span className={isDark ? 'text-[#00FF41]' : 'text-emerald-700'}>gemini-3.5-flash</span>
                </div>
                <h3 className={`text-base font-black uppercase tracking-tight font-sans ${
                  isDark ? 'text-white' : 'text-zinc-950'
                }`}>
                  Real-Time Corroboration &amp; Attributed Web Sources
                </h3>
              </div>
            </div>

            <button
              onClick={handleLiveFactCheck}
              disabled={isVerifying}
              className="bg-[#4285F4] hover:bg-[#3367d6] text-white text-xs font-bold font-mono uppercase px-4 py-2.5 rounded-full flex items-center gap-2 transition cursor-pointer self-start sm:self-auto shrink-0 shadow-lg"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Verifying with Google...' : 'Fact-Check This Article'}</span>
            </button>
          </div>

          {/* Live Fact Check Report Panel */}
          {liveVerification && (
            <div className={`border rounded-2xl p-4 mb-4 space-y-3 ${
              isDark 
                ? 'bg-black border-[#00FF41]/40 text-white' 
                : 'bg-emerald-50/50 border-emerald-300 text-zinc-900'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-4 h-4 ${isDark ? 'text-[#00FF41]' : 'text-emerald-700'}`} />
                  <span className={`text-xs font-bold uppercase ${isDark ? 'text-white' : 'text-zinc-950'}`}>Live Verification Verdict</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                    isDark 
                      ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30' 
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {liveVerification.verdict}
                  </span>
                  <span className={`text-[10px] ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>
                    Confidence: <strong className={isDark ? 'text-white' : 'text-zinc-950'}>{liveVerification.confidence}%</strong>
                  </span>
                </div>
              </div>

              <div className={`text-xs font-sans leading-relaxed border-t pt-3 space-y-2 ${
                isDark ? 'text-white/80 border-white/10' : 'text-zinc-800 border-zinc-200'
              }`}>
                {liveVerification.analysis.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          )}

          {/* Executed Search Queries */}
          {dynamicQueries.length > 0 && (
            <div className="mb-4">
              <div className={`text-[10px] uppercase font-bold mb-1.5 ${isDark ? 'text-white/40' : 'text-zinc-500'}`}>// EXECUTED GOOGLE SEARCH QUERIES:</div>
              <div className="flex flex-wrap gap-1.5">
                {dynamicQueries.map((q, idx) => (
                  <span key={idx} className={`border text-[11px] px-2.5 py-1 rounded-full ${
                    isDark ? 'bg-white/5 border-white/10 text-white/80' : 'bg-zinc-100 border-zinc-300 text-zinc-800 font-medium'
                  }`}>
                    "{q}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Attributed Sources Grid */}
          {dynamicSources.length > 0 ? (
            <div>
              <div className={`text-[10px] uppercase font-bold mb-2 ${isDark ? 'text-white/40' : 'text-zinc-500'}`}>// ATTRIBUTED WEB CITATIONS ({dynamicSources.length}):</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dynamicSources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-3 rounded-2xl border group transition ${
                      isDark 
                        ? 'bg-black border-white/10 hover:border-[#4285F4]/60' 
                        : 'bg-zinc-50 border-zinc-200 hover:border-[#4285F4] hover:bg-white shadow-2xs'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className={`text-xs font-bold group-hover:text-[#4285F4] truncate font-sans ${
                        isDark ? 'text-white' : 'text-zinc-900'
                      }`}>
                        {source.title || 'Source Reference'}
                      </div>
                      <div className={`text-[10px] truncate mt-0.5 ${isDark ? 'text-white/40' : 'text-zinc-500'}`}>
                        {source.uri.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                      </div>
                    </div>
                    <ExternalLink className={`w-3.5 h-3.5 group-hover:text-[#4285F4] shrink-0 ${
                      isDark ? 'text-white/30' : 'text-zinc-400'
                    }`} />
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
              isDark ? 'bg-black border-white/5 text-white/50' : 'bg-zinc-100 border-zinc-200 text-zinc-600'
            }`}>
              <span>This article has not had external sources attached yet. Click "Fact-Check This Article" to fetch live citations.</span>
            </div>
          )}
        </div>

        {/* In-Article AdSense Banner Simulation */}
        <div className={`my-10 p-4 border border-dashed rounded-3xl text-center ${
          isDark ? 'bg-[#0D0D0D] border-white/20' : 'bg-white border-zinc-300'
        }`}>
          <div className={`text-[10px] uppercase font-mono font-bold tracking-[0.2em] mb-2 ${
            isDark ? 'text-[#00FF41]' : 'text-emerald-700'
          }`}>// SPONSORED PARTNER AD UNIT</div>
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDark ? 'bg-black border-white/10' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <div className="text-left">
              <div className={`text-sm font-black uppercase ${isDark ? 'text-white' : 'text-zinc-950'}`}>Google Cloud Enterprise AI Platform</div>
              <div className={`text-xs font-mono ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>Scale foundation models with ultra-low latency &amp; zero infra complexity.</div>
            </div>
            <a 
              href="https://cloud.google.com" 
              target="_blank" 
              rel="noreferrer"
              className={`text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full transition shrink-0 ${
                isDark 
                  ? 'bg-white hover:bg-[#F27D26] text-black hover:text-white' 
                  : 'bg-black hover:bg-[#F27D26] text-white'
              }`}
            >
              Explore Free Tier
            </a>
          </div>
        </div>

        {/* Article Tags */}
        <div className={`flex flex-wrap items-center gap-2 py-4 border-t mb-8 ${
          isDark ? 'border-white/10' : 'border-zinc-200'
        }`}>
          <span className={`text-xs font-mono font-bold uppercase mr-2 ${
            isDark ? 'text-white/40' : 'text-zinc-400'
          }`}>// TAGS:</span>
          {article.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`text-xs font-mono px-3.5 py-1.5 rounded-full transition cursor-pointer border ${
                isDark 
                  ? 'bg-[#111111] hover:bg-[#1a1a1a] text-white/80 border-white/10' 
                  : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300 shadow-2xs'
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Social Share & Action Bar */}
        <div className={`p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 shadow-2xl border ${
          isDark ? 'bg-[#0D0D0D] border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-950 shadow-md'
        }`}>
          <div>
            <h4 className="font-black text-2xl uppercase tracking-tight mb-1">Found this report insightful?</h4>
            <p className={`text-xs font-mono ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>SHARE INSTANTLY WITH PEERS ACROSS WHATSAPP, LINKEDIN, AND TWITTER</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenWhatsAppShare(article)}
              className="bg-[#00FF41] hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-wider px-5 py-3 rounded-full flex items-center gap-2 transition cursor-pointer shadow-lg"
            >
              <Share2 className="w-4 h-4 text-black" />
              <span>Share on WhatsApp</span>
            </button>
            <button
              onClick={handleCopyLink}
              className={`text-xs font-mono font-bold px-4 py-3 rounded-full flex items-center gap-2 transition cursor-pointer border ${
                isDark 
                  ? 'bg-white/10 hover:bg-white hover:text-black text-white border-white/20' 
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-300'
              }`}
            >
              {copiedLink ? <Check className={`w-4 h-4 ${isDark ? 'text-[#00FF41]' : 'text-emerald-600'}`} /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <section className="mb-14">
          <div className={`flex items-center justify-between mb-6 pb-3 border-b ${
            isDark ? 'border-white/10' : 'border-zinc-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-[#F27D26]" />
              <h3 className={`text-2xl font-black uppercase tracking-tight ${
                isDark ? 'text-white' : 'text-zinc-950'
              }`}>
                DISCUSSION [{comments.length}]
              </h3>
            </div>
            <span className={`text-xs font-mono uppercase ${
              isDark ? 'text-[#00FF41]' : 'text-emerald-700 font-bold'
            }`}>// MODERATED WITH AI CIVILITY GUARD</span>
          </div>

          {/* Post a Comment Form */}
          <form onSubmit={handleAddComment} className={`p-6 rounded-3xl border mb-8 ${
            isDark ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-zinc-200 shadow-md'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={newCommentName}
                onChange={(e) => setNewCommentName(e.target.value)}
                className={`border rounded-xl px-4 py-2.5 text-xs focus:outline-none ${
                  isDark 
                    ? 'bg-black border-white/10 text-white placeholder:text-white/30 focus:border-white' 
                    : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900'
                }`}
              />
            </div>
            <textarea
              rows={3}
              placeholder="Join the discussion with a thoughtful perspective..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className={`w-full border rounded-xl p-4 text-sm focus:outline-none mb-3 ${
                isDark 
                  ? 'bg-black border-white/10 text-white placeholder:text-white/30 focus:border-white' 
                  : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900'
              }`}
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className={`text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-full flex items-center gap-2 transition cursor-pointer shadow-lg ${
                  isDark ? 'bg-white hover:bg-[#F27D26] text-black hover:text-white' : 'bg-black hover:bg-[#F27D26] text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Comment</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className={`text-xs font-mono italic text-center py-6 ${
                isDark ? 'text-white/40' : 'text-zinc-500'
              }`}>No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className={`p-5 rounded-2xl border transition ${
                  isDark ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-zinc-200 shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className={`w-8 h-8 rounded-full object-cover border ${
                          isDark ? 'border-white/20' : 'border-zinc-300'
                        }`}
                      />
                      <span className={`font-black text-sm uppercase tracking-tight ${
                        isDark ? 'text-white' : 'text-zinc-950'
                      }`}>{comment.userName}</span>
                      <span className={`text-[11px] font-mono ${
                        isDark ? 'text-white/40' : 'text-zinc-400'
                      }`}>• {comment.createdAt}</span>
                    </div>
                  </div>
                  <p className={`text-sm mb-3 leading-relaxed ${
                    isDark ? 'text-white/80' : 'text-zinc-700'
                  }`}>
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <button
                      onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                      className={`hover:underline uppercase font-bold cursor-pointer ${
                        isDark ? 'text-[#00FF41]' : 'text-emerald-700'
                      }`}
                    >
                      [Reply]
                    </button>
                  </div>

                  {/* Inline Reply Form */}
                  {replyingToId === comment.id && (
                    <div className={`mt-4 pl-4 border-l-2 ${isDark ? 'border-white/20' : 'border-zinc-300'}`}>
                      <textarea
                        rows={2}
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className={`w-full border rounded-xl p-3 text-xs focus:outline-none mb-2 ${
                          isDark 
                            ? 'bg-black border-white/10 text-white focus:border-white' 
                            : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900'
                        }`}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setReplyingToId(null)}
                          className={`text-xs font-mono px-3 py-1.5 uppercase ${
                            isDark ? 'text-white/50 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          className={`text-xs font-black uppercase px-4 py-1.5 rounded-full ${
                            isDark ? 'bg-white text-black' : 'bg-black text-white'
                          }`}
                        >
                          Send Reply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className={`mt-3 pl-4 border-l-2 space-y-2 ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
                      {comment.replies.map(reply => (
                        <div key={reply.id} className={`p-3 rounded-xl border ${
                          isDark ? 'bg-black/60 border-white/5' : 'bg-zinc-50 border-zinc-200'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <img src={reply.userAvatar} alt={reply.userName} className="w-5 h-5 rounded-full" />
                            <span className={`font-black text-xs uppercase ${isDark ? 'text-white' : 'text-zinc-950'}`}>{reply.userName}</span>
                            <span className={`text-[10px] font-mono ${isDark ? 'text-white/40' : 'text-zinc-400'}`}>• {reply.createdAt}</span>
                          </div>
                          <p className={`text-xs ${isDark ? 'text-white/70' : 'text-zinc-700'}`}>{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className={`pt-10 border-t ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-black uppercase tracking-tight ${
                isDark ? 'text-white' : 'text-zinc-950'
              }`}>
                RELATED STORIES IN {article.category}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className={`group p-4 rounded-2xl border transition cursor-pointer flex gap-4 ${
                    isDark 
                      ? 'bg-[#0D0D0D] border-white/10 hover:border-white/30' 
                      : 'bg-white border-zinc-200 hover:border-zinc-400 shadow-2xs'
                  }`}
                >
                  <img
                    src={rel.featuredImage}
                    alt={rel.title}
                    className="w-24 h-24 rounded-xl object-cover shrink-0 opacity-85 group-hover:opacity-100"
                  />
                  <div className="flex flex-col justify-between">
                    <div className="text-[10px] font-mono font-bold uppercase text-[#F27D26]">{rel.category}</div>
                    <h4 className={`text-sm font-black uppercase tracking-tight line-clamp-2 leading-snug transition ${
                      isDark ? 'text-white group-hover:text-[#00FF41]' : 'text-zinc-900 group-hover:text-emerald-700'
                    }`}>
                      {rel.title}
                    </h4>
                    <div className={`text-[10px] font-mono ${isDark ? 'text-white/40' : 'text-zinc-400'}`}>{rel.readTimeMinutes} MIN READ</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* SEO & Google News Inspector Modal */}
      {showSeoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className={`rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border ${
            isDark ? 'bg-[#0D0D0D] border-white/20 text-white' : 'bg-white border-zinc-300 text-zinc-900'
          }`}>
            <div className={`flex items-center justify-between pb-4 mb-4 border-b ${
              isDark ? 'border-white/10' : 'border-zinc-200'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`p-2.5 rounded-2xl ${
                  isDark ? 'bg-[#00FF41]/20 text-[#00FF41]' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h3 className={`font-black uppercase tracking-tight text-base ${
                    isDark ? 'text-white' : 'text-zinc-950'
                  }`}>Google News SEO &amp; Schema Inspector</h3>
                  <p className={`text-xs font-mono uppercase ${
                    isDark ? 'text-white/50' : 'text-zinc-500'
                  }`}>// AUTOMATED SEARCH ENGINE READINESS SCORE</p>
                </div>
              </div>
              <button
                onClick={() => setShowSeoModal(false)}
                className={`text-xl font-bold p-1 cursor-pointer ${
                  isDark ? 'text-white/40 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'
                }`}
              >
                ✕
              </button>
            </div>

            {/* Google SERP Snippet Preview */}
            <div className={`p-5 rounded-2xl border mb-4 text-xs font-mono ${
              isDark ? 'bg-black border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
            }`}>
              <div className={`text-[10px] uppercase font-bold tracking-wider mb-2 ${
                isDark ? 'text-[#00FF41]' : 'text-emerald-700'
              }`}>
                // LIVE GOOGLE SEARCH &amp; DISCOVER SNIPPET
              </div>
              <div className={`text-xs truncate mb-1 ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>
                https://presscore.io/news/{article.slug}
              </div>
              <div className={`text-base font-bold hover:underline cursor-pointer leading-snug mb-1 font-sans ${
                isDark ? 'text-white' : 'text-zinc-950'
              }`}>
                {article.seo?.metaTitle || article.title}
              </div>
              <div className={`text-xs leading-relaxed font-sans ${isDark ? 'text-white/70' : 'text-zinc-600'}`}>
                {article.seo?.metaDescription || article.excerpt}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 font-mono">
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className={`text-[10px] font-bold uppercase ${isDark ? 'text-[#00FF41]' : 'text-emerald-700'}`}>SEO Readiness</div>
                <div className={`text-3xl font-black ${isDark ? 'text-[#00FF41]' : 'text-emerald-700'}`}>{article.seo?.seoScore || 95}%</div>
              </div>
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className={`text-[10px] font-bold uppercase ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>Schema Markup</div>
                <div className={`text-xs font-bold mt-1 ${isDark ? 'text-white' : 'text-zinc-950'}`}>schema.org/NewsArticle</div>
              </div>
              <div className={`p-4 rounded-2xl border col-span-2 sm:col-span-1 ${isDark ? 'bg-black border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="text-[10px] font-bold text-[#F27D26] uppercase">Focus Keywords</div>
                <div className={`text-xs font-bold mt-1 ${isDark ? 'text-white' : 'text-zinc-950'}`}>{article.seo?.focusKeywords?.join(', ') || 'AI, Technology'}</div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className={`text-xs font-mono font-bold uppercase tracking-wider mb-2 ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}>// AUDIT RECOMMENDATIONS</h4>
              <ul className={`space-y-2 text-xs ${isDark ? 'text-white/70' : 'text-zinc-700'}`}>
                <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4 text-[#00FF41] shrink-0" />
                  <span>Article headline conforms to Google News editorial guidelines.</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4 text-[#00FF41] shrink-0" />
                  <span>Meta description length (148 chars) is optimized for desktop and mobile SERPs.</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4 text-[#00FF41] shrink-0" />
                  <span>Author credentials, avatar, and publication timestamps verified.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setShowSeoModal(false)}
              className={`w-full font-black uppercase text-xs py-3 rounded-full transition cursor-pointer ${
                isDark ? 'bg-white hover:bg-[#F27D26] text-black hover:text-white' : 'bg-black hover:bg-[#F27D26] text-white'
              }`}
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
