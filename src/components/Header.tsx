"use client";

import { useState, useEffect } from "react";
import { SearchModal } from "./SearchModal";
import Link from "next/link";
import { Search, Play } from "lucide-react";
import { usePlatform } from "@/hooks/usePlatform";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentPlatform } = usePlatform();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-50 w-full border-b-2 border-border transition-all hidden ${scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background"} `}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-200 bg-primary group-hover:-translate-y-1 ${scrolled ? "shadow-solid-sm" : ""} `}>
                <Play className="w-4 h-4 text-primary-foreground fill-current ml-0.5" />
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-foreground">
                SaPlay
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200 border-2 border-border hover:border-primary bg-input"
              aria-label="Cari"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <SearchModal onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}
