# Pionz Store

Website Pionz Store berbasis React + Vite, siap dideploy ke Vercel.

## Jalankan lokal

```bash
npm install
npm run dev
```

## Deploy ke Vercel

1. Upload project ini ke repository GitHub.
2. Di Vercel pilih **Add New → Project**, lalu pilih repository tersebut.
3. Framework akan terdeteksi sebagai **Vite**.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Klik **Deploy**.

### Password admin

Autentikasi admin menggunakan API serverless Vercel di `api/admin-auth.ts`.
Buat SHA-256 hash password admin, lalu di Vercel buka **Project Settings → Environment Variables** dan tambahkan:

`ADMIN_PASSWORD_HASH` = hash SHA-256 password admin kamu

Setelah menambahkan variable, lakukan redeploy. Jangan memasukkan password asli ke source code atau variable `VITE_*`.

### Data toko

Data katalog/config admin saat ini disimpan di **LocalStorage browser**. Artinya perubahan dari panel admin tersimpan pada browser/perangkat yang melakukan perubahan, bukan database server. Untuk data bersama antar-perangkat, nanti perlu database/backend.
