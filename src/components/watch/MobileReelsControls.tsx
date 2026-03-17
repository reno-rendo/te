"use client";

import React from "react";
import { List, Settings, Share2, Copy, Check, Download, Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DonationDialog } from "@/components/DonationDialog";

interface QualityOption {
  label: string;
  value: string | number;
}

interface MobileReelsControlsProps {
  onShowEpisodes: () => void;
  qualities: QualityOption[];
  currentQuality: string | number;
  onQualityChange: (quality: any) => void;
  shareData?: {
    title: string;
    text?: string;
    url: string;
  };
  videoUrl?: string;
  visible?: boolean;
}

export function MobileReelsControls({
  onShowEpisodes,
  qualities,
  currentQuality,
  onQualityChange,
  shareData,
  videoUrl,
  visible = true,
}: MobileReelsControlsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share && shareData) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share failed:", err);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const url = shareData?.url || window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    
    // Use our proxy to force download (attachment)
    const filename = encodeURIComponent(shareData?.title || "video");
    const proxyUrl = `/api/proxy/video?url=${encodeURIComponent(videoUrl)}&download=true&filename=${filename}`;
    
    const link = document.createElement("a");
    link.href = proxyUrl;
    link.setAttribute("download", ""); // Still good practice
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-5 sm:hidden pointer-events-auto transition-all">
      {/* 0. Donate Button */}
      <div className="flex flex-col items-center gap-1">
        <DonationDialog 
          trigger={
            <button
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg group"
            >
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20 group-hover:fill-rose-500 transition-all animate-pulse-subtle" />
            </button>
          }
        />
        <span className="text-[9px] text-white/80 font-bold drop-shadow-md">Donasi</span>
      </div>

      {/* 1. Episode List Button */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={onShowEpisodes}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg"
        >
          <List className="w-5 h-5" />
        </button>
        <span className="text-[9px] text-white/80 font-bold drop-shadow-md">Episode</span>
      </div>

      {/* 2. Share Button */}
      <div className="flex flex-col items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg">
              <Share2 className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black/90 border-white/20 text-white backdrop-blur-xl w-48">
            <DropdownMenuItem
              onClick={copyToClipboard}
              className="hover:bg-white/10 focus:bg-white/10 cursor-pointer flex items-center gap-3 py-3"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              <span className="font-medium">{copied ? "Tersalin!" : "Salin URL"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const url = shareData?.url || window.location.href;
                window.open(`https://wa.me/?text=${encodeURIComponent((shareData?.text || "") + " " + url)}`, "_blank");
              }}
              className="hover:bg-white/10 focus:bg-white/10 cursor-pointer flex items-center gap-3 py-3"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-green-500">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span className="font-medium">WhatsApp</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const url = shareData?.url || window.location.href;
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
              }}
              className="hover:bg-white/10 focus:bg-white/10 cursor-pointer flex items-center gap-3 py-3"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-blue-500">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span className="font-medium">Facebook</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="text-[9px] text-white/80 font-bold drop-shadow-md">Bagikan</span>
      </div>

      {/* 3. Download Button */}
      {videoUrl && (
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleDownload}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg"
          >
            <Download className="w-5 h-5 text-primary animate-pulse-subtle" />
          </button>
          <span className="text-[9px] text-white/80 font-bold drop-shadow-md">Simpan</span>
        </div>
      )}

      {/* 4. Quality Button */}
      {qualities.length > 0 && (
        <div className="flex flex-col items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg">
                <Settings className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/90 border-white/20 text-white backdrop-blur-xl">
              {qualities.map((q) => (
                <DropdownMenuItem
                  key={q.value}
                  onClick={() => onQualityChange(q.value)}
                  className={cn(
                    "hover:bg-white/10 focus:bg-white/10 cursor-pointer",
                    currentQuality === q.value && "text-primary font-bold"
                  )}
                >
                  {q.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-[9px] text-white/80 font-bold drop-shadow-md">Kualitas</span>
        </div>
      )}
    </div>
  );
}
