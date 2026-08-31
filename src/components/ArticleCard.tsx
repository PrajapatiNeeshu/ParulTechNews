import React from 'react';
import { 
  Clock, 
  Eye, 
  Heart, 
  Bookmark, 
  Share2, 
  Sparkles, 
  Volume2, 
  ArrowUpRight,
  TrendingUp,
  Flame,
  Zap
} from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  variant?: 'lead' | 'trending' | 'standard' | 'compact';
  onSelect: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
  onOpenWhatsAppShare: (article: Article) => void;
  onPlayAudio?: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'standard',
  onSelect,
  isBookmarked,
  onToggleBookmark,
  onOpenWhatsAppShare,
  onPlayAudio,
}) => {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  // Variant: Lead Hero Feature Story
  if (variant === 'lead') {
    return (
      <article className="group relative bg-[#0D0D0D] rounded-3xl border border-white/10 hover:border-white/25 shadow-2xl transition-all duration-300 overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:w-7/12 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-black">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent lg:hidden" />
          
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {article.isBreaking && (
              <span className="flex items-center gap-1 bg-[#F27D26] text-white font-black text-xs uppercase px-3 py-1 rounded-full shadow-lg tracking-wider animate-pulse">
                <Flame className="w-3.5 h-3.5" />
                Breaking
              </span>
            )}
            <span className="bg-white text-black font-black uppercase tracking-wider text-xs px-3 py-1 rounded-full shadow-lg">
              {article.category}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white lg:hidden">
            <h2 
              onClick={() => onSelect(article)}
              className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-tight line-clamp-2 cursor-pointer hover:text-[#F27D26]"
            >
              {article.title}
            </h2>
          </div>
        </div>

        <div className="lg:w-5/12 p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <div className="hidden lg:flex items-center gap-2 mb-3">
              {article.isBreaking && (
                <span className="flex items-center gap-1 bg-[#F27D26] text-white font-black text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  <Flame className="w-3 h-3" />
                  Breaking
                </span>
              )}
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#00FF41]">
                [{article.category}]
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-white/50 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                {article.readTimeMinutes}M READ
              </span>
            </div>

            <h2
              onClick={() => onSelect(article)}
              className="hidden lg:block text-2xl xl:text-3xl font-black uppercase tracking-tighter text-white hover:text-[#F27D26] transition cursor-pointer leading-[1.1] mb-3"
            >
              {article.title}
            </h2>

            <p className="text-white/70 text-sm line-clamp-3 leading-relaxed mb-4">
              {article.excerpt}
            </p>

            {/* AI Inshorts Flash Pill */}
            {article.inshortsSummary && (
              <div className="bg-[#141414] border border-white/10 rounded-2xl p-3.5 mb-4 text-xs text-white/90">
                <div className="flex items-center gap-1.5 font-bold text-[#00FF41] mb-1 font-mono uppercase tracking-wider text-[10px]">
                  <Sparkles className="w-3.5 h-3.5 text-[#00FF41]" />
                  <span>AI 60-Second Synopsis</span>
                </div>
                <p className="line-clamp-2 text-white/80 italic font-serif text-[13px]">
                  "{article.inshortsSummary}"
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-tight">{article.author.name}</div>
                  <div className="text-[10px] text-white/40 font-mono">{formattedDate}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {onPlayAudio && (
                  <button
                    onClick={() => onPlayAudio(article)}
                    aria-label="Listen to audio summary"
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
                    title="Listen to audio summary"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onOpenWhatsAppShare(article)}
                  aria-label="Share on WhatsApp"
                  className="p-2 text-white/60 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition cursor-pointer"
                  title="Share to WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onToggleBookmark(article.id)}
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark story'}
                  className={`p-2 rounded-full transition cursor-pointer ${
                    isBookmarked ? 'text-[#F27D26] bg-[#F27D26]/10' : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark story'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#F27D26]' : ''}`} />
                </button>
                <button
                  onClick={() => onSelect(article)}
                  className="ml-1 bg-white hover:bg-[#F27D26] text-black hover:text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full flex items-center gap-1 transition cursor-pointer shadow-lg"
                >
                  <span>Read</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Variant: Trending List Card
  if (variant === 'trending') {
    return (
      <div className="group flex gap-3.5 p-3 bg-[#0D0D0D] rounded-2xl border border-white/10 hover:border-white/20 transition">
        <div className="w-24 h-24 sm:w-28 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-black relative">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold text-[#00FF41] uppercase tracking-wider">
                [{article.category}]
              </span>
              <span className="text-[10px] text-white/20">•</span>
              <span className="text-[10px] text-white/40 font-mono flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {article.readTimeMinutes}M
              </span>
            </div>
            <h3
              onClick={() => onSelect(article)}
              className="text-xs sm:text-sm font-bold text-white hover:text-[#F27D26] transition line-clamp-2 cursor-pointer leading-snug tracking-tight"
            >
              {article.title}
            </h3>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40 pt-1">
            <span className="truncate">{article.author.name}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-0.5 text-white/50">
                <Eye className="w-3 h-3" />
                {article.views.toLocaleString()}
              </span>
              <button
                onClick={() => onToggleBookmark(article.id)}
                className={`transition ${isBookmarked ? 'text-[#F27D26]' : 'text-white/40 hover:text-white'}`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#F27D26]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Variant: Standard Grid Card
  return (
    <article className="group bg-[#0D0D0D] rounded-2xl border border-white/10 hover:border-white/20 shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[16/10] overflow-hidden bg-black">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="bg-white text-black font-black uppercase text-[10px] tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
            {article.category}
          </span>
          {article.isTrending && (
            <span className="bg-[#F27D26] text-white font-black uppercase text-[10px] tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <TrendingUp className="w-3 h-3" />
              HOT
            </span>
          )}
        </div>

        {article.seo?.seoScore && (
          <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs border border-[#00FF41]/40 text-[#00FF41] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#00FF41]" />
            <span>SEO {article.seo.seoScore}%</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-white/40 mb-2">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTimeMinutes}M READ
            </span>
          </div>

          <h3
            onClick={() => onSelect(article)}
            className="text-base sm:text-lg font-bold uppercase tracking-tight text-white hover:text-[#F27D26] transition cursor-pointer line-clamp-2 leading-snug mb-2"
          >
            {article.title}
          </h3>

          <p className="text-white/60 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3">
            {article.excerpt}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-2">
            <div className="flex items-center gap-2">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-6 h-6 rounded-full object-cover border border-white/20"
              />
              <span className="text-xs font-medium text-white/80 truncate max-w-[100px] sm:max-w-[130px]">
                {article.author.name}
              </span>
            </div>

            <div className="flex items-center gap-1 text-white/40">
              <button
                onClick={() => onOpenWhatsAppShare(article)}
                className="p-1.5 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition cursor-pointer"
                title="Share on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onToggleBookmark(article.id)}
                className={`p-1.5 rounded-full transition cursor-pointer ${
                  isBookmarked ? 'text-[#F27D26] bg-[#F27D26]/10' : 'hover:text-white hover:bg-white/10'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark story'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#F27D26]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
