import React from 'react';
import { Bookmark, X, ArrowUpRight, Trash2 } from 'lucide-react';
import { Article, ThemeMode } from '../types';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (articleId: string) => void;
  theme?: ThemeMode;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedArticles,
  onSelectArticle,
  onRemoveBookmark,
  theme = 'dark',
}) => {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-end z-50 animate-in fade-in">
      <div className={`w-full max-w-md h-full shadow-2xl flex flex-col p-6 border-l animate-in slide-in-from-right duration-300 ${
        isDark ? 'bg-[#0D0D0D] text-white border-white/10' : 'bg-white text-zinc-900 border-zinc-200'
      }`}>
        <div className={`flex items-center justify-between pb-4 border-b ${
          isDark ? 'border-white/10' : 'border-zinc-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-[#F27D26] fill-[#F27D26]" />
            <h3 className={`font-black text-base uppercase tracking-tight ${
              isDark ? 'text-white' : 'text-zinc-950'
            }`}>Saved Reading List [{bookmarkedArticles.length}]</h3>
          </div>
          <button
            onClick={onClose}
            className={`text-xl font-bold p-1 cursor-pointer ${
              isDark ? 'text-white/40 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'
            }`}
          >
            ✕
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto py-4 divide-y font-sans ${
          isDark ? 'divide-white/5' : 'divide-zinc-200'
        }`}>
          {bookmarkedArticles.length === 0 ? (
            <div className={`text-center py-20 text-xs font-mono ${
              isDark ? 'text-white/40' : 'text-zinc-500'
            }`}>
              <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="uppercase">// NO STORIES SAVED YET</p>
              <p className={`mt-1 text-[11px] ${isDark ? 'text-white/30' : 'text-zinc-400'}`}>Click the bookmark icon on any article to read later.</p>
            </div>
          ) : (
            bookmarkedArticles.map((art) => (
              <div key={art.id} className="py-3.5 flex items-start justify-between gap-3 group">
                <div 
                  onClick={() => {
                    onSelectArticle(art);
                    onClose();
                  }}
                  className="flex gap-3.5 flex-1 cursor-pointer"
                >
                  <img
                    src={art.featuredImage}
                    alt={art.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 opacity-85 group-hover:opacity-100"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#F27D26]">{art.category}</span>
                    <h4 className={`text-xs font-black uppercase tracking-tight line-clamp-2 leading-snug transition ${
                      isDark ? 'text-white group-hover:text-[#00FF41]' : 'text-zinc-900 group-hover:text-emerald-700'
                    }`}>
                      {art.title}
                    </h4>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-white/40' : 'text-zinc-400'}`}>{art.readTimeMinutes} MIN READ</span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveBookmark(art.id)}
                  className={`p-1 transition cursor-pointer ${
                    isDark ? 'text-white/30 hover:text-rose-500' : 'text-zinc-400 hover:text-rose-600'
                  }`}
                  title="Remove from bookmarks"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {bookmarkedArticles.length > 0 && (
          <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
            <button
              onClick={onClose}
              className={`w-full font-black uppercase text-xs py-3 rounded-full transition cursor-pointer ${
                isDark ? 'bg-white hover:bg-[#F27D26] text-black hover:text-white' : 'bg-black hover:bg-[#F27D26] text-white'
              }`}
            >
              Continue Reading
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
