// ============================================================
// SOAL 7 (Frontend) — "Cari & Filter Absensi"
// ============================================================
//
// 🎯 GAMBARAN:
// HR mau cari riwayat absensi berdasarkan nama karyawan,
// tanggal, atau status. Kamu bikin fitur search & filter
// di sisi client (browser).
//
// ============================================================

import { attendances, employees } from "../shared/store";
import type { Attendance } from "../shared/types";

// ═══════════════════════════════════════════════════════════
// TUGAS KAMU:
// ═══════════════════════════════════════════════════════════
//
// 1. getEmployeeName(employeeId) → string
//    Cari nama karyawan dari array employees berdasarkan ID.
//    Kalau tidak ketemu → "Unknown"
//
// 2. searchAttendance(query) → Attendance[]
//    Cari absensi berdasarkan nama karyawan (case-insensitive).
//    Kalau query kosong → return semua.
//
// 3. filterByDate(records, date) → Attendance[]
//    Filter berdasarkan tanggal. Kalau date kosong → return semua.
//
// 4. filterByStatus(records, status) → Attendance[]
//    Filter berdasarkan status (present/late/absent/leave).
//    Kalau status "all" → return semua.
//
// 5. renderSearchBar() → string HTML
//    Input text, input date, dropdown status, tombol cari.
//
// 6. renderAttendanceTable(records) → string HTML
//    Tabel: No | Nama | Tanggal | Jam Masuk | Jam Keluar | Status | Keterangan
//
//    - Nama dari getEmployeeName()
//    - Status pakai badge dengan class:
//      badge-present (hijau), badge-late (kuning),
//      badge-absent (merah), badge-leave (biru)
//      (styling sudah ada di index.html)
//    - "Menampilkan X dari Y absensi" di atas tabel
//    - Kalau kosong → "Tidak ada data absensi"
// ═══════════════════════════════════════════════════════════

function getEmployeeName(employeeId: number): string {
  const emp = employees.find((e) => e.id === employeeId);
  return emp ? emp.name : "Unknown";
}

function searchAttendance(query: string): Attendance[] {
  if (!query.trim()) return attendances;

  return attendances.filter((a) => {
    const name = getEmployeeName(a.employeeId).toLowerCase();
    return name.includes(query.toLowerCase());
  });
}

function filterByDate(records: Attendance[], date: string): Attendance[] {
  if (!date) return records;
  return records.filter((r) => r.date === date);
}

function filterByStatus(records: Attendance[], status: string): Attendance[] {
  if (status === "all") return records;
  return records.filter((r) => r.status === status);
}

function renderSearchBar(): string {
  return `<div class="search-bar">
    <input type="text" placeholder="Cari nama karyawan..." />
    <input type="date" />
    <select>
      <option value="all">Semua Status</option>
    </select>
    <button>Cari</button>
  </div>`;
}

function renderAttendanceTable(records: Attendance[]): string {
  if (records.length === 0) return "<p>Tidak ada data absensi</p>";
  return `<p>Menampilkan ${records.length} absensi</p>`;
}

// ═══════════════════════════════════════════════════════════
// PERTANYAAN WAJIB — jawab di komentar bawah:
// ═══════════════════════════════════════════════════════════
//
// Q1: Untuk 12 data sih cepat. TAPI untuk 500 karyawan ×
//     12.000 attendance, gimana performancenya? Optimasi?
//
// Q2: Filter tanggal pake perbandingan string ("2024-01-15").
//     Gimana kalau store pake format tanggal yang berbeda?
//     Biar lebih aman, sebaiknya pake apa?
//
// Q3: Status ditampilkan pake badge HTML. Risiko keamanan
//     apa yang mungkin terjadi? Haruskah di-escape?
// ═══════════════════════════════════════════════════════════

// JAWABAN Q1:
// Performance akan lambat karena nested loop (search nama di employees untuk setiap attendance).
// Optimasi: buat Map (employeeId → name) supaya lookup O(1), bukan O(n).

// JAWABAN Q2:
// String tanggal rawan error kalau format beda.
// Lebih aman pakai Date object atau timestamp (new Date(date)) supaya konsisten dan bisa dibandingkan dengan
// benar.

// JAWABAN Q3:
// Risiko XSS kalau data status/keterangan tidak di-escape sebelum masuk HTML.
// Harus dipastikan aman (escape/sanitizer), terutama jika data berasal dari user atau API.
