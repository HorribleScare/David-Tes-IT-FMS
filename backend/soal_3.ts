// ============================================================
// SOAL 3 (Backend) — "Bikin Rekap Laporan Absensi"
// ============================================================
//
// 🎯 GAMBARAN:
// HR butuh laporan rekap absensi bulanan. Kamu harus ngolah
// data absensi mentah jadi laporan yang rapi.
//
// Contoh: "Januari 2024 — Andi hadir 2 hari, telat 0, absen 0"
//
// ============================================================

import { employees, attendances, leaves, departments } from "../shared/store";
import type { Employee, Attendance, AttendanceSummary, Leave } from "../shared/types";

// ═══════════════════════════════════════════════════════════
// TUGAS KAMU:
// ═══════════════════════════════════════════════════════════
//
// 1. getAttendanceSummary(month, year) → array laporan
//
//    a. Filter attendance berdasarkan bulan & tahun
//    b. Kelompokkan per karyawan
//    c. Hitung untuk tiap karyawan:
//       - totalPresent  → jumlah status "present"
//       - totalLate     → jumlah status "late"
//       - totalAbsent   → jumlah status "absent"
//       - totalLeave    → jumlah status "leave"
//       - totalDays     = jumlah semua
//    d. Gabung dengan data karyawan (nama + departemen)
//    e. Urutkan dari yang paling sering absen
//    f. Return array AttendanceSummary
//
//    CONTOH OUTPUT:
//      [
//        { employeeId: 106, employeeName: "Fitri Handayani", department: "Marketing",
//          totalPresent: 0, totalLate: 0, totalAbsent: 1, totalLeave: 1, totalDays: 2 },
//        { employeeId: 101, employeeName: "Sari Dewi", department: "HR",
//          totalPresent: 2, totalLate: 0, totalAbsent: 0, totalLeave: 0, totalDays: 2 },
//      ]
//
// 2. printMonthlyReport(summaries) — CETAK KE TERMINAL
//
//    a. Cetak header "📊 REKAP ABSENSI — January 2024"
//    b. Buat tabel dengan kolom:
//       No | Nama | Departemen | Hadir | Telat | Absen | Cuti | %
//    c. % Kehadiran = (hadir + telat) / total × 100
//       Kalau total = 0, tulis "-"
//    d. Gunakan padding atau formatting biar rapi
//
//    CONTOH:
//      📊 REKAP ABSENSI — January 2024
//      No  Nama              Dept          Hadir  Telat  Absen  Cuti     %
//      1   Fitri Handayani   Marketing         0      0      1      1   0.0%
//      2   Sari Dewi         HR                2      0      0      0 100.0%
//
// 3. getPendingLeaves() → array cuti yang pending
//
//    a. Filter leaves yang statusnya "pending"
//    b. Urutkan dari yang paling lama diajukan
//    c. Return array
// ═══════════════════════════════════════════════════════════

function getAttendanceSummary(month: string, year: number): AttendanceSummary[] {
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();

  const map = new Map<number, AttendanceSummary>();

  for (const a of attendances) {
    const date = new Date(a.date);
    if (date.getMonth() !== monthIndex || date.getFullYear() !== year) continue;

    const emp = employees.find((e) => e.id === a.employeeId);
    if (!emp) continue;

    if (!map.has(emp.id)) {
      map.set(emp.id, {
        employeeId: emp.id,
        employeeName: emp.name,
        department: departments.find((d) => d.id === emp.departmentId)?.name || "-",
        totalPresent: 0,
        totalLate: 0,
        totalAbsent: 0,
        totalLeave: 0,
        totalDays: 0,
      });
    }

    const s = map.get(emp.id)!;

    if (a.status === "present") s.totalPresent++;
    else if (a.status === "late") s.totalLate++;
    else if (a.status === "absent") s.totalAbsent++;
    else if (a.status === "leave") s.totalLeave++;

    s.totalDays++;
  }

  return Array.from(map.values()).sort(
    (a, b) => b.totalAbsent - a.totalAbsent
  );
}

function printMonthlyReport(summaries: AttendanceSummary[]): void {
  console.log("\n📊 REKAP ABSENSI\n");

  console.log(
    "No  Nama                Dept         Hadir Telat Absen Cuti   %"
  );

  summaries.forEach((s, i) => {
    const present = s.totalPresent + s.totalLate;
    const percent =
      s.totalDays === 0 ? "-" : ((present / s.totalDays) * 100).toFixed(1) + "%";

    console.log(
      `${String(i + 1).padEnd(3)} ` +
      `${s.employeeName.padEnd(18)} ` +
      `${s.department.padEnd(12)} ` +
      `${String(s.totalPresent).padEnd(5)} ` +
      `${String(s.totalLate).padEnd(5)} ` +
      `${String(s.totalAbsent).padEnd(5)} ` +
      `${String(s.totalLeave).padEnd(5)} ` +
      `${percent}`
    );
  });
}

function getPendingLeaves(): Leave[] {
  return leaves
    .filter((l) => l.status === "pending")
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

// ═══════════════════════════════════════════════════════════
// TES
// ═══════════════════════════════════════════════════════════

function test() {
  console.log("🧪 Testing Attendance Report...\n");
  let failed = false;

  const summary = getAttendanceSummary("January", 2024);
  if (summary.length === 0) { console.log("❌ getAttendanceSummary — kosong (Not implemented?)"); failed = true; }
  else console.log(`✅ getAttendanceSummary: ${summary.length} karyawan`);

  printMonthlyReport(summary);

  console.log("\n📋 Pending Leaves:");
  const pending = getPendingLeaves();
  if (pending.length === 0) { console.log("⚠️  getPendingLeaves — kosong (mungkin belum ada data pending)"); }
  else {
    pending.forEach((l) => {
      console.log(`  ${l.id}: Karyawan ${l.employeeId} — ${l.type} (${l.status})`);
    });
  }

  if (failed) process.exit(1);
  console.log("\n✅ Test selesai.");
}

const isMain = process.argv[1] && (
  process.argv[1] === __filename ||
  process.argv[1].replace(/\\/g, "/").endsWith("backend/soal_3.ts")
);
if (isMain) test();

// ═══════════════════════════════════════════════════════════
// PERTANYAAN WAJIB — jawab di komentar bawah:
// ═══════════════════════════════════════════════════════════
//
// Q1: Kamu pake Map/Object buat group by di JavaScript. Kalo
//     pake SQL, GROUP BY bisa lebih pendek. Tulis SQL query
//     untuk dapetin total kehadiran per karyawan 1 bulan.
//
// Q2: Waktu hitung % kehadiran, karyawan yang cuti apakah
//     dianggap "tidak hadir"? Atau tidak dihitung? Jelaskan.
//
// Q3: Ada karyawan dengan isActive: false. Apakah dia tetap
//     muncul di laporan? Jelaskan alasan kamu.
//
// Q4: printMonthlyReport sekarang cetak ke terminal. Kalau HR
//     mau export ke CSV juga, desain seperti apa yang
//     mendukung dua format output sekaligus?
// ═══════════════════════════════════════════════════════════

// JAWABAN Q1:
// SELECT
//  employeeId,
//  COUNT(CASE WHEN status = 'present' THEN 1 END) AS totalPresent,
//  COUNT(CASE WHEN status = 'late' THEN 1 END) AS totalLate,
//  COUNT(CASE WHEN status = 'absent' THEN 1 END) AS totalAbsent,
//  COUNT(CASE WHEN status = 'leave' THEN 1 END) AS totalLeave,
//  COUNT(*) AS totalDays
// FROM attendances
// WHERE date >= '2024-01-01' AND date <= '2024-01-31'
// GROUP BY employeeId;

// JAWABAN Q2:
// [Cuti tetap dihitung sebagai bagian dari ketidakhadiran, tapi tidak masuk kategori “absen”.
// Tidak hadir tidak sama dengan cuti dan cuti adalah status izin resmi yang sudah disetujui oleh atasan.]

// JAWABAN Q3:
// [Tidak perlu ditampilkan di laporan aktif. Dengan alasan yaitu laporan absensi fokus ke karyawan aktif dan
// data historis tetap ada di database, tapi tidak dihitung di rekap bulanan aktif.]

// JAWABAN Q4:
// [Pakai konsep separation of concerns, yang terdiri dari 1 function generate data dan 1 function
// format output.]
