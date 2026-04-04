'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
import type { PropertyImage } from '@/types/index';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80';

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayImages = images.length > 0 ? images : [{ id: '0', url: PLACEHOLDER, publicId: null, caption: null, order: 0 }];
  const gridImages = displayImages.slice(0, 5);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + displayImages.length) % displayImages.length : 0));
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % displayImages.length : 0));

  return (
    <>
      {/* Grid Gallery */}
      <div className="gallery-grid rounded-2xl overflow-hidden cursor-pointer" onClick={() => openLightbox(0)}>
        {gridImages.map((img, index) => (
          <div key={img.id} className="relative overflow-hidden group" onClick={(e) => { e.stopPropagation(); openLightbox(index); }}>
            <Image
              src={img.url}
              alt={img.caption || `${title} - Image ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0}
            />
            {index === 4 && displayImages.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <Grid3X3 className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-lg font-semibold">+{displayImages.length - 5} more</span>
                </div>
              </div>
            )}
            {index === 0 && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        ))}
      </div>

      {displayImages.length > 1 && (
        <button
          onClick={() => openLightbox(0)}
          className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Grid3X3 className="w-4 h-4" />
          View all {displayImages.length} photos
        </button>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10">
            <X className="w-6 h-6" />
          </button>

          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10">
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh] mx-12" onClick={(e) => e.stopPropagation()}>
            <Image
              src={displayImages[lightboxIndex].url}
              alt={displayImages[lightboxIndex].caption || `${title} - Image ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10">
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4">
            {displayImages.map((img, i) => (
              <button
                key={img.id}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                className={`relative w-14 h-10 rounded overflow-hidden border-2 transition-all shrink-0 ${i === lightboxIndex ? 'border-white' : 'border-white/30 opacity-60 hover:opacity-100'}`}
              >
                <Image src={img.url} alt="" fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIndex + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </>
  );
}
