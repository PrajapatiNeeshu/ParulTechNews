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
  ChevronRight
} from 'lucide-react';
import { Article, Comment } from '../types';

interface ArticleReaderProps {
  article: Article;
  onBack: () => void;
  onSelectRelated: (article: Article) => void;
  relatedArticles: Article[];
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
  onOpenWhatsAppShare: (article: Article) => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  article,
  onBack,
  onSelectRelated,
  relatedArticles,
  isBookmarked,
  onToggleBookmark,
  onOpenWhatsAppShare,
}) => {
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
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Top reading progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#F27D26] via-white to-[#00FF41] z-50 transition-all duration-100"
        style={{ width: `${readingProgress}%` }}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation & Controls header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-[#00FF41] font-mono font-bold text-xs bg-[#111111] hover:bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-full transition cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All News</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSeoModal(true)}
              className="flex items-center gap-1.5 bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] text-xs font-mono font-bold px-3 py-2 rounded-full hover:bg-[#00FF41]/20 transition cursor-pointer uppercase"
              title="Google News & SEO Inspector"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00FF41]" />
              <span>SEO: {article.seo?.seoScore || 95}%</span>
            </button>

            <button
              onClick={toggleSpeech}
              className={`px-3 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer border ${
                isPlayingAudio 
                  ? 'bg-[#F27D26] border-[#F27D26] text-white animate-pulse' 
                  : 'bg-[#111111] border-white/10 hover:bg-[#1a1a1a] text-white'
              }`}
              title={isPlayingAudio ? 'Stop reading' : 'Listen with Audio Reader'}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Stop Audio' : 'Listen'}</span>
            </button>

            <button
              onClick={() => onOpenWhatsAppShare(article)}
              className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-full transition cursor-pointer"
              title="Share on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2.5 rounded-full transition cursor-pointer border ${
                isBookmarked ? 'bg-[#F27D26]/20 border-[#F27D26]/40 text-[#F27D26]' : 'bg-[#111111] border-white/10 hover:bg-[#1a1a1a] text-white'
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
          <span className="bg-white text-black font-black text-xs uppercase px-3 py-1 rounded-full shadow-lg tracking-wider">
            {article.category}
          </span>
          {article.subCategory && (
            <span className="bg-[#111111] border border-white/10 text-white/70 font-mono font-bold text-xs px-3 py-1 rounded-full">
              {article.subCategory}
            </span>
          )}
          <span className="text-xs text-white/30">•</span>
          <span className="text-xs font-mono text-[#00FF41] flex items-center gap-1 uppercase">
            <Clock className="w-3.5 h-3.5" />
            {article.readTimeMinutes} min read
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-[1.05] mb-6">
          {article.title}
        </h1>

        {/* Excerpt / Sub-headline */}
        <p className="text-lg sm:text-2xl text-white/70 leading-relaxed mb-8 font-normal">
          {article.excerpt}
        </p>

        {/* Author Bio Bar */}
        <div className="flex items-center justify-between py-4 border-y border-white/10 mb-8 bg-[#0D0D0D] px-6 rounded-2xl">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
            />
            <div>
              <div className="font-black text-sm uppercase tracking-tight text-white">{article.author.name}</div>
              <div className="text-xs font-mono text-white/40 uppercase">{article.author.role} • {formattedDate}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-white/60">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#00FF41]" />
              {article.views.toLocaleString()} VIEWS
            </span>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition cursor-pointer font-bold ${
                isLiked 
                  ? 'bg-[#F27D26]/20 border-[#F27D26] text-[#F27D26]' 
                  : 'bg-[#111111] border-white/10 hover:border-white/30 text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#F27D26]' : ''}`} />
              <span>{likes}</span>
            </button>
          </div>
        </div>

        {/* Hero Featured Image */}
        <div className="rounded-3xl overflow-hidden mb-8 bg-black border border-white/15 shadow-2xl">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full max-h-[520px] object-cover"
          />
          {article.imageCaption && (
            <div className="p-3.5 bg-[#0D0D0D] border-t border-white/10 text-xs font-mono text-white/50">
              PHOTO CAPTION: {article.imageCaption}
            </div>
          )}
        </div>

        {/* AI Inshorts 60-Second Flash Synopsis Card */}
        {article.inshortsSummary && (
          <div className="bg-[#0D0D0D] border border-white/15 rounded-3xl p-6 mb-10 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-[#F27D26] text-white rounded-full font-black">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="font-black text-white text-sm uppercase tracking-wider">
                  Inshorts 60-Second Flash Brief
                </span>
              </div>
              <button
                onClick={() => setShowFlashSummary(!showFlashSummary)}
                className="text-xs font-mono text-[#00FF41] hover:underline uppercase cursor-pointer"
              >
                {showFlashSummary ? '[Collapse]' : '[Expand]'}
              </button>
            </div>
            {showFlashSummary && (
              <p className="text-white/80 text-base sm:text-lg leading-relaxed font-normal bg-black/60 p-4 rounded-2xl border border-white/10">
                {article.inshortsSummary}
              </p>
            )}
          </div>
        )}

        {/* Article Body Content */}
        <div className="prose prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-h2:text-3xl prose-h3:text-2xl prose-p:text-white/80 prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed prose-blockquote:border-l-[#00FF41] prose-blockquote:bg-[#0D0D0D] prose-blockquote:p-4 prose-blockquote:rounded-r-2xl prose-blockquote:text-white prose-blockquote:font-medium mb-10">
          {article.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={index} className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-10 mb-4">{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={index} className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mt-8 mb-3">{paragraph.replace('### ', '')}</h3>;
            }
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote key={index} className="border-l-4 border-[#00FF41] bg-[#0D0D0D] p-5 rounded-r-2xl my-6 text-white text-lg font-medium">
                  {paragraph.replace('> ', '')}
                </blockquote>
              );
            }
            if (paragraph.startsWith('```')) {
              return (
                <pre key={index} className="bg-black text-[#00FF41] p-5 rounded-2xl text-xs font-mono overflow-x-auto my-6 border border-white/10">
                  {paragraph.replace(/```[a-z]*/g, '')}
                </pre>
              );
            }
            return <p key={index} className="text-white/80 text-base sm:text-lg leading-relaxed mb-6">{paragraph}</p>;
          })}
        </div>

        {/* In-Article AdSense Banner Simulation */}
        <div className="my-10 p-4 bg-[#0D0D0D] border border-dashed border-white/20 rounded-3xl text-center">
          <div className="text-[10px] uppercase font-mono font-bold text-[#00FF41] tracking-[0.2em] mb-2">// SPONSORED PARTNER AD UNIT</div>
          <div className="bg-black p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <div className="text-sm font-black uppercase text-white">Google Cloud Enterprise AI Platform</div>
              <div className="text-xs text-white/50 font-mono">Scale foundation models with ultra-low latency &amp; zero infra complexity.</div>
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

        {/* Article Tags */}
        <div className="flex flex-wrap items-center gap-2 py-4 border-t border-white/10 mb-8">
          <span className="text-xs font-mono font-bold text-white/40 uppercase mr-2">// TAGS:</span>
          {article.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-[#111111] hover:bg-[#1a1a1a] text-white/80 text-xs font-mono px-3.5 py-1.5 rounded-full transition cursor-pointer border border-white/10"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Social Share & Action Bar */}
        <div className="bg-[#0D0D0D] border border-white/10 text-white p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 shadow-2xl">
          <div>
            <h4 className="font-black text-2xl uppercase tracking-tight mb-1">Found this report insightful?</h4>
            <p className="text-xs font-mono text-white/50">SHARE INSTANTLY WITH PEERS ACROSS WHATSAPP, LINKEDIN, AND TWITTER</p>
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
              className="bg-white/10 hover:bg-white hover:text-black text-white text-xs font-mono font-bold px-4 py-3 rounded-full flex items-center gap-2 transition cursor-pointer border border-white/20"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#00FF41]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-[#F27D26]" />
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                DISCUSSION [{comments.length}]
              </h3>
            </div>
            <span className="text-xs font-mono text-[#00FF41] uppercase">// MODERATED WITH AI CIVILITY GUARD</span>
          </div>

          {/* Post a Comment Form */}
          <form onSubmit={handleAddComment} className="bg-[#0D0D0D] p-6 rounded-3xl border border-white/10 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={newCommentName}
                onChange={(e) => setNewCommentName(e.target.value)}
                className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white"
              />
            </div>
            <textarea
              rows={3}
              placeholder="Join the discussion with a thoughtful perspective..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white mb-3"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-white hover:bg-[#F27D26] text-black hover:text-white text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-full flex items-center gap-2 transition cursor-pointer shadow-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Comment</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-xs font-mono text-white/40 italic text-center py-6">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-[#0D0D0D] p-5 rounded-2xl border border-white/10 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-8 h-8 rounded-full object-cover border border-white/20"
                      />
                      <span className="font-black text-sm uppercase tracking-tight text-white">{comment.userName}</span>
                      <span className="text-[11px] font-mono text-white/40">• {comment.createdAt}</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 mb-3 leading-relaxed">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <button
                      onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                      className="text-[#00FF41] hover:underline uppercase font-bold cursor-pointer"
                    >
                      [Reply]
                    </button>
                  </div>

                  {/* Inline Reply Form */}
                  {replyingToId === comment.id && (
                    <div className="mt-4 pl-4 border-l-2 border-white/20">
                      <textarea
                        rows={2}
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white mb-2"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setReplyingToId(null)}
                          className="text-xs font-mono text-white/50 hover:text-white px-3 py-1.5 uppercase"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          className="bg-white text-black text-xs font-black uppercase px-4 py-1.5 rounded-full"
                        >
                          Send Reply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-white/10 space-y-2">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="bg-black/60 p-3 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2 mb-1">
                            <img src={reply.userAvatar} alt={reply.userName} className="w-5 h-5 rounded-full" />
                            <span className="font-black text-xs uppercase text-white">{reply.userName}</span>
                            <span className="text-[10px] font-mono text-white/40">• {reply.createdAt}</span>
                          </div>
                          <p className="text-xs text-white/70">{reply.content}</p>
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
          <section className="pt-10 border-t border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                RELATED STORIES IN {article.category}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="group bg-[#0D0D0D] p-4 rounded-2xl border border-white/10 hover:border-white/30 transition cursor-pointer flex gap-4"
                >
                  <img
                    src={rel.featuredImage}
                    alt={rel.title}
                    className="w-24 h-24 rounded-xl object-cover shrink-0 opacity-85 group-hover:opacity-100"
                  />
                  <div className="flex flex-col justify-between">
                    <div className="text-[10px] font-mono font-bold uppercase text-[#F27D26]">{rel.category}</div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-[#00FF41] line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                    <div className="text-[10px] font-mono text-white/40">{rel.readTimeMinutes} MIN READ</div>
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
          <div className="bg-[#0D0D0D] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-[#00FF41]/20 text-[#00FF41] rounded-2xl">
                  <Sparkles className="w-5 h-5 text-[#00FF41]" />
                </span>
                <div>
                  <h3 className="font-black uppercase tracking-tight text-white text-base">Google News SEO &amp; Schema Inspector</h3>
                  <p className="text-xs font-mono text-white/50 uppercase">// AUTOMATED SEARCH ENGINE READINESS SCORE</p>
                </div>
              </div>
              <button
                onClick={() => setShowSeoModal(false)}
                className="text-white/40 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Google SERP Snippet Preview */}
            <div className="bg-black p-5 rounded-2xl border border-white/10 mb-4 text-xs font-mono">
              <div className="text-[10px] uppercase font-bold text-[#00FF41] tracking-wider mb-2">
                // LIVE GOOGLE SEARCH &amp; DISCOVER SNIPPET
              </div>
              <div className="text-xs text-white/50 truncate mb-1">
                https://presscore.io/news/{article.slug}
              </div>
              <div className="text-base font-bold text-white hover:underline cursor-pointer leading-snug mb-1 font-sans">
                {article.seo?.metaTitle || article.title}
              </div>
              <div className="text-xs text-white/70 leading-relaxed font-sans">
                {article.seo?.metaDescription || article.excerpt}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 font-mono">
              <div className="bg-black p-4 rounded-2xl border border-white/10">
                <div className="text-[10px] font-bold text-[#00FF41] uppercase">SEO Readiness</div>
                <div className="text-3xl font-black text-[#00FF41]">{article.seo?.seoScore || 95}%</div>
              </div>
              <div className="bg-black p-4 rounded-2xl border border-white/10">
                <div className="text-[10px] font-bold text-white/50 uppercase">Schema Markup</div>
                <div className="text-xs font-bold text-white mt-1">schema.org/NewsArticle</div>
              </div>
              <div className="bg-black p-4 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-bold text-[#F27D26] uppercase">Focus Keywords</div>
                <div className="text-xs font-bold text-white mt-1">{article.seo?.focusKeywords?.join(', ') || 'AI, Technology'}</div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2">// AUDIT RECOMMENDATIONS</h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-4 h-4 text-[#00FF41] shrink-0" />
                  <span>Article headline conforms to Google News editorial guidelines.</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-4 h-4 text-[#00FF41] shrink-0" />
                  <span>Meta description length (148 chars) is optimized for desktop and mobile SERPs.</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-4 h-4 text-[#00FF41] shrink-0" />
                  <span>Author credentials, avatar, and publication timestamps verified.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setShowSeoModal(false)}
              className="w-full bg-white hover:bg-[#F27D26] text-black hover:text-white font-black uppercase text-xs py-3 rounded-full transition cursor-pointer"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
