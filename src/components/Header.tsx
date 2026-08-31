import React from 'react';
import { 
  Newspaper, 
  Zap, 
  Shield, 
  Sparkles, 
  Search, 
  Bookmark, 
  Share2, 
  UserCheck, 
  ChevronDown, 
  TrendingUp,
  CloudSun,
  Globe
} from 'lucide-react';
import { Category, User, ActiveTab, RoleType } from '../types';

interface HeaderProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentUser: User;
  onSwitchUser: (user: User) => void;
  allUsers: User[];
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenWhatsAppModal: () => void;
  bookmarksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  activeTab,
  onTabChange,
  currentUser,
  onSwitchUser,
  allUsers,
  onOpenSearch,
  onOpenBookmarks,
  onOpenWhatsAppModal,
  bookmarksCount,
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = React.useState(false);

  // Format today's date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 shadow-2xl">
      {/* Top utility sub-bar */}
      <div className="bg-black text-white/70 text-xs py-1.5 px-4 border-b border-white/10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></span>
              <span className="text-[#00FF41] font-mono text-[11px] uppercase tracking-[0.25em] font-bold">SYSTEM: STABLE</span>
            </div>
            <span className="text-white/20">|</span>
            <span className="font-mono text-white/50 text-[11px] uppercase tracking-wider">{todayFormatted}</span>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-[#00FF41] font-bold">S&P 500 ▲ 5,648.40 (+0.4%)</span>
              <span className="text-white/20">•</span>
              <span className="text-[#00FF41] font-bold">NASDAQ ▲ 17,870 (+0.7%)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* RBAC Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 bg-[#111111] border border-white/15 px-2.5 py-0.5 rounded-full hover:border-white/30 font-medium text-white/90 transition shadow-2xs cursor-pointer"
                title="Switch role to test Role-Based Access Control"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41]"></span>
                <span className="text-[11px] uppercase tracking-wider font-mono">
                  ROLE: <strong className="text-white capitalize">{currentUser.role.replace('_', ' ')}</strong>
                </span>
                <ChevronDown className="w-3 h-3 text-white/40" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-[#111111] border border-white/20 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-1.5 border-b border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] text-[#00FF41]">
                    // SWITCH RBAC ROLE
                  </div>
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-white/5 transition ${
                        u.id === currentUser.id ? 'bg-white/10 font-bold text-white' : 'text-white/70'
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/20" />
                      <div className="flex-1 truncate">
                        <div className="truncate font-semibold text-white">{u.name}</div>
                        <div className="text-[10px] text-white/40 uppercase font-mono">{u.role.replace('_', ' ')}</div>
                      </div>
                      {u.id === currentUser.id && <UserCheck className="w-4 h-4 text-[#00FF41] shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onOpenWhatsAppModal}
              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
            >
              <Share2 className="w-3 h-3" />
              <span>WhatsApp Alerts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onTabChange('portal');
              onSelectCategory(null);
            }}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-black text-lg tracking-tighter group-hover:bg-[#F27D26] group-hover:text-white transition">
              PC
            </div>
            <div>
              <div className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
                PRESSCORE
                <span className="text-[9px] uppercase font-mono tracking-[0.2em] px-2 py-0.5 bg-white/10 text-[#00FF41] font-bold rounded-full border border-[#00FF41]/30">
                  AI OS
                </span>
              </div>
              <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
                NEWS • INSHORTS • AI ENGINE
              </p>
            </div>
          </button>
        </div>

        {/* Primary View Switcher Tabs */}
        <div className="hidden lg:flex items-center bg-[#111111] p-1 rounded-full border border-white/10">
          <button
            onClick={() => onTabChange('portal')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'portal'
                ? 'bg-white text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>News Website</span>
          </button>

          <button
            onClick={() => onTabChange('inshorts')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'inshorts'
                ? 'bg-[#F27D26] text-white shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Inshorts 60s</span>
          </button>

          <button
            onClick={() => onTabChange('ai-lab')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'ai-lab'
                ? 'bg-white text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Studio</span>
          </button>

          <button
            onClick={() => onTabChange('admin')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-white text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin ({currentUser.role.replace('_', ' ')})</span>
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Mobile view toggle */}
          <div className="lg:hidden flex items-center bg-[#111111] p-0.5 rounded-full border border-white/10">
            <button
              onClick={() => onTabChange('portal')}
              className={`p-2 rounded-full text-xs font-medium ${activeTab === 'portal' ? 'bg-white text-black' : 'text-white/50'}`}
              title="News"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button
              onClick={() => onTabChange('inshorts')}
              className={`p-2 rounded-full text-xs font-medium ${activeTab === 'inshorts' ? 'bg-[#F27D26] text-white' : 'text-white/50'}`}
              title="Inshorts"
            >
              <Zap className="w-4 h-4" />
            </button>
            <button
              onClick={() => onTabChange('ai-lab')}
              className={`p-2 rounded-full text-xs font-medium ${activeTab === 'ai-lab' ? 'bg-white text-black' : 'text-white/50'}`}
              title="AI Studio"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => onTabChange('admin')}
              className={`p-2 rounded-full text-xs font-medium ${activeTab === 'admin' ? 'bg-white text-black' : 'text-white/50'}`}
              title="Admin"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 bg-[#111111] hover:bg-[#1a1a1a] text-white/70 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition cursor-pointer border border-white/10 hover:border-white/20"
            title="Search articles by title, tag, or author"
          >
            <Search className="w-3.5 h-3.5 text-white/50" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline bg-black px-1.5 py-0.2 rounded text-[10px] text-white/40 border border-white/10 font-mono">⌘K</kbd>
          </button>

          <button
            onClick={onOpenBookmarks}
            className="relative p-2 text-white/70 hover:text-white bg-[#111111] hover:bg-[#1a1a1a] border border-white/10 rounded-full transition cursor-pointer"
            title="Saved Bookmarks"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F27D26] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {bookmarksCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="border-t border-white/10 bg-black/60">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth text-xs">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-3.5 py-1 rounded-full whitespace-nowrap font-black uppercase text-[11px] tracking-wider transition cursor-pointer shrink-0 ${
              selectedCategory === null
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            All Stories
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.slug)}
                className={`px-3.5 py-1 rounded-full whitespace-nowrap font-bold uppercase text-[11px] tracking-wider transition cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                  isSelected
                    ? 'bg-white text-black border-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border-white/10'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: isSelected ? '#000000' : cat.color || '#F27D26' }}
                />
                <span>{cat.name}</span>
                {cat.postCount > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${isSelected ? 'bg-black text-white' : 'bg-white/10 text-white/50'}`}>
                    {cat.postCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
