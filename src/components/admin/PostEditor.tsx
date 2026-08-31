import React, { useState } from 'react';
import { 
  Save, 
  Sparkles, 
  ArrowLeft, 
  Eye, 
  Image as ImageIcon, 
  Tag, 
  Zap, 
  Check, 
  Globe, 
  Wand2, 
  FileText, 
  Flame,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Article, Category, User } from '../../types';
import { geminiService } from '../../services/geminiService';

interface PostEditorProps {
  article: Article | null; // null if creating new
  categories: Category[];
  currentUser: User;
  onSave: (articleData: Partial<Article>) => void;
  onCancel: () => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({
  article,
  categories,
  currentUser,
  onSave,
  onCancel,
}) => {
  const isEditing = !!article;

  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [content, setContent] = useState(article?.content || '');
  const [category, setCategory] = useState(article?.category || categories[0]?.name || 'Technology');
  const [subCategory, setSubCategory] = useState(article?.subCategory || '');
  const [tags, setTags] = useState(article?.tags.join(', ') || 'AI, Technology, News');
  const [featuredImage, setFeaturedImage] = useState(
    article?.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  );
  const [inshortsSummary, setInshortsSummary] = useState(article?.inshortsSummary || '');
  const [isBreaking, setIsBreaking] = useState(article?.isBreaking || false);
  const [isTrending, setIsTrending] = useState(article?.isTrending || false);
  const [isEditorPick, setIsEditorPick] = useState(article?.isEditorPick || false);
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled' | 'in_review'>(
    article?.status === 'trash' ? 'draft' : (article?.status || 'published')
  );

  // SEO Fields
  const [metaTitle, setMetaTitle] = useState(article?.seo?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(article?.seo?.metaDescription || '');
  const [focusKeywords, setFocusKeywords] = useState(article?.seo?.focusKeywords?.join(', ') || '');
  const [googleNewsHeadline, setGoogleNewsHeadline] = useState(article?.seo?.googleNewsHeadline || '');
  const [seoScore, setSeoScore] = useState(article?.seo?.seoScore || 94);

  // Active sub-tab in editor
  const [editorTab, setEditorTab] = useState<'write' | 'preview' | 'seo' | 'ai-tools'>('write');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('');

  // Auto-generate slug from title
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!article) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  // AI Action: Auto-Optimize Full SEO & Schema
  const handleAiOptimizeSeo = async () => {
    if (!title && !content) {
      alert('Please enter a title or content first.');
      return;
    }
    setIsAiLoading(true);
    setAiStatusMessage('Analyzing semantics with Gemini & generating Google News metadata...');
    try {
      const result = await geminiService.generateSeo(title, content, category);
      setMetaTitle(result.metaTitle);
      setMetaDescription(result.metaDescription);
      setFocusKeywords(result.focusKeywords.join(', '));
      setGoogleNewsHeadline(result.googleNewsHeadline);
      setSeoScore(result.seoScore);
      if (!slug) setSlug(result.canonicalSlug);
      setEditorTab('seo');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
      setAiStatusMessage('');
    }
  };

  // AI Action: Generate 60-Word Inshorts Flash Summary
  const handleAiGenerateInshorts = async () => {
    if (!content && !excerpt) {
      alert('Please add some article content first.');
      return;
    }
    setIsAiLoading(true);
    setAiStatusMessage('Condensing into 60-word Inshorts factual brief...');
    try {
      const result = await geminiService.rewriteContent(content || excerpt, 'inshorts');
      setInshortsSummary(result.rewrittenContent);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
      setAiStatusMessage('');
    }
  };

  // AI Action: Polish Grammar & AP Style
  const handleAiCheckGrammar = async () => {
    if (!content) return;
    setIsAiLoading(true);
    setAiStatusMessage('Polishing grammar, sentence structure, and AP Style...');
    try {
      const result = await geminiService.checkGrammar(content);
      setContent(result.correctedText);
      alert(`Grammar check complete: ${result.feedback || 'Text polished successfully.'}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
      setAiStatusMessage('');
    }
  };

  // AI Action: Detect Category & Tags
  const handleAiDetectCategory = async () => {
    if (!title && !content) return;
    setIsAiLoading(true);
    setAiStatusMessage('Detecting taxonomy & matching standard categories...');
    try {
      const result = await geminiService.detectCategory(title, content);
      if (result.suggestedCategory) setCategory(result.suggestedCategory);
      if (result.subCategory) setSubCategory(result.subCategory);
      if (result.suggestedTags?.length) setTags(result.suggestedTags.join(', '));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
      setAiStatusMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Article title is required.');
      return;
    }

    const tagArray = tags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const keywordArray = focusKeywords
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const payload: Partial<Article> = {
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      excerpt: excerpt.trim() || title,
      content: content.trim() || 'Article content is being drafted...',
      category,
      subCategory: subCategory.trim() || undefined,
      tags: tagArray.length > 0 ? tagArray : ['News', 'Technology'],
      featuredImage: featuredImage.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      inshortsSummary: inshortsSummary.trim() || excerpt.trim() || title,
      isBreaking,
      isTrending,
      isEditorPick,
      status,
      readTimeMinutes: Math.max(1, Math.ceil((content.split(/\s+/).length || 200) / 200)),
      seo: {
        metaTitle: metaTitle.trim() || title.trim(),
        metaDescription: metaDescription.trim() || excerpt.trim(),
        focusKeywords: keywordArray.length > 0 ? keywordArray : [category.toLowerCase(), 'news'],
        googleNewsHeadline: googleNewsHeadline.trim() || title.trim(),
        seoScore: seoScore || 94,
        schemaType: 'NewsArticle',
      }
    };

    onSave(payload);
  };

  return (
    <div className="bg-[#0D0D0D] rounded-3xl border border-white/10 shadow-2xl p-6 max-w-5xl mx-auto text-white font-sans">
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
            title="Cancel & return to post list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">
              {isEditing ? 'Edit Post' : 'Create New Article'}
            </h2>
            <p className="text-xs text-white/50 font-mono">
              // AUTHOR: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role.replace('_', ' ').toUpperCase()})
            </p>
          </div>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center gap-3">
          <div className="flex bg-black p-1 rounded-full text-xs font-mono border border-white/10">
            <button
              onClick={() => setEditorTab('write')}
              className={`px-4 py-1.5 rounded-full transition uppercase font-bold text-[10px] cursor-pointer ${editorTab === 'write' ? 'bg-white text-black shadow-xs' : 'text-white/60 hover:text-white'}`}
            >
              Write
            </button>
            <button
              onClick={() => setEditorTab('preview')}
              className={`px-4 py-1.5 rounded-full transition uppercase font-bold text-[10px] cursor-pointer ${editorTab === 'preview' ? 'bg-white text-black shadow-xs' : 'text-white/60 hover:text-white'}`}
            >
              Preview
            </button>
            <button
              onClick={() => setEditorTab('seo')}
              className={`px-4 py-1.5 rounded-full transition uppercase font-bold text-[10px] cursor-pointer ${editorTab === 'seo' ? 'bg-[#00FF41] text-black shadow-xs' : 'text-white/60 hover:text-white'}`}
            >
              SEO [{seoScore}%]
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-[#F27D26] hover:bg-[#d96a1a] text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full flex items-center gap-2 transition shadow-lg cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Update' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* AI Assistant Quick Toolbar */}
      <div className="bg-[#141414] p-4 rounded-2xl border border-white/10 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00FF41] text-black rounded-full shadow-xs font-black">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black uppercase text-white tracking-tight">Gemini AI Editorial Co-Pilot</div>
            <div className="text-[10px] font-mono text-white/50 uppercase">// 1-Click SEO generation, Inshorts summary &amp; grammar polish</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAiOptimizeSeo}
            disabled={isAiLoading}
            className="bg-white/10 hover:bg-white hover:text-black text-white border border-white/10 text-[10px] font-mono font-bold uppercase px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#00FF41]" />
            <span>Auto-SEO</span>
          </button>

          <button
            type="button"
            onClick={handleAiGenerateInshorts}
            disabled={isAiLoading}
            className="bg-white/10 hover:bg-[#F27D26] hover:text-white text-white border border-white/10 text-[10px] font-mono font-bold uppercase px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#F27D26]" />
            <span>Inshorts 60s</span>
          </button>

          <button
            type="button"
            onClick={handleAiCheckGrammar}
            disabled={isAiLoading}
            className="bg-white/10 hover:bg-[#00FF41] hover:text-black text-white border border-white/10 text-[10px] font-mono font-bold uppercase px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-[#00FF41]" />
            <span>Polish Grammar</span>
          </button>

          <button
            type="button"
            onClick={handleAiDetectCategory}
            disabled={isAiLoading}
            className="bg-white/10 hover:bg-white hover:text-black text-white border border-white/10 text-[10px] font-mono font-bold uppercase px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-white/70" />
            <span>Auto-Category</span>
          </button>
        </div>
      </div>

      {isAiLoading && (
        <div className="bg-black text-[#00FF41] border border-[#00FF41]/30 px-4 py-3 rounded-2xl text-xs font-mono flex items-center gap-2.5 mb-5 animate-pulse uppercase">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>{aiStatusMessage || 'Gemini is processing your request...'}</span>
        </div>
      )}

      {/* Editor Content Tabs */}
      {editorTab === 'write' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
              // ARTICLE TITLE *
            </label>
            <input
              type="text"
              placeholder="e.g. Breakthrough in Solid-State EV Batteries Unlocks 900-Mile Range"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full text-lg sm:text-xl font-black uppercase tracking-tight bg-black border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 focus:border-[#F27D26] outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
                // CATEGORY *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs font-mono font-bold text-white uppercase focus:border-[#F27D26] outline-none"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
                // SUB-CATEGORY (OPTIONAL)
              </label>
              <input
                type="text"
                placeholder="e.g. Battery Tech, Enterprise Intelligence"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:border-[#F27D26] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
              // EXCERPT / SUB-HEADLINE HOOK
            </label>
            <textarea
              rows={2}
              placeholder="A compelling 2-sentence summary hook for social previews and Google Discover..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-2xl p-3.5 text-xs text-white/80 placeholder-white/30 focus:border-[#F27D26] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-[#F27D26] uppercase tracking-wider mb-1.5">
              // INSHORTS 60-SECOND FLASH SYNOPSIS
            </label>
            <textarea
              rows={2}
              placeholder="Exact 60-word summary for the Inshorts mobile flash cards feed..."
              value={inshortsSummary}
              onChange={(e) => setInshortsSummary(e.target.value)}
              className="w-full bg-black border border-[#F27D26]/40 rounded-2xl p-3.5 text-xs text-white/90 placeholder-white/30 focus:border-[#F27D26] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
              // FEATURED IMAGE URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs font-mono text-white placeholder-white/30 focus:border-[#F27D26] outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider">
                // FULL ARTICLE CONTENT (MARKDOWN) *
              </label>
              <span className="text-[10px] font-mono text-white/40 uppercase">
                {content.split(/\s+/).filter(Boolean).length} words • ~{Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200))} min read
              </span>
            </div>
            <textarea
              rows={12}
              placeholder="Write or generate your markdown article here. Use ## Headings, ### Subheadings, > Quotes, - Bullet points..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-2xl p-4 text-xs sm:text-sm font-sans leading-relaxed text-white placeholder-white/30 focus:border-[#F27D26] outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
                // TAGS (COMMA-SEPARATED)
              </label>
              <input
                type="text"
                placeholder="AI, Technology, Clean Energy, EV"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:border-[#F27D26] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
                // PUBLICATION STATUS
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs font-mono font-bold text-white uppercase focus:border-[#F27D26] outline-none"
              >
                <option value="published">Published (Live on site)</option>
                <option value="draft">Draft (Private)</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_review">In Review (Editorial Check)</option>
              </select>
            </div>
          </div>

          {/* Promotion Toggles */}
          <div className="flex flex-wrap gap-4 pt-3 border-t border-white/10 text-xs font-mono">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={(e) => setIsBreaking(e.target.checked)}
                className="rounded accent-[#F27D26] w-4 h-4 cursor-pointer"
              />
              <span className="font-bold text-[#F27D26] uppercase">// BREAKING TICKER</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
                className="rounded accent-[#00FF41] w-4 h-4 cursor-pointer"
              />
              <span className="font-bold text-white/80 uppercase">// TRENDING LIST</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isEditorPick}
                onChange={(e) => setIsEditorPick(e.target.checked)}
                className="rounded accent-white w-4 h-4 cursor-pointer"
              />
              <span className="font-bold text-white uppercase">// EDITOR'S CHOICE</span>
            </label>
          </div>
        </form>
      )}

      {/* SEO Tab */}
      {editorTab === 'seo' && (
        <div className="space-y-4">
          <div className="bg-black p-5 rounded-2xl border border-white/10 text-xs">
            <div className="text-[10px] font-mono font-bold text-[#00FF41] uppercase tracking-wider mb-2">
              // GOOGLE SERP &amp; DISCOVER PREVIEW
            </div>
            <div className="text-xs text-[#00FF41] font-mono truncate mb-1">
              https://presscore.io/news/{slug || 'post-slug'}
            </div>
            <div className="text-base font-black uppercase text-white hover:underline leading-snug mb-1">
              {metaTitle || title || 'Post Headline Here'}
            </div>
            <div className="text-xs text-white/60 leading-relaxed">
              {metaDescription || excerpt || 'Meta description hook preview goes here...'}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
              // SEO META TITLE ({metaTitle.length}/60 CHARS)
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Optimized headline under 60 characters..."
              className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:border-[#F27D26] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
              // META DESCRIPTION ({metaDescription.length}/155 CHARS)
            </label>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="High-CTR description between 145-155 characters..."
              className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:border-[#F27D26] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
                // CANONICAL URL SLUG
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs font-mono text-white placeholder-white/30 focus:border-[#F27D26] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
                // FOCUS KEYWORDS
              </label>
              <input
                type="text"
                value={focusKeywords}
                onChange={(e) => setFocusKeywords(e.target.value)}
                placeholder="autonomous ai, enterprise software, 2026 trends"
                className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:border-[#F27D26] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider mb-1.5">
              // GOOGLE NEWS FEED HEADLINE
            </label>
            <input
              type="text"
              value={googleNewsHeadline}
              onChange={(e) => setGoogleNewsHeadline(e.target.value)}
              placeholder="Factual, AP-style headline for Google News publisher ingestion..."
              className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:border-[#F27D26] outline-none"
            />
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {editorTab === 'preview' && (
        <div className="p-6 bg-black rounded-3xl border border-white/10">
          <div className="max-w-2xl mx-auto bg-[#141414] p-6 rounded-3xl border border-white/10 shadow-xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F27D26] bg-[#F27D26]/10 px-2.5 py-1 rounded-full border border-[#F27D26]/20">
              {category}
            </span>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-3 mb-3">
              {title || 'Untitled Post'}
            </h1>
            <p className="text-sm text-white/60 mb-4">{excerpt}</p>
            {featuredImage && (
              <img
                src={featuredImage}
                alt={title}
                className="w-full h-64 object-cover rounded-2xl mb-6"
              />
            )}
            <div className="text-sm text-white/80 leading-relaxed space-y-4 font-sans">
              {content.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
