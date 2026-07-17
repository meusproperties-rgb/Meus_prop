'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
import type { PropertyImage } from '@/types/index';

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayImages = [...images].sort((a, b) => a.order - b.order);
  const featuredImage = displayImages[0];
  const thumbnailImages = displayImages.slice(1);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + displayImages.length) % displayImages.length : 0));
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % displayImages.length : 0));

  if (displayImages.length === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center border border-white/10 bg-[#111111] text-center">
        <div className="space-y-3 px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8f939c]">No property images</p>
          <p className="text-sm text-[#a3a5aa]">This property currently has no images available from the API.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div
          className="group relative aspect-[3/2] cursor-pointer overflow-hidden border border-white/10 bg-[#111111]"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={featuredImage.url}
            alt={featuredImage.caption || `${title} - Image 1`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 1280px) 100vw, 66vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          {displayImages.length > 1 ? (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/55 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/85">
              <Grid3X3 className="h-4 w-4" />
              {displayImages.length} Photos
            </div>
          ) : null}
        </div>

        {thumbnailImages.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {thumbnailImages.map((img, index) => (
              <button
                key={img.id}
                type="button"
                onClick={() => openLightbox(index + 1)}
                className="group relative aspect-[3/2] w-44 shrink-0 overflow-hidden border border-white/10 bg-[#111111] text-left"
              >
                <Image
                  src={img.url}
                  alt={img.caption || `${title} - Image ${index + 2}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="176px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {displayImages.length > 1 && (
        <button
          onClick={() => openLightbox(0)}
          className="mt-3 flex items-center gap-2 text-sm text-[#8f939c] transition-colors hover:text-white"
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
          <button onClick={closeLightbox} className="absolute right-4 top-4 z-10 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <X className="w-6 h-6" />
          </button>

          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 z-10 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
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

          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 z-10 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 flex max-w-full -translate-x-1/2 gap-2 overflow-x-auto px-4">
            {displayImages.map((img, i) => (
              <button
                key={img.id}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                className={`relative aspect-[3/2] w-20 shrink-0 overflow-hidden border-2 transition-all ${i === lightboxIndex ? 'border-white' : 'border-white/30 opacity-60 hover:opacity-100'}`}
              >
                <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
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
