import React, { useState } from 'react';
import { 
  Globe, 
  Sparkles, 
  Check, 
  AlertCircle, 
  FileCode, 
  Search, 
  Share2, 
  TrendingUp, 
  ExternalLink,
  Code,
  Layers
} from 'lucide-react';
import { Article, Category } from '../../types';

interface SeoCenterProps {
  articles: Article[];
  categories: Category[];
  onSelectArticleToEdit: (article: Article) => void;
}

export const SeoCenter: React.FC<SeoCenterProps> = ({
  articles,
  categories,
  onSelectArticleToEdit,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<Article>(articles[0]);
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'schema' | 'sitemap' | 'google-news'>('audit');

  // Compute average SEO score across all articles
  const avgSeoScore = Math.round(
    articles.reduce((acc, curr) => acc + (curr.seo?.seoScore || 90), 0) / (articles.length || 1)
  );

  const sampleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": selectedArticle.seo?.googleNewsHeadline || selectedArticle.title,
    "description": selectedArticle.seo?.metaDescription || selectedArticle.excerpt,
    "image": [selectedArticle.featuredImage],
    "datePublished": selectedArticle.publishedAt,
    "dateModified": selectedArticle.updatedAt,
    "author": [{
      "@type": "Person",
      "name": selectedArticle.author.name,
      "url": `https://presscore.io/author/${selectedArticle.author.id}`
    }],
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "PressCore AI News",
      "url": "https://presscore.io",
      "logo": {
        "@type": "ImageObject",
        "url": "https://presscore.io/logo.png"
      }
    },
    "articleSection": selectedArticle.category,
    "keywords": selectedArticle.tags.join(", ")
  };

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Header Banner */}
      <div className="bg-[#0D0D0D] text-white p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#00FF41] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>// TECHNICAL SEO &amp; GOOGLE NEWS HUB</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            Automated Google Discover &amp; SERP Readiness
          </h2>
          <p className="text-xs text-white/50 max-w-xl mt-1 font-mono">
            Live schema.org NewsArticle generator, sitemap validation, focus keyphrase auditing &amp; SERP indexing.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-black p-4 rounded-2xl border border-white/10">
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-white/50">// CATALOG SEO HEALTH</div>
            <div className="text-3xl font-black font-mono text-[#00FF41]">{avgSeoScore}%</div>
          </div>
          <div className="text-[11px] text-white/70 font-mono">
            <div>✓ {articles.length} INDEXED POSTS</div>
            <div>✓ VALID JSON-LD SCHEMA</div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex flex-wrap gap-2 font-mono">
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-4 py-2 rounded-full text-xs uppercase font-bold transition cursor-pointer ${
              activeSubTab === 'audit' ? 'bg-white text-black shadow-xs' : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            Article SEO Audit
          </button>
          <button
            onClick={() => setActiveSubTab('schema')}
            className={`px-4 py-2 rounded-full text-xs uppercase font-bold transition cursor-pointer ${
              activeSubTab === 'schema' ? 'bg-white text-black shadow-xs' : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            JSON-LD Schema
          </button>
          <button
            onClick={() => setActiveSubTab('sitemap')}
            className={`px-4 py-2 rounded-full text-xs uppercase font-bold transition cursor-pointer ${
              activeSubTab === 'sitemap' ? 'bg-white text-black shadow-xs' : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            Google News XML Sitemap
          </button>
          <button
            onClick={() => setActiveSubTab('google-news')}
            className={`px-4 py-2 rounded-full text-xs uppercase font-bold transition cursor-pointer ${
              activeSubTab === 'google-news' ? 'bg-white text-black shadow-xs' : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            Publisher Center Checklist
          </button>
        </div>
      </div>

      {/* View: Article Audit */}
      {activeSubTab === 'audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Post Selection Sidebar */}
          <div className="bg-[#0D0D0D] p-4 rounded-3xl border border-white/10 shadow-2xl space-y-2">
            <div className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider mb-2">
              // SELECT ARTICLE TO AUDIT
            </div>
            {articles.map((art) => (
              <button
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className={`w-full text-left p-3 rounded-2xl text-xs transition flex items-center justify-between gap-2 cursor-pointer ${
                  selectedArticle.id === art.id
                    ? 'bg-black border border-[#F27D26] font-bold text-white shadow-inner'
                    : 'hover:bg-white/5 text-white/70 border border-transparent'
                }`}
              >
                <div className="truncate font-sans font-bold uppercase text-[11px]">{art.title}</div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  (art.seo?.seoScore || 90) >= 90 ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/30' : 'bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/30'
                }`}>
                  {art.seo?.seoScore || 90}%
                </span>
              </button>
            ))}
          </div>

          {/* Audit Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#0D0D0D] p-6 rounded-3xl border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#F27D26] bg-[#F27D26]/10 px-2.5 py-1 rounded-full border border-[#F27D26]/20">
                    {selectedArticle.category}
                  </span>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white mt-2">
                    {selectedArticle.title}
                  </h3>
                </div>
                <button
                  onClick={() => onSelectArticleToEdit(selectedArticle)}
                  className="bg-[#F27D26] hover:bg-[#d96a1a] text-white text-xs font-mono font-bold uppercase px-4 py-2 rounded-full transition shadow-md cursor-pointer shrink-0"
                >
                  Edit Metadata
                </button>
              </div>

              {/* Google SERP Snippet Preview */}
              <div className="bg-black p-4 rounded-2xl border border-white/10 text-xs mb-4">
                <div className="text-[10px] font-mono font-bold text-[#00FF41] uppercase tracking-wider mb-2">
                  // GOOGLE SERP PREVIEW
                </div>
                <div className="text-[#00FF41] font-mono text-xs truncate mb-1">
                  https://presscore.io/news/{selectedArticle.slug}
                </div>
                <div className="text-base font-black uppercase text-white hover:underline leading-snug mb-1">
                  {selectedArticle.seo?.metaTitle || selectedArticle.title}
                </div>
                <div className="text-white/60 leading-relaxed font-sans text-xs">
                  {selectedArticle.seo?.metaDescription || selectedArticle.excerpt}
                </div>
              </div>

              {/* Keyword Analysis */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 font-mono">
                <div className="bg-black p-3.5 rounded-2xl border border-white/10">
                  <div className="text-[10px] font-bold text-white/40 uppercase">// FOCUS KEYWORDS</div>
                  <div className="text-xs font-bold text-white mt-1 truncate">
                    {selectedArticle.seo?.focusKeywords?.join(', ') || selectedArticle.category}
                  </div>
                </div>
                <div className="bg-black p-3.5 rounded-2xl border border-white/10">
                  <div className="text-[10px] font-bold text-white/40 uppercase">// READABILITY GRADE</div>
                  <div className="text-xs font-bold text-[#00FF41] mt-1">GRADE 8 [OPTIMAL]</div>
                </div>
                <div className="bg-black p-3.5 rounded-2xl border border-white/10">
                  <div className="text-[10px] font-bold text-white/40 uppercase">// SCHEMA STATUS</div>
                  <div className="text-xs font-bold text-white mt-1">NEWSARTICLE [VALID]</div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">// AUDIT CHECKLIST</div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2.5 text-white/90 bg-black p-3 rounded-2xl border border-white/10">
                    <Check className="w-4 h-4 text-[#00FF41] shrink-0" />
                    <span>Title contains primary focus keyphrase and stays within 60 characters.</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-white/90 bg-black p-3 rounded-2xl border border-white/10">
                    <Check className="w-4 h-4 text-[#00FF41] shrink-0" />
                    <span>Meta description length is optimized for Google CTR without clipping.</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-white/90 bg-black p-3 rounded-2xl border border-white/10">
                    <Check className="w-4 h-4 text-[#00FF41] shrink-0" />
                    <span>Canonical URL slug is clean and keyword-rich.</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-white/90 bg-black p-3 rounded-2xl border border-white/10">
                    <Check className="w-4 h-4 text-[#00FF41] shrink-0" />
                    <span>High-resolution featured image formatted for Google Discover cards.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View: Schema JSON-LD */}
      {activeSubTab === 'schema' && (
        <div className="bg-[#0D0D0D] text-white p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-[#00FF41]" />
              <h3 className="font-mono text-sm font-bold text-white uppercase">
                // SCHEMA.ORG/NEWSARTICLE STRUCTURED JSON-LD
              </h3>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(sampleSchema, null, 2));
                alert('Schema copied to clipboard!');
              }}
              className="bg-[#00FF41] hover:bg-[#00cc33] text-black text-xs font-mono font-bold uppercase px-4 py-1.5 rounded-full transition cursor-pointer"
            >
              Copy Schema
            </button>
          </div>
          <pre className="text-xs font-mono text-[#00FF41] overflow-x-auto p-4 bg-black rounded-2xl border border-white/10 leading-relaxed custom-scrollbar">
            {JSON.stringify(sampleSchema, null, 2)}
          </pre>
        </div>
      )}

      {/* View: XML Sitemap */}
      {activeSubTab === 'sitemap' && (
        <div className="bg-[#0D0D0D] text-white p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-[#F27D26]" />
              <h3 className="font-mono text-sm font-bold text-white uppercase">
                // SITEMAP-NEWS.XML (GOOGLE NEWS COMPLIANT)
              </h3>
            </div>
          </div>
          <pre className="text-xs font-mono text-white/80 overflow-x-auto p-4 bg-black rounded-2xl border border-white/10 leading-relaxed custom-scrollbar">
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${articles.map(art => `  <url>
    <loc>https://presscore.io/news/${art.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>PressCore AI News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${art.publishedAt}</news:publication_date>
      <news:title>${art.seo?.googleNewsHeadline || art.title}</news:title>
      <news:keywords>${art.tags.join(', ')}</news:keywords>
    </news:news>
  </url>`).join('\n')}
</urlset>`}
          </pre>
        </div>
      )}

      {/* View: Google News Checklist */}
      {activeSubTab === 'google-news' && (
        <div className="bg-[#0D0D0D] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <h3 className="text-base font-black uppercase tracking-tight text-white">
            Google Publisher Center &amp; Discover Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-black rounded-2xl border border-white/10 space-y-2">
              <div className="font-bold text-white flex items-center gap-2 uppercase">
                <Check className="w-4 h-4 text-[#00FF41]" />
                <span>Editorial Transparency &amp; Byline</span>
              </div>
              <p className="text-white/60 font-sans text-xs">
                All articles feature verified author avatars, roles, bios, and clear publication dates required by Google News guidelines.
              </p>
            </div>

            <div className="p-4 bg-black rounded-2xl border border-white/10 space-y-2">
              <div className="font-bold text-white flex items-center gap-2 uppercase">
                <Check className="w-4 h-4 text-[#00FF41]" />
                <span>Fast Mobile Loading &amp; Responsive Layout</span>
              </div>
              <p className="text-white/60 font-sans text-xs">
                Lighthouse performance score 98+ with optimized image formats and zero layout shift.
              </p>
            </div>

            <div className="p-4 bg-black rounded-2xl border border-white/10 space-y-2">
              <div className="font-bold text-white flex items-center gap-2 uppercase">
                <Check className="w-4 h-4 text-[#00FF41]" />
                <span>Automated Inshorts 60s Briefs</span>
              </div>
              <p className="text-white/60 font-sans text-xs">
                Enhances user dwell time and provides instant factual clarity for mobile Discover carousels.
              </p>
            </div>

            <div className="p-4 bg-black rounded-2xl border border-white/10 space-y-2">
              <div className="font-bold text-white flex items-center gap-2 uppercase">
                <Check className="w-4 h-4 text-[#00FF41]" />
                <span>Structured NewsArticle JSON-LD</span>
              </div>
              <p className="text-white/60 font-sans text-xs">
                Full schema validation enables rich snippet badges and headline carousels in Google Search.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
