"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMeloloDetail, useMeloloStream } from "@/hooks/useMelolo";
import { ChevronLeft, ChevronRight, X, Loader2, List, AlertCircle, Settings, Play, Pause } from "lucide-react";
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

interface VideoQuality {
  name: string;
  url: string;
}

export default function MeloloWatchPage() {
  const params = useParams<{ bookId: string; videoId: string }>();
  const router = useRouter();
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
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState(params.videoId || "");

  useEffect(() => {
    if (params.videoId && params.videoId !== currentVideoId) {
      setCurrentVideoId(params.videoId);
    }
  }, [params.videoId]);

  const { data: detailData, isLoading: detailLoading } = useMeloloDetail(params.bookId || "");
  const { data: streamData, isLoading: streamLoading } = useMeloloStream(currentVideoId);

  const drama = detailData?.data?.video_data;
  const rawVideoModel = streamData?.data?.video_model;

  const qualities = useMemo(() => {
    if (!rawVideoModel) return [];
    try {
      const parsedModel = JSON.parse(rawVideoModel);
      const videoList = parsedModel.video_list;
      if (!videoList) return [];

      const availableQualities: VideoQuality[] = [];
      const qualityMap: Record<string, string> = {
        video_1: "240p", video_2: "360p", video_3: "480p", video_4: "540p", video_5: "720p",
      };

      Object.entries(videoList).forEach(([key, value]: [string, any]) => {
        if (value?.main_url) {
          try {
            const decoded = atob(value.main_url);
            const url = decoded.startsWith("http") ? decoded : value.main_url;
            availableQualities.push({ name: qualityMap[key] || key, url: url });
          } catch (e) {
            availableQualities.push({ name: qualityMap[key] || key, url: value.main_url });
          }
        }
      });
      return availableQualities;
    } catch (e) { return []; }
  }, [rawVideoModel]);

  useEffect(() => {
    if (qualities.length > 0 && !selectedQuality) {
      setSelectedQuality(qualities[qualities.length - 1]);
    }
  }, [qualities, selectedQuality]);

  const handleEpisodeChange = (videoId: string) => {
    setCurrentVideoId(videoId);
    router.replace(`/watch/melolo/${params.bookId}/${videoId}`, { scroll: false });
    setShowEpisodeList(false);
  };

  const exercises = detailData?.data?.video_list || [];
  const episodes = detailData?.data?.video_list || [];
  const currentIndex = episodes.findIndex((ep: any) => ep.video_id === currentVideoId);
  const totalEpisodes = episodes.length;

  return (
    <main className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 h-16 pointer-events-none">
        <div className="absolute inset-0 bg-background border-b-2 border-border hidden sm:block" />
        <div className="relative z-10 hidden sm:flex items-center justify-between h-full px-4 max-w-7xl mx-auto pointer-events-auto">
          <Link
            href={`/detail/melolo/${params.bookId}`}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-primary font-bold hidden sm:inline shadow-black drop-shadow-md">SaPlay</span>
          </Link>

          <div className="text-center flex-1 px-4 min-w-0">
            <h1 className="text-white font-medium truncate text-sm sm:text-base drop-shadow-md">
              {drama?.video_name || "Loading..."}
            </h1>
            <p className="text-white/80 text-xs drop-shadow-md">Episode {currentIndex + 1}</p>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-white/90 hover:text-white transition-colors rounded-full hover:bg-white/10">
                  <Settings className="w-6 h-6 drop-shadow-md" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[100]">
                {qualities.map((q: any) => (
                  <DropdownMenuItem key={q.name} onClick={() => setSelectedQuality(q)} className={selectedQuality?.name === q.name ? "text-primary font-semibold" : ""}>
                    {q.name}
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
          {(detailLoading || streamLoading) && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          )}

          {selectedQuality && (
            <video
              ref={videoRef}
              src={selectedQuality.url}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                const next = episodes[currentIndex + 1];
                if (next) handleEpisodeChange(next.video_id);
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
          <h2 className="text-white font-bold text-lg drop-shadow-lg truncate">{drama?.video_name || "Loading..."}</h2>
          <p className="text-white/80 text-sm drop-shadow-md">Episode {currentIndex + 1}</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <MobileReelsControls 
            onShowEpisodes={() => setShowEpisodeList(true)}
            qualities={qualities.map((q: any) => ({ label: q.name, value: q.name }))}
            currentQuality={selectedQuality?.name || ""}
            onQualityChange={(name) => {
              const quality = qualities.find((q: any) => q.name === name);
              if (quality) setSelectedQuality(quality);
            }}
            shareData={{
              title: drama?.video_name || "SaPlay",
              text: `Tonton ${drama?.video_name} Episode ${currentIndex + 1} di SaPlay!`,
              url: typeof window !== "undefined" ? window.location.href : ""
            }}
            videoUrl={selectedQuality?.url || undefined}
          />
        </div>

        <ModernEpisodeNav 
          onPrev={() => handleEpisodeChange(episodes[currentIndex - 1]?.video_id)}
          onNext={() => handleEpisodeChange(episodes[currentIndex + 1]?.video_id)}
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
              {episodes.map((ep: any, idx: number) => (
                <button
                  key={ep.video_id}
                  onClick={() => handleEpisodeChange(ep.video_id)}
                  className={`aspect-square flex items-center justify-center rounded-2xl text-base font-bold transition-all ${ep.video_id === currentVideoId ? "bg-primary text-primary-foreground shadow-lg scale-95 shadow-primary/20" : "bg-secondary text-muted-foreground border-2 border-transparent hover:border-primary/50 hover:bg-secondary/80 active:scale-90"}`}
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
