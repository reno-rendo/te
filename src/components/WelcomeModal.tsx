"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [canClose, setCanClose] = useState(false);

    useEffect(() => {
        // Check if modal has already been shown in this session
        const hasShown = sessionStorage.getItem("welcome_modal_shown");
        if (!hasShown) {
            setIsOpen(true);
        }
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setCanClose(true);
        }
    }, [isOpen, countdown]);

    const handleClose = () => {
        if (!canClose) return;
        setIsOpen(false);
        sessionStorage.setItem("welcome_modal_shown", "true");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className="relative w-[90vw] max-w-[400px] bg-card border-2 border-border rounded-xl shadow-solid overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Close Button Trigger */}
                <button
                    onClick={handleClose}
                    disabled={!canClose}
                    className={`
            absolute top-2 right-2 sm:top-3 sm:right-3 z-50 p-1.5 sm:p-2 rounded-lg transition-all
            ${canClose
                            ? "bg-primary text-primary-foreground shadow-solid-sm hover:translate-y-[-2px] active:translate-y-0"
                            : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                        }
          `}
                >
                    {canClose ? (
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                        <span className="text-xs sm:text-sm font-bold tabular-nums w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                            {countdown}
                        </span>
                    )}
                </button>

                {/* Image Content */}
                <div className="relative aspect-[4/5] w-full">
                    <Image
                        src={`/modalPopup.png?v=${Date.now()}`}
                        alt="Welcome to SaPlay"
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />

                    {/* Subtle Overlay to make sure close button area is clear if image is busy */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
