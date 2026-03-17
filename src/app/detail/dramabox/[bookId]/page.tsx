"use client";

import { UnifiedErrorDisplay } from "@/components/UnifiedErrorDisplay";
import { useDramaDetail } from "@/hooks/useDramaDetail";
import { Play, Calendar, ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import type { DramaDetailDirect, DramaDetailResponseLegacy } from "@/types/drama";

// Helper to check if response is new format
function isDirectFormat(data: unknown): data is DramaDetailDirect {
  return data !== null && typeof data === 'object' && 'bookId' in data && 'coverWap' in data;
}

// Helper to check if response is legacy format
function isLegacyFormat(data: unknown): data is DramaDetailResponseLegacy {
  return data !== null && typeof data === 'object' && 'data' in data && (data as DramaDetailResponseLegacy).data?.book !== undefined;
}

export default function DramaBoxDetailPage() {
  const params = useParams<{ bookId: string }>();
  const bookId = params.bookId;
  const router = useRouter();
  const { data, isLoading, error } = useDramaDetail(bookId || "");

  if (isLoading) {
    return <DetailSkeleton />;
  }

  // Handle both new and legacy API formats
  let book: {
    bookId: string;
    bookName: string;
    cover: string;
    chapterCount: number;
    introduction: string;
    tags?: string[];
    shelfTime?: string;
  } | null = null;

  if (isDirectFormat(data)) {
    // New flat format
    book = {
      bookId: data.bookId,
      bookName: data.bookName,
      cover: data.coverWap,
      chapterCount: data.chapterCount,
      introduction: data.introduction,
      tags: data.tags || data.tagV3s?.map(t => t.tagName),
      shelfTime: data.shelfTime,
    };
  } else if (isLegacyFormat(data)) {
    // Legacy nested format
    book = {
      bookId: data.data.book.bookId,
      bookName: data.data.book.bookName,
      cover: data.data.book.cover,
      chapterCount: data.data.book.chapterCount,
      introduction: data.data.book.introduction,
      tags: data.data.book.tags,
      shelfTime: data.data.book.shelfTime,
    };
  }

  if (error || !book) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <UnifiedErrorDisplay
          title="Drama tidak ditemukan"
          message="Tidak dapat memuat detail drama. Silakan coba lagi atau kembali ke beranda."
          onRetry={() => router.push('/')}
          retryLabel="Kembali ke Beranda"
        />
      </div>
    );
  }

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
                src={book.cover}
                alt={book.bookName}
                className="w-full max-w-[300px] mx-auto rounded-xl border-2 border-border shadow-solid"
              />
              <div className="absolute inset-0 rounded-xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                <Link
                  href={`/watch/dramabox/${book.bookId}`}
                  className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-solid-sm"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Tonton Sekarang
                </Link>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black font-display text-primary mb-4 uppercase tracking-tighter">
                  {book.bookName}
                </h1>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Play className="w-4 h-4" />
                    <span>{book.chapterCount} Episode</span>
                  </div>
                  {book.shelfTime && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{book.shelfTime?.split(" ")[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {book.tags && book.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="bg-card border-2 border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2 uppercase tracking-wider text-sm">
                  <div className="w-1.5 h-4 bg-primary" />
                  Sinopsis
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {book.introduction}
                </p>
              </div>

              {/* Watch Button */}
              <Link
                href={`/watch/dramabox/${book.bookId}`}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black text-primary-foreground bg-primary border-2 border-primary hover:bg-background hover:text-primary transition-all duration-200 shadow-solid uppercase tracking-wider"
              >
                <Play className="w-5 h-5 fill-current" />
                Mulai Menonton
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailSkeleton() {
  return (
    <main className="min-h-screen pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <Skeleton className="aspect-[2/3] w-full max-w-[300px] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-12 w-48 rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
