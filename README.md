"# KelasKu - Platform Manajemen Kelas Malam

Sebuah platform sederhana untuk membantu manajemen kelas malam saya, dengan fokus pada komunikasi, transparansi, dan kolaborasi antar anggota kelas.

## Fitur Utama

### 1. Kritik & Saran Anonim
- Anggota kelas dapat memberikan kritik dan saran secara anonim
- Semua masukan disimpan dan ditampilkan secara real-time
- Tidak ada identifikasi siapa yang membuat saran tersebut

### 2. Manajemen Tugas
- Siapa pun dapat menambahkan tugas dengan nama dan deadline
- Sistem menandai tugas yang sudah lewat deadline
- Mudah dihapus jika tugas sudah selesai

### 3. Laporan Keuangan
- Upload file bukti pengeluaran kelas (PDF, gambar, spreadsheet)
- Catatan transparan tentang pengeluaran kelas
- Memudahkan bendahara dalam menyimpan bukti-bukti keuangan

## Teknologi yang Digunakan

- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage (untuk menyimpan data secara lokal di browser)

## Cara Menjalankan Aplikasi

Aplikasi ini dirancang untuk bekerja secara statis dan dapat diakses langsung sebagai file HTML. Namun, jika ingin menjalankan di server lokal:

```bash
# Instal live-server (jika belum)
npm install -g live-server

# Jalankan aplikasi
live-server
```

Atau gunakan modul Node.js bawaan:

```bash
# Instal serve (jika belum)
npm install -g serve

# Jalankan aplikasi
serve -s .
```

## Deployment

Aplikasi ini didesain untuk dideploy di GitHub Pages menggunakan GitHub Actions. Pipeline deployment sudah dikonfigurasi di `.github/workflows/deploy.yml`.

## Prinsip Desain

Project ini dibuat dengan prinsip KISS (Keep It Simple, Stupid):
- Antarmuka yang sederhana dan mudah digunakan
- Tanpa dependensi eksternal yang tidak diperlukan
- Fokus pada fungsionalitas utama tanpa embel-embel berlebihan

## Kontribusi

Jika Anda adalah anggota kelas dan memiliki saran untuk pengembangan lebih lanjut, Anda bisa fork repository ini dan membuat pull request, atau gunakan fitur kritik dan saran di dalam aplikasi.

## Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail lengkapnya." 
