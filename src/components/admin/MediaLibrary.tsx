import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Trash2, Copy, Check, Filter, Search, Plus } from 'lucide-react';
import { MediaItem } from '../../types';

interface MediaLibraryProps {
  media: MediaItem[];
  onUploadMedia: (item: Partial<MediaItem>) => void;
  onDeleteMedia: (id: string) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  media,
  onUploadMedia,
  onDeleteMedia,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newFolder, setNewFolder] = useState('Editorial');

  const filteredMedia = selectedFolder === 'all'
    ? media
    : media.filter(m => m.folder?.toLowerCase() === selectedFolder.toLowerCase());

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    onUploadMedia({
      title: newTitle,
      url: newUrl,
      folder: newFolder,
      altText: newTitle,
      dimensions: '1200x800',
      sizeBytes: 340000,
      mimeType: 'image/jpeg',
      uploadedBy: 'Editorial Staff',
      uploadedAt: new Date().toISOString().split('T')[0],
    });

    setShowUploadModal(false);
    setNewTitle('');
    setNewUrl('');
  };

  return (
    <div className="space-y-6 text-white font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D0D0D] p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-[#00FF41] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <ImageIcon className="w-4 h-4" />
            <span>// DIGITAL ASSET CDN STORAGE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            Media &amp; Photography Assets
          </h2>
          <p className="text-xs text-white/50 mt-1 font-mono">
            Optimized responsive assets with instant CDN distribution and alt-text SEO tagging.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-[#F27D26] hover:bg-[#d96a1a] text-white text-xs font-mono font-bold uppercase px-5 py-2.5 rounded-full flex items-center gap-2 transition cursor-pointer shadow-lg shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Asset</span>
        </button>
      </div>

      {/* Folder filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-mono">
        {['all', 'Hero Banners', 'Editorial', 'Automotive', 'Tech'].map(f => (
          <button
            key={f}
            onClick={() => setSelectedFolder(f)}
            className={`px-4 py-2 rounded-full uppercase font-bold transition cursor-pointer shrink-0 ${
              selectedFolder === f ? 'bg-white text-black' : 'bg-[#0D0D0D] border border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map(item => (
          <div key={item.id} className="group bg-[#0D0D0D] rounded-3xl border border-white/10 overflow-hidden shadow-2xl hover:border-white/20 transition">
            <div className="relative aspect-[16/10] bg-black overflow-hidden">
              <img
                src={item.url}
                alt={item.altText}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-xs text-[#00FF41] border border-white/10 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full">
                {item.folder}
              </div>
            </div>

            <div className="p-4">
              <h4 className="text-xs font-sans font-bold text-white uppercase truncate mb-1">{item.title}</h4>
              <div className="text-[10px] font-mono text-white/40 flex items-center justify-between mb-3">
                <span>{item.dimensions}</span>
                <span>{item.uploadedAt}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  onClick={() => handleCopyUrl(item)}
                  className="text-xs font-mono font-bold text-[#F27D26] hover:text-[#d96a1a] flex items-center gap-1.5 cursor-pointer uppercase text-[10px]"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy CDN URL'}</span>
                </button>

                <button
                  onClick={() => onDeleteMedia(item.id)}
                  className="text-white/30 hover:text-rose-500 p-1 transition cursor-pointer"
                  title="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#0D0D0D] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/10 text-white font-sans">
            <h3 className="text-lg font-black uppercase tracking-tight text-white mb-4">Add Asset to Library</h3>
            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block font-bold text-white/70 uppercase mb-1 text-[10px]">// ASSET TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Next-Gen EV Concept Studio Shot"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl p-3 text-white placeholder-white/30 focus:border-[#F27D26] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-white/70 uppercase mb-1 text-[10px]">// IMAGE URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl p-3 text-white placeholder-white/30 focus:border-[#F27D26] outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-white/70 uppercase mb-1 text-[10px]">// FOLDER CATEGORY</label>
                <select
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl p-3 font-bold text-white uppercase focus:border-[#F27D26] outline-none"
                >
                  <option value="Editorial">Editorial</option>
                  <option value="Hero Banners">Hero Banners</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Tech">Tech</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="bg-white/10 hover:bg-white/20 text-white font-mono font-bold uppercase px-4 py-2 rounded-full cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#F27D26] hover:bg-[#d96a1a] text-white font-mono font-bold uppercase px-5 py-2 rounded-full cursor-pointer text-xs shadow-lg"
                >
                  Save to CDN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
