# Malika Web App

## Deskripsi

Malika Web App adalah aplikasi web yang menggunakan Firebase untuk autentikasi pengguna. Aplikasi ini memungkinkan pengguna untuk mendaftar, masuk, dan keluar. Selain itu, aplikasi ini menampilkan informasi pengguna yang telah masuk.

## Fitur

- **Autentikasi Pengguna**: Pengguna dapat mendaftar dan masuk menggunakan email dan kata sandi.
- **Logout**: Pengguna dapat keluar dari aplikasi.
- **Informasi Pengguna**: Menampilkan informasi pengguna yang telah masuk.
- **Penggunaan Tailwind CSS**: Aplikasi ini menggunakan Tailwind CSS untuk styling.

## Persyaratan

- Node.js
- Firebase Project
- Environment Variables:
  - `FIREBASE_SERVICE_ACCOUNT_BASE64`: String JSON akun layanan Firebase yang dienkode base64.
  - `FIREBASE_API_KEY`: Kunci API untuk Firebase Authentication.

## Instalasi

1. **Clone repositori ini:**

   ```bash
   git clone https://github.com/username/malika-webapp.git
   cd malika-webapp
   ```

2. **Instal dependensi:**

   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**

   Buat file `.env` di root proyek dan tambahkan variabel lingkungan berikut:

   ```env
   FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_service_account_json
   FIREBASE_API_KEY=your_firebase_api_key
   ```

4. **Jalankan aplikasi:**

   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:3000`.

## Struktur Proyek

- **`/api`**: Berisi endpoint API untuk autentikasi.
  - **`auth.js`**: Menangani login, pendaftaran, dan verifikasi sesi.
  - **`logout.js`**: Menangani logout pengguna.
- **`/src`**: Berisi kode sumber aplikasi.
  - **`/components`**: Berisi komponen React yang digunakan di berbagai halaman.
    - **`Header.jsx`**: Komponen header.
    - **`UserInfo.jsx`**: Komponen untuk menampilkan informasi pengguna.
  - **`/pages`**: Berisi halaman aplikasi.
    - **`/auth`**: Berisi halaman autentikasi.
      - **`index.jsx`**: Halaman autentikasi utama.
      - **`components/Auth.jsx`**: Komponen untuk login dan pendaftaran.
    - **`/index`**: Berisi halaman utama.
      - **`index.jsx`**: Halaman utama aplikasi.
  - **`index.css`**: Berisi gaya global dan tema Tailwind CSS.
  - **`main.jsx`**: Entry point aplikasi.

## Penggunaan

### Login

1. Buka halaman login di `http://localhost:3000/auth`.
2. Masukkan email dan kata sandi Anda.
3. Klik tombol "Login".

### Pendaftaran

1. Buka halaman pendaftaran di `http://localhost:3000/auth`.
2. Klik tombol "Register" untuk beralih ke mode pendaftaran.
3. Masukkan email dan kata sandi Anda.
4. Klik tombol "Register".

### Logout

1. Setelah masuk, informasi pengguna akan ditampilkan di halaman utama.
2. Klik tombol "Logout" untuk keluar dari aplikasi.

## Kontribusi

Kontribusi sangat diterima! Jika Anda memiliki saran atau perbaikan, silakan buat pull request atau buka issue.

## Lisensi

Proyek ini dilisensikan di bawah lisensi MIT. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.
