// ============================================================
// SOAL 8 (Frontend) — "Profil Karyawan & Riwayat Absensi"
// ============================================================
//
// 🎯 GAMBARAN:
// Karyawan mau lihat profil diri sendiri dan riwayat absensi
// pribadi. Halaman ini gabungin data dari employees,
// attendances, dan leaves.
//
// ============================================================

import { employees, attendances, leaves, departments, users } from "../shared/store";
import type { Employee, Attendance, Leave } from "../shared/types";

// ═══════════════════════════════════════════════════════════
// TUGAS KAMU:
// ═══════════════════════════════════════════════════════════
//
// 1. getEmployeeProfile(employeeId) → object | null
//
//    Cari employee berdasarkan ID. Kalau ketemu, gabung
//    dengan nama departemen. Kalau tidak → return null.
//
// 2. getEmployeeAttendance(employeeId) → Attendance[]
//
//    Ambil semua absensi milik employee tersebut.
//    Urutkan dari tanggal terbaru. Return 5 terakhir.
//
// 3. getEmployeeLeaves(employeeId) → Leave[]
//
//    Ambil semua cuti employee tersebut.
//    Urutkan dari createdAt terbaru.
//
// 4. renderProfilePage(employeeId) → string HTML
//
//    Kalau karyawan tidak ditemukan → "Karyawan tidak ditemukan"
//
//    Kalau ditemukan, tampilkan:
//
//    a. Info karyawan: nama, email, jabatan, departemen
//    b. Statistik: total hadir, telat, absen, cuti
//       (hitung dari SEMUA attendance, bukan 5 terakhir)
//    c. Tabel riwayat absensi (5 terakhir)
//    d. Tabel daftar cuti
//
// 5. getAuthHeaders(token) → object
//
//    Return header untuk request ke backend
// ═══════════════════════════════════════════════════════════

interface EmployeeWithDept extends Employee {
  departmentName: string;
}

function getEmployeeProfile(employeeId: number): EmployeeWithDept | null {
  const emp = employees.find((e) => e.id === employeeId);
  if (!emp) return null;

  const dept = departments.find((d) => d.id === emp.departmentId);

  return {
    ...emp,
    departmentName: dept ? dept.name : "-",
  };
}

function getEmployeeAttendance(employeeId: number): Attendance[] {
  return attendances
    .filter((a) => a.employeeId === employeeId)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);
}

function getEmployeeLeaves(employeeId: number): Leave[] {
  return leaves
    .filter((l) => l.employeeId === employeeId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function renderProfilePage(employeeId: number): string {
  const profile = getEmployeeProfile(employeeId);

  if (!profile) {
    return `<div>Karyawan tidak ditemukan</div>`;
  }

  const attendance = attendances.filter((a) => a.employeeId === employeeId);

  const stats = {
    present: attendance.filter((a) => a.status === "present").length,
    late: attendance.filter((a) => a.status === "late").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    leave: attendance.filter((a) => a.status === "leave").length,
  };

  const history = getEmployeeAttendance(employeeId);
  const leaveData = getEmployeeLeaves(employeeId);

  return `
    <div>
      <h2>${profile.name}</h2>
      <p>Email: ${profile.email}</p>
      <p>Jabatan: ${profile.position}</p>
      <p>Departemen: ${profile.departmentName}</p>

      <h3>Statistik</h3>
      <p>Hadir: ${stats.present}</p>
      <p>Telat: ${stats.late}</p>
      <p>Absen: ${stats.absent}</p>
      <p>Cuti: ${stats.leave}</p>

      <h3>Riwayat Absensi</h3>
      <ul>
        ${history.map((h) => `<li>${h.date} - ${h.status}</li>`).join("")}
      </ul>

      <h3>Cuti</h3>
      <ul>
        ${leaveData.map((l) => `<li>${l.type} - ${l.status}</li>`).join("")}
      </ul>
    </div>
  `;
}

export function getAuthHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}

// ═══════════════════════════════════════════════════════════
// PERTANYAAN WAJIB — jawab di komentar bawah:
// ═══════════════════════════════════════════════════════════
//
// Q1: renderProfilePage manggil 3 fungsi sekaligus:
//     getEmployeeProfile, getEmployeeAttendance, getEmployeeLeaves.
//     Masing-masing looping data sendiri-sendiri. Untuk halaman
//     yang cuma butuh data 1 orang, apa pemborosan yang terjadi?
//     Desain ulang biar lebih efisien.
//
// Q2: Statistik kehadiran dihitung dengan looping SEMUA
//     attendance. Makin banyak data, makin lambat render.
//     Apa alternatif selain hitung ulang setiap kali render?
//     Mana yang lebih cocok untuk aplikasi web seperti ini?
//
// Q3: Tulis kode yang melakukan join antara employee dan
//     department di TypeScript untuk mencari nama departemen
//     dari departmentId. Usahakan efisien untuk banyak data.
// ═══════════════════════════════════════════════════════════

// JAWABAN Q1:
// [Terjadi pengulangan looping data berkali-kali (redundan scan array). Lebih efisien jika data diambil
// sekali lalu dipakai ulang dalam satu proses render.]

// JAWABAN Q2:
// [Hitung ulang setiap render itu berat. Alternatifnya: precompute / cache statistik saat data berubah.
// Untuk web app, caching lebih cocok karena render bisa sering terjadi.]

// JAWABAN Q3:
// [Gunakan map untuk department agar lookup cepat:]
// const deptMap = new Map(departments.map(d => [d.id, d.name]));
//
// const employeeWithDept = employees.map(e => ({
//   ...e,
//   departmentName: deptMap.get(e.departmentId) || "-"
// }));