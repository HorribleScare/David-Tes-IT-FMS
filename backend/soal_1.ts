// ============================================================
// SOAL 1 (Backend) — "Bikin Struktur Data Absensi"
// ============================================================
//
// 🎯 GAMBARAN:
// Perusahaan punya data absensi campur aduk dalam 1 array
// (RAW_DATA di bawah). Tugas kamu: pisahin data itu jadi
// tabel-tabel terpisah (normalisasi).
//
// ============================================================

// ═══════════════════════════════════════════════════════════
// DATA MENTAH — file Excel/CSV yang belum diolah
// ═══════════════════════════════════════════════════════════

interface FlatAttendanceRow {
  employeeName: string;
  email: string;
  department: string;
  position: string;
  joinDate: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  status: string;
  leaveType: string | null;
  leaveReason: string | null;
  leaveStatus: string | null;
}

const RAW_DATA: FlatAttendanceRow[] = [
  { employeeName: "Sari Dewi", email: "sari@company.com", department: "HR", position: "HR Manager", joinDate: "2020-03-15", date: "2024-01-15", clockIn: "08:00", clockOut: "17:00", status: "present", leaveType: null, leaveReason: null, leaveStatus: null },
  { employeeName: "Budi Santoso", email: "budi@company.com", department: "HR", position: "HR Staff", joinDate: "2021-06-01", date: "2024-01-15", clockIn: "08:45", clockOut: "17:00", status: "late", leaveType: null, leaveReason: null, leaveStatus: null },
  { employeeName: "Andi Pratama", email: "andi@company.com", department: "Engineering", position: "Tech Lead", joinDate: "2019-11-20", date: "2024-01-15", clockIn: "07:55", clockOut: "17:00", status: "present", leaveType: null, leaveReason: null, leaveStatus: null },
  { employeeName: "Fitri Handayani", email: "fitri@company.com", department: "Marketing", position: "Content Writer", joinDate: "2022-03-22", date: "2024-01-15", clockIn: "", clockOut: null, status: "absent", leaveType: null, leaveReason: null, leaveStatus: null },
  { employeeName: "Fitri Handayani", email: "fitri@company.com", department: "Marketing", position: "Content Writer", joinDate: "2022-03-22", date: "2024-01-15", clockIn: "", clockOut: null, status: "leave", leaveType: "sick", leaveReason: "Demam tinggi", leaveStatus: "approved" },
  { employeeName: "Dewi Lestari", email: "dewi@company.com", department: "Finance", position: "Accountant", joinDate: "2021-10-01", date: "2024-01-15", clockIn: "", clockOut: null, status: "leave", leaveType: "annual", leaveReason: "Liburan keluarga", leaveStatus: "approved" },
  { employeeName: "Rina Wijaya", email: "rina@company.com", department: "Engineering", position: "Frontend Developer", joinDate: "2022-01-10", date: "2024-01-15", clockIn: "09:15", clockOut: "17:30", status: "late", leaveType: null, leaveReason: null, leaveStatus: null },
  { employeeName: "Andi Pratama", email: "andi@company.com", department: "Engineering", position: "Tech Lead", joinDate: "2019-11-20", date: "2024-01-16", clockIn: "07:50", clockOut: "17:00", status: "present", leaveType: null, leaveReason: null, leaveStatus: null },
];

// ═══════════════════════════════════════════════════════════
// TUGAS KAMU:
// ═══════════════════════════════════════════════════════════
//
// Di file shared/types.ts, udah ada interface:
//   - Department (id, name, headId)
//   - Employee   (id, name, email, departmentId, position, joinDate, isActive)
//   - Attendance (id, employeeId, date, clockIn, clockOut, status, note)
//   - Leave      (id, employeeId, startDate, endDate, type, status, reason, ...)
//
// Tugas kamu di function normalizeData() di bawah:
//
// 1. Ambil data departemen dari RAW_DATA
//    Setiap baris punya field "department"
//    Buat array Department, kasih id urut (1, 2, 3, ...)
//    Nama departemen tidak boleh duplikat
//
// 2. Ambil data karyawan dari RAW_DATA
//    Setiap baris punya employeeName, email, department, position, joinDate
//    Hati-hati: nama yang sama cuma boleh masuk SEKALI
//    Beri employeeId mulai dari 101
//
// 3. Ambil data absensi dari RAW_DATA
//    Setiap baris = 1 data absensi
//    Kolom: employeeId (cocokin dari nama), date, clockIn, clockOut, status
//
// 4. Ambil data cuti dari RAW_DATA
//    Hanya baris yang punya field leaveType (tidak null)
//
// 5. Cetak hasilnya ke console dengan format seperti contoh
//
// CONTOH OUTPUT:
//
//   📋 DEPARTEMEN:
//     1. HR
//     2. Engineering
//     ...
//
//   👥 KARYAWAN (8 orang):
//     101. Sari Dewi — HR — HR Manager
//     102. Budi Santoso — HR — HR Staff
//     ...
//
//   📅 ABSENSI (8 record):
//     1. Sari Dewi — 15/01/2024 — 08:00 - 17:00 — present
//     2. Budi Santoso — 15/01/2024 — 08:45 - 17:00 — late
//     ...
// ═══════════════════════════════════════════════════════════

function normalizeData(rows: FlatAttendanceRow[]): void {
  const departments: any[] = [];
  const employees: any[] = [];
  const attendances: any[] = [];
  const leaves: any[] = [];

  const deptMap = new Map<string, number>();
  const empMap = new Map<string, number>();

  // 1. MERANCANG 📋DEPARTEMEN + 👥KARYAWAN
  for (const row of rows) {
    // Department
    if (!deptMap.has(row.department)) {
      const deptId = deptMap.size + 1;
      deptMap.set(row.department, deptId);

      departments.push({
        id: deptId,
        name: row.department,
        headId: null,
      });
    }

    // 👥KARYAWAN (unik by email)
    if (!empMap.has(row.email)) {
      const empId = 100 + empMap.size + 1;
      empMap.set(row.email, empId);

      employees.push({
        id: empId,
        name: row.employeeName,
        email: row.email,
        departmentId: deptMap.get(row.department),
        position: row.position,
        joinDate: row.joinDate,
        isActive: true,
      });
    }
  }

  // 2. MERANCANG 📅ABSENSI + 🏖️CUTI
  for (const row of rows) {
    const employeeId = empMap.get(row.email);

    // Kehadiran Karyawan
    attendances.push({
      id: attendances.length + 1,
      employeeId,
      date: row.date,
      clockIn: row.clockIn,
      clockOut: row.clockOut,
      status: row.status,
      note: null,
    });

    // Karyawan Keluar (hanya kalau ada)
    if (row.leaveType) {
      leaves.push({
        id: leaves.length + 1,
        employeeId,
        startDate: row.date,
        endDate: row.date,
        type: row.leaveType,
        status: row.leaveStatus,
        reason: row.leaveReason,
      });
    }
  }

  // 3. OUTPUT YANG DIINGINKAN
  console.log("\n📋 DEPARTEMEN:");
  departments.forEach((d) => {
    console.log(`${d.id}. ${d.name}`);
  });

  console.log("\n👥 KARYAWAN:");
  employees.forEach((e) => {
    console.log(`${e.id}. ${e.name} — ${e.departmentId} — ${e.position}`);
  });

  console.log("\n📅 ABSENSI:");
  attendances.forEach((a, i) => {
    const emp = employees.find((e) => e.id === a.employeeId);
    console.log(
      `${i + 1}. ${emp?.name} — ${a.date} — ${a.clockIn || "-"} - ${a.clockOut || "-"} — ${a.status}`
    );
  });

  console.log("\n🏖️ CUTI:");
  leaves.forEach((l) => {
    const emp = employees.find((e) => e.id === l.employeeId);
    console.log(
      `${emp?.name} — ${l.type} — ${l.status} — ${l.reason}`
    );
  });
}

// ⬇️ JALANKAN FUNGSINYA:
normalizeData(RAW_DATA);

// ═══════════════════════════════════════════════════════════
// PERTANYAAN WAJIB — jawab di komentar bawah:
// ═══════════════════════════════════════════════════════════
//
// Q1: Fitri muncul 2x di RAW_DATA (absent + leave). Dari semua
//     masalah yang timbul akibat data campur aduk, mana yang PALING
//     KRITIS menurut kamu? Jelaskan kenapa.
//
// Q2: Hasil normalisasi kamu, apakah udah dalam bentuk 3NF?
//     Jelaskan.
//
// Q3: Kalau mau nambah fitur "Lembur" (overtimeHours, overtimeRate),
//     apa yang perlu diubah dari schema kamu?
//
// Q4: Perusahaan punya 500+ karyawan, data absensi 2 tahun.
//     Dari berbagai cara optimasi query rekap per bulan, mana yang
//     paling cocok untuk skenario ini? Sebutkan kekurangannya juga.
// ═══════════════════════════════════════════════════════════

// JAWABAN Q1:
// [Masalah paling kritis adalah duplikasi data karyawan dan status yang berbeda dalam satu orang
// (Fitri muncul sebagai absent dan leave). Ini bisa menyebabkan data tidak konsisten, laporan salah, dan
// kesalahan dalam pengambilan keputusan karena satu entitas memiliki status berbeda di hari yang sama.]

// JAWABAN Q2:
// [Sudah mendekati 3NF karena data sudah dipisahkan ke tabel terpisah (Department, Employee, Attendance,
// Leave). Tidak ada repeating group dan setiap tabel memiliki primary key. Relasi antar tabel menggunakan
// ID sehingga mengurangi redundansi data.]

// JAWABAN Q3:
// [Perlu menambahkan tabel atau field baru khusus untuk overtime. Tidak disarankan menambahkan langsung ke
// Attendance karena bisa membuat data tidak konsisten. Struktur ideal adalah membuat tabel Overtime yang
// berisi employeeId, date, overtimeHours, dan overtimeRate.]

// JAWABAN Q4:
// [Metode paling cocok adalah menggunakan indexing pada kolom date dan employeeId, serta menggunakan
// pre-aggregated table (materialized view) untuk rekap bulanan. Kekurangannya adalah membutuhkan storage
// lebih besar dan harus di-update secara berkala agar data tetap sinkron.]
