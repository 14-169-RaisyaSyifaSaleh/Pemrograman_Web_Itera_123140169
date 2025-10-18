📝 Manajemen Tugas Mahasiswa

Aplikasi web sederhana untuk membantu mahasiswa mengelola daftar tugas kuliah.
Kamu bisa menambahkan, mengedit, menandai tugas selesai, menghapus, dan memfilter tugas berdasarkan status atau nama mata kuliah.
Semua data tersimpan otomatis di localStorage, jadi tidak hilang walau halaman ditutup.


🛠️ Teknologi yang Digunakan

- HTML5 → Struktur halaman

- CSS3 → Tampilan dan layout
 
- JavaScript (ES6) → Logika aplikasi, manipulasi DOM, dan penyimpanan localStorage
  


💡 Cara Menjalankan

Unduh atau clone repository ini.
Buka file index.html menggunakan browser favoritmu (Chrome, Edge, Firefox, dsb).
Aplikasi langsung bisa digunakan tanpa instalasi tambahan.

🧠 Penjelasan Singkat Alur Program

User input tugas baru → data disimpan dalam array lalu ke localStorage.

Daftar tugas ditampilkan secara dinamis di DOM.

Tombol Edit / Hapus / Selesai memicu fungsi JS yang memperbarui data dan tampilan.

Filter dan Pencarian bekerja dengan memfilter array sebelum ditampilkan ulang.

Setiap perubahan otomatis disimpan agar data tetap ada walau browser ditutup.




🌟 Fitur-Fitur

📝 Menambah Tugas Baru
Pengguna dapat membuat tugas dengan memasukkan nama tugas, mata kuliah, dan tanggal deadline.

🔁 Mengubah Status Tugas
Setiap tugas dapat ditandai sebagai selesai atau belum selesai hanya dengan satu klik.

✏️ Mengedit Informasi Tugas
Tugas yang sudah tersimpan bisa diperbarui tanpa harus dihapus terlebih dahulu.

❌ Menghapus Tugas
Fitur untuk menghapus tugas yang sudah tidak diperlukan agar daftar tetap rapi.

🔍 Filter dan Pencarian
Pengguna bisa memfilter daftar tugas berdasarkan mata kuliah atau mencari tugas tertentu dengan cepat.

📊 Jumlah Tugas Aktif
Aplikasi menampilkan total tugas yang masih belum diselesaikan secara otomatis.

⚠️ Validasi Input Form
Mencegah pengguna menyimpan data kosong atau tidak lengkap saat menambahkan tugas.
