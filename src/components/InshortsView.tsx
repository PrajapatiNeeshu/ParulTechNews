import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ChevronUp, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  Share2, 
  Bookmark, 
  ArrowUpRight, 
  Clock, 
  Sparkles,
  Flame,
  Filter
} from 'lucide-react';
import { Article, Category } from '../types';

interface InshortsViewProps {
  articles: Article[];
  categories: Category[];
  onSelectArticle: (article: Article) => void;
  onOpenWhatsAppShare: (article: Article) => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
}

export const InshortsView: React.FC<InshortsViewProps> = ({
  articles,
  categories,
  onSelectArticle,
  onOpenWhatsAppShare,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const filteredArticles = selectedCategory 
    ? articles.filter(a => a.category.toLowerCase() === selectedCategory.toLowerCase())
    : articles;

  const currentArticle = filteredArticles[currentIndex] || filteredArticles[0];

  // Stop TTS speech on unmount or slide change
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < filteredArticles.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlayingAudio(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsPlayingAudio(false);
    }
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window) || !currentArticle) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${currentArticle.title}. ${currentArticle.inshortsSummary || currentArticle.excerpt}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.05;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  if (!currentArticle) {
    return (
      <div className="max-w-md mx-auto py-16 text-center px-4">
        <p className="text-slate-500 text-sm">No stories available in this category.</p>
        <button
          onClick={() => setSelectedCategory(null)}
          className="mt-3 text-xs text-indigo-600 font-bold hover:underline"
        >
          View all stories
        </button>
      </div>
    );
  }

  const formattedDate = new Date(currentArticle.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Feed Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F27D26] text-white flex items-center justify-center shadow-lg font-black">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Inshorts 60s Flash Feed</h2>
            <p className="text-xs font-mono text-white/50 uppercase">// CONCISE, FACT-VERIFIED BRIEFS UNDER 60 WORDS</p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold text-[#00FF41] bg-[#111111] border border-white/10 px-3 py-1.5 rounded-full">
          STORY [{currentIndex + 1}/{filteredArticles.length}]
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 text-xs">
        <button
          onClick={() => { setSelectedCategory(null); setCurrentIndex(0); }}
          className={`px-4 py-1.5 rounded-full whitespace-nowrap font-black uppercase text-[11px] tracking-wider transition cursor-pointer shrink-0 ${
            selectedCategory === null ? 'bg-white text-black shadow-lg' : 'bg-[#111111] border border-white/10 text-white/60 hover:text-white'
          }`}
        >
          All ({articles.length})
        </button>
        {categories.slice(0, 8).map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.slug); setCurrentIndex(0); }}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap font-bold uppercase text-[11px] tracking-wider transition cursor-pointer shrink-0 border ${
              selectedCategory === cat.slug ? 'bg-white text-black border-white shadow-lg' : 'bg-[#111111] border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Inshorts Card */}
      <div className="bg-[#0D0D0D] rounded-3xl border border-white/15 shadow-2xl overflow-hidden relative flex flex-col transition-all duration-300">
        {/* Cover Photo */}
        <div className="relative aspect-[16/9] bg-black overflow-hidden">
          <img
            src={currentArticle.featuredImage}
            alt={currentArticle.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent" />

          <div className="absolute top-4 left-4 flex gap-2">
            {currentArticle.isBreaking && (
              <span className="bg-[#F27D26] text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg animate-pulse">
                Breaking
              </span>
            )}
            <span className="bg-white text-black font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
              {currentArticle.category}
            </span>
          </div>

          <div className="absolute bottom-3 left-5 right-5 text-white">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-snug">
              {currentArticle.title}
            </h3>
          </div>
        </div>

        {/* 60-Word Summary Body */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-white/40 mb-4 pb-3 border-b border-white/10">
              <span className="font-bold text-white uppercase">{currentArticle.author.name}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#00FF41]" />
                {formattedDate} • 60-WORD BRIEF
              </span>
            </div>

            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-6 font-normal">
              {currentArticle.inshortsSummary || currentArticle.excerpt}
            </p>
          </div>

          <div>
            {/* Card Action Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSpeech}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
                    isPlayingAudio ? 'bg-[#F27D26] text-white animate-pulse' : 'bg-[#1a1a1a] hover:bg-[#222222] text-white/80'
                  }`}
                  title={isPlayingAudio ? 'Stop Voice' : 'Listen with Audio Voice'}
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isPlayingAudio ? 'Stop' : 'Audio'}</span>
                </button>

                <button
                  onClick={() => onOpenWhatsAppShare(currentArticle)}
                  className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-full transition cursor-pointer"
                  title="Share to WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onToggleBookmark(currentArticle.id)}
                  className={`p-2.5 rounded-full transition cursor-pointer ${
                    isBookmarked(currentArticle.id) ? 'bg-[#F27D26]/20 text-[#F27D26]' : 'bg-[#1a1a1a] hover:bg-[#222222] text-white/60'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked(currentArticle.id) ? 'fill-[#F27D26]' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => onSelectArticle(currentArticle)}
                className="bg-white hover:bg-[#F27D26] text-black hover:text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-full flex items-center gap-1.5 transition cursor-pointer shadow-lg"
              >
                <span>Read Full Story</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition shadow-lg cursor-pointer ${
            currentIndex === 0
              ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
              : 'bg-[#111111] border border-white/20 text-white hover:bg-white hover:text-black'
          }`}
        >
          <ChevronUp className="w-4 h-4" />
          <span>Previous Story</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex >= filteredArticles.length - 1}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition shadow-lg cursor-pointer ${
            currentIndex >= filteredArticles.length - 1
              ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
              : 'bg-white text-black hover:bg-[#F27D26] hover:text-white'
          }`}
        >
          <span>Next Story</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
