import React, { useState } from 'react';
import { Share2, Check, Copy, ExternalLink, MessageCircle, Sparkles } from 'lucide-react';
import { Article } from '../types';

interface WhatsAppShareModalProps {
  article: Article | null;
  onClose: () => void;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({ article, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  // Build high-CTR formatted WhatsApp text
  const shareUrl = `https://presscore.io/news/${article.slug}`;
  const whatsappFormattedText = `🚨 *BREAKING: ${article.title}*\n\n📌 *Quick 60-Second Brief:*\n${article.inshortsSummary || article.excerpt}\n\n🏷️ *Category:* #${article.category}\n⏱️ *Read Time:* ${article.readTimeMinutes} min\n\n📖 *Read Full Story & Analysis:* \n${shareUrl}\n\n---\n_Shared via PressCore AI News Platform_`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappFormattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappFormattedText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-[#0D0D0D] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00FF41] text-black flex items-center justify-center font-black shadow-lg">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base uppercase tracking-tight">WhatsApp Broadcast Formatter</h3>
              <p className="text-xs font-mono text-white/50 uppercase">// AUTO-FORMATTED HIGH-CTR GROUP DIGEST</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-xl font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* WhatsApp Phone Mockup Preview */}
        <div className="bg-black text-white rounded-2xl p-4 mb-5 font-sans text-xs border border-white/10 shadow-inner">
          <div className="flex items-center justify-between text-[10px] text-[#00FF41] pb-2 border-b border-white/10 mb-3 font-mono uppercase tracking-wider">
            <span>// WHATSAPP PREVIEW</span>
            <span>READY FOR 1-CLICK BROADCAST</span>
          </div>

          <div className="bg-[#141414] text-white/90 p-4 rounded-2xl space-y-2 max-w-[95%] border border-white/10">
            <div className="font-black text-[#00FF41] uppercase tracking-tight text-xs">
              🚨 BREAKING: {article.title}
            </div>
            <div className="text-white/80 leading-relaxed text-xs">
              📌 <strong className="text-white">Quick 60-Second Brief:</strong><br />
              {article.inshortsSummary || article.excerpt}
            </div>
            <div className="text-[10px] font-mono text-white/50">
              🏷️ Category: #{article.category} • ⏱️ {article.readTimeMinutes} min read
            </div>
            <div className="text-[#00FF41] underline truncate text-xs pt-1 font-mono">
              📖 Read Full Story: {shareUrl}
            </div>
            <div className="text-[9px] font-mono text-white/40 text-right pt-0.5">
              10:42 AM ✓✓
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 transition cursor-pointer border border-white/10 uppercase"
          >
            {copied ? <Check className="w-4 h-4 text-[#00FF41]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Broadcast Text' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="flex-1 bg-[#00FF41] hover:bg-emerald-400 text-black font-black text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 transition cursor-pointer shadow-lg uppercase tracking-wider"
          >
            <Share2 className="w-4 h-4" />
            <span>Open in WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
