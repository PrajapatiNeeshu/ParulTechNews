import React, { useState, useMemo } from 'react';
import { Search, X, Clock, ArrowUpRight, Flame, Sparkles, Filter } from 'lucide-react';
import { Article, Category } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  categories: Category[];
  onSelectArticle: (article: Article) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  categories,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const searchResults = useMemo(() => {
    return articles.filter(a => {
      const matchesCategory = selectedCategory === 'all' || a.category.toLowerCase() === selectedCategory.toLowerCase();
      if (!matchesCategory) return false;

      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.author.name.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    });
  }, [articles, query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-16 z-50 animate-in fade-in">
      <div className="bg-[#0D0D0D] rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-white/20 flex flex-col">
        {/* Search Input Bar */}
        <div className="p-5 border-b border-white/10 flex items-center gap-3 bg-black">
          <Search className="w-5 h-5 text-white/50 shrink-0" />
          <input
            type="text"
            placeholder="Search news, topics, authors, tags (#AI, #EV, #Jobs)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-sm focus:outline-none text-white placeholder-white/30 font-medium bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-white/40 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[10px] font-mono font-bold bg-white/10 hover:bg-white hover:text-black text-white px-3 py-1 rounded-full transition cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-4 py-2.5 border-b border-white/10 bg-[#080808] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-black uppercase text-[10px] tracking-wider transition shrink-0 cursor-pointer ${
              selectedCategory === 'all' ? 'bg-white text-black' : 'text-white/60 hover:text-white bg-[#111111] border border-white/10'
            }`}
          >
            All Categories
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-bold uppercase text-[10px] tracking-wider transition shrink-0 cursor-pointer border ${
                selectedCategory === c.slug ? 'bg-[#F27D26] text-white border-[#F27D26]' : 'text-white/60 hover:text-white bg-[#111111] border-white/10'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-white/5 font-sans">
          <div className="text-[10px] font-mono font-bold text-[#00FF41] uppercase tracking-wider mb-2">
            // {searchResults.length} {searchResults.length === 1 ? 'ARTICLE' : 'ARTICLES'} FOUND
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/40 text-sm font-mono">No articles match your search criteria.</p>
              <button
                onClick={() => { setQuery(''); setSelectedCategory('all'); }}
                className="text-xs text-[#00FF41] font-mono font-bold mt-2 hover:underline uppercase"
              >
                Reset search filters
              </button>
            </div>
          ) : (
            searchResults.map(article => (
              <div
                key={article.id}
                onClick={() => {
                  onSelectArticle(article);
                  onClose();
                }}
                className="py-3.5 flex items-center justify-between gap-4 group cursor-pointer hover:bg-white/5 px-3 rounded-2xl transition"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 opacity-80 group-hover:opacity-100"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#F27D26]">
                        {article.category}
                      </span>
                      <span className="text-[10px] text-white/30">•</span>
                      <span className="text-[10px] font-mono text-[#00FF41]">
                        {article.readTimeMinutes} MIN READ
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight text-white group-hover:text-[#00FF41] transition truncate">
                      {article.title}
                    </h4>
                    <p className="text-[11px] text-white/50 line-clamp-1">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#00FF41] group-hover:translate-x-0.5 transition shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
