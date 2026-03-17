"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { usePlatform, type PlatformInfo } from "@/hooks/usePlatform";
import { useState, useRef, useEffect } from "react";

export function PlatformSelector() {
  const { currentPlatform, setPlatform, platforms, getPlatformInfo } = usePlatform();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentPlatformInfo = getPlatformInfo(currentPlatform);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full py-3 px-4">
      {/* Mobile: Dropdown */}
      <div className="block md:hidden" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 border-2 border-border bg-input hover:border-primary"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-5 h-5 rounded-md overflow-hidden">
              <Image
                src={currentPlatformInfo.logo}
                alt={currentPlatformInfo.name}
                fill
                className="object-cover"
                sizes="20px"
              />
            </div>
            <span className="font-semibold text-sm text-foreground">
              {currentPlatformInfo.name}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-4 right-4 mt-2 rounded-xl overflow-hidden z-50 bg-popover border-2 border-border shadow-solid-sm">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => {
                  setPlatform(platform.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${currentPlatform === platform.id
                  ? 'text-primary bg-primary/10 font-bold'
                  : 'text-foreground hover:bg-muted font-medium'
                  }`}
              >
                <div className="relative w-5 h-5 rounded-md overflow-hidden">
                  <Image
                    src={platform.logo}
                    alt={platform.name}
                    fill
                    className="object-cover"
                    sizes="20px"
                  />
                </div>
                <span className="font-medium text-sm">{platform.name}</span>
                {currentPlatform === platform.id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-xl bg-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Horizontal tabs */}
      <div className="hidden md:flex items-center gap-1.5 flex-wrap">
        {platforms.map((platform) => (
          <PlatformButton
            key={platform.id}
            platform={platform}
            isActive={currentPlatform === platform.id}
            onClick={() => setPlatform(platform.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface PlatformButtonProps {
  platform: PlatformInfo;
  isActive: boolean;
  onClick: () => void;
}

function PlatformButton({ platform, isActive, onClick }: PlatformButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-xl
        transition-all text-sm font-bold uppercase tracking-wider border-2
        ${isActive
          ? "bg-primary text-primary-foreground border-primary shadow-solid-sm -translate-y-[2px]"
          : "bg-input text-muted-foreground border-border hover:border-primary hover:text-foreground"
        }
      `}
    >
      <div className="relative w-5 h-5 rounded-xl overflow-hidden">
        <Image
          src={platform.logo}
          alt={platform.name}
          fill
          className="object-cover"
          sizes="20px"
        />
      </div>
      <span className="whitespace-nowrap">
        {platform.name}
      </span>
    </button>
  );
}
