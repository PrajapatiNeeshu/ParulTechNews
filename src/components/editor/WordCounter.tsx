import React from 'react';

interface WordCounterProps {
  text: string;
  html: string;
}

export const WordCounter: React.FC<WordCounterProps> = ({ text, html }) => {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const readingMinutes = Math.max(1, Math.ceil(words / 200));
  return <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#262626] bg-[#0b0b0b] px-4 py-2 text-[10px] font-mono uppercase text-white/45"><span>{words.toLocaleString()} words</span><span>{characters.toLocaleString()} characters</span><span>~{readingMinutes} min read</span><span>{html.length.toLocaleString()} HTML chars</span></div>;
};
