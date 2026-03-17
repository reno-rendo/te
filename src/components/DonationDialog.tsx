"use client";

import { useState } from "react";
import { Coffee, CreditCard, ChevronRight } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DONATION_AMOUNTS = [
    { value: 10000, label: "Rp 10rb" },
    { value: 25000, label: "Rp 25rb" },
    { value: 50000, label: "Rp 50rb" },
    { value: 100000, label: "Rp 100rb" },
];

export function DonationDialog({ trigger }: { trigger: React.ReactNode }) {
    const [amount, setAmount] = useState<number | "">(25000);
    const [customAmount, setCustomAmount] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Hardcoded Pakasir Project Slug
    const slug = "saplay";

    const handleDonation = () => {
        const finalAmount = amount === "" ? parseInt(customAmount) : amount;
        if (!finalAmount || finalAmount < 1000) return;

        const orderId = `DON-${Date.now()}`;
        const url = `https://app.pakasir.com/pay/${slug}/${finalAmount}?order_id=${orderId}`;
        window.open(url, "_blank");
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="p-6 border-none bg-transparent shadow-none w-full sm:max-w-[480px] focus:outline-none flex items-center justify-center">
                <div className="relative w-full max-h-[85vh] bg-background border-2 border-border shadow-solid rounded-xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
                    <div className="overflow-y-auto scrollbar-none flex-1">
                        {/* Header Part */}
                        <div className="bg-primary p-6 sm:p-8 flex flex-col items-center text-primary-foreground sticky top-0 z-10 border-b-2 border-border">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-background rounded-2xl flex items-center justify-center mb-4 shadow-solid-sm">
                                <Coffee className="w-7 h-7 sm:w-8 sm:h-8 text-primary fill-current" />
                            </div>
                            <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-center">Dukung SaPlay</DialogTitle>
                            <DialogDescription className="text-primary-foreground/80 font-medium text-center mt-2 text-sm sm:text-base max-w-[280px]">
                                Donasi Anda membantu kami tetap bebas iklan dan update terus.
                            </DialogDescription>
                        </div>

                        {/* Content Part */}
                        <div className="p-6 sm:p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-3">
                                {DONATION_AMOUNTS.map((item) => (
                                    <button
                                        key={item.value}
                                        onClick={() => {
                                            setAmount(item.value);
                                            setCustomAmount("");
                                        }}
                                        className={cn(
                                            "py-3 px-4 rounded-xl border-2 font-bold transition-all text-sm",
                                            amount === item.value
                                                ? "bg-primary border-primary text-primary-foreground shadow-solid-sm -translate-y-0.5"
                                                : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                    Jumlah Custom (Min. Rp 1.000)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">Rp</span>
                                    <Input
                                        type="number"
                                        placeholder="Masukkan jumlah..."
                                        value={customAmount}
                                        onChange={(e) => {
                                            setCustomAmount(e.target.value);
                                            setAmount("");
                                        }}
                                        className="pl-12 h-12 rounded-xl border-2 border-border focus:border-primary bg-muted font-bold text-sm sm:text-base transition-colors"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleDonation}
                                className="w-full h-14 rounded-xl text-base sm:text-lg font-black shadow-solid hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-2"
                                disabled={(amount === "" && (!customAmount || parseInt(customAmount) < 1000))}
                            >
                                Donasi Sekarang
                                <ChevronRight className="w-5 h-5" />
                            </Button>

                            <p className="text-[10px] sm:text-xs text-center text-muted-foreground font-medium opacity-80">
                                Pembayaran aman via Pakasir — QRIS, VA, & E-Wallet
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
