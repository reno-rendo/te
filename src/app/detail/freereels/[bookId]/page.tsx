
"use client";

import { useFreeReelsDetail } from "@/hooks/useFreeReels";
import { useParams, useRouter } from "next/navigation";
import { Play, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { UnifiedErrorDisplay } from "@/components/UnifiedErrorDisplay";

export default function FreeReelsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;

  const { data, isLoading, error, refetch } = useFreeReelsDetail(bookId);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  // Handle optional chaining safely since data might be partial
  if (error || !data || !data.data) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <UnifiedErrorDisplay
          title="Gagal Memuat Drama"
          message={error ? "Drama tidak ditemukan atau terjadi kesalahan server." : "Data tidak tersedia."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const drama = data.data;
  // Fallback for episode navigation. If detail API returns episodes list, use it. 
  // Otherwise try to use container info if available (likely from foryou feed passed via state, but here we fetch fresh).
  // For now assuming we start at episode 1 or what's available.
  const firstEpisodeId = drama.container?.episode_info?.id || "1";

  return (
    <main className="min-h-screen bg-background pb-20 lg:pb-10">
      {/* Immersive Header Hero */}
      <div className="relative h-[45vh] lg:h-[50vh] w-full overflow-hidden">
        {/* Blurred Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-2xl opacity-30"
          style={{ backgroundImage: `url(${drama.cover})` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-4 z-20">
          <button
            onClick={() => router.back()}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-background/50 backdrop-blur-md border border-white/10 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Content in Hero */}
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-end pb-12">
            <div className="flex gap-4 items-end animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Mobile Cover */}
                <div className="lg:hidden shrink-0 w-28 sm:w-32 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                    <img 
                        src={drama.cover} 
                        alt={drama.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black font-display text-foreground mb-3 leading-[0.9] tracking-tighter uppercase line-clamp-2">
                      {drama.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2">
                        {drama.content_tags?.slice(0, 2).map((tag: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[9px] font-black uppercase tracking-widest leading-none">
                                {tag}
                            </span>
                        ))}
                        <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-bold">
                            <Play className="w-3 h-3" />
                            {drama.episode_count || "?"} Eps
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Cover Art - Floating effect */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border-4 border-border shadow-solid animate-in zoom-in-95 duration-500">
                    <img
                        src={drama.cover}
                        alt={drama.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                         <Link
                            href={`/watch/freereels/${bookId}?ep=1`}
                            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-black text-center shadow-solid-sm hover:translate-y-[-2px] transition-all"
                        >
                            TONTON
                        </Link>
                    </div>
                </div>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            {/* Mobile Action Button */}
            <div className="lg:hidden">
                 <Link
                    href={`/watch/freereels/${bookId}?ep=1`}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-solid hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Play className="w-6 h-6 fill-current" />
                    MULAI MENONTON
                </Link>
            </div>

            {/* IntroductionCard */}
            <div className="bg-card/50 backdrop-blur-sm border-2 border-border rounded-3xl p-6 lg:p-8 shadow-sm">
              <h3 className="font-black text-foreground mb-4 flex items-center gap-2 uppercase tracking-widest text-xs opacity-70">
                <div className="w-1 h-3 bg-primary rounded-full" />
                Sinopsis Drama
              </h3>
              <p className="text-muted-foreground leading-relaxed font-medium text-base lg:text-lg">
                {drama.desc || "Tidak ada deskripsi."}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 <div className="p-4 rounded-2xl bg-muted/50 border-2 border-border/50 flex flex-col items-center text-center gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Status</span>
                    <span className="font-black text-foreground">Selesai</span>
                 </div>
                 <div className="p-4 rounded-2xl bg-muted/50 border-2 border-border/50 flex flex-col items-center text-center gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Platform</span>
                    <span className="font-black text-primary uppercase">FreeReels</span>
                 </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailSkeleton() {
  return (
    <main className="min-h-screen pt-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <Skeleton className="aspect-[2/3] w-full max-w-[300px] rounded-2xl mx-auto md:mx-0" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-12 w-48 rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
