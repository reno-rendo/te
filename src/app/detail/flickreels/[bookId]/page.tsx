"use client";

import { useFlickReelsDetail } from "@/hooks/useFlickReels";
import { useParams, useRouter } from "next/navigation";
import { Play, ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { UnifiedErrorDisplay } from "@/components/UnifiedErrorDisplay";
import { Badge } from "@/components/ui/badge";

export default function FlickReelsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;

  const { data, isLoading, error, refetch } = useFlickReelsDetail(bookId);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !data) {
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

  const { drama, episodes } = data;
  const firstEpisode = episodes?.[0];

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section with Cover */}
      <div className="relative">
        {/* Background Solid with subtle pattern or border */}
        <div className="absolute inset-x-0 top-0 h-[400px] bg-secondary/30 border-b-2 border-border" />

        <div className="relative max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            {/* Cover */}
            <div className="relative group">
              <img
                src={drama.cover}
                alt={drama.title}
                className="w-full max-w-[300px] mx-auto rounded-xl border-2 border-border shadow-solid"
              />
              {/* Overlay Play Button on Cover */}
              {firstEpisode && (
                <div className="absolute inset-0 rounded-xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                  <Link
                    href={`/watch/flickreels/${bookId}/${firstEpisode.id}`}
                    className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-solid-sm"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Tonton Sekarang
                  </Link>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black font-display text-primary mb-4 uppercase tracking-tighter">
                  {drama.title}
                </h1>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Play className="w-4 h-4" />
                    <span>{episodes?.length || drama.chapterCount} Episode</span>
                  </div>
                  {/* Status Badge if available, assuming drama.status or similar exists, otherwise omit */}
                </div>

                {/* Labels */}
                {drama.labels && drama.labels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {drama.labels.map((label: any, idx: number) => (
                      <span key={idx} className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium">
                        {label.tag_name || label.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-card border-2 border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2 uppercase tracking-wider text-sm">
                  <div className="w-1.5 h-4 bg-primary" />
                  Sinopsis
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {drama.description || "Tidak ada deskripsi."}
                </p>
              </div>

              {/* Watch Button */}
              {firstEpisode && (
                <Link
                  href={`/watch/flickreels/${bookId}/${firstEpisode.id}`}
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black text-primary-foreground bg-primary border-2 border-primary hover:bg-background hover:text-primary transition-all duration-200 shadow-solid uppercase tracking-wider"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Mulai Menonton
                </Link>
              )}
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
