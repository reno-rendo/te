"use client";

import { useEffect, useState, useRef } from "react";
import { Search, X, Play } from "lucide-react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePlatform } from "@/hooks/usePlatform";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchDramas } from "@/hooks/useDramas";
import { useReelShortSearch } from "@/hooks/useReelShort";
import { useNetShortSearch } from "@/hooks/useNetShort";
import { useShortMaxSearch } from "@/hooks/useShortMax";
import { useMeloloSearch } from "@/hooks/useMelolo";
import { useFlickReelsSearch } from "@/hooks/useFlickReels";
import { useFreeReelsSearch } from "@/hooks/useFreeReels";

interface SearchModalProps {
    onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedQuery = useDebounce(searchQuery, 300);
    const normalizedQuery = debouncedQuery.trim();

    const { currentPlatform, getPlatformInfo, isDramaBox, isReelShort, isShortMax, isNetShort, isMelolo, isFlickReels, isFreeReels } = usePlatform();
    const platformInfo = getPlatformInfo(currentPlatform);

    // Search based on active platform hook
    const { data: dramaBoxResults, isLoading: isDbLoad } = useSearchDramas(isDramaBox ? normalizedQuery : "");
    const { data: reelShortResults, isLoading: isRsLoad } = useReelShortSearch(isReelShort ? normalizedQuery : "");
    const { data: netShortResults, isLoading: isNsLoad } = useNetShortSearch(isNetShort ? normalizedQuery : "");
    const { data: shortMaxResults, isLoading: isSmLoad } = useShortMaxSearch(isShortMax ? normalizedQuery : "");
    const { data: meloloResults, isLoading: isMlLoad } = useMeloloSearch(isMelolo ? normalizedQuery : "");
    const { data: flickReelsResults, isLoading: isFrLoad } = useFlickReelsSearch(isFlickReels ? normalizedQuery : "");
    const { data: freeReelsResults, isLoading: isFwLoad } = useFreeReelsSearch(isFreeReels ? normalizedQuery : "");

    // Consolidation state
    const isSearching = isDbLoad || isRsLoad || isNsLoad || isSmLoad || isMlLoad || isFrLoad || isFwLoad;

    let searchResults: any[] = [];
    if (isDramaBox) searchResults = dramaBoxResults?.data?.list || [];
    if (isReelShort) searchResults = reelShortResults?.data?.list || [];
    if (isNetShort) searchResults = netShortResults?.data?.list || [];
    if (isShortMax) searchResults = shortMaxResults?.data?.list || [];
    if (isMelolo) searchResults = meloloResults?.data?.list || [];
    if (isFlickReels) searchResults = flickReelsResults?.data?.list || [];
    if (isFreeReels) searchResults = freeReelsResults?.data?.list || [];

    // Focus lock ref
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
        // Focus input on mount
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);

        // Lock body scroll
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Hapus Fetch Manual lama karena hooks TanStack Query mengambil alih

    if (!mounted || typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] overflow-hidden bg-background flex justify-center">
            <div className="w-full max-w-4xl px-4 py-6 h-[100dvh] flex flex-col relative">
                <div className="flex items-center gap-3 mb-5 flex-shrink-0">
                    <div className="flex-1 relative min-w-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Cari drama di ${platformInfo.name}...`}
                            className="w-full rounded-xl px-5 py-3 pl-12 text-foreground font-medium placeholder:text-muted-foreground focus:outline-none transition-all duration-200 bg-input border-2 border-border focus:border-primary focus:shadow-solid-sm"
                            autoFocus
                        />
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-xl transition-all duration-200 flex-shrink-0 border-2 border-border bg-input text-muted-foreground hover:text-foreground hover:border-primary"
                        aria-label="Tutup Pencarian"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Platform indicator */}
                <div className="mb-4 flex items-center gap-2 text-sm justify-center">
                    <span className="text-muted-foreground">Mencari di database:</span>
                    <span className="px-3 py-1 rounded-md text-xs font-bold bg-primary text-primary-foreground">
                        {platformInfo.name}
                    </span>
                </div>

                {/* Search Results */}
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-none px-1 pb-10">
                    {isSearching && normalizedQuery && (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-10 h-10 rounded-full border-4 border-muted border-t-primary animate-spin" />
                        </div>
                    )}

                    {!isSearching && normalizedQuery && searchResults.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            <p className="text-lg font-bold mb-2 text-foreground">Kosong!</p>
                            <p>Tidak ada drama yang cocok dengan "{searchQuery}"</p>
                        </div>
                    )}

                    {/* Result Grid - Adapted from Header's old logic but simplified to one common grid */}
                    {!isSearching && searchResults.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {searchResults.map((drama: any, index: number) => {
                                // Ekstraksi path berdasarkan platform
                                let bookId = "";
                                let title = "";
                                let cover = "";
                                let path = "/";

                                if (currentPlatform === "dramabox") {
                                    bookId = drama.bookId;
                                    title = drama.bookName;
                                    cover = drama.cover;
                                    path = `/detail/dramabox/${bookId}`;
                                } else if (currentPlatform === "shortmax") {
                                    bookId = drama.shortPlayId || drama.bookId;
                                    title = drama.shortPlayName || drama.title;
                                    cover = drama.coverUrl || drama.cover;
                                    path = `/detail/shortmax/${bookId}`;
                                } else if (currentPlatform === "reelshort") {
                                    bookId = drama.book_id;
                                    title = drama.book_title;
                                    cover = drama.book_pic;
                                    path = `/detail/reelshort/${bookId}`;
                                } else if (currentPlatform === "melolo") {
                                    bookId = drama.id?.toString();
                                    title = drama.title;
                                    cover = drama.poster_url;
                                    path = `/detail/melolo/${bookId}`;
                                } else if (currentPlatform === "flickreels") {
                                    bookId = drama.id?.toString();
                                    title = drama.title;
                                    cover = drama.poster_url;
                                    path = `/detail/flickreels/${bookId}`;
                                } else if (currentPlatform === "netshort") {
                                    bookId = drama.shortPlayId?.toString() || drama.id?.toString();
                                    title = drama.shortPlayName || drama.title;
                                    cover = drama.coverUrl || drama.cover;
                                    path = `/detail/netshort/${bookId}`;
                                } else if (currentPlatform === "freereels") {
                                    bookId = drama.id?.toString();
                                    title = drama.title;
                                    cover = drama.h_poster_url || drama.poster_url;
                                    path = `/detail/freereels/${bookId}`;
                                }

                                if (!bookId) return null;

                                return (
                                    <Link
                                        key={bookId}
                                        href={path}
                                        onClick={onClose}
                                        className="flex items-center gap-4 p-3 rounded-xl border-2 border-border bg-card hover:border-primary transition-all duration-200 group"
                                    >
                                        <div className="w-16 h-24 bg-muted rounded-xl flex-shrink-0 overflow-hidden relative">
                                            {cover ? (
                                                <Image src={cover} alt={title} fill className="object-cover" sizes="64px" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Play className="w-5 h-5 text-muted-foreground/30" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <h4 className="font-bold text-sm text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                                {title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mt-2 inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md bg-muted">
                                                Buka {platformInfo.name}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
