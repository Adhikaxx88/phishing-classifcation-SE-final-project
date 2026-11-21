# Implementation Plan — PhishGuard V3

## Overview

Implementasi V3 dilakukan bertahap. Prioritas pertama adalah memahami struktur proyek dan kontrak API yang sudah ada, lalu membangun validasi URL dan penyimpanan riwayat sebelum membuat Dashboard dan History. Fitur lama (prediksi URL dan QR scanner) harus tetap berfungsi.

Status awal semua task adalah belum dikerjakan. Ubah checkbox hanya setelah implementasi dan verifikasi benar-benar selesai.

## Tasks

- [ ] 1. Audit proyek dan kontrak API
  - [ ] 1.1 Periksa struktur folder frontend dan routing yang sudah ada.
  - [ ] 1.2 Periksa `package.json`, scripts, dan dependensi yang sudah terpasang.
  - [ ] 1.3 Periksa service prediksi frontend dan endpoint FastAPI yang digunakan.
  - [ ] 1.4 Catat bentuk request dan response API aktual, termasuk skala confidence.
  - [ ] 1.5 Periksa implementasi QR scanner dan cara cleanup kamera.
  - _Requirements: 3, 5, 8, 11_

- [ ] 2. Siapkan fondasi V3
  - [ ] 2.1 Pertahankan tokens cyber/dark V2 dan komponen visual yang masih digunakan.
  - [ ] 2.2 Tambahkan tipe `PredictionResult` dan `ScanHistoryItem` berdasarkan kontrak aktual.
  - [ ] 2.3 Tambahkan route Dashboard, URL Scanner, History, dan About tanpa merusak route lama.
  - [ ] 2.4 Perbarui navigasi desktop dan mobile.
  - [ ] 2.5 Pastikan tidak ada dependensi duplikat atau perubahan versi yang tidak diperlukan.
  - _Requirements: 1, 11_

- [ ] 3. Implementasi validasi URL
  - [ ] 3.1 Buat fungsi `validateUrl` yang melakukan trim dan parsing URL.
  - [ ] 3.2 Izinkan protokol `http:` dan `https:` saja, kecuali aturan proyek yang sudah ada menentukan lain.
  - [ ] 3.3 Tampilkan pesan untuk input kosong dan URL tidak valid.
  - [ ] 3.4 Pastikan URL tidak valid tidak memicu request ke backend.
  - [ ] 3.5 Tulis unit test untuk kasus valid, invalid, whitespace, dan protokol tidak didukung.
  - _Requirements: 3, 5, 11_

- [ ] 4. Rapikan prediction service dan normalisasi response
  - [ ] 4.1 Pertahankan endpoint dan payload FastAPI yang sudah digunakan.
  - [ ] 4.2 Buat adapter untuk mengubah response aktual menjadi tipe internal UI.
  - [ ] 4.3 Validasi label dan field probabilitas/confidence.
  - [ ] 4.4 Jangan menampilkan confidence jika field tidak tersedia atau tidak valid.
  - [ ] 4.5 Tampilkan error aman untuk response malformed atau label yang tidak dikenal.
  - [ ] 4.6 Tulis unit test untuk normalisasi response.
  - _Requirements: 3, 4, 9, 11_

- [ ] 5. Implementasi local history store
  - [ ] 5.1 Buat `historyStore` dengan fungsi `list`, `add`, `remove`, dan `clear`.
  - [ ] 5.2 Gunakan key `phishguard.scan-history.v1`.
  - [ ] 5.3 Validasi data ketika membaca localStorage.
  - [ ] 5.4 Simpan URL, label, confidence jika tersedia, dan timestamp ISO.
  - [ ] 5.5 Batasi jumlah item menggunakan konstanta (default 100 item terbaru).
  - [ ] 5.6 Tangani JSON rusak, storage tidak tersedia, dan quota exceeded.
  - [ ] 5.7 Pastikan kegagalan menyimpan history tidak menghilangkan hasil prediksi.
  - [ ] 5.8 Tulis unit test untuk add/list/remove/clear dan skenario error.
  - _Requirements: 6, 9, 11_

- [ ] 6. Integrasikan hasil scan dengan history
  - [ ] 6.1 Simpan hanya hasil prediksi yang berhasil dan tervalidasi.
  - [ ] 6.2 Pastikan scan manual dan hasil QR menggunakan fungsi penyimpanan yang sama.
  - [ ] 6.3 Cegah penyimpanan duplikat akibat double click atau rerender.
  - [ ] 6.4 Tampilkan notifikasi jika hasil berhasil tetapi gagal disimpan ke riwayat.
  - [ ] 6.5 Pastikan hasil gagal tidak masuk ke riwayat.
  - _Requirements: 3, 5, 6, 9_

- [ ] 7. Tingkatkan URL Scanner dan Result View
  - [ ] 7.1 Pertahankan input URL, paste, dan tombol Analyze yang sudah ada.
  - [ ] 7.2 Tambahkan state idle, validating, loading, success, dan error.
  - [ ] 7.3 Cegah request berulang saat proses berjalan.
  - [ ] 7.4 Tampilkan label PHISHING/LEGITIMATE dan confidence hanya jika tersedia.
  - [ ] 7.5 Tambahkan penjelasan hasil yang tidak mengklaim kepastian keamanan.
  - [ ] 7.6 Tambahkan tombol Copy URL dan Scan another URL.
  - [ ] 7.7 Tambahkan status aksesibel untuk loading, hasil, dan error.
  - [ ] 7.8 Tulis component/integration test untuk alur validasi dan prediksi.
  - _Requirements: 3, 4, 9, 10, 11_

- [ ] 8. Integrasikan dan perkuat QR Scanner
  - [ ] 8.1 Pertahankan kamera live dan upload gambar yang sudah tersedia.
  - [ ] 8.2 Tampilkan URL hasil decode sebelum menjalankan prediksi.
  - [ ] 8.3 Kirim URL decode melalui validator dan prediction service yang sama.
  - [ ] 8.4 Pastikan tombol start/stop bekerja dan kamera dibersihkan saat unmount.
  - [ ] 8.5 Tangani permission denied, no camera, decode error, dan initialization error.
  - [ ] 8.6 Pertahankan ScanFrame bila masih sesuai dengan komponen QR yang ada.
  - [ ] 8.7 Regression test kamera live dan upload gambar.
  - _Requirements: 5, 9, 10, 11_

- [ ] 9. Buat Dashboard
  - [ ] 9.1 Buat SummaryCard untuk total scan, phishing, dan legitimate.
  - [ ] 9.2 Hitung semua angka dari local history, bukan angka statis.
  - [ ] 9.3 Tampilkan rasio hanya jika total scan lebih dari nol.
  - [ ] 9.4 Tampilkan lima scan terbaru atau jumlah yang ditetapkan tim.
  - [ ] 9.5 Buat EmptyState untuk pengguna tanpa riwayat.
  - [ ] 9.6 Pastikan dashboard memperbarui data setelah scan atau delete.
  - [ ] 9.7 Tulis component test untuk empty dan populated state.
  - _Requirements: 2, 10, 11_

- [ ] 10. Buat History dan Detail
  - [ ] 10.1 Buat daftar riwayat terbaru lebih dahulu.
  - [ ] 10.2 Tambahkan search URL case-insensitive.
  - [ ] 10.3 Tambahkan filter All, PHISHING, dan LEGITIMATE.
  - [ ] 10.4 Tambahkan detail item berisi URL, waktu, label, dan confidence jika ada.
  - [ ] 10.5 Tambahkan aksi copy URL dan scan ulang.
  - [ ] 10.6 Tambahkan delete satu item.
  - [ ] 10.7 Tambahkan clear all dengan confirmation dialog.
  - [ ] 10.8 Tambahkan EmptyState untuk history kosong dan hasil pencarian kosong.
  - [ ] 10.9 Tampilkan penjelasan penyimpanan lokal dan privasi.
  - [ ] 10.10 Tulis component test untuk search, filter, detail, delete, dan clear.
  - _Requirements: 6, 7, 10, 11_

- [ ] 11. Perbarui About page
  - [ ] 11.1 Jelaskan tujuan dan alur kerja PhishGuard.
  - [ ] 11.2 Cantumkan stack berdasarkan konfigurasi dan kode proyek aktual.
  - [ ] 11.3 Cantumkan informasi model yang telah diverifikasi.
  - [ ] 11.4 Hapus klaim metrik yang belum memiliki bukti evaluasi.
  - [ ] 11.5 Tambahkan batasan prediksi dan responsible-use notice.
  - [ ] 11.6 Pertahankan tema cyber/dark dan layout responsif.
  - _Requirements: 8, 10_

- [ ] 12. Accessibility, responsive, dan polish
  - [ ] 12.1 Pastikan layout dapat digunakan pada lebar 320px.
  - [ ] 12.2 Pastikan navigasi mobile dapat dioperasikan dengan keyboard.
  - [ ] 12.3 Pastikan input dan tombol memiliki accessible name.
  - [ ] 12.4 Tambahkan `aria-live` untuk status proses dan hasil.
  - [ ] 12.5 Pastikan error menggunakan `role="alert"` bila sesuai.
  - [ ] 12.6 Pastikan status dibedakan dengan teks/ikon, bukan warna saja.
  - [ ] 12.7 Hormati `prefers-reduced-motion`.
  - _Requirements: 1, 4, 5, 10_

- [ ] 13. Final verification
  - [ ] 13.1 Jalankan unit test dan component test.
  - [ ] 13.2 Jalankan lint dan production build.
  - [ ] 13.3 Uji URL valid, URL invalid, backend error, dan malformed response.
  - [ ] 13.4 Uji penyimpanan dan penghapusan riwayat.
  - [ ] 13.5 Uji dashboard dengan riwayat kosong dan terisi.
  - [ ] 13.6 Uji kamera live dan upload QR.
  - [ ] 13.7 Uji responsive layout dan keyboard navigation.
  - [ ] 13.8 Pastikan aplikasi inti tetap dapat digunakan tanpa konfigurasi Supabase.
  - [ ] 13.9 Catat hasil test dan known limitations.
  - _Requirements: 1–11_

## Notes

- Semua checkbox dimulai dalam status belum dikerjakan; ubah hanya setelah implementasi diverifikasi.
- Jangan mengasumsikan nama field API. Selesaikan Task 1 sebelum implementasi normalisasi response.
- Jangan mengubah model ML atau endpoint FastAPI sebagai bagian dari V3 kecuali audit menunjukkan perubahan memang diperlukan.
- Dashboard hanya menggunakan data riwayat aktual.
- Riwayat default disimpan lokal di browser dan tidak otomatis disinkronkan.
- Metrik model di About harus bersumber dari artefak evaluasi atau dokumentasi proyek yang dapat diverifikasi.
- Fitur inti tidak boleh bergantung pada Supabase yang belum dikonfigurasi.
