import React from 'react';
import { Sparkles, Flame, ChevronRight } from 'lucide-react';
import { Article } from '../types';

interface BreakingTickerProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ articles, onSelectArticle }) => {
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
    <div className="bg-[#0A0A0A] text-white text-xs py-2 px-4 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <div className="flex items-center gap-1.5 bg-[#F27D26] text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest text-[10px] shrink-0 animate-pulse">
            <Flame className="w-3 h-3" />
            <span>FLASH NEWS</span>
          </div>

          <button
            onClick={() => onSelectArticle(currentItem)}
            className="text-left font-bold text-white/90 hover:text-[#F27D26] transition truncate flex items-center gap-1.5 group cursor-pointer"
          >
            <span className="text-[#00FF41] font-mono text-[11px] font-bold shrink-0">[{currentItem.category}]</span>
            <span className="truncate tracking-tight">{currentItem.title}</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:translate-x-0.5 transition shrink-0" />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4 text-white/50 shrink-0 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-[#00FF41]">
            <Sparkles className="w-3 h-3 text-[#00FF41]" />
            AI VERIFIED
          </span>
          <div className="flex gap-1 items-center">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Jump to breaking headline ${idx + 1}`}
                className={`h-1 rounded-full transition-all ${
                  idx === currentIndex ? 'w-5 bg-[#F27D26]' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
