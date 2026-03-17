"use client";

import { ExternalLink, Coffee, Play } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on watch pages for immersive video experience
  if (pathname?.startsWith("/watch")) {
    return null;
  }

  return (
    <footer className="relative mt-16 bg-background border-t-2 border-border">

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Logo mini */}
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-primary">
              <Play className="w-3 h-3 text-primary-foreground fill-current ml-0.5" />
            </div>
            <span className="font-display font-black text-sm text-foreground">SaPlay</span>
          </div>

          {/* API Credit */}
          <p className="text-sm text-muted-foreground text-center">
            Instagram{" "}
            <a
              href="https://www.instagram.com/reno.rendo11/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold transition-all duration-200 text-primary hover:underline"
            >
              reno.rendo11
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/60 text-center flex items-center gap-1.5">
            © {new Date().getFullYear()} Made

            by Reno Rendo
          </p>
        </div>
      </div>
    </footer>
  );
}

