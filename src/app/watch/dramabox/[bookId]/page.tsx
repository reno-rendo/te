"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useDramaDetail, useEpisodes } from "@/hooks/useDramaDetail";
import { ChevronLeft, ChevronRight, X, Loader2, Settings, List, AlertCircle, Play, Pause } from "lucide-react";
import Link from "next/link";
import { MobileReelsControls } from "@/components/watch/MobileReelsControls";
import { ModernEpisodeNav } from "@/components/watch/ModernEpisodeNav";
import { VideoProgress } from "@/components/watch/VideoProgress";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DramaDetailDirect, DramaDetailResponseLegacy } from "@/types/drama";

// Helper to check if response is new format
function isDirectFormat(data: unknown): data is DramaDetailDirect {
  return data !== null && typeof data === 'object' && 'bookId' in data && 'coverWap' in data;
}

// Helper to check if response is legacy format
function isLegacyFormat(data: unknown): data is DramaDetailResponseLegacy {
  return data !== null && typeof data === 'object' && 'data' in data && (data as DramaDetailResponseLegacy).data?.book !== undefined;
}

export default function DramaBoxWatchPage() {
  const params = useParams<{ bookId: string }>();
  const bookId = params.bookId;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [quality, setQuality] = useState(720);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        setShowPlayIcon(true);
        setTimeout(() => setShowPlayIcon(false), 800);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPauseIcon(true);
        setTimeout(() => setShowPauseIcon(false), 800);
      }
    }
  };

  const { data: detailData, isLoading: detailLoading } = useDramaDetail(bookId || "");
  const { data: episodes, isLoading: episodesLoading } = useEpisodes(bookId || "");

  // Initialize from URL params
  useEffect(() => {
    const ep = parseInt(searchParams.get("ep") || "0", 10);
    if (ep >= 0) {
      setCurrentEpisode(ep);
    }
  }, [searchParams]);

  // Update URL when episode changes (for manual navigation)
  const handleEpisodeChange = (index: number, preserveFullscreen = false) => {
    setCurrentEpisode(index);
    setShowEpisodeList(false);
    if (preserveFullscreen) {
      window.history.replaceState(null, '', `/watch/dramabox/${bookId}?ep=${index}`);
    } else {
      router.push(`/watch/dramabox/${bookId}?ep=${index}`);
    }
  };

  // All useMemo hooks must be called BEFORE any early returns
  const currentEpisodeData = useMemo(() => {
    if (!episodes) return null;
    return episodes[currentEpisode] || null;
  }, [episodes, currentEpisode]);

  const defaultCdn = useMemo(() => {
    if (!currentEpisodeData) return null;
    return (
      currentEpisodeData.cdnList.find((cdn) => cdn.isDefault === 1) || currentEpisodeData.cdnList[0] || null
    );
  }, [currentEpisodeData]);

  const availableQualities = useMemo(() => {
    const list = defaultCdn?.videoPathList
      ?.map((v) => v.quality)
      .filter((q): q is number => typeof q === "number");

    const unique = Array.from(new Set(list && list.length ? list : [720]));
    return unique.sort((a, b) => b - a);
  }, [defaultCdn]);

  // Get subtitle URL for Indonesian language
  const subtitleUrl = useMemo(() => {
    if (!currentEpisodeData) return "";
    if (currentEpisodeData.useMultiSubtitle !== 1) return "";
    if (!currentEpisodeData.subLanguageVoList?.length) return "";

    const indo = currentEpisodeData.subLanguageVoList.find(
      (s) => s.captionLanguage === "in" && s.url
    );
    if (indo) return indo.url;

    const defaultSub = currentEpisodeData.subLanguageVoList.find(
      (s) => s.isDefault === 1 && s.url
    );
    if (defaultSub) return defaultSub.url;

    const first = currentEpisodeData.subLanguageVoList.find(
      (s) => s.captionLanguage !== "none" && s.url
    );
    return first?.url || "";
  }, [currentEpisodeData]);

  const proxiedSubtitleUrl = useMemo(() => {
    if (!subtitleUrl) return "";
    return `/api/proxy/video?url=${encodeURIComponent(subtitleUrl)}`;
  }, [subtitleUrl]);

  // Keep selected quality valid
  useEffect(() => {
    if (!availableQualities.length) return;
    if (!availableQualities.includes(quality)) {
      setQuality(availableQualities[0]);
    }
  }, [availableQualities, quality]);

  const videoUrl = useMemo(() => {
    if (!currentEpisodeData || !defaultCdn) return "";
    const videoPath =
      defaultCdn.videoPathList.find((v) => v.quality === quality) ||
      defaultCdn.videoPathList.find((v) => v.isDefault === 1) ||
      defaultCdn.videoPathList[0];
    return videoPath?.videoPath || "";
  }, [currentEpisodeData, defaultCdn, quality]);

  const handleVideoEnded = () => {
    if (!episodes) return;
    const next = currentEpisode + 1;
    if (next <= episodes.length - 1) {
      handleEpisodeChange(next, true);
    }
  };

  // Subtitle Injection
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const injectTrack = () => {
      if (!proxiedSubtitleUrl) return;
      const tracks = Array.from(video.getElementsByTagName('track'));
      const existing = tracks.find(t => t.label === 'Indonesia' && t.srclang === 'id');
      if (existing) {
        if (existing.src === proxiedSubtitleUrl) return;
        video.removeChild(existing);
      }
      const track = document.createElement('track');
      track.kind = 'subtitles';
      track.label = 'Indonesia';
      track.srclang = 'id';
      track.default = true;
      track.src = proxiedSubtitleUrl;
      track.onload = () => {
        if (track.track) track.track.mode = 'showing';
      };
      video.appendChild(track);
    };

    const enforce = () => {
      const tracks = Array.from(video.textTracks);
      const indo = tracks.find(t => t.label === 'Indonesia' || t.language === 'id');
      if (indo && indo.mode !== 'showing') {
        indo.mode = 'showing';
      }
    };

    injectTrack();
    video.addEventListener('loadeddata', enforce);
    video.addEventListener('canplay', enforce);
    video.addEventListener('playing', enforce);
    video.addEventListener('seeked', enforce);

    let retries = 0;
    const poll = setInterval(() => {
      injectTrack();
      enforce();
      retries++;
      if (retries > 10) clearInterval(poll);
    }, 200);

    return () => {
      video.removeEventListener('loadeddata', enforce);
      video.removeEventListener('canplay', enforce);
      video.removeEventListener('playing', enforce);
      video.removeEventListener('seeked', enforce);
      clearInterval(poll);
    };
  }, [proxiedSubtitleUrl]);

  // Handle formats
  let book: { bookId: string; bookName: string } | null = null;
  if (isDirectFormat(detailData)) {
    book = { bookId: detailData.bookId, bookName: detailData.bookName };
  } else if (isLegacyFormat(detailData)) {
    book = { bookId: detailData.data.book.bookId, bookName: detailData.data.book.bookName };
  }

  const totalEpisodes = episodes?.length || 0;

  if (detailLoading || episodesLoading) {
    return (
      <main className="fixed inset-0 bg-black flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <div className="text-center space-y-2">
          <h3 className="text-white font-medium text-lg">Memuat video...</h3>
          <p className="text-white/60 text-sm">Mohon tunggu sebentar, data sedang diambil.</p>
        </div>
      </main>
    );
  }

  if (!book || !episodes) {
    return (
      <main className="fixed inset-0 bg-black flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Drama tidak ditemukan</h2>
        <Link href="/" className="text-primary hover:underline">
          Kembali ke beranda
        </Link>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 bg-black flex flex-col">
      <div className="absolute top-0 left-0 right-0 z-40 h-16 pointer-events-none">
        <div className="absolute inset-0 bg-background border-b-2 border-border hidden sm:block" />
        <div className="relative z-10 hidden sm:flex items-center justify-between h-full px-4 max-w-7xl mx-auto pointer-events-auto">
          <Link
            href={`/detail/dramabox/${bookId}`}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-primary font-bold shadow-black drop-shadow-md">SaPlay</span>
          </Link>

          <div className="text-center flex-1 px-4 min-w-0">
            <h1 className="text-white font-medium truncate text-sm sm:text-base drop-shadow-md">
              {book.bookName}
            </h1>
            <p className="text-white/80 text-xs drop-shadow-md">
              {currentEpisodeData?.chapterName || `Episode ${currentEpisode + 1}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-white/90 hover:text-white transition-colors rounded-full hover:bg-white/10">
                  <Settings className="w-6 h-6 drop-shadow-md" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[100]">
                {availableQualities.map((q) => (
                  <DropdownMenuItem key={q} onClick={() => setQuality(q)} className={quality === q ? "text-primary font-semibold" : ""}>
                    {q}p
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button onClick={() => setShowEpisodeList(!showEpisodeList)} className="p-2 text-white/90 hover:text-white transition-colors rounded-full hover:bg-white/10">
              <List className="w-6 h-6 drop-shadow-md" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full h-full relative bg-black flex flex-col items-center justify-center group overflow-hidden" onClick={togglePlayPause}>
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          {showPlayIcon && (
            <div className="bg-white/20 p-6 rounded-full animate-ping-once opacity-0">
              <Play className="w-12 h-12 text-white fill-current" />
            </div>
          )}
          {showPauseIcon && (
            <div className="bg-white/20 p-6 rounded-full animate-ping-once opacity-0">
              <Pause className="w-12 h-12 text-white fill-current" />
            </div>
          )}
          {!isPlaying && !showPlayIcon && !showPauseIcon && (
            <div className="bg-black/40 p-6 rounded-full border border-white/20 backdrop-blur-sm scale-110 animate-in fade-in zoom-in duration-200">
              <Play className="w-14 h-14 text-white fill-current translate-x-1" />
            </div>
          )}
        </div>

        <div className="relative w-full h-full flex items-center justify-center">
          {currentEpisodeData ? (
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleVideoEnded}
              onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.volume = 1;
                  setDuration(videoRef.current.duration);
                }
              }}
              className="w-full h-full object-contain max-h-[100dvh]"
              poster={currentEpisodeData.chapterImg}
              playsInline
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 z-50">
            <VideoProgress
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />
          </div>
        </div>

        <div className="absolute bottom-20 md:bottom-12 left-0 right-0 z-40 pointer-events-none flex items-end justify-between px-4 pb-safe-area-bottom">
          <div className="flex-1 max-w-[70%] mb-2 sm:hidden">
            <h2 className="text-white font-bold text-lg drop-shadow-lg truncate">{book.bookName}</h2>
            <p className="text-white/80 text-sm drop-shadow-md">{currentEpisodeData?.chapterName || `Episode ${currentEpisode + 1}`}</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <MobileReelsControls 
              onShowEpisodes={() => setShowEpisodeList(true)}
              qualities={availableQualities.map(q => ({ label: `${q}p`, value: q }))}
              currentQuality={quality}
              onQualityChange={(q) => setQuality(q)}
              shareData={{
                title: book.bookName,
                text: `Tonton ${book.bookName} Episode ${currentEpisode + 1} di SaPlay!`,
                url: typeof window !== "undefined" ? window.location.href : ""
              }}
              videoUrl={videoUrl || undefined}
            />
          </div>

          <ModernEpisodeNav 
            onPrev={() => handleEpisodeChange(currentEpisode - 1)}
            onNext={() => handleEpisodeChange(currentEpisode + 1)}
            disabledPrev={currentEpisode <= 0}
            disabledNext={currentEpisode >= totalEpisodes - 1}
          />
        </div>
      </div>

      {showEpisodeList && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-in fade-in duration-300" onClick={() => setShowEpisodeList(false)} />
          <div className="fixed inset-x-0 bottom-0 h-auto max-h-[75vh] bg-background z-[70] overflow-y-auto border-t-2 border-border shadow-2xl animate-in slide-in-from-bottom duration-300 rounded-t-[32px] pb-safe-area-bottom">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-2" />
            <div className="p-4 border-b-2 border-border sticky top-0 bg-background z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-lg">Daftar Episode</h2>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full">Total {totalEpisodes}</span>
              </div>
              <button onClick={() => setShowEpisodeList(false)} className="p-2 text-white/70 hover:text-white bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
              {episodes.map((episode, idx) => (
                <button
                  key={episode.chapterId}
                  onClick={() => { handleEpisodeChange(idx); setShowEpisodeList(false); }}
                  className={`aspect-square flex items-center justify-center rounded-2xl text-base font-bold transition-all ${idx === currentEpisode ? "bg-primary text-primary-foreground shadow-lg scale-95 shadow-primary/20" : "bg-secondary text-muted-foreground border-2 border-transparent hover:border-primary/50 hover:bg-secondary/80 active:scale-90"}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
