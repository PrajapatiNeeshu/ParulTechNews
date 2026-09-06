import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import type { Editor } from '@tiptap/react';

interface ImageUploaderProps { editor: Editor; onClose: () => void; }

export const ImageUploader: React.FC<ImageUploaderProps> = ({ editor, onClose }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const addImage = (src: string) => { editor.chain().focus().setImage({ src, alt: 'Article image' }).run(); onClose(); };
  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => addImage(String(reader.result));
    reader.readAsDataURL(file);
  };
  return <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 p-4" onClick={onClose}><div className="w-full max-w-md rounded-2xl border border-[#262626] bg-[#141414] p-5" onClick={(event) => event.stopPropagation()}><div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-black uppercase text-white">Insert image</h3><button type="button" onClick={onClose} className="text-white/50 hover:text-white">×</button></div><div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => fileRef.current?.click()} className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#ff8c00]/50 p-6 text-xs text-white/70 hover:bg-[#ff8c00]/10"><Upload className="h-5 w-5 text-[#ff8c00]" />Upload image</button><label className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#262626] p-6 text-xs text-white/70 hover:bg-white/5"><span className="text-[#ff8c00]">URL</span><input autoFocus type="url" placeholder="https://..." className="w-full bg-transparent text-center text-xs outline-none" onKeyDown={(event) => { if (event.key === 'Enter') addImage(event.currentTarget.value); }} /></label></div><div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); handleFiles(event.dataTransfer.files); }} className="mt-3 rounded-xl border border-dashed border-[#262626] p-4 text-center text-[11px] text-white/40">Drag and drop an image here</div><input ref={fileRef} hidden type="file" accept="image/*" onChange={(event) => handleFiles(event.target.files)} /></div></div>;
};
