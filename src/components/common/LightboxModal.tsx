import React from 'react';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';

export const LightboxModal: React.FC = () => {
  const { lightboxMedia, closeLightbox } = useApp();

  if (!lightboxMedia) return null;

  return (
    <div
      onClick={closeLightbox}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 cursor-zoom-out"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center cursor-default"
      >
        <button
          onClick={closeLightbox}
          className="absolute -top-10 right-0 text-white/80 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          aria-label="Tutup Pratinjau"
        >
          <X className="w-6 h-6" />
        </button>

        <img
          src={lightboxMedia.url}
          alt={lightboxMedia.title}
          className="max-h-[75vh] w-auto max-w-full rounded-lg shadow-2xl object-contain border border-stone-800"
        />

        <div className="w-full text-center mt-3 text-white space-y-1">
          <h4 className="text-sm font-semibold">{lightboxMedia.title}</h4>
          {lightboxMedia.caption && (
            <p className="text-xs text-stone-300 max-w-xl mx-auto">
              {lightboxMedia.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
