// ============================================================
// SOAL 2 (Backend) — "Bikin API untuk Absensi & Karyawan"
// ============================================================
//
// 🎯 GAMBARAN:
// Kamu diminta bikin API (Application Programming Interface)
// — ini kayak "pelayan" yang nerima perintah (request) dan
// ngasih jawaban (response) dalam bentuk data.
//
// Contoh: kalau ada yang minta "GET /employees", API harus
// ngasih daftar semua karyawan.
//
// ============================================================

import { employees, attendances, leaves, nextAttendanceId, departments } from "../shared/store";
import type { ApiRequest, ApiResponse, Attendance, Employee } from "../shared/types";

// ═══════════════════════════════════════════════════════════
// SUDAH TERSEDIA (jangan diubah):
// ═══════════════════════════════════════════════════════════
//   GET  /employees       → daftar semua karyawan ✅
//   GET  /employees/:id   → detail 1 karyawan ✅
//   GET  /attendances     → daftar absensi ✅
//   GET  /leaves          → daftar cuti ✅
//
// ═══════════════════════════════════════════════════════════
// TUGAS KAMU — buat yang ini:
// ═══════════════════════════════════════════════════════════
//
// 1. POST /employees — TAMBAH KARYAWAN BARU
//
//    a. Pastikan request sudah terautentikasi
//    b. Parse body dari JSON string
//    c. Validasi:
//       - name: wajib, tidak boleh kosong
//       - email: wajib, harus mengandung "@"
//       - departmentId: wajib, harus ada di data departments
//       - position: wajib, tidak boleh kosong
//    d. Kalau valid: bikin Employee baru, push ke array,
//       increment nextEmployeeId
//    e. Return status 201
//    f. Kalau tidak valid: return 400 + pesan error
//
//    CONTOH REQUEST:
//      POST /employees
//      Authorization: Bearer tok_xxx
//      Body: {"name":"Bambang","email":"bambang@c.com","departmentId":2,"position":"Dev"}
//
// 2. POST /attendances — CATAT ABSENSI BARU
//
//    a. Parse body
//    b. Validasi:
//       - employeeId: wajib, harus ada di data employees
//       - date: wajib
//       - status: wajib, harus "present"/"late"/"absent"/"leave"
//       - clockIn: wajib kalau status "present" atau "late"
//    c. Kalau valid: bikin Attendance baru, push, return 201
//    d. Kalau tidak valid: return 400
//
//    CONTOH REQUEST:
//      POST /attendances
//      Body: {"employeeId":101,"date":"2024-02-01","status":"present","clockIn":"08:00"}
//
// ═══════════════════════════════════════════════════════════
// FORMAT RESPONSE:
//   { status: number, body: string }
// ═══════════════════════════════════════════════════════════

function handleRequest(req: ApiRequest): ApiResponse {
  const { method, path, body, headers } = req;

  // ─── SUDAH JADI ──────────────────────────────────────────
  if (method === "GET" && path === "/employees") {
    return { status: 200, body: JSON.stringify(employees) };
  }

  const empMatch = path.match(/^\/employees\/(\d+)$/);
  if (method === "GET" && empMatch) {
    const id = parseInt(empMatch[1], 10);
    const emp = employees.find((e) => e.id === id);
    if (!emp) return { status: 404, body: JSON.stringify({ error: "Karyawan tidak ditemukan" }) };
    return { status: 200, body: JSON.stringify(emp) };
  }

  // ─── TUGAS KAMU: POST /employees ─────────────────────────
  if (method === "POST" && path === "/employees") {
    const auth = headers?.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return { status: 401, body: JSON.stringify({ error: "Unauthorized" }) };
    }

    const data = JSON.parse(body || "{}");

    if (!data.name || data.name.trim() === "") {
      return { status: 400, body: JSON.stringify({ error: "Name wajib" }) };
    }
    if (!data.email || !data.email.includes("@")) {
      return { status: 400, body: JSON.stringify({ error: "Email tidak valid" }) };
    }
    if (!data.departmentId || !departments.find((d) => d.id === data.departmentId)) {
      return { status: 400, body: JSON.stringify({ error: "Department tidak valid" }) };
    }
    if (!data.position || data.position.trim() === "") {
      return { status: 400, body: JSON.stringify({ error: "Position wajib" }) };
    }

    const newEmp: Employee = {
      id: employees.length + 101,
      name: data.name,
      email: data.email,
      departmentId: data.departmentId,
      position: data.position,
      joinDate: new Date().toISOString().split("T")[0],
      isActive: true,
    };

    employees.push(newEmp);

    return { status: 201, body: JSON.stringify(newEmp) };
  }

  // ─── SUDAH JADI: GET /attendances ────────────────────────
  if (method === "GET" && path.startsWith("/attendances")) {
    const url = new URL(path, "http://localhost");
    const dateFilter = url.searchParams.get("date");
    let result = attendances;
    if (dateFilter) {
      result = attendances.filter((a) => a.date === dateFilter);
    }
    return { status: 200, body: JSON.stringify(result) };
  }

  // ─── TUGAS KAMU: POST /attendances ───────────────────────
  if (method === "POST" && path === "/attendances") {
    const data = JSON.parse(body || "{}");

    const empExists = employees.find((e) => e.id === data.employeeId);
    if (!empExists) {
      return { status: 400, body: JSON.stringify({ error: "Employee tidak ditemukan" }) };
    }

    if (!data.date) {
      return { status: 400, body: JSON.stringify({ error: "Date wajib" }) };
    }

    const valid = ["present", "late", "absent", "leave"];
    if (!valid.includes(data.status)) {
      return { status: 400, body: JSON.stringify({ error: "Status tidak valid" }) };
    }

    if ((data.status === "present" || data.status === "late") && !data.clockIn) {
      return { status: 400, body: JSON.stringify({ error: "clockIn wajib" }) };
    }

    const newAtt: Attendance = {
      id: attendances.length + 1,
      employeeId: data.employeeId,
      date: data.date,
      clockIn: data.clockIn || "",
      clockOut: data.clockOut || null,
      status: data.status,
      note: "", // ← INI YANG KURANG
    };

  attendances.push(newAtt);

  return { status: 201, body: JSON.stringify(newAtt) };
}

  // ─── SUDAH JADI: GET /leaves ─────────────────────────────
  if (method === "GET" && path === "/leaves") {
    return { status: 200, body: JSON.stringify(leaves) };
  }

  return { status: 404, body: JSON.stringify({ error: "Endpoint tidak dikenal" }) };
}

// ═══════════════════════════════════════════════════════════
// TES — jalanin buat liat hasilnya
// ═══════════════════════════════════════════════════════════

function test() {
  console.log("🧪 Testing API Handlers...\n");
  let failed = false;

  const res1 = handleRequest({ method: "GET", path: "/employees" });
  console.log(`GET /employees → ${res1.status}: ${JSON.parse(res1.body).length} karyawan`);

  const res2 = handleRequest({ method: "GET", path: "/employees/101" });
  const emp = JSON.parse(res2.body);
  console.log(`GET /employees/101 → ${res2.status}: ${emp.name || "?"}`);

  const res3 = handleRequest({ method: "GET", path: "/employees/999" });
  console.log(`GET /employees/999 → ${res3.status}: ${JSON.parse(res3.body).error}`);

  const res4 = handleRequest({ method: "GET", path: "/attendances" });
  console.log(`GET /attendances → ${res4.status}: ${JSON.parse(res4.body).length} records`);

  const res5 = handleRequest({ method: "POST", path: "/employees", body: '{"name":"X","email":"x@c.com","departmentId":1,"position":"X"}', headers: {} });
  if (res5.status === 501) { console.log("❌ POST /employees — Not implemented"); failed = true; }
  else console.log(`✅ POST /employees → ${res5.status}`);

  const res6 = handleRequest({ method: "POST", path: "/attendances", body: '{"employeeId":101,"date":"2024-06-01","status":"present","clockIn":"08:00"}', headers: {} });
  if (res6.status === 501) { console.log("❌ POST /attendances — Not implemented"); failed = true; }
  else console.log(`✅ POST /attendances → ${res6.status}`);

  if (failed) process.exit(1);
  console.log("\n✅ Test selesai.");
}
const isMain = process.argv[1] && (
  process.argv[1] === __filename ||
  process.argv[1].replace(/\\/g, "/").endsWith("backend/soal_2.ts")
);
if (isMain) test();

// ═══════════════════════════════════════════════════════════
// PERTANYAAN WAJIB — jawab di komentar bawah:
// ═══════════════════════════════════════════════════════════
//
// Q1: Gimana cara nambahin endpoint GET /employees?department=engineering
//     yang cuma nampilin karyawan dari departemen tertentu?
//     Tulis kode yang diperlukan.
//
// Q2: POST /employees butuh autentikasi. POST /attendances juga
//     harusnya. Lebih baik bikin 1 fungsi middleware atau
//     tulis ulang kode auth di tiap handler? Kenapa?
//
// Q3: `nextAttendanceId` disimpan di memory. Kalau server mati,
//     angkanya balik lagi. ID bisa bentrok. Kalau harus pilih
//     SATU solusi untuk production, mana yang kamu pilih? Kenapa?
//
// Q4: GET /attendances ngembaliin employeeId (angka). Frontend
//     butuh nama karyawan. Lebih baik:
//     A) Frontend nyari sendiri namanya
//     B) Backend langsung kasih nama di response
//     C) Bikin endpoint baru
//     Kamu pilih mana? Kenapa?
// ═══════════════════════════════════════════════════════════

// JAWABAN Q1:
//  if (method === "GET" && path.startsWith("/employees")) {
//   const url = new URL(path, "http://localhost");
//   const dept = url.searchParams.get("department");
//
//  if (dept) {
//   const result = employees.filter((e) =>
//   departments.find((d) => d.id === e.departmentId)?.name.toLowerCase() === dept.toLowerCase()
//  );
//    return { status: 200, body: JSON.stringify(result) };
//  }
//
//  return { status: 200, body: JSON.stringify(employees) };
//  }

// JAWABAN Q2:
// [Middleware lebih baik karena tidak perlu ulang kode auth di setiap endpoint, lebih rapi dan mudah
// di-maintain, dan kalau ada perubahan auth, cukup ubah 1 tempat.]

// JAWABAN Q3:
// [Pakai database auto-increment atau UUID. Karena kalau pakai memory, data bisa hilang kalau server restart
// dan bisa terjadi ID duplikat.]

// JAWABAN Q4:
// [B) Backend langsung kasih nama di response. Karena bagian frontend jadi lebih simpel, tidak perlu query
// tambahan, dan performa yang dihasilkan lebih cepat.]
