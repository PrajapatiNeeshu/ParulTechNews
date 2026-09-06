import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Youtube from '@tiptap/extension-youtube';
import TurndownService from 'turndown';
import { marked } from 'marked';
import { Clipboard, Download, FileCode2, FileText, History, Maximize2, Save, X } from 'lucide-react';
import { Toolbar } from './Toolbar';
import { WordCounter } from './WordCounter';
import { SEOAnalyzer } from './SEOAnalyzer';
import { ImageUploader } from './ImageUploader';
import { PreviewPanel } from './PreviewPanel';

interface RichTextEditorProps {
  initialContent?: string;
  initialMarkdown?: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  metaDescription: string;
  keywords: string;
  storageKey?: string;
  onChange: (value: { html: string; markdown: string; text: string }) => void;
}

const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() { return [{ types: ['textStyle'], attributes: { fontSize: { default: null, parseHTML: (element: HTMLElement) => element.style.fontSize || null, renderHTML: (attributes: { fontSize?: string }) => attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {} } } }]; },
});
const ResizableImage = Image.extend({
  addAttributes() { return { ...this.parent?.(), width: { default: '100%' }, align: { default: 'center' } }; },
});
const normaliseContent = (html: string | undefined, markdown: string | undefined) => {
  if (html?.trim()) return html;
  if (markdown?.trim()) return marked.parse(markdown) as string;
  return '<p></p>';
};
const download = (name: string, content: string, type: string) => { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url); };

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialContent, initialMarkdown, title, excerpt, featuredImage, metaDescription, keywords, storageKey = 'presscore-editor-draft', onChange }) => {
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [recoveryAvailable, setRecoveryAvailable] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [html, setHtml] = useState(() => normaliseContent(initialContent, initialMarkdown));
  const [markdown, setMarkdown] = useState('');
  const turndown = useMemo(() => new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' }), []);
  const latest = useRef({ html, markdown });
  const editor = useEditor({
    extensions: [StarterKit.configure({ link: false, underline: false }), FontSize, TextStyle, Color, FontFamily, Underline, Highlight.configure({ multicolor: true }), Link.configure({ openOnClick: false, autolink: true }), TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }), Placeholder.configure({ placeholder: 'Start writing your story...' }), ResizableImage.configure({ allowBase64: true }), Table.configure({ resizable: true }), TableRow, TableHeader, TableCell, TaskList, TaskItem.configure({ nested: true }), Youtube.configure({ controls: true, nocookie: true, HTMLAttributes: { class: 'editor-youtube' } })],
    content: normaliseContent(initialContent, initialMarkdown),
    editorProps: { attributes: { class: 'editor-content min-h-[360px] rounded-b-2xl bg-[#0b0b0b] px-5 py-4 text-[15px] leading-7 text-white/90 outline-none sm:min-h-[460px]' } },
    onUpdate: ({ editor: current }) => {
      const nextHtml = current.getHTML();
      const nextMarkdown = turndown.turndown(nextHtml);
      const nextText = current.getText();
      setHtml(nextHtml); setMarkdown(nextMarkdown); latest.current = { html: nextHtml, markdown: nextMarkdown }; onChange({ html: nextHtml, markdown: nextMarkdown, text: nextText });
    },
  });
  useEffect(() => { const draft = localStorage.getItem(storageKey); setRecoveryAvailable(Boolean(draft)); }, [storageKey]);
  useEffect(() => { if (!editor) return; const nextHtml = editor.getHTML(); const nextMarkdown = turndown.turndown(nextHtml); setHtml(nextHtml); setMarkdown(nextMarkdown); latest.current = { html: nextHtml, markdown: nextMarkdown }; }, [editor, turndown]);
  useEffect(() => { const timer = window.setInterval(() => { if (!latest.current.html || latest.current.html === '<p></p>') return; localStorage.setItem(storageKey, JSON.stringify({ ...latest.current, savedAt: new Date().toISOString() })); setSavedAt(new Date()); }, 30000); return () => window.clearInterval(timer); }, [storageKey]);
  const recover = () => { const raw = localStorage.getItem(storageKey); if (!raw || !editor) return; const draft = JSON.parse(raw) as { html: string }; editor.commands.setContent(draft.html); setRecoveryAvailable(false); };
  const clearDraft = () => { localStorage.removeItem(storageKey); setRecoveryAvailable(false); };
  const insertVideo = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => editor?.chain().focus().insertContent(`<p><a href="${String(reader.result)}">${file.name}</a></p>`).run();
      reader.readAsDataURL(file);
    };
    input.click();
    window.setTimeout(() => {
      if (!input.files?.length) {
        const url = window.prompt('Or enter a video URL');
        if (url) editor?.chain().focus().insertContent(`<p><a href="${url}">${url}</a></p>`).run();
      }
    }, 300);
  };
  const insertYoutube = () => { const url = window.prompt('YouTube URL'); if (url) editor?.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 360 }).run(); };
  const setImageAttribute = (attribute: 'width' | 'align', value: string) => editor?.chain().focus().updateAttributes('image', { [attribute]: value }).run();
  const copy = async (value: string) => { await navigator.clipboard.writeText(value); };
  if (!editor) return null;
  return <div className="relative space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#262626] bg-[#141414] px-3 py-2"><div className="flex items-center gap-2 text-[10px] font-mono uppercase text-white/45"><Save className="h-3.5 w-3.5 text-[#ff8c00]" />{savedAt ? `Autosaved ${savedAt.toLocaleTimeString()}` : 'Autosave every 30 seconds'}</div><div className="flex flex-wrap items-center gap-2">{recoveryAvailable && <button type="button" onClick={recover} className="flex items-center gap-1.5 rounded-lg bg-[#ff8c00]/10 px-2.5 py-1.5 text-[10px] font-bold uppercase text-[#ff8c00]"><History className="h-3.5 w-3.5" />Recover draft</button>}<button type="button" onClick={clearDraft} className="text-[10px] uppercase text-white/35 hover:text-white">Clear recovery</button></div></div>
    <div className="overflow-hidden rounded-2xl border border-[#262626] bg-[#141414]"><Toolbar editor={editor} onInsertImage={() => setShowImageUploader(true)} onInsertVideo={insertVideo} onInsertYoutube={insertYoutube} /><EditorContent editor={editor} /><div className="flex flex-wrap items-center gap-2 border-t border-[#262626] bg-[#141414] px-3 py-2"><span className="text-[10px] uppercase text-white/35">Selected image:</span>{['25%', '50%', '75%', '100%'].map((width) => <button type="button" key={width} onClick={() => setImageAttribute('width', width)} className="rounded-md border border-[#262626] px-2 py-1 text-[10px] text-white/60 hover:border-[#ff8c00] hover:text-[#ff8c00]">{width}</button>)}{['left', 'center', 'right'].map((align) => <button type="button" key={align} onClick={() => setImageAttribute('align', align)} className="rounded-md border border-[#262626] px-2 py-1 text-[10px] capitalize text-white/60 hover:border-[#ff8c00] hover:text-[#ff8c00]">{align}</button>)}</div><WordCounter text={editor.getText()} html={html} /></div>
    <div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setShowPreview((value) => !value)} className="flex items-center gap-2 rounded-lg border border-[#262626] bg-[#141414] px-3 py-2 text-[10px] font-bold uppercase text-white/70 hover:border-[#ff8c00] hover:text-[#ff8c00]"><Maximize2 className="h-3.5 w-3.5" />{showPreview ? 'Hide preview' : 'Publishing preview'}</button><button type="button" onClick={() => copy(html)} className="flex items-center gap-2 rounded-lg border border-[#262626] bg-[#141414] px-3 py-2 text-[10px] font-bold uppercase text-white/70 hover:text-white"><Clipboard className="h-3.5 w-3.5" />Copy HTML</button><button type="button" onClick={() => copy(markdown)} className="flex items-center gap-2 rounded-lg border border-[#262626] bg-[#141414] px-3 py-2 text-[10px] font-bold uppercase text-white/70 hover:text-white"><FileText className="h-3.5 w-3.5" />Copy Markdown</button><button type="button" onClick={() => download('article.md', markdown, 'text/markdown')} className="flex items-center gap-2 rounded-lg border border-[#262626] bg-[#141414] px-3 py-2 text-[10px] font-bold uppercase text-white/70 hover:text-white"><Download className="h-3.5 w-3.5" />Export MD</button><button type="button" onClick={() => download('article.html', html, 'text/html')} className="flex items-center gap-2 rounded-lg border border-[#262626] bg-[#141414] px-3 py-2 text-[10px] font-bold uppercase text-white/70 hover:text-white"><FileCode2 className="h-3.5 w-3.5" />Export HTML</button></div>
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">{showPreview && <PreviewPanel title={title} excerpt={excerpt} image={featuredImage} html={html} />}<SEOAnalyzer text={editor.getText()} html={html} metaDescription={metaDescription} keywords={keywords} /></div>
    {showImageUploader && <ImageUploader editor={editor} onClose={() => setShowImageUploader(false)} />}
  </div>;
};
