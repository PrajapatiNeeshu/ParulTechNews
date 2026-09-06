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
  Globe,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Category, User, ActiveTab, RoleType, ThemeMode } from '../types';

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
  theme?: ThemeMode;
  onToggleTheme?: () => void;
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
  theme = 'dark',
  onToggleTheme,
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = React.useState(false);
  const [now, setNow] = React.useState(() => new Date());
  const [temperature, setTemperature] = React.useState<number | null>(null);
  const [weatherLabel, setWeatherLabel] = React.useState('LOCAL WEATHER');
  const roleSwitcherRef = React.useRef<HTMLDivElement>(null);
  const categoryScrollerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (roleSwitcherRef.current && !roleSwitcherRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsRoleDropdownOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  React.useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(clock);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    const loadWeather = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=celsius`);
        if (!response.ok) throw new Error('Weather request failed');
        const data = await response.json() as { current?: { temperature_2m?: number; weather_code?: number } };
        if (!cancelled && typeof data.current?.temperature_2m === 'number') {
          setTemperature(Math.round(data.current.temperature_2m));
          setWeatherLabel('LIVE LOCAL TEMP');
        }
      } catch {
        if (!cancelled) setWeatherLabel('WEATHER UNAVAILABLE');
      }
    };
    const fallbackLocation = () => loadWeather(28.6139, 77.2090);
    if (!navigator.geolocation) {
      fallbackLocation();
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => loadWeather(position.coords.latitude, position.coords.longitude),
        fallbackLocation,
        { timeout: 5000, maximumAge: 900000 }
      );
    }
    const refresh = window.setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => loadWeather(position.coords.latitude, position.coords.longitude),
          fallbackLocation,
          { timeout: 5000, maximumAge: 900000 }
        );
      }
    }, 900000);
    return () => { cancelled = true; window.clearInterval(refresh); };
  }, []);

  const scrollCategories = (direction: 'left' | 'right') => {
    categoryScrollerRef.current?.scrollBy({
      left: direction === 'right' ? 280 : -280,
      behavior: 'smooth',
    });
  };

  // Format today's date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(now);
  const timeFormatted = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now);
  const selectedContext = selectedCategory ? categories.find((category) => category.slug === selectedCategory)?.name : 'ALL NEWS';

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-200 ${
      isDark 
        ? 'bg-[#050505]/95 border-b border-white/10 shadow-2xl text-white' 
        : 'bg-white/95 border-b border-zinc-200 shadow-sm text-zinc-950'
    }`}>
      {/* Top utility sub-bar */}
      <div className={`text-xs py-1.5 px-4 border-b hidden sm:block transition-colors duration-200 ${
        isDark 
          ? 'bg-black text-white/70 border-white/10' 
          : 'bg-zinc-100 text-zinc-600 border-zinc-200'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-[#00FF41]' : 'bg-emerald-600'}`}></span>
              <span className={`font-mono text-[11px] uppercase tracking-[0.25em] font-bold ${
                isDark ? 'text-[#00FF41]' : 'text-emerald-700'
              }`}>
                SYSTEM: STABLE
              </span>
            </div>
            <span className={isDark ? 'text-white/20' : 'text-zinc-300'}>|</span>
            <span className={`font-mono text-[11px] uppercase tracking-wider ${
              isDark ? 'text-white/50' : 'text-zinc-500'
            }`}>
              {todayFormatted} • {timeFormatted}
            </span>
            <span className={isDark ? 'text-white/20' : 'text-zinc-300'}>|</span>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <CloudSun className={`h-3.5 w-3.5 ${isDark ? 'text-[#00FF41]' : 'text-emerald-700'}`} />
              <span className={isDark ? 'text-[#00FF41] font-bold' : 'text-emerald-700 font-bold'}>
                {weatherLabel}: {temperature === null ? '--' : `${temperature}°C`}
              </span>
              <span className={isDark ? 'text-white/20' : 'text-zinc-300'}>•</span>
              <span className={isDark ? 'text-white/50' : 'text-zinc-500'}>{selectedContext}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Pill (Top Bar) */}
            {onToggleTheme && (
              <button
                id="header-theme-toggle-top"
                onClick={onToggleTheme}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-medium transition cursor-pointer ${
                  isDark
                    ? 'bg-[#111111] border-white/15 hover:border-white/30 text-white/90'
                    : 'bg-white border-zinc-300 hover:border-zinc-400 text-zinc-800 shadow-2xs'
                }`}
                title={`Switch to ${isDark ? 'High-Contrast Light' : 'Obsidian Dark'} Theme`}
              >
                {isDark ? (
                  <>
                    <Moon className="w-3 h-3 text-[#00FF41]" />
                    <span className="uppercase tracking-wider">THEME: <strong className="text-white">OBSIDIAN</strong></span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span className="uppercase tracking-wider">THEME: <strong className="text-zinc-950">LIGHT</strong></span>
                  </>
                )}
              </button>
            )}

            {/* RBAC Role Switcher */}
            <div ref={roleSwitcherRef} className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-medium transition cursor-pointer ${
                  isDark
                    ? 'bg-[#111111] border-white/15 hover:border-white/30 text-white/90 shadow-2xs'
                    : 'bg-white border-zinc-300 hover:border-zinc-400 text-zinc-800 shadow-2xs'
                }`}
                title="Switch role to test Role-Based Access Control"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#00FF41]' : 'bg-emerald-600'}`}></span>
                <span className="text-[11px] uppercase tracking-wider font-mono">
                  ROLE: <strong className={isDark ? 'text-white capitalize' : 'text-zinc-950 capitalize'}>{currentUser.role.replace('_', ' ')}</strong>
                </span>
                <ChevronDown className={`w-3 h-3 ${isDark ? 'text-white/40' : 'text-zinc-400'}`} />
              </button>

              {isRoleDropdownOpen && (
                <div className={`absolute right-0 mt-1.5 w-64 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 border ${
                  isDark
                    ? 'bg-[#111111] border-white/20'
                    : 'bg-white border-zinc-200 text-zinc-900'
                }`}>
                  <div className={`px-3.5 py-1.5 border-b text-[10px] font-mono uppercase tracking-[0.2em] ${
                    isDark ? 'border-white/10 text-[#00FF41]' : 'border-zinc-100 text-emerald-700'
                  }`}>
                    // SWITCH RBAC ROLE
                  </div>
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 transition cursor-pointer ${
                        isDark 
                          ? `hover:bg-white/5 ${u.id === currentUser.id ? 'bg-white/10 font-bold text-white' : 'text-white/70'}`
                          : `hover:bg-zinc-100 ${u.id === currentUser.id ? 'bg-zinc-100 font-bold text-zinc-950' : 'text-zinc-700'}`
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className={`w-6 h-6 rounded-full object-cover shrink-0 border ${
                        isDark ? 'border-white/20' : 'border-zinc-300'
                      }`} />
                      <div className="flex-1 truncate">
                        <div className={`truncate font-semibold ${isDark ? 'text-white' : 'text-zinc-950'}`}>{u.name}</div>
                        <div className={`text-[10px] uppercase font-mono ${isDark ? 'text-white/40' : 'text-zinc-400'}`}>{u.role.replace('_', ' ')}</div>
                      </div>
                      {u.id === currentUser.id && <UserCheck className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00FF41]' : 'text-emerald-600'}`} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onOpenWhatsAppModal}
              className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition cursor-pointer ${
                isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800 font-bold'
              }`}
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
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg tracking-tighter transition ${
              isDark
                ? 'bg-white text-black group-hover:bg-[#F27D26] group-hover:text-white'
                : 'bg-black text-white group-hover:bg-[#F27D26]'
            }`}>
              PC
            </div>
            <div>
              <div className={`text-2xl font-black uppercase tracking-tighter flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-zinc-950'
              }`}>
                PRESSCORE
                <span className={`text-[9px] uppercase font-mono tracking-[0.2em] px-2 py-0.5 font-bold rounded-full border ${
                  isDark 
                    ? 'bg-white/10 text-[#00FF41] border-[#00FF41]/30' 
                    : 'bg-zinc-100 text-emerald-700 border-emerald-500/30'
                }`}>
                  AI OS
                </span>
              </div>
              <p className={`text-[10px] font-mono tracking-widest uppercase ${
                isDark ? 'text-white/40' : 'text-zinc-500 font-semibold'
              }`}>
                NEWS • INSHORTS • AI ENGINE
              </p>
            </div>
          </button>
        </div>

        {/* Primary View Switcher Tabs */}
        <div className={`hidden lg:flex items-center p-1 rounded-full border ${
          isDark 
            ? 'bg-[#111111] border-white/10' 
            : 'bg-zinc-100 border-zinc-300'
        }`}>
          <button
            onClick={() => onTabChange('portal')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'portal'
                ? (isDark ? 'bg-white text-black shadow-md' : 'bg-black text-white shadow-md')
                : (isDark ? 'text-white/60 hover:text-white' : 'text-zinc-600 hover:text-zinc-950')
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
                : (isDark ? 'text-white/60 hover:text-white' : 'text-zinc-600 hover:text-zinc-950')
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Inshorts 60s</span>
          </button>

          <button
            onClick={() => onTabChange('ai-lab')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'ai-lab'
                ? (isDark ? 'bg-white text-black shadow-md' : 'bg-black text-white shadow-md')
                : (isDark ? 'text-white/60 hover:text-white' : 'text-zinc-600 hover:text-zinc-950')
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Studio</span>
          </button>

          <button
            onClick={() => onTabChange('admin')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'admin'
                ? (isDark ? 'bg-white text-black shadow-md' : 'bg-black text-white shadow-md')
                : (isDark ? 'text-white/60 hover:text-white' : 'text-zinc-600 hover:text-zinc-950')
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin ({currentUser.role.replace('_', ' ')})</span>
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Mobile view toggle */}
          <div className={`lg:hidden flex items-center p-0.5 rounded-full border ${
            isDark ? 'bg-[#111111] border-white/10' : 'bg-zinc-100 border-zinc-300'
          }`}>
            <button
              onClick={() => onTabChange('portal')}
              className={`p-2 rounded-full text-xs font-medium ${
                activeTab === 'portal' 
                  ? (isDark ? 'bg-white text-black' : 'bg-black text-white') 
                  : (isDark ? 'text-white/50' : 'text-zinc-500')
              }`}
              title="News"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button
              onClick={() => onTabChange('inshorts')}
              className={`p-2 rounded-full text-xs font-medium ${activeTab === 'inshorts' ? 'bg-[#F27D26] text-white' : (isDark ? 'text-white/50' : 'text-zinc-500')}`}
              title="Inshorts"
            >
              <Zap className="w-4 h-4" />
            </button>
            <button
              onClick={() => onTabChange('ai-lab')}
              className={`p-2 rounded-full text-xs font-medium ${
                activeTab === 'ai-lab' 
                  ? (isDark ? 'bg-white text-black' : 'bg-black text-white') 
                  : (isDark ? 'text-white/50' : 'text-zinc-500')
              }`}
              title="AI Studio"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => onTabChange('admin')}
              className={`p-2 rounded-full text-xs font-medium ${
                activeTab === 'admin' 
                  ? (isDark ? 'bg-white text-black' : 'bg-black text-white') 
                  : (isDark ? 'text-white/50' : 'text-zinc-500')
              }`}
              title="Admin"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Toggle Button (Main Bar) */}
          {onToggleTheme && (
            <button
              id="header-theme-toggle-btn"
              onClick={onToggleTheme}
              className={`p-2 rounded-full border transition cursor-pointer flex items-center justify-center ${
                isDark
                  ? 'text-white/70 hover:text-white bg-[#111111] hover:bg-[#1a1a1a] border-white/10 hover:border-white/25'
                  : 'text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 border-zinc-300 hover:border-zinc-400'
              }`}
              title={`Switch to ${isDark ? 'High-Contrast Light' : 'Obsidian Dark'} Theme`}
              aria-label="Toggle visual theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 transition-transform hover:rotate-12" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-900 hover:text-black transition-transform hover:-rotate-12" />
              )}
            </button>
          )}

          <button
            onClick={onOpenSearch}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition cursor-pointer border ${
              isDark
                ? 'bg-[#111111] hover:bg-[#1a1a1a] text-white/70 border-white/10 hover:border-white/20'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300 hover:border-zinc-400'
            }`}
            title="Search articles by title, tag, or author"
          >
            <Search className={`w-3.5 h-3.5 ${isDark ? 'text-white/50' : 'text-zinc-500'}`} />
            <span className="hidden sm:inline">Search...</span>
            <kbd className={`hidden sm:inline px-1.5 py-0.2 rounded text-[10px] border font-mono ${
              isDark 
                ? 'bg-black text-white/40 border-white/10' 
                : 'bg-white text-zinc-500 border-zinc-300'
            }`}>
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenBookmarks}
            className={`relative p-2 rounded-full border transition cursor-pointer ${
              isDark
                ? 'text-white/70 hover:text-white bg-[#111111] hover:bg-[#1a1a1a] border-white/10'
                : 'text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 border-zinc-300'
            }`}
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
      <div className={`border-t transition-colors duration-200 ${
        isDark ? 'border-white/10 bg-black/60' : 'border-zinc-200 bg-zinc-50/90'
      }`}>
        <div className="relative max-w-7xl mx-auto px-10 sm:px-12">
          <button
            type="button"
            onClick={() => scrollCategories('left')}
            className={`absolute left-1 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm transition ${
              isDark
                ? 'border-white/20 bg-[#111111] text-white hover:border-[#F27D26] hover:text-[#F27D26]'
                : 'border-zinc-300 bg-white text-zinc-700 hover:border-[#F27D26] hover:text-[#F27D26]'
            }`}
            title="Scroll categories left"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div ref={categoryScrollerRef} className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar scroll-smooth text-xs">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-3.5 py-1 rounded-full whitespace-nowrap font-black uppercase text-[11px] tracking-wider transition cursor-pointer shrink-0 border ${
              selectedCategory === null
                ? (isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                : (isDark ? 'text-white/60 hover:text-white hover:bg-white/5 border-transparent' : 'text-zinc-600 hover:text-black hover:bg-zinc-200 border-transparent')
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
                    ? (isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                    : (isDark ? 'text-white/60 hover:text-white hover:bg-white/5 border-white/10' : 'text-zinc-700 hover:text-black hover:bg-zinc-200 border-zinc-300')
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: isSelected ? (isDark ? '#000000' : '#FFFFFF') : cat.color || '#F27D26' }}
                />
                <span>{cat.name}</span>
                {cat.postCount > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected 
                      ? (isDark ? 'bg-black text-white' : 'bg-white text-black')
                      : (isDark ? 'bg-white/10 text-white/50' : 'bg-zinc-200 text-zinc-700')
                  }`}>
                    {cat.postCount}
                  </span>
                )}
              </button>
            );
          })}
          </div>
          <button
            type="button"
            onClick={() => scrollCategories('right')}
            className={`absolute right-1 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm transition ${
              isDark
                ? 'border-white/20 bg-[#111111] text-white hover:border-[#F27D26] hover:text-[#F27D26]'
                : 'border-zinc-300 bg-white text-zinc-700 hover:border-[#F27D26] hover:text-[#F27D26]'
            }`}
            title="Scroll categories right"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
