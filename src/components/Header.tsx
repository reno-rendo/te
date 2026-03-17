"use client";

import { useState, useEffect } from "react";
import { SearchModal } from "./SearchModal";
import Link from "next/link";
import Image from "next/image";
import { Search, Play, Menu, ExternalLink, Coffee } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { usePlatform } from "@/hooks/usePlatform";
import { DonationDialog } from "./DonationDialog";
import { Button } from "@/components/ui/button"; // Added Button import

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentPlatform, setPlatform, platforms } = usePlatform();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-50 w-full border-b-2 border-border transition-all lg:hidden ${scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background"} `}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 -ml-2 text-foreground hover:bg-muted rounded-lg transition-colors" aria-label="Menu">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 flex flex-col border-r-2 border-border bg-background">
                <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
                <SheetDescription className="sr-only">Pilih platform streaming drama pendek</SheetDescription>

                {/* Logo inside Sheet */}
                <div className="h-20 flex items-center px-6 border-b-2 border-border">
                  <Link href="/" className="flex items-center gap-2.5 group w-full" onClick={() => setMobileMenuOpen(false)}>
                    <div className="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-200 bg-primary group-hover:-translate-y-1">
                      <Play className="w-4 h-4 text-primary-foreground fill-current ml-0.5" />
                    </div>
                    <span className="font-display font-black text-2xl tracking-tight text-foreground">
                      SaPlay
                    </span>
                  </Link>
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
                          onClick={() => {
                            setPlatform(platform.id);
                            setMobileMenuOpen(false);
                          }}
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
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-border shadow-solid-sm hover:translate-y-[-2px] active:translate-y-0 transition-all font-bold gap-2">
                        <Coffee className="w-4 h-4 fill-current" />
                        Donasi
                      </Button>
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
              </SheetContent>
            </Sheet>

            {/* Logo in Header */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-200 bg-primary group-hover:-translate-y-1 ${scrolled ? "shadow-solid-sm" : ""} `}>
                <Play className="w-4 h-4 text-primary-foreground fill-current ml-0.5" />
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-foreground">
                SaPlay
              </span>
            </Link>
          </div>

          {/* Search Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground transition-all duration-200 border-2 border-border hover:border-primary bg-input"
              aria-label="Cari"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:block">Cari Drama...</span>
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
