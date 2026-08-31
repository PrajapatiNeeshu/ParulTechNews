import React, { useState } from 'react';
import { Share2, Send, MessageCircle, Check, Users, Clock, Flame, Bell } from 'lucide-react';
import { Article } from '../../types';

interface NotificationDispatcherProps {
  articles: Article[];
}

export const NotificationDispatcher: React.FC<NotificationDispatcherProps> = ({ articles }) => {
  const [selectedArticleId, setSelectedArticleId] = useState(articles[0]?.id || '');
  const [channel, setChannel] = useState<'whatsapp' | 'webpush' | 'telegram'>('whatsapp');
  const [customHeading, setCustomHeading] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const activeArticle = articles.find(a => a.id === selectedArticleId) || articles[0];

  const shareUrl = `https://presscore.io/news/${activeArticle?.slug}`;
  const whatsappPreview = `🚨 *${customHeading || activeArticle?.title}*\n\n📌 *60-Second Flash:* \n${activeArticle?.inshortsSummary || activeArticle?.excerpt}\n\n${customNote ? `💡 *Editor's Note:* ${customNote}\n\n` : ''}📖 *Read full story:* ${shareUrl}\n\n---\n_PressCore Editorial Alert_`;

  const handleDispatch = () => {
    setDispatchStatus('Broadcasting payload to 14,200 subscribers...');
    setTimeout(() => {
      setDispatchStatus(`Successfully sent to 14,200 recipients via ${channel.toUpperCase()}!`);
      setTimeout(() => setDispatchStatus(null), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Header */}
      <div className="bg-[#0D0D0D] text-white p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#00FF41] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <MessageCircle className="w-4 h-4" />
            <span>// AUDIENCE BROADCAST &amp; WHATSAPP DISPATCHER</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            Instant News Flash Broadcast Studio
          </h2>
          <p className="text-xs text-white/50 max-w-xl mt-1 font-mono">
            Push real-time breaking alerts directly to WhatsApp groups, Web Push subscribers, and Telegram channels.
          </p>
        </div>

        <div className="bg-black p-4 rounded-2xl border border-white/10 text-center font-mono">
          <div className="text-[10px] uppercase font-bold text-white/50">// ACTIVE SUBSCRIBERS</div>
          <div className="text-2xl font-black text-[#00FF41]">14,280</div>
          <div className="text-[10px] text-white/40 mt-0.5">OPTED-IN RECIPIENTS</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Composer Form */}
        <div className="bg-[#0D0D0D] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 font-mono">
          <h3 className="font-black text-sm uppercase tracking-tight text-white font-sans">// COMPOSE BROADCAST ALERT</h3>

          <div>
            <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">
              // SELECT ARTICLE
            </label>
            <select
              value={selectedArticleId}
              onChange={(e) => setSelectedArticleId(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs font-mono font-bold text-white focus:border-[#F27D26] outline-none"
            >
              {articles.map(a => (
                <option key={a.id} value={a.id}>
                  [{a.category.toUpperCase()}] {a.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">
              // DISTRIBUTION CHANNEL
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                className={`py-2.5 px-3 rounded-full text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  channel === 'whatsapp' ? 'bg-[#00FF41] text-black shadow-md' : 'bg-black text-white/60 border border-white/10 hover:text-white'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('webpush')}
                className={`py-2.5 px-3 rounded-full text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  channel === 'webpush' ? 'bg-[#F27D26] text-white shadow-md' : 'bg-black text-white/60 border border-white/10 hover:text-white'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Web Push</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('telegram')}
                className={`py-2.5 px-3 rounded-full text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  channel === 'telegram' ? 'bg-white text-black shadow-md' : 'bg-black text-white/60 border border-white/10 hover:text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">
              // OVERRIDE HEADLINE (OPTIONAL)
            </label>
            <input
              type="text"
              placeholder={activeArticle?.title || 'Enter custom headline...'}
              value={customHeading}
              onChange={(e) => setCustomHeading(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs font-sans text-white placeholder-white/30 focus:border-[#F27D26] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">
              // EDITOR'S QUICK TAKE NOTE
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Crucial development for tech investors tracking Q3 forecasts..."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs font-sans text-white placeholder-white/30 focus:border-[#F27D26] outline-none"
            />
          </div>

          <button
            onClick={handleDispatch}
            className="w-full bg-[#00FF41] hover:bg-[#00cc33] text-black font-mono font-bold text-xs uppercase py-3.5 rounded-full flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Alert to {channel.toUpperCase()} [14.2k]</span>
          </button>

          {dispatchStatus && (
            <div className="bg-[#00FF41]/20 border border-[#00FF41]/30 text-[#00FF41] p-3 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-[#00FF41]" />
              <span>{dispatchStatus}</span>
            </div>
          )}
        </div>

        {/* Live Device Preview */}
        <div className="bg-[#0D0D0D] text-white rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#00FF41] pb-3 border-b border-white/10 mb-4 font-mono">
              <span>// LIVE NOTIFICATION SIMULATION</span>
              <span>100% DELIVERABILITY</span>
            </div>

            <div className="bg-black text-white p-5 rounded-3xl space-y-3 border border-white/10">
              <div className="font-black text-white uppercase text-sm font-sans tracking-tight">
                🚨 {customHeading || activeArticle?.title}
              </div>
              <div className="text-white/70 leading-relaxed text-xs font-sans">
                📌 <strong className="text-white uppercase font-mono text-[10px]">60-Second Flash:</strong><br />
                {activeArticle?.inshortsSummary || activeArticle?.excerpt}
              </div>
              {customNote && (
                <div className="bg-white/5 border border-[#00FF41]/30 p-2.5 rounded-xl text-[#00FF41] text-xs font-mono italic">
                  💡 Editor's Note: {customNote}
                </div>
              )}
              <div className="text-[10px] font-mono text-white/40 uppercase">
                🏷️ Category: #{activeArticle?.category} • ⏱️ {activeArticle?.readTimeMinutes} min read
              </div>
              <div className="text-[#F27D26] underline font-mono truncate text-xs pt-1">
                📖 Read Full Story: {shareUrl}
              </div>
              <div className="text-[10px] font-mono text-white/40 text-right">
                Just now ✓✓
              </div>
            </div>
          </div>

          <div className="pt-4 text-[10px] font-mono text-white/40 flex items-center justify-between border-t border-white/10 mt-4">
            <span>// POWERED BY WHATSAPP CLOUD API &amp; WEB PUSH ENGINE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
