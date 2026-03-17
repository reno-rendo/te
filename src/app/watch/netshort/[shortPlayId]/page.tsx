"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useNetShortDetail } from "@/hooks/useNetShort";
import { ChevronLeft, ChevronRight, X, Loader2, AlertCircle, List, Play, Pause } from "lucide-react";
import Link from "next/link";
import { MobileReelsControls } from "@/components/watch/MobileReelsControls";
import { ModernEpisodeNav } from "@/components/watch/ModernEpisodeNav";
import { VideoProgress } from "@/components/watch/VideoProgress";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Hls from "hls.js";

export default function NetShortWatchPage() {
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const addLog = (msg: string) => {
    console.log(msg);
  };

  // Get episode from URL
  useEffect(() => {
    const ep = searchParams.get("ep");
    if (ep) {
      setCurrentEpisode(parseInt(ep) || 1);
    }
  }, [searchParams]);

  // Fetch detail with all episodes
  const { data, isLoading, error } = useNetShortDetail(shortPlayId || "");

  // Get current episode data
  const currentEpisodeData = data?.episodes?.find(
    (ep) => ep.episodeNo === currentEpisode
  );

  // Handle video ended - auto next episode
  const handleVideoEnded = useCallback(() => {
    if (!data?.episodes) return;
    const nextEp = currentEpisode + 1;
    const nextEpisodeData = data.episodes.find((ep) => ep.episodeNo === nextEp);

    if (nextEpisodeData) {
      setCurrentEpisode(nextEp);
      window.history.replaceState(null, '', `/watch/netshort/${shortPlayId}?ep=${nextEp}`);
    }
  }, [currentEpisode, data?.episodes, shortPlayId]);

  // Load video with fallback support for MP4/HLS
  useEffect(() => {
    if (currentEpisodeData?.videoUrl && videoRef.current) {
      const video = videoRef.current;
      const videoUrl = currentEpisodeData.videoUrl;

      addLog(`Loading video: ${videoUrl}`);

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      const isHlsUrl = videoUrl.includes('.m3u8') || videoUrl.includes('application/x-mpegURL');

      if (isHlsUrl && Hls.isSupported()) {
        const hls = new Hls({
          debug: false,
          enableWorker: true,
        });
        hlsRef.current = hls;
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(e => addLog("Hls play error: " + e));
        });
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });
      } else {
        video.src = videoUrl;
        video.play().catch(e => addLog("Native play error: " + e));
      }
    }
  }, [currentEpisodeData]);

  const goToEpisode = (epNo: number) => {
    setCurrentEpisode(epNo);
    router.replace(`/watch/netshort/${shortPlayId}?ep=${epNo}`, { scroll: false });
    setShowEpisodeList(false);
  };

  const episodes = data?.episodes || [];
  const totalEpisodes = episodes.length;

  return (
    <main className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 h-16 pointer-events-none">
        <div className="absolute inset-0 bg-background border-b-2 border-border hidden sm:block" />
        <div className="relative z-10 hidden sm:flex items-center justify-between h-full px-4 max-w-7xl mx-auto pointer-events-auto">
          <Link
            href={`/detail/netshort/${shortPlayId}`}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-primary font-bold hidden sm:inline shadow-black drop-shadow-md">SaPlay</span>
          </Link>

          <div className="text-center flex-1 px-4 min-w-0">
            <h1 className="text-white font-medium truncate text-sm sm:text-base drop-shadow-md">
              {(data as any)?.shortPlayName || "Loading..."}
            </h1>
            <p className="text-white/80 text-xs drop-shadow-md">Episode {currentEpisode}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEpisodeList(!showEpisodeList)}
              className="p-2 text-white/90 hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
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
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-20">
              <AlertCircle className="w-10 h-10 text-destructive mb-4" />
              <p className="text-white mb-4">Gagal memuat video</p>
              <button
                onClick={() => router.refresh()}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {currentEpisodeData ? (
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
          ) : !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-20">
              <AlertCircle className="w-10 h-10 text-destructive mb-4" />
              <p className="text-white mb-4">Data episode tidak tersedia</p>
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
      </div>

      <div className="absolute bottom-20 md:bottom-12 left-0 right-0 z-40 pointer-events-none flex items-end justify-between px-4 pb-safe-area-bottom">
        <div className="flex-1 max-w-[70%] mb-2 sm:hidden">
          <h2 className="text-white font-bold text-lg drop-shadow-lg truncate">
            {(data as any)?.shortPlayName || "Loading..."}
          </h2>
          <p className="text-white/80 text-sm drop-shadow-md">Episode {currentEpisode}</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <MobileReelsControls 
            onShowEpisodes={() => setShowEpisodeList(true)}
            qualities={[]}
            currentQuality=""
            onQualityChange={() => {}}
            shareData={{
              title: (data as any)?.shortPlayName || "SaPlay",
              text: `Tonton ${(data as any)?.shortPlayName} Episode ${currentEpisode} di SaPlay!`,
              url: typeof window !== "undefined" ? window.location.href : ""
            }}
            videoUrl={currentEpisodeData?.videoUrl || undefined}
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
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-in fade-in duration-300"
            onClick={() => setShowEpisodeList(false)}
          />
          <div className="fixed inset-x-0 bottom-0 h-auto max-h-[75vh] bg-background z-[70] overflow-y-auto border-t-2 border-border shadow-2xl animate-in slide-in-from-bottom duration-300 rounded-t-[32px] pb-safe-area-bottom">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-2" />
            <div className="p-4 border-b-2 border-border sticky top-0 bg-background z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-lg">Daftar Episode</h2>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                  Total {totalEpisodes}
                </span>
              </div>
              <button
                onClick={() => setShowEpisodeList(false)}
                className="p-2 text-white/70 hover:text-white bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
              {episodes.map((ep) => (
                <button
                  key={ep.episodeNo}
                  onClick={() => goToEpisode(ep.episodeNo)}
                  className={`aspect-square flex items-center justify-center rounded-2xl text-base font-bold transition-all ${ep.episodeNo === currentEpisode ? "bg-primary text-primary-foreground shadow-lg scale-95 shadow-primary/20" : "bg-secondary text-muted-foreground border-2 border-transparent hover:border-primary/50 hover:bg-secondary/80 active:scale-90"}`}
                >
                  {ep.episodeNo}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
