// ============================================================
// SOAL 4 (Backend) — "Bikin Login & Hak Akses"
// ============================================================
//
// 🎯 GAMBARAN:
// Sistem absensi butuh login. Ada 3 level user:
//   - admin    : bisa apa aja
//   - hr       : bisa kelola karyawan & approve cuti
//   - employee : cuma bisa lihat absensi sendiri & ajukan cuti
//
// ============================================================

import { users, sessions, nextUserId } from "../shared/store";
import type { User, SafeUser, UserRole } from "../shared/types";

// ─── FUNGSI BANTU (udah jadi, jangan diubah) ───────────────

function hashPassword(password: string): string {
  return `hashed_${password}`;
}

function verifyPassword(password: string, hash: string): boolean {
  return hash === `hashed_${password}`;
}

let tokenCounter = 0;
function generateToken(): string {
  tokenCounter++;
  return `tok_${Date.now()}_${tokenCounter}`;
}

// ═══════════════════════════════════════════════════════════
// TUGAS KAMU:
// ═══════════════════════════════════════════════════════════
//
// 1. register(email, name, password, role?) — DAFTAR AKUN BARU
//
//    a. Validasi email (harus ada @), password (min 6 karakter),
//       name (tidak boleh kosong)
//    b. Cek duplikasi email (case-insensitive)
//    c. Kalau lolos: bikin User, hash password, simpan di array
//    d. Return SafeUser (tanpa passwordHash)
//    e. Kalau gagal: return { error: "pesan" }
//
//    CONTOH:
//      register("budi@c.com", "Budi", "rahasia123")
//      → { user: { id: 5, email: "budi@c.com", name: "Budi", role: "employee" } }
//
// 2. login(email, password) — LOGIN
//
//    a. Cari user berdasarkan email (case-insensitive)
//    b. Verify password
//    c. Kalau cocok: generate token, simpan session
//    d. Return { token: "...", user: SafeUser }
//    e. Kalau salah: return { error: "Email atau password salah" }
//       (JANGAN sebut yang mana yang salah — itu info buat hacker)
//
//    CONTOH:
//      login("sari@company.com", "hr456")
//      → { token: "tok_...", user: { id: 2, email: "sari@company.com", ... } }
//
// 3. authenticate(headers) — CEK TOKEN AKSES
//
//    a. Baca token dari header request
//    b. Cari session yang cocok
//    c. Kalau ada: cari user dari session
//    d. Return user atau null
//
// 4. authorize(user, requiredRole) — CEK HAK AKSES
//
//    a. Gunakan ROLE_HIERARCHY di bawah
//    b. admin = 3, hr = 2, employee = 1
//    c. Return true kalau level user >= level yang diminta
//
//    CONTOH:
//      authorize(user_role_hr, "hr")    → true
//      authorize(user_role_hr, "admin") → false
//
// 5. requireAuth(handler, requiredRole?) — MIDDLEWARE
//
//    a. Ini fungsi pembungkus: otomatis cek auth sebelum handler jalan
//    b. authenticate dulu — kalau null → return 401
//    c. Kalau ada requiredRole — authorize — kalau false → return 403
//    d. Kalau lolos: panggil handler(req, user)
// ═══════════════════════════════════════════════════════════

function register(
  email: string,
  name: string,
  password: string,
  role: UserRole = "employee"
): { user: SafeUser } | { error: string } {
  if (!email.includes("@")) return { error: "Email tidak valid" };
  if (!name || name.trim() === "") return { error: "Nama wajib" };
  if (!password || password.length < 6) return { error: "Password minimal 6 karakter" };

  const exists = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) return { error: "Email sudah terdaftar" };

  const newUser: User = {
    id: users.length + 1,
    email,
    name,
    passwordHash: hashPassword(password),
    role,
    employeeId: null,
  };

  users.push(newUser);

  const safe: SafeUser = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    employeeId: newUser.employeeId,
  };

  return { user: safe };
}

function login(
  email: string,
  password: string
): { token: string; user: SafeUser } | { error: string } {
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Email atau password salah" };
  }

  const token = generateToken();

  sessions.set(token, {
    userId: user.id,
    token,
    createdAt: new Date(),
  });

  const safe: SafeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    employeeId: user.employeeId,
  };

  return { token, user: safe };
}

export function authenticate(
  headers?: Record<string, string>
): User | null {
  const auth = headers?.authorization || headers?.Authorization;
  if (!auth) return null;

  const token = auth.replace("Bearer ", "").trim();

  const session = sessions.get(token);
  if (!session) return null;

  return users.find((u) => u.id === session.userId) || null;
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  hr: 2,
  employee: 1,
};

export function authorize(user: User, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
}

export function requireAuth(
  handler: (req: any, user: User) => any,
  requiredRole?: UserRole
): (req: any) => any {
  return (req: any) => {
    const user = authenticate(req.headers);

    if (!user) {
      return { status: 401, body: JSON.stringify({ error: "Unauthorized" }) };
    }

    if (requiredRole && !authorize(user, requiredRole)) {
      return { status: 403, body: JSON.stringify({ error: "Forbidden" }) };
    }

    return handler(req, user);
  };
}

// ═══════════════════════════════════════════════════════════
// TES
// ═══════════════════════════════════════════════════════════

function test() {
  console.log("🧪 Testing Auth...\n");
  let failed = false;

  const regResult = register("test@company.com", "Test User", "test123", "employee");
  if ("error" in regResult) {
    console.log(`❌ Register gagal: ${regResult.error}`);
    failed = true;
  } else {
    console.log(`✅ Register sukses: ${regResult.user.name} (${regResult.user.email})`);
  }

  const logResult = login("sari@company.com", "hr456");
  if ("error" in logResult) {
    console.log(`❌ Login gagal: ${logResult.error}`);
    failed = true;
  } else {
    console.log(`✅ Login sukses: ${logResult.user.name} — token: ${logResult.token.slice(0, 12)}...`);
  }

  if (!("error" in logResult)) {
    const authed = authenticate({ authorization: `Bearer ${logResult.token}` });
    if (authed) {
      console.log(`✅ Authenticate sukses: ${authed.name} (${authed.role})`);
    } else {
      console.log(`❌ Authenticate gagal`);
      failed = true;
    }
  }

  const sariUser = users.find((u) => u.email === "sari@company.com");
  if (sariUser) {
    const hrOk = authorize(sariUser, "hr");
    const adminOk = authorize(sariUser, "admin");
    console.log(`✅ Sari (hr) authorize hr: ${hrOk}`);
    console.log(`✅ Sari (hr) authorize admin: ${adminOk}`);
    if (!hrOk) { console.log("❌ Sari harusnya bisa akses hr"); failed = true; }
    if (adminOk) { console.log("❌ Sari (hr) harusnya TIDAK bisa akses admin"); failed = true; }
  }

  const dupResult = register("sari@company.com", "Sari Lain", "pass123");
  if ("error" in dupResult) {
    console.log(`✅ Duplikasi terdeteksi: ${dupResult.error}`);
  } else {
    console.log("❌ Duplikasi seharusnya ditolak");
    failed = true;
  }

  if (failed) process.exit(1);
  console.log("\n✅ Test selesai.");
}

const isMain = process.argv[1] && (
  process.argv[1] === __filename ||
  process.argv[1].replace(/\\/g, "/").endsWith("backend/soal_4.ts")
);
if (isMain) test();

// ═══════════════════════════════════════════════════════════
// PERTANYAAN WAJIB — jawab di komentar bawah:
// ═══════════════════════════════════════════════════════════
//
// Q1: Session disimpan di Map (memory). Kalau server mati,
//     semua session ilang. Sebutkan 2 solusi dan kekurangannya.
//
// Q2: Kalau besok ada role baru "manager" yang levelnya di
//     antara hr (2) dan admin (3), apa aja yang perlu diubah?
//     Selain ROLE_HIERARCHY, apakah fungsi authorize() dan
//     requireAuth() perlu diubah struktur kodenya? Kenapa?
//
// Q3: authenticate() baca 2 header (Authorization + X-Auth-Token).
//     Dari sisi keamanan, ini bagus atau jelek? Jelaskan.
//
// Q4: Fungsi hashPassword cuma nambah "hashed_" di depan password.
//     Sebutkan 3 kelemahan cara ini dibanding bcrypt.
// ═══════════════════════════════════════════════════════════

// JAWABAN Q1:
// 1) Simpan session di database (Redis/DB)
// Kekurangan: butuh setup tambahan + sedikit lebih lambat dari memory.
// 2) Pakai Redis cluster / cache server
// Kekurangan: biaya lebih tinggi + kompleksitas sistem naik.

// JAWABAN Q2:
// Tidak perlu ubah authorize() atau requireAuth().
// Cukup tambahkan "manager: 2.5" di ROLE_HIERARCHY.
// Karena sistem sudah berbasis angka level, jadi scalable.

// JAWABAN Q3:
// Jelek dari sisi keamanan.
// Karena 2 header bisa bikin bypass auth atau confusion attack.
// Harusnya cukup 1 sumber token saja (Authorization).

// JAWABAN Q4:
// 1) Tidak aman karena tidak benar-benar hash (hanya prefix).
// 2) Mudah ditebak / reverse engineering sangat gampang.
// 3) Tidak ada salt dan raw hashing → rawan brute force.
