import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernEpisodeNavProps {
  currentEpisode: number;
  totalEpisodes: number;
  onPrev: () => void;
  onNext: () => void;
  disabledPrev?: boolean;
  disabledNext?: boolean;
  visible?: boolean;
}

export function ModernEpisodeNav({
  onPrev,
  onNext,
  disabledPrev,
  disabledNext,
}: Omit<ModernEpisodeNavProps, "currentEpisode" | "totalEpisodes">) {
  return (
    <>
      {/* Side Navigation - Left (Prev) */}
      <div className="fixed left-2 top-[45%] -translate-y-1/2 z-[55] pointer-events-none group/nav">
        <button
          onClick={onPrev}
          disabled={disabledPrev}
          className={cn(
            "pointer-events-auto p-2 rounded-full bg-black/10 backdrop-blur-sm border border-white/5 text-white/30 disabled:opacity-0 active:scale-90 transition-all hover:bg-black/40 hover:text-white/80 hover:scale-110",
            disabledPrev && "invisible"
          )}
        >
          <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
        </button>
      </div>

      {/* Side Navigation - Right (Next) */}
      <div className="fixed right-2 top-[45%] -translate-y-1/2 z-[55] pointer-events-none group/nav">
        <button
          onClick={onNext}
          disabled={disabledNext}
          className={cn(
            "pointer-events-auto p-2 rounded-full bg-black/10 backdrop-blur-sm border border-white/5 text-white/30 disabled:opacity-0 active:scale-90 transition-all hover:bg-black/40 hover:text-white/80 hover:scale-110",
            disabledNext && "invisible"
          )}
        >
          <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
        </button>
      </div>
    </>
  );
}
