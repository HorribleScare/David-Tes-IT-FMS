// ============================================================
// SOAL 5 (Frontend) — "Tampilan Daftar Karyawan"
// ============================================================
//
// 🎯 GAMBARAN:
// Bikin halaman daftar karyawan yang nampilin data dari
// store.ts. Setiap karyawan harus ada status kehadiran
// HARI INI. Karena data cuma sampai Jan 2024, kita pake
// tanggal demo: 2024-01-15.
//
// ============================================================

import { employees, attendances, departments } from "../shared/store";
import type { Employee } from "../shared/types";

const TODAY = "2024-01-15";

// ═══════════════════════════════════════════════════════════
// TUGAS KAMU:
// ═══════════════════════════════════════════════════════════
//
// 1. getTodayStatus(employeeId) → string
//
//    Cari attendance untuk karyawan tersebut pada tanggal TODAY.
//    Map status ke Bahasa Indonesia:
//      "present" → "Hadir"
//      "late"    → "Telat"
//      "absent"  → "Absen"
//      "leave"   → "Cuti"
//    Kalau tidak ketemu → "-"
//
// 2. renderEmployeeTable(employees) → string HTML
//
//    Bikin tabel HTML dengan kolom:
//    No | Nama | Departemen | Jabatan | Status Hari Ini
//
//    - No = nomor urut (1, 2, 3...), BUKAN employee ID
//    - Nama departemen dicari dari array departments
//    - Status = panggil getTodayStatus()
//    - Karyawan non-aktif (isActive: false) → class "inactive" di <tr>
//    - Kalau array kosong → pesan "Tidak ada karyawan"
//
// 3. renderApp() → string HTML halaman lengkap
//
//    Judul "👥 Daftar Karyawan", info tanggal, dan tabel.
//    Panggil renderEmployeeTable() di dalamnya.
//
// CONTOH:
//   ┌─────────────────────────────────────────────┐
//   │ 👥 Daftar Karyawan                          │
//   │ Status kehadiran: 15 Januari 2024           │
//   │                                             │
//   │ No │ Nama      │ Dept   │ Status            │
//   │ 1  │ Sari Dewi │ HR     │ Hadir             │
//   │ 2  │ Budi      │ HR     │ Telat             │
//   └─────────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════

function getTodayStatus(employeeId: number): string {
  const attendance = attendances.find(
    (a) => a.employeeId === employeeId && a.date === TODAY
  );

  if (!attendance) return "-";

  const map: Record<string, string> = {
    present: "Hadir",
    late: "Telat",
    absent: "Absen",
    leave: "Cuti",
  };

  return map[attendance.status] || "-";
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return `${day} ${months[parseInt(month) - 1]} ${year}`;
}

function renderEmployeeTable(employees: Employee[]): string {
  if (employees.length === 0) return "<p>Tidak ada karyawan</p>";

  let rows = "";

  employees.forEach((emp, index) => {
    const dept = departments.find((d) => d.id === emp.departmentId);

    const status = getTodayStatus(emp.id);

    const className = emp.isActive ? "" : ' class="inactive"';

    rows += `
      <tr${className}>
        <td>${index + 1}</td>
        <td>${emp.name}</td>
        <td>${dept ? dept.name : "-"}</td>
        <td>${emp.position}</td>
        <td>${status}</td>
      </tr>
    `;
  });

  return `
    <table border="1" cellpadding="6">
      <tr>
        <th>No</th>
        <th>Nama</th>
        <th>Departemen</th>
        <th>Jabatan</th>
        <th>Status</th>
      </tr>
      ${rows}
    </table>
  `;
}

export function renderApp(): string {
  return `<!DOCTYPE html>
<html>
<head><title>Daftar Karyawan</title></head>
<body>
  <h1>👥 Daftar Karyawan</h1>
  <p>Status kehadiran: ${formatDate(TODAY)}</p>
  <div id="employee-list">
    ${renderEmployeeTable(employees)}
  </div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════
// PERTANYAAN WAJIB — jawab di komentar bawah:
// ═══════════════════════════════════════════════════════════
//
// Q1: Data di store bisa inconsistent — misalnya attendance
//     punya employeeId yang tidak ada di tabel employees. Waktu
//     render tabel, apa yang terjadi? Gimana cara handle-nya?
//     Dan gimana cara NYEGAH biar data tetap konsisten?
//
// Q2: Sekarang TODAY di-hardcode "2024-01-15". Di production
//     harus real-time. TAPI store cuma punya data Jan 2024.
//     Gimana desainnya biar kode tetap jalan di production?
//
// Q3: Karyawan non-aktif (isActive: false) — lebih baik
//     ditampilkan atau disembunyikan? Argumen masing-masing?
// ═══════════════════════════════════════════════════════════

// JAWABAN Q1:
// [Skip data yang tidak punya pasangan di employees, atau validasi sebelum render. Solusi terbaik:
// pastikan data valid dari backend dengan constraint/relasi yang jelas.]

// JAWABAN Q2:
// [Gunakan tanggal dinamis (new Date()), tapi siapkan fallback untuk data lama via environment mode atau
// mapping data demo agar tetap kompatibel.]

// JAWABAN Q3:
// [Lebih baik default disembunyikan untuk UI bersih, tapi tetap sediakan opsi filter jika butuh data
// lengkap (audit/admin).]
