# Requirements Document — PhishGuard V3

## 1. Introduction

PhishGuard V3 mengembangkan aplikasi Link Predictor dari alat pemeriksaan URL menjadi pengalaman pemeriksaan keamanan yang lebih informatif dan mudah digunakan. V3 melanjutkan fondasi visual cyber/dark dari V2, tetapi berfokus pada peningkatan alur penggunaan, riwayat pemeriksaan, ringkasan aktivitas, validasi input, dan penjelasan hasil.

Aplikasi tetap menggunakan React 18, TypeScript, Vite, Tailwind CSS v4, dan backend FastAPI yang sudah ada. V3 tidak mengubah model machine learning maupun kontrak endpoint prediksi tanpa kebutuhan teknis yang telah diverifikasi. Integrasi penyimpanan cloud tidak diwajibkan; fitur riwayat lokal harus tetap berfungsi tanpa Supabase.

## 2. Goals

- Memudahkan pengguna memeriksa URL dan memahami hasil deteksi.
- Menyediakan riwayat pemeriksaan yang dapat dicari, difilter, dibuka kembali, dan dihapus.
- Menampilkan ringkasan aktivitas berdasarkan data pemeriksaan yang benar-benar tersimpan.
- Memperjelas status, confidence, dan batasan hasil prediksi tanpa mengarang alasan model.
- Menyediakan pengalaman QR scan yang konsisten dengan pemeriksaan URL manual.
- Mempertahankan tampilan cyber/dark V2, responsivitas, dan aksesibilitas.

## 3. Non-goals

- Melatih ulang atau mengganti model machine learning.
- Mengubah endpoint FastAPI atau format respons prediksi tanpa audit backend.
- Mengklaim akurasi, jumlah fitur, atau metrik model yang belum dibuktikan.
- Menambahkan autentikasi atau sinkronisasi cloud sebagai syarat agar aplikasi dapat digunakan.
- Menganggap hasil prediksi sebagai jaminan bahwa sebuah situs aman.

## 4. Glossary

- **Scan**: satu proses pemeriksaan URL melalui input manual atau QR code.
- **Scan_History**: daftar hasil scan yang disimpan secara lokal pada browser pengguna.
- **Dashboard**: halaman ringkasan aktivitas berdasarkan Scan_History.
- **Prediction_Result**: respons prediksi dari backend yang berisi label dan nilai probabilitas/confidence sesuai kontrak aktual API.
- **Local_Storage**: penyimpanan browser pada perangkat pengguna, bukan penyimpanan cloud.
- **Empty_State**: tampilan ketika belum ada data untuk ditampilkan.

## 5. Requirements

### Requirement 1 — Konsistensi Tema dan Navigasi

**User Story:** Sebagai pengguna, saya ingin semua halaman memiliki tampilan yang konsisten dan navigasi yang mudah dipahami.

Acceptance Criteria:
1. THE App SHALL mempertahankan design tokens cyber/dark V2 sebagai fondasi visual.
2. THE App SHALL menyediakan navigasi ke Dashboard, URL Scanner, History, dan About.
3. THE App SHALL menandai halaman aktif pada navigasi.
4. THE App SHALL menyediakan navigasi mobile yang dapat digunakan pada viewport sempit.
5. THE App SHALL menyediakan indikator fokus keyboard yang terlihat.
6. THE App SHALL menghormati `prefers-reduced-motion`.

### Requirement 2 — Dashboard Ringkasan Aktivitas

**User Story:** Sebagai pengguna, saya ingin melihat ringkasan pemeriksaan agar dapat memahami aktivitas scan saya.

Acceptance Criteria:
1. THE Dashboard SHALL menampilkan jumlah total scan dari data riwayat lokal yang tersedia.
2. THE Dashboard SHALL menampilkan jumlah dan proporsi hasil PHISHING serta LEGITIMATE berdasarkan riwayat lokal.
3. THE Dashboard SHALL menampilkan scan terbaru.
4. THE Dashboard SHALL menampilkan Empty_State yang jelas ketika belum ada riwayat.
5. THE Dashboard SHALL memperbarui ringkasan setelah scan baru disimpan atau riwayat dihapus.
6. THE Dashboard SHALL tidak menampilkan angka contoh seolah-olah merupakan data aktual.
7. IF belum ada data riwayat, THE Dashboard SHALL menampilkan nilai nol atau Empty_State, bukan membuat data dummy.

### Requirement 3 — URL Scanner dan Validasi Input

**User Story:** Sebagai pengguna, saya ingin memasukkan URL dengan mudah dan mendapat pesan validasi yang jelas sebelum pemeriksaan.

Acceptance Criteria:
1. THE URL Scanner SHALL menerima URL melalui input teks.
2. THE URL Scanner SHALL melakukan validasi format dasar sebelum mengirim permintaan ke backend.
3. WHEN input kosong atau format URL tidak valid, THE App SHALL menampilkan pesan kesalahan yang dapat dipahami dan tidak mengirim permintaan prediksi.
4. THE URL Scanner SHALL menyediakan aksi paste dari clipboard jika browser mengizinkan akses.
5. THE URL Scanner SHALL menampilkan state idle, loading, success, dan error secara berbeda.
6. THE URL Scanner SHALL mencegah pengiriman berulang saat permintaan sebelumnya masih berjalan.
7. THE App SHALL mempertahankan kontrak endpoint prediksi yang sudah digunakan oleh aplikasi saat ini.

### Requirement 4 — Hasil Deteksi yang Lebih Informatif

**User Story:** Sebagai pengguna, saya ingin memahami hasil pemeriksaan tanpa salah menafsirkan nilai confidence.

Acceptance Criteria:
1. WHEN hasil prediksi berlabel PHISHING, THE App SHALL menampilkan status peringatan yang mudah dikenali.
2. WHEN hasil prediksi berlabel LEGITIMATE, THE App SHALL menampilkan status yang sesuai dan tetap menyertakan peringatan bahwa prediksi bukan jaminan keamanan.
3. THE App SHALL menampilkan nilai confidence/probabilitas hanya berdasarkan field yang benar-benar dikembalikan API.
4. THE App SHALL menjelaskan label dan nilai probabilitas dengan bahasa sederhana.
5. THE App SHALL tidak menampilkan penjelasan fitur atau alasan spesifik model kecuali informasi tersebut memang disediakan oleh backend/model.
6. THE App SHALL menyediakan tindakan untuk menyalin URL yang diperiksa.
7. THE App SHALL menyediakan tindakan untuk memeriksa URL lain.
8. THE Result_View SHALL dapat dibaca oleh screen reader melalui heading, status, dan live region yang sesuai.

### Requirement 5 — QR Scanner Terintegrasi

**User Story:** Sebagai pengguna, saya ingin memeriksa URL dari QR code melalui alur yang sama dengan input manual.

Acceptance Criteria:
1. THE QR Scanner SHALL mempertahankan kemampuan kamera live dan upload gambar yang telah tersedia pada aplikasi.
2. WHEN QR code berhasil dibaca, THE App SHALL mengirim URL hasil ekstraksi melalui alur validasi dan prediksi yang sama dengan input manual.
3. THE App SHALL menampilkan URL hasil scan sebelum atau selama proses pemeriksaan sehingga pengguna dapat mengetahui URL yang akan diperiksa.
4. THE App SHALL menyediakan kontrol untuk memulai dan menghentikan kamera.
5. THE App SHALL menampilkan pesan yang jelas jika izin kamera ditolak, kamera tidak tersedia, atau QR code tidak dapat dibaca.
6. THE QR Scanner SHALL tidak mengirim gambar QR ke backend prediksi jika backend hanya membutuhkan URL.
7. THE QR Scanner SHALL mempertahankan overlay ScanFrame V2 jika komponen tersebut masih tersedia.

### Requirement 6 — Riwayat Pemeriksaan

**User Story:** Sebagai pengguna, saya ingin melihat pemeriksaan sebelumnya agar dapat meninjau hasil scan.

Acceptance Criteria:
1. THE App SHALL menyimpan hasil scan yang berhasil secara lokal pada browser.
2. Setiap item riwayat SHALL menyimpan sekurang-kurangnya URL, label prediksi, nilai confidence jika tersedia, dan waktu pemeriksaan.
3. THE History SHALL menampilkan item terbaru terlebih dahulu.
4. THE History SHALL menyediakan pencarian berdasarkan URL.
5. THE History SHALL menyediakan filter berdasarkan label PHISHING dan LEGITIMATE.
6. THE History SHALL menyediakan detail ringkas untuk setiap item.
7. THE User SHALL dapat menghapus satu item riwayat.
8. THE User SHALL dapat menghapus seluruh riwayat setelah konfirmasi.
9. THE App SHALL menampilkan Empty_State ketika riwayat kosong.
10. THE App SHALL menangani data riwayat yang rusak atau tidak sesuai skema tanpa membuat halaman gagal dimuat.
11. THE App SHALL menjelaskan bahwa riwayat disimpan pada browser/perangkat yang digunakan dan tidak otomatis tersinkronisasi antarperangkat.

### Requirement 7 — Detail Riwayat

**User Story:** Sebagai pengguna, saya ingin membuka kembali detail hasil scan sebelumnya.

Acceptance Criteria:
1. THE User SHALL dapat membuka detail item riwayat.
2. THE Detail_View SHALL menampilkan URL, waktu pemeriksaan, label, dan confidence jika tersedia.
3. THE Detail_View SHALL menyediakan aksi salin URL.
4. THE Detail_View SHALL tidak mengklaim bahwa hasil lama merupakan status keamanan situs saat ini.
5. THE App SHALL menyediakan aksi untuk melakukan scan ulang melalui URL Scanner.

### Requirement 8 — About dan Informasi Model

**User Story:** Sebagai pengguna, saya ingin mengetahui tujuan aplikasi, alur pemeriksaan, dan teknologi yang digunakan.

Acceptance Criteria:
1. THE About page SHALL menjelaskan tujuan PhishGuard dan alur pemeriksaan URL.
2. THE About page SHALL mencantumkan teknologi frontend dan backend yang benar-benar digunakan proyek.
3. THE About page SHALL menjelaskan bahwa prediksi berasal dari model machine learning yang digunakan proyek.
4. THE About page SHALL hanya menampilkan metrik model jika nilainya telah diverifikasi dari evaluasi/model artifact atau dokumentasi proyek.
5. THE About page SHALL tidak menyatakan bahwa sebuah URL pasti aman hanya karena hasilnya LEGITIMATE.
6. THE About page SHALL mempertahankan tema cyber/dark V2 dan layout responsif.

### Requirement 9 — Penanganan Error dan Keandalan

**User Story:** Sebagai pengguna, saya ingin aplikasi memberikan informasi saat terjadi kegagalan agar saya tahu tindakan berikutnya.

Acceptance Criteria:
1. THE App SHALL menampilkan pesan yang dapat dipahami ketika backend tidak dapat dihubungi.
2. THE App SHALL membedakan kesalahan validasi input, kesalahan jaringan, dan kesalahan server jika informasi tersedia.
3. THE App SHALL mempertahankan input URL ketika permintaan gagal agar pengguna dapat mencoba kembali.
4. THE App SHALL tidak menyimpan hasil prediksi yang gagal sebagai hasil scan berhasil.
5. THE App SHALL tetap dapat membuka halaman utama dan riwayat ketika integrasi Supabase tidak dikonfigurasi.
6. THE App SHALL tidak menampilkan secret key atau detail sensitif pada UI maupun log client.

### Requirement 10 — Responsivitas dan Aksesibilitas

**User Story:** Sebagai pengguna perangkat mobile atau pengguna keyboard, saya ingin semua fitur tetap dapat digunakan.

Acceptance Criteria:
1. THE App SHALL mendukung viewport dengan lebar minimum 320px.
2. THE App SHALL menggunakan layout satu kolom pada layar kecil untuk konten utama.
3. THE App SHALL menyediakan label yang jelas untuk input, tombol, filter, dan kontrol kamera.
4. THE App SHALL mendukung navigasi keyboard dan indikator fokus yang terlihat.
5. THE App SHALL menggunakan kontras teks yang memadai dan tidak mengandalkan warna saja untuk membedakan status.
6. THE App SHALL menyediakan `aria-live` atau mekanisme aksesibilitas setara untuk status proses dan hasil.
7. THE App SHALL menghormati `prefers-reduced-motion`.

### Requirement 11 — Pengujian dan Kualitas

**User Story:** Sebagai developer, saya ingin perubahan V3 diuji agar fitur lama tidak rusak.

Acceptance Criteria:
1. THE Project SHALL menyediakan unit test untuk validasi URL dan fungsi pengelolaan riwayat.
2. THE Project SHALL menyediakan component test untuk Dashboard, History, Result_View, dan Empty_State.
3. THE Project SHALL menguji penyimpanan, pembacaan, penghapusan satu item, dan penghapusan seluruh riwayat.
4. THE Project SHALL menguji error backend dan respons API yang tidak sesuai.
5. THE Project SHALL melakukan regression test untuk kamera live dan upload QR.
6. THE Project SHALL menjalankan lint/build/test yang tersedia sebelum rilis.
7. THE Project SHALL tidak menandai task selesai sebelum implementasi dan verifikasi dilakukan.

## 6. Data and Privacy Rules

- Riwayat V3 disimpan secara lokal pada browser sebagai default.
- URL dapat mengandung token atau parameter sensitif; UI harus memberi tahu pengguna bahwa riwayat disimpan di perangkat dan menyediakan penghapusan.
- Jangan mengirim riwayat ke layanan cloud tanpa keputusan produk dan persetujuan pengguna yang eksplisit.
- Jangan menyimpan gambar QR apabila hanya URL hasil ekstraksi yang dibutuhkan.
- Data dashboard dihitung dari riwayat aktual, bukan angka statis.

## 7. Assumptions and Open Questions

- Kontrak endpoint FastAPI yang sekarang tetap menjadi sumber kebenaran untuk format prediksi.
- Nama field confidence/probability perlu dicocokkan dengan implementasi API sebelum UI dibuat.
- Supabase bukan prasyarat V3; konfigurasi Supabase yang tidak tersedia tidak boleh membuat fitur inti gagal.
- Batas jumlah item riwayat lokal dan kebijakan retensi dapat ditetapkan saat implementasi.
