# Frontend Assessment

Pengerjaan Junior Frontend Developer Technical Assessment. Isinya dua bagian:

- Bagian 1, dua fungsi logic JavaScript di `logic-assessment.js`
- Bagian 2, aplikasi React untuk mengelola katalog produk, ada di folder `app/`

## Setup

Butuh Node.js 18 atau lebih baru.

**Bagian 1**

```
node check-logic.js
```

Skrip ini menjalankan kedua fungsi dengan contoh yang ada di soal dan mencetak
hasilnya ke terminal, berdampingan dengan hasil yang seharusnya.

**Bagian 2**

```
cd app
npm install
cp .env.example .env
npm run dev
```

Lalu buka http://localhost:5174.

### Environment variable

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `VITE_API_URL` | Tidak | Base URL my-json-server. Kalau kosong, app memakai salinan `db.json` yang ada di `src/api.js` dan menampilkan tanda "local data" di header |

Fallback itu sengaja dibuat supaya aplikasinya tetap bisa dibuka dan diperiksa
walaupun my-json-server sedang tidak bisa diakses.

## Endpoint mock API

```
https://my-json-server.typicode.com/nafisspinning/frontend-assessment-nafis/products
```

`db.json` ada di root repo, jadi endpoint di atas aktif begitu repo ini dipush
sebagai repository publik, tanpa konfigurasi tambahan.

Route yang dipakai aplikasi:

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| GET | `/products` | Ambil semua produk |
| POST | `/products` | Tambah produk |
| PATCH | `/products/:id` | Ubah produk |
| DELETE | `/products/:id` | Hapus produk |

`PATCH` dipilih daripada `PUT` karena form hanya mengirim empat field yang bisa
diubah, bukan seluruh isi produk.

## Struktur folder

```
.
├── db.json                 seed my-json-server, harus di root repo
├── logic-assessment.js     bagian 1, dua fungsi, tanpa dependency
├── check-logic.js            menjalankan kedua fungsi dan mencetak hasilnya
└── app/
    └── src/
        ├── main.jsx        menempelkan App ke halaman
        ├── App.jsx         state, tabel, filter, pagination, modal, CRUD
        ├── ProductForm.jsx form yang dipakai untuk create dan edit
        ├── api.js          semua request ke my-json-server
        ├── helpers.js      daftar kategori dan status, format harga dan tanggal, validasi
        └── styles.css      seluruh CSS
```

Komponen utamanya tiga. `App.jsx` memegang semua state dan menyusun tampilan.
`ProductForm.jsx` mengurus form beserta validasinya. `api.js` jadi satu-satunya
tempat yang memanggil `fetch`, jadi kalau backend-nya ganti cukup file itu yang
diubah.

Alur datanya satu arah: `api.js` menyediakan data, `App.jsx` menyimpannya di
state dan menurunkannya sebagai props, komponen di bawahnya hanya menampilkan.

## Keputusan dan trade-off

**State pakai `useState` saja, tanpa Redux atau library lain.** Aplikasinya
cuma punya satu resource dan satu layar. Server state ada di `App.jsx`
(`products`, `loading`, `loadError`), state UI juga di situ (filter, halaman,
modal yang terbuka). Menambah state library di ukuran segini hanya menambah
lapisan tanpa manfaat.

**Hasil filter dan pagination tidak disimpan di state.** Keduanya dihitung ulang
tiap render dari `products` dan nilai filter yang sedang aktif. Kalau disimpan,
harus ada kode tambahan untuk menyinkronkannya setiap kali data atau filter
berubah, dan di situ biasanya bug muncul.

**Validasi juga dihitung ulang, bukan disimpan.** `validateProduct(values)`
adalah fungsi murni yang dipanggil tiap render, jadi pesan error tidak mungkin
tertinggal dari isi field. Yang disimpan di state hanya dua hal: field mana yang
sudah disentuh, dan apakah submit sudah pernah ditekan. Dua hal itu yang
menentukan kapan error mulai ditampilkan, supaya form tidak langsung merah
begitu dibuka.

**Filter dijalankan di sisi klien.** Data seed cuma empat produk. Untuk data
besar, pencarian dan pagination sebaiknya dipindah ke server lewat query param
`?q=` dan `?_page=`.

**Belum memakai optimistic update.** Saat ini create, edit, dan delete menunggu
respons server dulu, baru state lokal diubah. Konsekuensinya ada jeda sekitar
setengah detik sebelum tampilan berubah. Pendekatan yang diminta soal adalah
mengubah state lokal lebih dulu, lalu rekonsiliasi dengan respons server dan
rollback disertai pesan error kalau gagal. Itu memang terasa jauh lebih responsif,
terutama karena my-json-server menyimpan perubahan hanya di memori dan bisa
ter-reset, tapi belum saya kerjakan di versi ini.

**CSS ditulis manual, tanpa Tailwind.** Komponennya sedikit dan token warna cukup
ditaruh di `:root`. Ini menghemat satu build step dan satu dependency.

## Asumsi yang diambil

- Daftar kategori dikunci pada tiga kategori yang ada di `db.json`, sesuai aturan
  validasi "must choose one of the seeded categories".
- Harga diperlakukan sebagai bilangan bulat rupiah, tanpa desimal.
- User tanpa `age` di bagian 1 dibuang, karena syarat "di bawah 18 tahun" tidak
  bisa dibuktikan tanpa data umur.
- User tanpa `gender` dimasukkan ke kelompok `unknown`, supaya datanya tidak
  hilang tanpa jejak.
- Pagination lima baris per halaman. Sifatnya opsional di soal, tetap dikerjakan.

## Yang akan diperbaiki kalau waktunya lebih panjang

- **Optimistic update beserta rollback**, seperti yang diminta soal. Ini yang
  paling utama.
- **Debounce pada pencarian.** Sekarang filter jalan tiap ketikan. Untuk empat
  produk tidak terasa, untuk ribuan data perlu ditunda sekitar 300 ms.
- **Unit test.** `check-logic.js` baru mencetak hasil, belum ada test yang otomatis
  gagal kalau kodenya rusak. Untuk aplikasi React-nya juga belum ada test sama
  sekali.
- **Modal yang lebih rapi**, bisa ditutup dengan Escape, fokus dipindah ke dalam
  modal saat dibuka dan dikembalikan saat ditutup.
- **Huruf beraksen di bagian 1.** Pengecekan hurufnya masih memakai rentang `a`
  sampai `z`, jadi huruf seperti `é` tidak terhitung.
- **Sorting kolom** nama, harga, dan tanggal.
- **Filter disimpan di URL** (`?q=&category=`), supaya hasil filter bisa
  dibagikan lewat link dan tahan refresh.
