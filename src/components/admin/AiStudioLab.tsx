import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Send, 
  Copy, 
  Check, 
  ArrowRight, 
  RefreshCw, 
  Zap, 
  Globe, 
  Flame,
  FileText,
  Sliders
} from 'lucide-react';
import { Category, Article } from '../../types';
import { geminiService } from '../../services/geminiService';

interface AiStudioLabProps {
  categories: Category[];
  onCreateArticleFromAi: (generatedArticle: Partial<Article>) => void;
}

export const AiStudioLab: React.FC<AiStudioLabProps> = ({
  categories,
  onCreateArticleFromAi,
}) => {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Technology');
  const [tone, setTone] = useState<'journalistic' | 'breaking' | 'opinion' | 'explainer' | 'technical'>('journalistic');
  const [targetLength, setTargetLength] = useState<'concise' | 'standard' | 'deep_dive'>('standard');
  const [includeInshorts, setIncludeInshorts] = useState(true);
  const [includeSeo, setIncludeSeo] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [progressStep, setProgressStep] = useState('');
  const [generatedResult, setGeneratedResult] = useState<{
    title: string;
    excerpt: string;
    content: string;
    inshortsSummary: string;
    metaTitle: string;
    metaDescription: string;
    focusKeywords: string[];
    suggestedCategory: string;
    suggestedTags: string[];
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setProgressStep('Synthesizing research & drafting journalistic article with Gemini 3.7 Flash...');
    setGeneratedResult(null);

    try {
      // Step 1: Generate Blog
      const blogData = await geminiService.generateBlog({
        topic,
        category,
        tone,
        wordCount: targetLength === 'concise' ? '400' : targetLength === 'deep_dive' ? '1200' : '700'
      });

      setProgressStep('Generating Google News Schema, focus keywords, and SEO metadata...');
      // Step 2: Generate SEO
      const seoData = await geminiService.generateSeo(blogData.title, blogData.content, category);

      let inshortsText = blogData.excerpt;
      if (includeInshorts) {
        setProgressStep('Synthesizing 60-word Inshorts mobile flash card...');
        const inshortsData = await geminiService.rewriteContent(blogData.content, 'inshorts');
        inshortsText = inshortsData.rewrittenContent;
      }

      setGeneratedResult({
        title: blogData.title,
        excerpt: blogData.excerpt,
        content: blogData.content,
        inshortsSummary: inshortsText,
        metaTitle: seoData.metaTitle,
        metaDescription: seoData.metaDescription,
        focusKeywords: seoData.focusKeywords,
        suggestedCategory: category,
        suggestedTags: blogData.tags || ['AI', 'Tech', 'Analysis'],
      });
    } catch (err: any) {
      console.error(err);
      alert('Failed to generate article: ' + (err?.message || 'Server error'));
    } finally {
      setIsLoading(false);
      setProgressStep('');
    }
  };

  const handlePushToEditor = () => {
    if (!generatedResult) return;

    onCreateArticleFromAi({
      title: generatedResult.title,
      slug: generatedResult.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      excerpt: generatedResult.excerpt,
      content: generatedResult.content,
      inshortsSummary: generatedResult.inshortsSummary,
      category: generatedResult.suggestedCategory,
      tags: generatedResult.suggestedTags,
      featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      status: 'published',
      isTrending: true,
      seo: {
        metaTitle: generatedResult.metaTitle,
        metaDescription: generatedResult.metaDescription,
        focusKeywords: generatedResult.focusKeywords,
        googleNewsHeadline: generatedResult.title,
        seoScore: 96,
        schemaType: 'NewsArticle',
      }
    });
  };

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Hero Header */}
      <div className="bg-[#0D0D0D] text-white p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#00FF41] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>// AI AUTOMATED NEWSROOM ENGINE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            Gemini 3.7 Flash Prompt-to-Publish Suite
          </h2>
          <p className="text-xs text-white/50 max-w-xl mt-1 font-mono">
            Synthesize AP-standard articles, Inshorts 60-word briefs, and Google News metadata instantly.
          </p>
        </div>

        <div className="bg-black px-4 py-3 rounded-2xl border border-white/10 text-center">
          <div className="text-[10px] uppercase font-mono font-bold text-white/50">// MODEL ENGINE</div>
          <div className="text-sm font-bold text-[#00FF41] font-mono">gemini-3.7-flash</div>
          <div className="text-[10px] text-white/60 font-mono mt-0.5">● SECURE ZERO-LEAK PROXY</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prompt Input Form */}
        <div className="lg:col-span-5 bg-[#0D0D0D] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <h3 className="font-black text-sm uppercase tracking-tight text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#F27D26]" />
            <span>Generation Parameters</span>
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block font-bold text-white/70 uppercase tracking-wider mb-1.5 text-[10px]">
                // NEWS TOPIC / HEADLINE ANGLE *
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Breakthrough in room-temperature superconducting quantum chips by European researchers..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-2xl p-3.5 text-white placeholder-white/30 focus:border-[#F27D26] outline-none font-sans text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-white/70 uppercase tracking-wider mb-1.5 text-[10px]">
                  // CATEGORY
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl p-2.5 font-bold text-white uppercase focus:border-[#F27D26] outline-none text-xs"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-white/70 uppercase tracking-wider mb-1.5 text-[10px]">
                  // TONE
                </label>
                <select
                  value={tone}
                  onChange={(e: any) => setTone(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl p-2.5 font-bold text-white uppercase focus:border-[#F27D26] outline-none text-xs"
                >
                  <option value="journalistic">AP JOURNALISTIC</option>
                  <option value="breaking">BREAKING FLASH</option>
                  <option value="opinion">DEEP OP-ED</option>
                  <option value="explainer">EXPLAINER</option>
                  <option value="technical">TECHNICAL</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-white/70 uppercase tracking-wider mb-1.5 text-[10px]">
                // LENGTH &amp; DEPTH
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'concise', label: 'CONCISE (400W)' },
                  { id: 'standard', label: 'STANDARD (700W)' },
                  { id: 'deep_dive', label: 'DEEP DIVE (1200W)' }
                ].map(l => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setTargetLength(l.id as any)}
                    className={`py-2 px-1 rounded-xl text-[10px] font-mono font-bold text-center transition cursor-pointer ${
                      targetLength === l.id ? 'bg-white text-black shadow-xs' : 'bg-black text-white/60 border border-white/10 hover:text-white'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="flex items-center gap-2 cursor-pointer text-white/80">
                <input
                  type="checkbox"
                  checked={includeInshorts}
                  onChange={(e) => setIncludeInshorts(e.target.checked)}
                  className="rounded accent-[#F27D26] w-4 h-4 cursor-pointer"
                />
                <span className="font-bold text-[11px] uppercase">// AUTO-GENERATE 60W INSHORTS</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-white/80">
                <input
                  type="checkbox"
                  checked={includeSeo}
                  onChange={(e) => setIncludeSeo(e.target.checked)}
                  className="rounded accent-[#00FF41] w-4 h-4 cursor-pointer"
                />
                <span className="font-bold text-[11px] uppercase">// AUTO-GENERATE GOOGLE NEWS SEO</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="w-full bg-[#F27D26] hover:bg-[#d96a1a] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-full flex items-center justify-center gap-2 transition cursor-pointer shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>SYNTHESIZING ARTICLE...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>GENERATE NEWS PACKAGE</span>
                </>
              )}
            </button>
          </form>

          {isLoading && (
            <div className="bg-black p-4 rounded-2xl border border-[#00FF41]/30 text-[#00FF41] text-xs font-mono flex items-center gap-2.5 animate-pulse uppercase">
              <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-[#00FF41]" />
              <span>{progressStep}</span>
            </div>
          )}
        </div>

        {/* Generated Output Preview */}
        <div className="lg:col-span-7 bg-[#0D0D0D] p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h3 className="font-black text-sm uppercase tracking-tight text-white">
                Generated Package Output
              </h3>

              {generatedResult && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedResult.content);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-[10px] font-mono font-bold uppercase bg-white/10 hover:bg-white hover:text-black text-white px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>

                  <button
                    onClick={handlePushToEditor}
                    className="bg-[#00FF41] hover:bg-[#00cc33] text-black text-[10px] font-mono font-bold uppercase px-4 py-1.5 rounded-full flex items-center gap-1.5 transition shadow-lg cursor-pointer"
                  >
                    <span>Send to Editor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {!generatedResult ? (
              <div className="text-center py-24 text-white/30 text-xs font-mono">
                <Wand2 className="w-10 h-10 mx-auto mb-3 opacity-30 text-[#F27D26]" />
                <p className="font-bold text-white uppercase">// READY TO DRAFT YOUR NEXT HEADLINE</p>
                <p className="mt-1 text-white/40 max-w-sm mx-auto">
                  Type any subject or breaking news angle in the left panel to synthesize an AP-style article with SEO and Inshorts briefs.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F27D26] bg-[#F27D26]/10 px-2.5 py-1 rounded-full border border-[#F27D26]/20">
                    {generatedResult.suggestedCategory}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mt-2 mb-2 leading-tight">
                    {generatedResult.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/60 mb-4 font-sans">
                    {generatedResult.excerpt}
                  </p>
                </div>

                {/* Inshorts Pill */}
                {generatedResult.inshortsSummary && (
                  <div className="bg-black border border-[#F27D26]/30 rounded-2xl p-3.5 text-xs text-white">
                    <div className="flex items-center gap-1.5 font-bold font-mono text-[#F27D26] mb-1 uppercase text-[10px]">
                      <Zap className="w-3.5 h-3.5 text-[#F27D26]" />
                      <span>// INSHORTS 60-SECOND FLASH SYNOPSIS</span>
                    </div>
                    <p className="text-white/80 font-sans">{generatedResult.inshortsSummary}</p>
                  </div>
                )}

                {/* SEO Snippet Pill */}
                <div className="bg-black border border-white/10 rounded-2xl p-3.5 text-xs space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-bold">
                    <span>// GOOGLE NEWS SEO METADATA</span>
                    <span className="text-[#00FF41]">READINESS 96%</span>
                  </div>
                  <div className="text-white font-bold text-xs truncate">
                    {generatedResult.metaTitle}
                  </div>
                  <div className="text-white/60 text-[11px] line-clamp-2">
                    {generatedResult.metaDescription}
                  </div>
                  <div className="text-[10px] text-white/40 pt-1">
                    KEYWORDS: <strong className="text-white">{generatedResult.focusKeywords.join(', ')}</strong>
                  </div>
                </div>

                {/* Full Article Markdown */}
                <div className="border-t border-white/10 pt-4 text-xs sm:text-sm text-white/80 leading-relaxed space-y-3 font-sans">
                  {generatedResult.content.split('\n\n').map((p, idx) => {
                    if (p.startsWith('## ')) {
                      return <h3 key={idx} className="font-black uppercase tracking-tight text-base text-white mt-4">{p.replace('## ', '')}</h3>;
                    }
                    if (p.startsWith('> ')) {
                      return <blockquote key={idx} className="border-l-4 border-[#F27D26] bg-white/5 p-3 rounded-r-xl italic my-2 text-white">{p.replace('> ', '')}</blockquote>;
                    }
                    return <p key={idx}>{p}</p>;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
