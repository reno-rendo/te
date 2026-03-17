"use client";

import Link from "next/link";
import { Play, Search, Home, Compass, Clock, PlayCircle, Settings, LogOut, Coffee, Instagram, Twitter, Github, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";
import { usePlatform } from "@/hooks/usePlatform";
import { useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { SearchModal } from "./SearchModal";
import { DonationDialog } from "./DonationDialog";

export function Sidebar() {
    const pathname = usePathname();
    const { currentPlatform, setPlatform, platforms } = usePlatform();
    const [searchOpen, setSearchOpen] = useState(false);

    // Jangan tampilkan sidebar di layar pemutaran video (Watch mode)
    if (pathname?.startsWith("/watch")) {
        return null;
    }

    return (
        <>
            <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0 h-screen sticky top-0 border-r-2 border-border bg-background z-40">

                {/* Logo Section */}
                <div className="h-20 flex items-center px-6 border-b-2 border-border">
                    <Link href="/" className="flex items-center gap-2.5 group w-full">
                        <div className="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-200 bg-primary group-hover:-translate-y-1">
                            <Play className="w-4 h-4 text-primary-foreground fill-current ml-0.5" />
                        </div>
                        <span className="font-display font-black text-2xl tracking-tight text-foreground">
                            SaPlay
                        </span>
                    </Link>
                </div>

                {/* Search Trigger */}
                <div className="p-4 border-b-2 border-border">
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground transition-all duration-200 border-2 border-border hover:border-primary bg-input"
                        aria-label="Cari"
                    >
                        <Search className="w-4 h-4 flex-shrink-0" />
                        <span>Cari Drama...</span>
                    </button>
                </div>

                {/* Scrollable Navigation */}
                <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-none">
                    <div className="mb-4 text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">
                        Pilih Platform
                    </div>

                    <nav className="space-y-1.5 flex flex-col">
                        {platforms.map((platform) => {
                            const isActive = currentPlatform === platform.id;
                            return (
                                <button
                                    key={platform.id}
                                    onClick={() => setPlatform(platform.id)}
                                    className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl
                    transition-all text-sm font-bold
                    ${isActive
                                            ? "bg-primary text-primary-foreground shadow-solid-sm translate-x-1"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }
                  `}
                                >
                                    <div className="relative w-6 h-6 rounded-md overflow-hidden flex-shrink-0 shadow-sm border border-black/10">
                                        <Image
                                            src={platform.logo}
                                            alt={platform.name}
                                            fill
                                            className="object-cover"
                                            sizes="24px"
                                        />
                                    </div>
                                    <span className="truncate text-left">{platform.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Area in Sidebar */}
                <div className="p-4 border-t-2 border-border mt-auto flex flex-col gap-3">
                    <DonationDialog
                        trigger={
                            <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-black shadow-solid hover:translate-y-[-2px] active:translate-y-0 transition-all text-sm">
                                <Coffee className="w-4 h-4 fill-current" />
                                Donasi
                            </button>
                        }
                    />

                    <div className="bg-muted rounded-xl p-4 flex flex-col gap-2 border border-border/50">
                        <p className="text-xs text-muted-foreground font-medium">
                            Follow Creator
                            <a
                                href="https://www.instagram.com/reno.rendo11/?hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-bold ml-1 text-primary hover:underline"
                            >
                                @reno.rendo11
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1 font-medium">
                            © {new Date().getFullYear()} Made with
                            <Coffee className="w-3 h-3 fill-current text-primary" />
                        </p>
                    </div>
                </div>
            </aside>

            {/* Render Search Modal Portal */}
            {searchOpen && (
                <SearchModal onClose={() => setSearchOpen(false)} />
            )}
        </>
    );
}
