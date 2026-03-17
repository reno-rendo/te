"use client";

import Link from "next/link";
import { Play } from "lucide-react";

export interface BadgeConfig {
  text: string;
  color?: string;       // Background color (e.g., "#E52E2E" or "hsl(var(--primary))")
  textColor?: string;   // Text color (default white)
  isTransparent?: boolean; // If true, uses black/60 backdrop
}

export interface UnifiedMediaCardProps {
  title: string;
  cover: string;
  link: string;
  episodes?: number;
  topLeftBadge?: BadgeConfig | null;
  topRightBadge?: BadgeConfig | null;
  index?: number;
}

export function UnifiedMediaCard({
  title,
  cover,
  link,
  episodes = 0,
  topLeftBadge,
  topRightBadge,
  index = 0,
}: UnifiedMediaCardProps) {

  const BADGE_BASE = "px-1.5 py-0.5 rounded-xl font-bold text-white leading-none tracking-wide flex items-center justify-center font-sans text-[9px] md:text-[10px]";

  const BADGE_FONT = {
    lineHeight: "1",
    fontFamily: "inherit"
  };

  return (
    <Link
      href={link}
      className="group relative block"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Visual Container */}
      <div
        className="aspect-[2/3] relative overflow-hidden rounded-xl transition-all duration-200 border-2 border-transparent group-hover:border-primary group-hover:shadow-solid-sm"
        style={{ background: 'hsl(var(--muted))' }}
      >
        <img
          src={cover.includes(".heic")
            ? `https://wsrv.nl/?url=${encodeURIComponent(cover)}&output=jpg`
            : cover}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          style={{ '--tw-scale-x': '1', '--tw-scale-y': '1' } as React.CSSProperties}
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Badges Container */}
        <div className="absolute top-1.5 left-1.5 right-1.5 md:top-2 md:left-2 md:right-2 flex justify-between items-start pointer-events-none z-10">

          {/* Top Left Badge */}
          <div className="flex-1 min-w-0 pr-1 flex justify-start">
            {topLeftBadge && (
              <div
                className={`${BADGE_BASE} truncate max-w-full`}
                style={{
                  ...BADGE_FONT,
                  backgroundColor: topLeftBadge.color || "#E52E2E",
                  color: topLeftBadge.textColor || "#FFFFFF"
                }}
              >
                {topLeftBadge.text}
              </div>
            )}
          </div>

          {/* Top Right Badge */}
          <div className="shrink-0 flex justify-end">
            {topRightBadge && (
              <div
                className={`${BADGE_BASE} ${topRightBadge.isTransparent ? 'backdrop-blur-sm' : ''}`}
                style={{
                  ...BADGE_FONT,
                  backgroundColor: topRightBadge.isTransparent ? "rgba(0,0,0,0.8)" : (topRightBadge.color || "rgba(0,0,0,0.8)"),
                  color: topRightBadge.textColor || "#FFFFFF"
                }}
              >
                {topRightBadge.text}
              </div>
            )}
          </div>
        </div>

        {/* Episode Count & Title Overlay - Minimalist Solid Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-2 md:p-3 flex flex-col justify-end bg-black/60 border-t border-white/5 pointer-events-none z-10 backdrop-blur-[2px]">
          <h3 className="font-display font-semibold text-xs md:text-sm leading-snug line-clamp-2 text-white mb-1.5 md:mb-2 drop-shadow-md">
            {title}
          </h3>
          {episodes > 0 && (
            <div className="flex items-center gap-1.5 text-[9px] md:text-xs text-white/90 font-medium">
              <Play className="w-2.5 h-2.5 md:w-3 md:h-3 fill-white/90" />
              <span>{episodes} Ep</span>
            </div>
          )}
        </div>

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <div
            className="w-11 h-11 md:w-13 md:h-13 flex items-center justify-center rounded-xl transform scale-75 group-hover:scale-100 transition-transform duration-200 bg-primary shadow-solid"
          >
            <Play className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground fill-current ml-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
