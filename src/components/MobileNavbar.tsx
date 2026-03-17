"use client";

import { Home, Search, Tv, Coffee, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { SearchModal } from "./SearchModal";
import { DonationDialog } from "./DonationDialog";
import { usePlatform } from "@/hooks/usePlatform";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
} from "@/components/ui/drawer";

export function MobileNavbar() {
    const pathname = usePathname();
    const [searchOpen, setSearchOpen] = useState(false);
    const { currentPlatform, setPlatform, platforms, platformInfo } = usePlatform();

    // Jangan tampilkan di mode menonton (watch)
    if (pathname?.startsWith("/watch")) {
        return null;
    }

    return (
        <>
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[min(400px,92%)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
                <nav className="bg-background/80 backdrop-blur-xl border-2 border-border shadow-solid-sm rounded-3xl h-18 flex items-center justify-between px-3 py-2 gap-1">
                    
                    {/* Home */}
                    <Link
                        href="/"
                        className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-2 rounded-2xl transition-all ${
                            pathname === "/" 
                            ? "text-primary bg-primary/5" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Home className={`w-5 h-5 ${pathname === "/" ? "fill-current" : ""}`} />
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">Beranda</span>
                    </Link>

                    {/* Platforms Drawer */}
                    <Drawer>
                        <DrawerTrigger asChild>
                            <button className="flex-1 flex flex-col items-center justify-center gap-1.5 py-2 rounded-2xl text-muted-foreground hover:text-foreground transition-all">
                                <LayoutGrid className="w-5 h-5" />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Situs</span>
                            </button>
                        </DrawerTrigger>
                        <DrawerContent className="border-t-2 border-border bg-background px-4 pb-8">
                            <DrawerHeader className="px-0 mb-4">
                                <DrawerTitle className="text-xl font-black text-left">Pilih Platform</DrawerTitle>
                            </DrawerHeader>
                            <div className="grid grid-cols-2 gap-3">
                                {platforms.map((p) => {
                                    const isActive = currentPlatform === p.id;
                                    return (
                                        <DrawerClose key={p.id} asChild>
                                            <button
                                                onClick={() => setPlatform(p.id)}
                                                className={`
                                                    flex items-center gap-3 p-3 rounded-2xl border-2 transition-all
                                                    ${isActive 
                                                        ? "bg-primary border-primary text-primary-foreground shadow-solid-sm -translate-y-0.5" 
                                                        : "border-border bg-muted/50 text-muted-foreground hover:border-primary hover:text-foreground"
                                                    }
                                                `}
                                            >
                                                <div className="relative w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 border border-black/10">
                                                    <Image src={p.logo} alt={p.name} fill className="object-cover" sizes="28px" />
                                                </div>
                                                <span className="font-bold text-sm truncate">{p.name}</span>
                                            </button>
                                        </DrawerClose>
                                    );
                                })}
                            </div>
                        </DrawerContent>
                    </Drawer>

                    {/* Search */}
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="flex-1 flex flex-col items-center justify-center gap-1.5 py-2 rounded-2xl text-muted-foreground hover:text-foreground transition-all"
                    >
                        <Search className="w-5 h-5" />
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">Cari</span>
                    </button>

                    {/* Donation */}
                    <div className="flex-1 flex justify-center">
                        <DonationDialog
                            trigger={
                                <button className="w-full flex flex-col items-center justify-center gap-1.5 py-2 rounded-2xl text-muted-foreground hover:text-foreground transition-all group">
                                    <Coffee className="w-5 h-5 group-hover:fill-current" />
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">Donasi</span>
                                </button>
                            }
                        />
                    </div>
                </nav>
            </div>

            {searchOpen && (
                <SearchModal onClose={() => setSearchOpen(false)} />
            )}
        </>
    );
}
