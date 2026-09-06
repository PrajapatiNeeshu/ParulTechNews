import React from 'react';

interface SEOAnalyzerProps {
  text: string;
  html: string;
  metaDescription: string;
  keywords: string;
}

export const SEOAnalyzer: React.FC<SEOAnalyzerProps> = ({ text, html, metaDescription, keywords }) => {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const headings = Array.from(html.matchAll(/<h([1-4])[^>]*>(.*?)<\/h\1>/gi)).map((match) => ({ level: Number(match[1]), text: match[2].replace(/<[^>]+>/g, '') }));
  const h1Count = headings.filter((heading) => heading.level === 1).length;
  const keywordList = keywords.split(',').map((keyword) => keyword.trim().toLowerCase()).filter(Boolean);
  const lowerText = text.toLowerCase();
  const density = keywordList.length ? keywordList.map((keyword) => ({ keyword, count: lowerText.split(keyword).length - 1 })).filter((item) => item.count > 0) : [];
  const checks = [
    { label: 'H1 heading present', ok: h1Count > 0, warning: 'Add one H1 heading.' },
    { label: 'Article length', ok: words >= 800, warning: `${Math.max(0, 800 - words)} more words recommended.` },
    { label: 'Meta description', ok: metaDescription.length >= 120 && metaDescription.length <= 160, warning: 'Aim for 120-160 characters.' },
    { label: 'Heading structure', ok: headings.length > 1, warning: 'Add supporting H2-H4 headings.' },
  ];
  return <aside className="space-y-3 rounded-2xl border border-[#262626] bg-[#141414] p-4"><div className="flex items-center justify-between"><h3 className="text-xs font-black uppercase tracking-wider text-white">SEO Analyzer</h3><span className="text-[10px] font-mono text-[#ff8c00]">{checks.filter((check) => check.ok).length}/{checks.length}</span></div><div className="space-y-2">{checks.map((check) => <div key={check.label} className={`rounded-lg border px-3 py-2 text-[11px] ${check.ok ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300' : 'border-amber-500/20 bg-amber-500/5 text-amber-200'}`}><div className="font-bold">{check.ok ? '✓' : '!' } {check.label}</div>{!check.ok && <div className="mt-0.5 text-[10px] opacity-75">{check.warning}</div>}</div>)}</div><div className="border-t border-[#262626] pt-3"><div className="mb-2 text-[10px] font-mono uppercase text-white/45">Keyword density</div>{density.length ? density.map((item) => <div className="flex justify-between text-[11px] text-white/70" key={item.keyword}><span>{item.keyword}</span><span className="font-mono text-[#ff8c00]">{item.count}x</span></div>) : <div className="text-[11px] text-white/40">Add comma-separated focus keywords.</div>}</div><div className="border-t border-[#262626] pt-3"><div className="mb-1 text-[10px] font-mono uppercase text-white/45">Meta preview</div><div className="rounded-lg bg-[#0b0b0b] p-3"><div className="truncate text-sm font-bold text-blue-300">Your article headline preview</div><div className="mt-1 text-[11px] leading-relaxed text-white/55">{metaDescription || 'Your meta description preview will appear here.'}</div></div></div></aside>;
};
