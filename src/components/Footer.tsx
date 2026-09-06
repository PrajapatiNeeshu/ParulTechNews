import React from 'react';
import { Newspaper, Shield, Sparkles, Share2, Globe, Heart } from 'lucide-react';
import { Category, ThemeMode } from '../types';

interface FooterProps {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
  onOpenWhatsAppModal: () => void;
  theme?: ThemeMode;
}

export const Footer: React.FC<FooterProps> = ({ categories, onSelectCategory, onOpenWhatsAppModal, theme = 'dark' }) => {
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t text-xs mt-20 transition-colors duration-200 ${
      isDark 
        ? 'bg-black text-white/70 border-white/10' 
        : 'bg-zinc-100 text-zinc-700 border-zinc-300'
    }`}>
      {/* Top newsletter banner */}
      <div className={`py-10 px-4 border-b ${
        isDark ? 'border-white/10 bg-[#0A0A0A]' : 'border-zinc-300 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className={`flex items-center gap-2 font-mono font-bold uppercase tracking-[0.25em] text-[11px] mb-2 ${
              isDark ? 'text-[#00FF41]' : 'text-emerald-700'
            }`}>
              <Sparkles className="w-4 h-4" />
              <span>// REAL-TIME EDITORIAL INTELLIGENCE</span>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-black uppercase tracking-tighter ${
              isDark ? 'text-white' : 'text-zinc-950'
            }`}>
              Stay ahead with Daily AI Curated News &amp; Inshorts
            </h3>
            <p className={`text-xs sm:text-sm max-w-xl mt-2 font-normal ${
              isDark ? 'text-white/60' : 'text-zinc-600'
            }`}>
              Join 14,000+ technology leaders, developers, and founders receiving high-signal briefings directly on WhatsApp and Email.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenWhatsAppModal}
              className={`w-full sm:w-auto font-black uppercase tracking-wider px-6 py-3.5 rounded-full flex items-center justify-center gap-2 transition cursor-pointer shadow-2xl ${
                isDark 
                  ? 'bg-[#00FF41] hover:bg-emerald-400 text-black' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Join WhatsApp Daily Digest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm ${
              isDark ? 'bg-white text-black' : 'bg-black text-white'
            }`}>
              PC
            </div>
            <span className={`text-2xl font-black tracking-tighter uppercase ${
              isDark ? 'text-white' : 'text-zinc-950'
            }`}>PRESSCORE</span>
          </div>
          <p className={`leading-relaxed text-xs max-w-sm mb-5 font-normal ${
            isDark ? 'text-white/50' : 'text-zinc-600'
          }`}>
            A production-ready AI-powered news, blogging, and media operating system with built-in RBAC, automated Google News SEO, Inshorts flash cards, and Gemini-powered generation.
          </p>
          <div className={`flex items-center gap-2 font-mono text-[11px] ${
            isDark ? 'text-[#00FF41]' : 'text-emerald-700'
          }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${
              isDark ? 'bg-[#00FF41]' : 'bg-emerald-600'
            }`}></span>
            <span>SYSTEMS: ONLINE • GOOGLE NEWS INDEXED</span>
          </div>
        </div>

        {/* Categories column 1 */}
        <div>
          <h4 className={`font-black uppercase tracking-wider text-[11px] mb-4 font-mono ${
            isDark ? 'text-white' : 'text-zinc-950'
          }`}>// TECH &amp; AUTO</h4>
          <ul className="space-y-2.5">
            {['AI', 'Technology', 'Cyber Security', 'Jobs', 'EV', 'Automobile', 'Cars', 'Bikes'].map(cat => (
              <li key={cat}>
                <button
                  onClick={() => onSelectCategory(cat.toLowerCase().replace(' ', '-'))}
                  className={`transition cursor-pointer uppercase text-[11px] font-bold tracking-tight ${
                    isDark ? 'text-white/50 hover:text-white' : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories column 2 */}
        <div>
          <h4 className={`font-black uppercase tracking-wider text-[11px] mb-4 font-mono ${
            isDark ? 'text-white' : 'text-zinc-950'
          }`}>// BUSINESS &amp; CULTURE</h4>
          <ul className="space-y-2.5">
            {['Business', 'Finance', 'Entertainment', 'Bollywood', 'Sports', 'Health', 'Education', 'Lifestyle'].map(cat => (
              <li key={cat}>
                <button
                  onClick={() => onSelectCategory(cat.toLowerCase().replace(' ', '-'))}
                  className={`transition cursor-pointer uppercase text-[11px] font-bold tracking-tight ${
                    isDark ? 'text-white/50 hover:text-white' : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Architecture & Stack */}
        <div>
          <h4 className={`font-black uppercase tracking-wider text-[11px] mb-4 font-mono ${
            isDark ? 'text-white' : 'text-zinc-950'
          }`}>// ARCHITECTURE</h4>
          <ul className={`space-y-2 text-[11px] font-mono ${
            isDark ? 'text-white/40' : 'text-zinc-500'
          }`}>
            <li>• GEMINI 3.7 FLASH</li>
            <li>• TURBO MONOREPO</li>
            <li>• POSTGRESQL &amp; REDIS</li>
            <li>• GOOGLE NEWS JSON-LD</li>
            <li>• INSHORTS 60S ENGINE</li>
            <li>• ADSENSE MONETIZATION</li>
            <li>• RBAC SECURITY ENGINE</li>
          </ul>
        </div>
      </div>

      <div className={`border-t py-6 px-4 ${
        isDark ? 'border-white/10' : 'border-zinc-300'
      }`}>
        <div className={`max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono ${
          isDark ? 'text-white/40' : 'text-zinc-500'
        }`}>
          <div>
            © {new Date().getFullYear()} PRESSCORE MEDIA PLATFORM. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span className={`${isDark ? 'hover:text-white' : 'hover:text-black'} cursor-pointer uppercase`}>Privacy Policy</span>
            <span>•</span>
            <span className={`${isDark ? 'hover:text-white' : 'hover:text-black'} cursor-pointer uppercase`}>Terms of Service</span>
            <span>•</span>
            <span className={`${isDark ? 'hover:text-white' : 'hover:text-black'} cursor-pointer uppercase`}>Google News RSS Feed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
