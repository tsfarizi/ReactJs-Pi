# Chiz Decor Wedding Experience

Selamat datang di dokumentasi proyek web Chiz Decor, platform pemesanan dekorasi pernikahan yang elegan dan modern. Aplikasi ini dibangun dengan React + TypeScript + Vite dan menghadirkan animasi bernuansa wedding serta dukungan pembayaran bertahap (DP dan pelunasan).

## Daftar Isi
- [Tentang Proyek](#tentang-proyek)
- [Sorotan Fitur](#sorotan-fitur)
- [Teknologi Utama](#teknologi-utama)
- [Struktur Proyek](#struktur-proyek)
- [Persiapan Lingkungan](#persiapan-lingkungan)
- [Menjalankan Proyek](#menjalankan-proyek)
- [Alur Pembayaran](#alur-pembayaran)
- [Catatan Deployment](#catatan-deployment)
- [Desain & Animasi](#desain--animasi)
- [Kontak](#kontak)

## Tentang Proyek
Chiz Decor Wedding Experience membantu calon pengantin mengeksplorasi paket dekorasi, melakukan pemesanan, dan memantau status pembayaran dengan antarmuka yang hangat. Admin dapat mengatur paket, galeri, proyek dekorasi, sekaligus mengaktifkan pelunasan final secara manual.

## Sorotan Fitur
- **Landing Page bertema wedding** dengan animasi lembut dan tombol hero yang langsung menuju daftar paket dekorasi.
- **Hash routing** memungkinkan akses langsung ke halaman manapun (ideal untuk GitHub Pages).
- **Alur pembayaran bertahap** (DP & pelunasan) terintegrasi Midtrans, dilengkapi tombol kontak admin saat DP sudah lunas.
- **Dasbor admin** untuk mengelola paket, galeri, proyek dekorasi, dan memantau status booking.
- **Tombol Hubungi Admin** otomatis menyiapkan pesan WhatsApp saat status booking berada di "DP Terbayar".

## Teknologi Utama
- React 19 + TypeScript
- Vite 6
- Material UI
- React Router (HashRouter)
- Tailwind via `@tailwindcss/vite`
- Axios
- Midtrans Snap
- Supabase (integrasi default template)

## Struktur Proyek
```text
ReactJs-Pi/
|- public/
|- src/
|  |- components/
|  |- pages/
|  |  |- HomePage.tsx
|  |  |- bookings/
|  |  |- admin/
|  |- services/
|  |- utils/
|  |- App.tsx
|  |- main.tsx
|- index.html
|- vite.config.ts
|- package.json
|- README.md
```

## Persiapan Lingkungan
1. Pastikan **Node.js 18+** sudah terpasang.
2. Clone repository ini dan jalankan `npm install` untuk mengunduh dependencies.
3. Salin atau sesuaikan berkas `.env`:
```env
VITE_API_URL=https://wedding-114331170820.asia-southeast2.run.app
VITE_MIDTRANS_CLIENT_KEY=Mid-client-uwc9aEzaapgcedn2
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Menjalankan Proyek
```bash
# Install dependencies
npm install

# Mode pengembangan
npm run dev
# Aplikasi otomatis menggunakan hash routing dengan base /ReactJs-Pi/

# Build produksi
npm run build

# Preview hasil build
npm run preview
```

## Alur Pembayaran
1. **DP (Down Payment)**
   - Status awal booking: `Menunggu DP`.
   - Tombol "Bayar DP" selalu tersedia selama DP belum lunas.
2. **DP Terbayar**
   - Tombol pelunasan belum muncul.
   - Pengguna mendapat tombol **Hubungi Admin** (WhatsApp) untuk menanyakan aktivasi pelunasan.
3. **Aktifkan Pelunasan (Admin)**
   - Admin menekan tombol "Aktifkan Pelunasan" di dasbor.
   - Sistem membuat baris pembayaran final (pending) dan mengganti status booking menjadi `Menunggu Pelunasan`.
4. **Pelunasan**
   - Pengguna melihat tombol "Pelunasan" dan melanjutkan pembayaran via Midtrans.
   - Setelah sukses, status berubah menjadi `Pelunasan Terbayar`.

## Catatan Deployment
- Aplikasi menggunakan `HashRouter`, sehingga URL berbentuk `https://domain/ReactJs-Pi/#/...`.
- `vite.config.ts` telah diset `base: "/ReactJs-Pi/"` agar kompatibel dengan GitHub Pages.
- Refresh atau akses langsung ke rute tertentu aman karena hash routing tidak membutuhkan konfigurasi server tambahan.

## Desain & Animasi
- Kelas khusus (`wedding-fade`, `wedding-button`, `hero-petal`, `wedding-outline`) menambah nuansa glamor ala pesta pernikahan.
- Animasi didefinisikan di `src/index.css`, memberikan efek shimmer, glow, dan fade lembut pada hero, konten, serta tombol.

## Kontak
Butuh bantuan atau ingin berkolaborasi?
- WhatsApp Admin : +62 816-1777-5709
- Instagram      : [@chizdecor](https://instagram.com/chizdecor)
- Email          : chizdecor@gmail.com

Semoga dokumentasi ini membantu Anda mengembangkan dan merawat proyek Chiz Decor Wedding Experience. Selamat berkarya dan wujudkan acara impian!
