"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useShortMaxAllEpisodes, useShortMaxDetail } from "@/hooks/useShortMax";
import { ChevronLeft, ChevronRight, X, Loader2, AlertCircle, List, Settings, Play, Pause } from "lucide-react";
import Link from "next/link";
import { MobileReelsControls } from "@/components/watch/MobileReelsControls";
import { ModernEpisodeNav } from "@/components/watch/ModernEpisodeNav";
import { VideoProgress } from "@/components/watch/VideoProgress";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Hls from "hls.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ShortMaxWatchPage() {
  const params = useParams<{ shortPlayId: string }>();
  const searchParams = useSearchParams();
  const shortPlayId = params.shortPlayId;
  const router = useRouter();

  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
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
  const [selectedQuality, setSelectedQuality] = useState<string>("720");
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Get episode from URL
  useEffect(() => {
    const ep = searchParams.get("ep");
    if (ep) {
      setCurrentEpisode(parseInt(ep) || 1);
    }
  }, [searchParams]);

  // Fetch detail for title
  const { data: detailData } = useShortMaxDetail(shortPlayId || "");

  // Fetch ALL episodes in one call
  const { data: allEpisodesData, isLoading, error } = useShortMaxAllEpisodes(
    shortPlayId || ""
  );

  // Get current episode data from the preloaded array
  const currentEpisodeData = useMemo(() => {
    if (!allEpisodesData?.episodes) return null;
    return allEpisodesData.episodes.find(ep => ep.episodeNumber === currentEpisode) || null;
  }, [allEpisodesData, currentEpisode]);

  const totalEpisodes = allEpisodesData?.totalEpisodes || detailData?.totalEpisodes || 1;
  const title = detailData?.title || allEpisodesData?.shortPlayName || "Loading...";

  // Available quality options
  const qualityOptions = useMemo(() => {
    const urls = currentEpisodeData?.videoUrl;
    if (!urls) return [];
    const options: { key: string; label: string; quality: number }[] = [];
    if (urls.video_480) options.push({ key: "480", label: "480p", quality: 480 });
    if (urls.video_720) options.push({ key: "720", label: "720p", quality: 720 });
    if (urls.video_1080) options.push({ key: "1080", label: "1080p", quality: 1080 });
    return options.sort((a, b) => b.quality - a.quality);
  }, [currentEpisodeData]);

  // Get video URL
  const getVideoUrl = useCallback(() => {
    const urls = currentEpisodeData?.videoUrl;
    if (!urls) return null;
    const qualityKey = `video_${selectedQuality}` as keyof typeof urls;
    return urls[qualityKey] || urls.video_720 || urls.video_1080 || urls.video_480 || null;
  }, [currentEpisodeData, selectedQuality]);

  // Handle video ended - auto next episode
  const handleVideoEnded = useCallback(() => {
    const nextEp = currentEpisode + 1;
    if (nextEp <= totalEpisodes) {
      setCurrentEpisode(nextEp);
      window.history.replaceState(null, '', `/watch/shortmax/${shortPlayId}?ep=${nextEp}`);
    }
  }, [currentEpisode, totalEpisodes, shortPlayId]);

  // Setup video source
  useEffect(() => {
    const url = getVideoUrl();
    if (url && videoRef.current) {
      const video = videoRef.current;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => { });
        });
      } else {
        video.src = url;
        video.play().catch(() => { });
      }
    }
  }, [getVideoUrl]);

  const goToEpisode = (ep: number) => {
    setCurrentEpisode(ep);
    router.replace(`/watch/shortmax/${shortPlayId}?ep=${ep}`, { scroll: false });
    setShowEpisodeList(false);
  };

  return (
    <main className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 h-16 pointer-events-none">
        <div className="absolute inset-0 bg-background border-b-2 border-border hidden sm:block" />
        <div className="relative z-10 hidden sm:flex items-center justify-between h-full px-4 max-w-7xl mx-auto pointer-events-auto">
          <Link
            href={`/detail/shortmax/${shortPlayId}`}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-primary font-bold hidden sm:inline shadow-black drop-shadow-md">SaPlay</span>
          </Link>

          <div className="text-center flex-1 px-4 min-w-0">
            <h1 className="text-white font-medium truncate text-sm sm:text-base drop-shadow-md">{title}</h1>
            <p className="text-white/80 text-xs drop-shadow-md">Episode {currentEpisode}</p>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-white/90 hover:text-white transition-colors rounded-full hover:bg-white/10">
                  <Settings className="w-6 h-6 drop-shadow-md" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[100]">
                {qualityOptions.map((opt) => (
                  <DropdownMenuItem key={opt.key} onClick={() => setSelectedQuality(opt.key)} className={selectedQuality === opt.key ? "text-primary font-semibold" : ""}>
                    {opt.label}
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
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-20">
              <AlertCircle className="w-10 h-10 text-destructive mb-4" />
              <p className="text-white mb-4">Gagal memuat video</p>
              <button onClick={() => router.refresh()} className="px-4 py-2 bg-primary text-white rounded-lg text-sm">Coba Lagi</button>
            </div>
          )}

          <video
            ref={videoRef}
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
            playsInline
            autoPlay
          />

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
          <h2 className="text-white font-bold text-lg drop-shadow-lg truncate">{title}</h2>
          <p className="text-white/80 text-sm drop-shadow-md">Episode {currentEpisode}</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <MobileReelsControls 
            onShowEpisodes={() => setShowEpisodeList(true)}
            qualities={qualityOptions.map(o => ({ label: o.label, value: o.key }))}
            currentQuality={selectedQuality}
            onQualityChange={(q) => setSelectedQuality(q)}
            shareData={{
              title: title,
              text: `Tonton ${title} Episode ${currentEpisode} di SaPlay!`,
              url: typeof window !== "undefined" ? window.location.href : ""
            }}
            videoUrl={getVideoUrl() || undefined}
          />
        </div>

        <ModernEpisodeNav 
          onPrev={() => goToEpisode(currentEpisode - 1)}
          onNext={() => goToEpisode(currentEpisode + 1)}
          disabledPrev={currentEpisode <= 1}
          disabledNext={currentEpisode >= totalEpisodes}
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
              {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map((ep) => (
                <button
                  key={ep}
                  onClick={() => goToEpisode(ep)}
                  className={`aspect-square flex items-center justify-center rounded-2xl text-base font-bold transition-all ${ep === currentEpisode ? "bg-primary text-primary-foreground shadow-lg scale-95 shadow-primary/20" : "bg-secondary text-muted-foreground border-2 border-transparent hover:border-primary/50 hover:bg-secondary/80 active:scale-90"}`}
                >
                  {ep}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
