import React, { useRef, useState } from 'react';
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, CheckSquare, Code2,
  FileCode2, Highlighter, ImagePlus, Italic, Link as LinkIcon, List,
  ListOrdered, Minus, Palette, Quote, Redo2, Strikethrough, Table2, Type,
  Underline, Undo2, Video, Youtube, Plus,
} from 'lucide-react';
import type { Editor } from '@tiptap/react';

interface ToolbarProps {
  editor: Editor;
  onInsertImage: () => void;
  onInsertVideo: () => void;
  onInsertYoutube: () => void;
}

const buttonClass = (active = false) => `p-2 rounded-lg transition cursor-pointer ${active ? 'bg-[#ff8c00] text-black' : 'text-white/65 hover:bg-white/10 hover:text-white'}`;

export const Toolbar: React.FC<ToolbarProps> = ({ editor, onInsertImage, onInsertVideo, onInsertYoutube }) => {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const linkUrl = useRef<HTMLInputElement>(null);
  const emojis = ['😀', '🚀', '💡', '🔥', '✅', '⚡', '📈', '🎯', '🧠', '🌐', '🛡️', '✨'];
  const runLink = () => {
    const current = editor.getAttributes('link').href || '';
    const url = window.prompt('Enter URL', current || 'https://');
    if (url === null) return;
    if (!url.trim()) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url.trim() }).run();
  };
  const setFontSize = (size: string) => editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
  const changeFontSize = (direction: 'increase' | 'decrease') => {
    const sizes = [12, 14, 16, 18, 20, 24, 32, 48];
    const currentSize = Number.parseInt(editor.getAttributes('textStyle').fontSize || '', 10) || 16;
    const currentIndex = sizes.reduce((closest, size, index) => Math.abs(size - currentSize) < Math.abs(sizes[closest] - currentSize) ? index : closest, 0);
    const nextIndex = direction === 'increase' ? Math.min(sizes.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1);
    setFontSize(`${sizes[nextIndex]}px`);
  };
  const setColor = (color: string) => editor.chain().focus().setColor(color).run();
  const setHighlight = (color: string) => editor.chain().focus().toggleHighlight({ color }).run();

  return (
    <div className="relative border-b border-[#262626] bg-[#141414] p-2">
      <div className="flex flex-wrap items-center gap-1">
        <select aria-label="Font family" className="h-9 max-w-[128px] rounded-lg border border-[#262626] bg-[#0b0b0b] px-2 text-[11px] text-white outline-none" defaultValue="" onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}>
          <option value="" disabled>Font</option><option value="Inter">Inter</option><option value="Poppins">Poppins</option><option value="Roboto">Roboto</option><option value="Open Sans">Open Sans</option><option value="Merriweather">Merriweather</option>
        </select>
        <select aria-label="Font size" className="h-9 rounded-lg border border-[#262626] bg-[#0b0b0b] px-2 text-[11px] text-white outline-none" defaultValue="" onChange={(e) => setFontSize(e.target.value)}>
          <option value="" disabled>Size</option>{['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'].map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
        <button type="button" title="Decrease selected text size" aria-label="Decrease selected text size" className={buttonClass()} onClick={() => changeFontSize('decrease')}><span className="text-[11px] font-black">A−</span></button>
        <button type="button" title="Increase selected text size" aria-label="Increase selected text size" className={buttonClass()} onClick={() => changeFontSize('increase')}><span className="flex items-center text-[11px] font-black">A<Plus className="h-2.5 w-2.5" /></span></button>
        <span className="mx-1 h-6 w-px bg-[#262626]" />
        <button type="button" title="Bold" className={buttonClass(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></button>
        <button type="button" title="Italic" className={buttonClass(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></button>
        <button type="button" title="Underline" className={buttonClass(editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline().run()}><Underline className="h-4 w-4" /></button>
        <button type="button" title="Strikethrough" className={buttonClass(editor.isActive('strike'))} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></button>
        <span className="mx-1 h-6 w-px bg-[#262626]" />
        {(['1', '2', '3', '4'] as const).map((level) => <button type="button" key={level} title={`Heading ${level}`} className={buttonClass(editor.isActive('heading', { level: Number(level) }))} onClick={() => editor.chain().focus().toggleHeading({ level: Number(level) as 1 | 2 | 3 | 4 }).run()}><span className="text-xs font-black">H{level}</span></button>)}
        <button type="button" title="Bullet list" className={buttonClass(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></button>
        <button type="button" title="Numbered list" className={buttonClass(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></button>
        <button type="button" title="Checklist" className={buttonClass(editor.isActive('taskList'))} onClick={() => editor.chain().focus().toggleTaskList().run()}><CheckSquare className="h-4 w-4" /></button>
        <button type="button" title="Quote block" className={buttonClass(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></button>
        <button type="button" title="Code block" className={buttonClass(editor.isActive('codeBlock'))} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><FileCode2 className="h-4 w-4" /></button>
        <button type="button" title="Inline code" className={buttonClass(editor.isActive('code'))} onClick={() => editor.chain().focus().toggleCode().run()}><Code2 className="h-4 w-4" /></button>
        <button type="button" title="Horizontal divider" className={buttonClass()} onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="h-4 w-4" /></button>
        <button type="button" title="Insert link" className={buttonClass(editor.isActive('link'))} onClick={runLink}><LinkIcon className="h-4 w-4" /></button>
        <button type="button" title="Insert table" className={buttonClass()} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><Table2 className="h-4 w-4" /></button>
        <button type="button" title="Insert image" className={buttonClass()} onClick={onInsertImage}><ImagePlus className="h-4 w-4" /></button>
        <button type="button" title="Upload video" className={buttonClass()} onClick={onInsertVideo}><Video className="h-4 w-4" /></button>
        <button type="button" title="Insert YouTube URL" className={buttonClass()} onClick={onInsertYoutube}><Youtube className="h-4 w-4" /></button>
        <span className="mx-1 h-6 w-px bg-[#262626]" />
        <label title="Text color" className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-white/65 hover:bg-white/10"><Palette className="h-4 w-4" /><input type="color" className="absolute inset-0 cursor-pointer opacity-0" defaultValue="#ff8c00" onChange={(e) => setColor(e.target.value)} /></label>
        <label title="Highlight color" className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-white/65 hover:bg-white/10"><Highlighter className="h-4 w-4" /><input type="color" className="absolute inset-0 cursor-pointer opacity-0" defaultValue="#ff8c00" onChange={(e) => setHighlight(e.target.value)} /></label>
        <button type="button" title="Align left" className={buttonClass(editor.isActive({ textAlign: 'left' }))} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft className="h-4 w-4" /></button>
        <button type="button" title="Align center" className={buttonClass(editor.isActive({ textAlign: 'center' }))} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter className="h-4 w-4" /></button>
        <button type="button" title="Align right" className={buttonClass(editor.isActive({ textAlign: 'right' }))} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight className="h-4 w-4" /></button>
        <button type="button" title="Justify" className={buttonClass(editor.isActive({ textAlign: 'justify' }))} onClick={() => editor.chain().focus().setTextAlign('justify').run()}><AlignJustify className="h-4 w-4" /></button>
        <button type="button" title="Undo" className={buttonClass()} onClick={() => editor.chain().focus().undo().run()}><Undo2 className="h-4 w-4" /></button>
        <button type="button" title="Redo" className={buttonClass()} onClick={() => editor.chain().focus().redo().run()}><Redo2 className="h-4 w-4" /></button>
        <button type="button" title="Emoji picker" className={buttonClass()} onClick={() => setEmojiOpen((open) => !open)}><Type className="h-4 w-4" /></button>
      </div>
      {emojiOpen && <div className="absolute right-2 top-14 z-20 grid grid-cols-6 gap-1 rounded-xl border border-[#262626] bg-[#141414] p-2 shadow-2xl">{emojis.map((emoji) => <button type="button" key={emoji} className="rounded-lg p-2 text-lg hover:bg-white/10" onClick={() => { editor.chain().focus().insertContent(emoji).run(); setEmojiOpen(false); }}>{emoji}</button>)}</div>}
      <input ref={linkUrl} className="hidden" aria-hidden="true" />
    </div>
  );
};
