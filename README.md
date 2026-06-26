# 🧪 Tes Masuk — Fullstack Software Engineer (Sistem Absensi)

Halo! Baca halaman ini **sampai selesai** sebelum mulai ngerjain.

---

## 📌 Sebelum Mulai

- **Waktu        :** Maksimal 4 jam (kamu yang atur sendiri)
- **Bahasa       :** TypeScript — sudah diatur di `package.json` dan `tsconfig.json`
- **Tampilan     :** Pakai Vite (bisa lihat hasil di browser) — **tidak pakai framework**
- **Boleh cari   :** Google, ChatGPT, Stack Overflow, catatan pribadi, apapun
- **Cara kirim   :** Clone repo → kerjakan → push ke repo sendiri → kirim **link repo** + **`SUBMISSION.md`**

> ⚠️ Jujur itu lebih penting daripada jawaban sempurna.
> Kami lebih lihat **cara kamu mikir** daripada hasil akhir.

---

## 📂 Isi Folder

```
📁 home-test/
├── README.md              ← Kamu baca ini
├── SUBMISSION.md          ← Wajib diisi dan dikumpulkan
├── package.json           ← Pengaturan project (sudah siap)
├── tsconfig.json          ← Pengaturan TypeScript (sudah siap)
├── main.ts                ← Pengecek error — jalankan sebelum kirim
├── verify.ts              ← Pengecek integrasi — jalankan setelah backend & frontend selesai
│
├── shared/
│   ├── types.ts           ← Tipe data (Employee, Attendance, Leave, dll.)
│   └── store.ts           ← Data contoh (karyawan, absensi, cuti)
│
├── backend/
│   ├── soal_1.ts          ← Soal 1: Normalisasi data absensi
│   ├── soal_2.ts          ← Soal 2: API absensi & karyawan
│   ├── soal_3.ts          ← Soal 3: Rekap laporan absensi
│   └── soal_4.ts          ← Soal 4: Login & hak akses
│
├── frontend/
│   ├── index.html         ← Halaman utama (buka di browser)
│   ├── main.ts            ← Penghubung antar soal
│   ├── soal_5.ts          ← Soal 5: Daftar karyawan
│   ├── soal_6.ts          ← Soal 6: Form pengajuan cuti
│   ├── soal_7.ts          ← Soal 7: Cari & filter absensi
│   └── soal_8.ts          ← Soal 8: Profil & riwayat absensi
│
├── tests/
│   └── run_all.ts         ← Pengecek otomatis — semua soal
│
└── vite.config.ts         ← Pengaturan Vite (buat lihat di browser)
```

---

## 🚀 Cara Jalanin

```bash
# Install dulu (sekali aja):
npm install

# Cek apakah ada error (pastikan hijau semua):
npm start

# Jalanin soal backend satu-satu:
npm run be1     # Soal 1 — Normalisasi data
npm run be2     # Soal 2 — API absensi & karyawan
npm run be3     # Soal 3 — Rekap laporan absensi
npm run be4     # Soal 4 — Login & hak akses

# Jalanin frontend (buka di browser):
npm run fe      # Nanti kebuka http://localhost:3000

# Cek integrasi backend-frontend (jalanin SETELAH semua selesai):
npm run verify

# Tes otomatis (cek apakah implementasi kamu sudah bener):
npm test
```

---

## 📝 Cara Ngerjain

1. **Baca semua soal dulu** sampai habis — jangan langsung coding
2. Kerjakan **backend** dulu (soal 1-4)
3. Kerjakan **frontend** (soal 5-8)
4. **Jangan hapus kode yang sudah ada** — tulis jawaban di tempat yang sudah disediain
5. Jawab **pertanyaan wajib** di tiap soal (tulis di komentar)
6. `npm test` — cek apakah implementasi backend udah bener
7. `npm run verify` — cek integrasi backend & frontend
8. Isi `SUBMISSION.md` dengan jujur
9. Push ke repo sendiri, kirim link repo + SUBMISSION.md

---

## 💡 Tips

- Baca soal **sampai habis** — kadang info penting ada di bagian bawah
- **TypeScript mode ketat** — jangan asal pake `any`
- File `store.ts` adalah **satu-satunya tempat data** — backend dan frontend pake data yang sama
- Perhatiin **tipe data** — ID number vs string, salah nyambung bisa error
- Tulis **alasan** di komentar, bukan jelasin ulang apa yang kode lakuin
- **Jalanin semua perintah** (`npm start`, `npm test`, `npm run verify`) sebelum kirim

---

Semangat! 🚀
