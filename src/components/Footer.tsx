import React from 'react';
import { Newspaper, Shield, Sparkles, Share2, Globe, Heart } from 'lucide-react';
import { Category } from '../types';

interface FooterProps {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
  onOpenWhatsAppModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ categories, onSelectCategory, onOpenWhatsAppModal }) => {
  return (
    <footer className="bg-black text-white/70 border-t border-white/10 text-xs mt-20">
      {/* Top newsletter banner */}
      <div className="border-b border-white/10 bg-[#0A0A0A] py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#00FF41] font-mono font-bold uppercase tracking-[0.25em] text-[11px] mb-2">
              <Sparkles className="w-4 h-4 text-[#00FF41]" />
              <span>// REAL-TIME EDITORIAL INTELLIGENCE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white">
              Stay ahead with Daily AI Curated News &amp; Inshorts
            </h3>
            <p className="text-white/60 text-xs sm:text-sm max-w-xl mt-2 font-normal">
              Join 14,000+ technology leaders, developers, and founders receiving high-signal briefings directly on WhatsApp and Email.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenWhatsAppModal}
              className="w-full sm:w-auto bg-[#00FF41] hover:bg-emerald-400 text-black font-black uppercase tracking-wider px-6 py-3.5 rounded-full flex items-center justify-center gap-2 transition cursor-pointer shadow-2xl"
            >
              <Share2 className="w-4 h-4 text-black" />
              <span>Join WhatsApp Daily Digest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-black text-sm">
              PC
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">PRESSCORE</span>
          </div>
          <p className="text-white/50 leading-relaxed text-xs max-w-sm mb-5 font-normal">
            A production-ready AI-powered news, blogging, and media operating system with built-in RBAC, automated Google News SEO, Inshorts flash cards, and Gemini-powered generation.
          </p>
          <div className="flex items-center gap-2 text-[#00FF41] font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></span>
            <span>SYSTEMS: ONLINE • GOOGLE NEWS INDEXED</span>
          </div>
        </div>

        {/* Categories column 1 */}
        <div>
          <h4 className="font-black text-white uppercase tracking-wider text-[11px] mb-4 font-mono">// TECH &amp; AUTO</h4>
          <ul className="space-y-2.5">
            {['AI', 'Technology', 'Cyber Security', 'Jobs', 'EV', 'Automobile', 'Cars', 'Bikes'].map(cat => (
              <li key={cat}>
                <button
                  onClick={() => onSelectCategory(cat.toLowerCase().replace(' ', '-'))}
                  className="hover:text-white transition text-white/50 cursor-pointer uppercase text-[11px] font-bold tracking-tight"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories column 2 */}
        <div>
          <h4 className="font-black text-white uppercase tracking-wider text-[11px] mb-4 font-mono">// BUSINESS &amp; CULTURE</h4>
          <ul className="space-y-2.5">
            {['Business', 'Finance', 'Entertainment', 'Bollywood', 'Sports', 'Health', 'Education', 'Lifestyle'].map(cat => (
              <li key={cat}>
                <button
                  onClick={() => onSelectCategory(cat.toLowerCase().replace(' ', '-'))}
                  className="hover:text-white transition text-white/50 cursor-pointer uppercase text-[11px] font-bold tracking-tight"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Architecture & Stack */}
        <div>
          <h4 className="font-black text-white uppercase tracking-wider text-[11px] mb-4 font-mono">// ARCHITECTURE</h4>
          <ul className="space-y-2 text-white/40 text-[11px] font-mono">
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

      <div className="border-t border-white/10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-[11px] font-mono">
          <div>
            © {new Date().getFullYear()} PRESSCORE MEDIA PLATFORM. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer uppercase">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer uppercase">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer uppercase">Google News RSS Feed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
