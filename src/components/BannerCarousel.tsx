"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { ReelShortBanner } from "@/types/reelshort";

interface BannerCarouselProps {
  banners: ReelShortBanner[];
  autoPlayInterval?: number;
}

export function BannerCarousel({
  banners,
  autoPlayInterval = 5000,
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-play
  useEffect(() => {
    if (isHovered || banners.length <= 1) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide, autoPlayInterval, banners.length]);

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div
      className="relative w-full aspect-[3/1] md:aspect-[4/1] rounded-xl border-2 border-border overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Banner Image */}
      <Link href={`/detail/reelshort/${currentBanner.jump_param.book_id}`}>
        <img
          src={currentBanner.pic}
          alt={currentBanner.jump_param.book_title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />

        {/* Overlay for Readability */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="absolute bottom-5 left-5 right-24 space-y-2.5 z-10">
          {/* Artistic Title */}
          {currentBanner.pic_artistic_word && (
            <img
              src={currentBanner.pic_artistic_word}
              alt=""
              className="h-10 md:h-14 object-contain opacity-95"
            />
          )}

          <h3 className="text-base md:text-xl font-display font-bold text-white line-clamp-1 drop-shadow-md">
            {currentBanner.jump_param.book_title}
          </h3>

          {/* Tags */}
          {currentBanner.jump_param.book_theme && (
            <div className="flex flex-wrap gap-1.5">
              {currentBanner.jump_param.book_theme.slice(0, 3).map((theme) => (
                <span
                  key={theme}
                  className="tag-pill bg-black/60 text-white border-white/20"
                >
                  {theme}
                </span>
              ))}
            </div>
          )}

          {/* Play Button */}
          {currentBanner.play_button === 1 && (
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-200 text-sm shadow-solid-sm">
              <Play className="w-4 h-4 fill-current" />
              Tonton Sekarang
            </button>
          )}
        </div>

        {/* Badge */}
        {currentBanner.book_mark?.text && (
          <div
            className="absolute top-4 left-4 px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border-2 border-transparent"
            style={{
              backgroundColor: currentBanner.book_mark.color || "hsl(var(--primary))",
              color: currentBanner.book_mark.text_color || "hsl(var(--primary-foreground))",
            }}
          >
            {currentBanner.book_mark.text}
          </div>
        )}
      </Link>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              prevSlide();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:-translate-x-1 border-2 border-border bg-background/95 text-foreground hover:border-primary"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:translate-x-1 border-2 border-border bg-background/95 text-foreground hover:border-primary"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
          {banners.slice(0, 10).map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex(idx);
              }}
              className="h-1.5 rounded-xl transition-all duration-300"
              style={{
                width: idx === currentIndex ? '24px' : '8px',
                background: idx === currentIndex
                  ? 'hsl(var(--primary))'
                  : 'hsl(var(--muted))'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
