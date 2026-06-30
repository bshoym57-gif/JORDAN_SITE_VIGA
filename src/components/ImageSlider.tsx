import { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface ImageSliderProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ImageSlider({ images, alt, className = '' }: ImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (images.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      delta > 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  return (
    <div className={`relative overflow-hidden select-none ${className}`}>
      {/* Images */}
      <div
        className="flex transition-transform duration-300 ease-in-out h-full"
        style={{ transform: `translateX(${-current * 100}%)`, direction: 'ltr' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${alt} ${i + 1}`}
            className="w-full h-full object-contain flex-shrink-0"
            draggable={false}
          />
        ))}
      </div>

      {/* Arrows - only show if more than 1 image */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-all backdrop-blur-sm"
            aria-label="صورة سابقة"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-all backdrop-blur-sm"
            aria-label="صورة تالية"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-white w-5 h-2'
                  : 'bg-white/50 w-2 h-2'
              }`}
              aria-label={`الصورة ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm font-medium">
          {current + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
