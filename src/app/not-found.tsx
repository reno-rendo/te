import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-black font-display text-primary mb-4 uppercase tracking-tighter">404</h1>
      <h2 className="text-2xl font-bold text-foreground mb-4 uppercase tracking-tight">Halaman Tidak Ditemukan</h2>
      <p className="text-muted-foreground mb-10 text-center max-w-md font-medium">
        Maaf, halaman yang kamu cari tidak ada atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="px-10 py-4 rounded-xl font-bold text-primary-foreground bg-primary border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-200 shadow-solid"
      >
        KEMBALI KE BERANDA
      </Link>
    </main>
  );
}
