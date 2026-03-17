# SaPlay Brand & Tech Stack Documentation

Dokumen ini berisi informasi mengenai identitas visual (Color Palette) serta stack teknologi utama yang digunakan dalam pengembangan aplikasi web **SaPlay**.

---

## 🎨 Color Palette (Tema Amber Minimalist)

SaPlay menggunakan skema warna "Amber Minimalist" yang mengedepankan blok warna solid (*flat*), desain UI industri tanpa gradasi kompleks, dipadukan dengan aksen kuning amber (*yellow-amber*) yang tegas.

| Nama Warna | Penggunaan Utama | Kode HEX | RGB / HSL |
| :--- | :--- | :--- | :--- |
| **Background** | Latar belakang utama seluruh aplikasi | `#171717` | `hsl(0 0% 9%)` |
| **Foreground** | Warna teks standar | `#E5E5E5` | `hsl(0 0% 90%)` |
| **Primary (Amber)** | Aksen utama, *highlight*, tombol aktif, *shadow* | `#F59E0B` | `hsl(38 92% 50%)` |
| **Card / Surface** | Warna kontainer sekunder (sedikit lebih terang) | `#1F1F1F` | `hsl(0 0% 12%)` |
| **Secondary / Muted** | Teks non-aktif, *border*, *input field* | `#262626` | `hsl(0 0% 15%)` |

**Catatan Desain Tambahan:**
- Komponen *shadowing* menggunakan teknik offset solid warna *Primary* (contoh: `4px 4px 0px 0px hsl(var(--primary))`) daripada *blur dropdown* (*glassmorphism*).
- Garis tepi (*border*) sengaja dibuat tegas untuk menambah karakter pada kotak konten.

---

## 💻 Tech Stack

Proyek ini dibangun menggunakan arsitektur *frontend* modern, yang menitikberatkan pada performa optimal, penataan tampilan cepat, dan pengelolaan asinkron yang kokoh.

### Framework & Bahasa
1. **[Next.js](https://nextjs.org/) (v16+)**: Framework React utama (`App Router` digunakan).
2. **[React](https://react.dev/) (v18+)**: Pustaka inti untuk menyusun antarmuka pengguna interaktif (termasuk *Server Components* dan *Client Components*).
3. **[TypeScript](https://www.typescriptlang.org/)**: *Superset* dari JavaScript untuk pengetikan statis yang membuat proyek lebih maintanable (*type-safe*).

### Styling & Komponen UI
1. **[Tailwind CSS](https://tailwindcss.com/) (v3)**: *Utility-first CSS framework* untuk mempercepat pengembangan tata letak dan skema desain responsif.
2. **[shadcn/ui](https://ui.shadcn.com/)**: Koleksi komponen UI fleksibel (*re-usable*) untuk fungsi interaktif seperti `Sheet`/`Drawer`, `Dialog`, `SearchModal`, dan `Accordion`.
3. **[Radix UI](https://www.radix-ui.com/)**: Fundamental *primitives library* tak berwajah (*headless*) yang menggerakkan utilitas di bawah shadcn/ui.
4. **[Lucide React](https://lucide.dev/)**: Penyedia ikon vektor (SVG) modern dan konsisten.

### State Management & Performa Data
1. **[TanStack Query / React Query](https://tanstack.com/query) (v5)**: Diandalkan untuk manajemen state asinkronus (pengambilan data server, caching, mutasi, paginasi / infinite scrolling (`useInfiniteQuery`)).
2. **[Zustand](https://github.com/pmndrs/zustand) (v5)**: Sistem manajamen state global super ringan (saat ini digunakan misal untuk preferensi *Platform / Viewport*).

### Lainnya
- **[next-themes](https://github.com/pacocoursey/next-themes)**: *Helper* khusus implementasi *Dark/Light Mode* (tema saat ini difiksasi penuh gaya "*Amber Dark*").
- **[HLS.js](https://github.com/video-dev/hls.js/)**: Digunakan mendasari Video Player agar kompatibel memutar format arsip `m3u8` di sistem browser.
- **[Zod](https://zod.dev/)** & **[React Hook Form](https://react-hook-form.com/)**: Alat tangguh untuk mengamankan dan memvalidasi formulir pengguna secara dinamis.
