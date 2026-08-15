# Rapzpedia Script — V2 UI/UX

Upgrade V2 fokus pada UI/UX dan pengalaman discovery script dengan tetap memakai LocalStorage.

## Yang ditambahkan
- Homepage/dashboard baru dengan hero search.
- Search suggestion berdasarkan nama, game, kategori, subkategori, versi, deskripsi, dan tag.
- Quick filter: Semua, Free Fire, Mobile Legends, VIP, Favorit.
- Filter game + kategori + sorting terbaru/terlama/like/view/download.
- Reset filter dan empty state yang lebih informatif.
- Script card premium dengan tag, statistik, favorite, dan waktu update.
- Script detail yang lebih lengkap: breadcrumb, metadata, tag, download center, share, favorite, related scripts.
- Riwayat script yang baru dilihat.
- Favorite per user menggunakan LocalStorage.
- Profile dengan tab Overview, Favorit, dan Riwayat.
- Statistik download pada script.
- Mobile-first responsive layout.
- Micro-interaction dan animasi card.

## Menjalankan
Tidak membutuhkan build step. Buka `index.html` atau deploy folder ini ke Netlify sebagai static site.

## Catatan LocalStorage
Data user, script, favorite, history, notifikasi, dan session masih lokal di browser. Karena itu data tidak tersinkron antar perangkat.

Support chat realtime, autentikasi produksi, VIP lintas perangkat, database, dan permission download aman perlu backend pada tahap berikutnya.
