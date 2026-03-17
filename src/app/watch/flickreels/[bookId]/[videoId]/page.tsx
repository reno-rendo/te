"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFlickReelsDetail } from "@/hooks/useFlickReels";
import { ChevronLeft, ChevronRight, X, Loader2, List, AlertCircle, Play, Pause } from "lucide-react";
import Link from "next/link";
import { MobileReelsControls } from "@/components/watch/MobileReelsControls";
import { ModernEpisodeNav } from "@/components/watch/ModernEpisodeNav";
import { VideoProgress } from "@/components/watch/VideoProgress";
import { cn } from "@/lib/utils";

export default function FlickReelsWatchPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  const initialVideoId = params.videoId as string;

  const [activeVideoId, setActiveVideoId] = useState(initialVideoId);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [warmupError, setWarmupError] = useState(false);
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoTimestamp = useRef(Date.now());
  const isInitialLoad = useRef(true);

  const { data, isLoading, error, refetch } = useFlickReelsDetail(bookId);

  useEffect(() => {
    if (params.videoId && params.videoId !== activeVideoId) {
      setActiveVideoId(params.videoId as string);
      setRetryCount(0);
      setVideoReady(false);
      setWarmupError(false);
    }
  }, [params.videoId]);

  const episodes = useMemo(() => data?.episodes || [], [data]);
  const currentIndex = useMemo(() => episodes.findIndex((ep) => ep.id === activeVideoId), [episodes, activeVideoId]);
  const currentEpisodeData = useMemo(() => currentIndex === -1 ? null : episodes[currentIndex], [episodes, currentIndex]);
  const totalEpisodes = episodes.length;

  useEffect(() => {
    if (!currentEpisodeData?.raw?.videoUrl) return;
    videoTimestamp.current = Date.now();
    const videoUrl = currentEpisodeData.raw.videoUrl;
    const warmupUrl = `/api/proxy/warmup?url=${encodeURIComponent(videoUrl)}`;

    if (isInitialLoad.current) {
      setVideoReady(false);
      setWarmupError(false);
      fetch(warmupUrl).then(res => res.json()).then(data => {
        setVideoReady(true);
        if (!data.success) setWarmupError(true);
        isInitialLoad.current = false;
      }).catch(() => { setVideoReady(true); setWarmupError(true); });
    } else {
      setVideoReady(true);
      fetch(warmupUrl);
    }
  }, [currentEpisodeData]);

  const getVideoSrc = () => {
    if (!currentEpisodeData?.raw?.videoUrl) return "";
    return `/api/proxy/video?url=${encodeURIComponent(currentEpisodeData.raw.videoUrl)}&referer=${encodeURIComponent("https://www.flickreels.com/")}&_t=${videoTimestamp.current}`;
  };

  const handleEpisodeChange = (videoId: string) => {
    setActiveVideoId(videoId);
    router.replace(`/watch/flickreels/${bookId}/${videoId}`, { scroll: false });
    setShowEpisodeList(false);
  };

  return (
    <main className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 h-16 pointer-events-none">
        <div className="absolute inset-0 bg-background border-b-2 border-border hidden sm:block" />
        <div className="relative z-10 hidden sm:flex items-center justify-between h-full px-4 max-w-7xl mx-auto pointer-events-auto">
          <Link
            href={`/detail/flickreels/${bookId}`}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-primary font-bold hidden sm:inline shadow-black drop-shadow-md">SaPlay</span>
          </Link>

          <div className="text-center flex-1 px-4 min-w-0">
            <h1 className="text-white font-medium truncate text-sm sm:text-base drop-shadow-md">
              {data?.drama?.title || "Loading..."}
            </h1>
            <p className="text-white/80 text-xs drop-shadow-md">Episode {currentIndex + 1}</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowEpisodeList(!showEpisodeList)} className="p-2 text-white/90 hover:text-white transition-colors rounded-full hover:bg-white/10">
              <List className="w-6 h-6 drop-shadow-md" />
            </button>
          </div>
        </div>
      </div>

      <div 
        className="flex-1 w-full h-full relative bg-black flex flex-col items-center justify-center group overflow-hidden" 
        onClick={togglePlayPause}
      >
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
          {(!videoReady || isLoading) && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          )}

          {currentEpisodeData && videoReady && (
            <video
              ref={videoRef}
              src={getVideoSrc()}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                const next = episodes[currentIndex + 1];
                if (next) handleEpisodeChange(next.id);
              }}
              onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.volume = 1;
                  setDuration(videoRef.current.duration);
                }
              }}
              className="w-full h-full object-contain max-h-[100dvh]"
              playsInline
              autoPlay
            />
          )}

          <div className="absolute bottom-0 left-0 right-0 z-50">
            <VideoProgress
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 md:bottom-12 left-0 right-0 z-40 pointer-events-none flex items-end justify-between px-4 pb-safe-area-bottom">
        <div className="flex-1 max-w-[70%] mb-2 sm:hidden">
          <h2 className="text-white font-bold text-lg drop-shadow-lg truncate">{data?.drama?.title || "Loading..."}</h2>
          <p className="text-white/80 text-sm drop-shadow-md">Episode {currentIndex + 1}</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <MobileReelsControls 
            onShowEpisodes={() => setShowEpisodeList(true)}
            shareData={{
              title: data?.drama?.title || "SaPlay",
              text: `Tonton ${data?.drama?.title} Episode ${currentIndex + 1} di SaPlay!`,
              url: typeof window !== "undefined" ? window.location.href : ""
            }}
            videoUrl={currentEpisodeData?.raw?.videoUrl || undefined}
          />
        </div>

        <ModernEpisodeNav 
          onPrev={() => handleEpisodeChange(episodes[currentIndex - 1]?.id)}
          onNext={() => handleEpisodeChange(episodes[currentIndex + 1]?.id)}
          disabledPrev={currentIndex <= 0}
          disabledNext={currentIndex >= totalEpisodes - 1}
        />
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
              {episodes.map((ep, idx) => (
                <button
                  key={ep.id}
                  onClick={() => handleEpisodeChange(ep.id)}
                  className={`aspect-square flex items-center justify-center rounded-2xl text-base font-bold transition-all ${ep.id === activeVideoId ? "bg-primary text-primary-foreground shadow-lg scale-95 shadow-primary/20" : "bg-secondary text-muted-foreground border-2 border-transparent hover:border-primary/50 hover:bg-secondary/80 active:scale-90"}`}
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
