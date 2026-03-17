"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface VideoProgressProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}

export function VideoProgress({
  currentTime,
  duration,
  onSeek,
  className,
}: VideoProgressProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleInteraction = useCallback(
    (clientX: number) => {
      if (!containerRef.current || duration === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pos = (clientX - rect.left) / rect.width;
      const clampedPos = Math.max(0, Math.min(1, pos));
      onSeek(clampedPos * duration);
    },
    [duration, onSeek]
  );

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleInteraction(e.clientX);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleInteraction(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleInteraction(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleInteraction(e.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleInteraction]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative w-full cursor-pointer transition-all duration-300 pointer-events-auto",
        (isHovering || isDragging) ? "h-6 flex items-center" : "h-1.5",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* Background Track */}
      <div 
        className={cn(
          "absolute inset-x-0 bg-white/20 transition-all duration-300",
          (isHovering || isDragging) ? "h-1.5 rounded-full" : "h-0.5"
        )} 
      />
      
      {/* Progress Track */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 bg-white transition-all duration-300",
          (isHovering || isDragging) ? "h-1.5 rounded-full" : "h-0.5"
        )}
        style={{ width: `${progress}%` }}
      />

      {/* Handle / Knob (TikTok only shows this on hover/drag) */}
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-opacity duration-300 pointer-events-none",
          (isHovering || isDragging) ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )}
        style={{ left: `calc(${progress}% - 6px)` }}
      />
    </div>
  );
}
