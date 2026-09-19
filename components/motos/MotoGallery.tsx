"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface MotoGalleryProps {
  images: string[];
  altText: string;
}

export default function MotoGallery({ images, altText }: MotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const photoList = images && images.length > 0
    ? images
    : ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop"];

  const currentImage = photoList[selectedIndex] || photoList[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? photoList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === photoList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl group">
        <Image
          src={currentImage}
          alt={`${altText} - Vue ${selectedIndex + 1}`}
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
          onClick={() => setLightboxOpen(true)}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent pointer-events-none" />

        {/* Zoom Lightbox Trigger Button */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-zinc-950/80 backdrop-blur-md text-white border border-zinc-700/80 hover:bg-zinc-900 transition-colors shadow-lg"
          aria-label="Agrandir l'image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Carousel arrows if multiple images */}
        {photoList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-950/80 backdrop-blur-md text-white border border-zinc-800 hover:bg-red-600 transition-colors shadow-lg"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-950/80 backdrop-blur-md text-white border border-zinc-800 hover:bg-red-600 transition-colors shadow-lg"
              aria-label="Photo suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {photoList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {photoList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedIndex === idx
                  ? "border-red-500 scale-105 shadow-md shadow-red-950/50"
                  : "border-zinc-800 opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`Vignette ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-5xl aspect-[16/10] max-h-[85vh]">
            <Image
              src={currentImage}
              alt={altText}
              fill
              className="object-contain"
            />
          </div>

          {photoList.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-zinc-900/90 border border-zinc-700 text-white hover:bg-red-600"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-zinc-900/90 border border-zinc-700 text-white hover:bg-red-600"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
