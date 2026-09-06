import React from 'react';
import { Sparkles, Flame, ChevronRight } from 'lucide-react';
import { Article, ThemeMode } from '../types';

interface BreakingTickerProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  theme?: ThemeMode;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ articles, onSelectArticle, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const breakingList = articles.filter(a => a.isBreaking || a.isTrending);
  const items = breakingList.length > 0 ? breakingList : articles.slice(0, 3);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [items.length]);

  const currentItem = items[currentIndex];

  if (!currentItem) return null;

  return (
    <div className={`text-xs py-2 px-4 border-b transition-colors duration-200 ${
      isDark ? 'bg-[#0A0A0A] text-white border-white/10' : 'bg-white text-zinc-900 border-zinc-200 shadow-2xs'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <div className="flex items-center gap-1.5 bg-[#F27D26] text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest text-[10px] shrink-0 animate-pulse">
            <Flame className="w-3 h-3" />
            <span>FLASH NEWS</span>
          </div>

          <button
            onClick={() => onSelectArticle(currentItem)}
            className={`text-left font-bold transition truncate flex items-center gap-1.5 group cursor-pointer ${
              isDark ? 'text-white/90 hover:text-[#F27D26]' : 'text-zinc-800 hover:text-[#F27D26]'
            }`}
          >
            <span className={`font-mono text-[11px] font-bold shrink-0 ${
              isDark ? 'text-[#00FF41]' : 'text-emerald-700'
            }`}>
              [{currentItem.category}]
            </span>
            <span className="truncate tracking-tight">{currentItem.title}</span>
            <ChevronRight className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition shrink-0 ${
              isDark ? 'text-white/40' : 'text-zinc-400'
            }`} />
          </button>
        </div>

        <div className={`hidden md:flex items-center gap-4 shrink-0 font-mono text-[11px] ${
          isDark ? 'text-white/50' : 'text-zinc-500'
        }`}>
          <span className={`flex items-center gap-1 ${isDark ? 'text-[#00FF41]' : 'text-emerald-700 font-bold'}`}>
            <Sparkles className={`w-3 h-3 ${isDark ? 'text-[#00FF41]' : 'text-emerald-600'}`} />
            AI VERIFIED
          </span>
          <div className="flex gap-1 items-center">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Jump to breaking headline ${idx + 1}`}
                className={`h-1 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'w-5 bg-[#F27D26]' 
                    : (isDark ? 'w-2 bg-white/20 hover:bg-white/40' : 'w-2 bg-zinc-300 hover:bg-zinc-400')
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
