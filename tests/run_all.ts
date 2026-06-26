import { execSync } from "child_process";
import * as path from "path";

const tests = [
  { name: "Soal 1 — Normalisasi data", file: "backend/soal_1.ts" },
  { name: "Soal 2 — API absensi & karyawan", file: "backend/soal_2.ts" },
  { name: "Soal 3 — Rekap laporan absensi", file: "backend/soal_3.ts" },
  { name: "Soal 4 — Login & hak akses", file: "backend/soal_4.ts" },
  { name: "Soal 5 — Daftar karyawan", file: "frontend/soal_5.ts" },
  { name: "Soal 6 — Form pengajuan cuti", file: "frontend/soal_6.ts" },
  { name: "Soal 7 — Cari & filter absensi", file: "frontend/soal_7.ts" },
  { name: "Soal 8 — Profil & riwayat", file: "frontend/soal_8.ts" },
];

console.log("=".repeat(50));
console.log("  TEST RUNNER — Semua Soal");
console.log("=".repeat(50));
console.log();

let passed = 0;
let failed = 0;

for (const test of tests) {
  const filePath = path.join(__dirname, "..", test.file);
  process.stdout.write(`▶ ${test.name} ... `);
  try {
    execSync(`npx ts-node "${filePath}"`, { stdio: "pipe", timeout: 30000 });
    console.log(`✅ OK`);
    passed++;
  } catch (err: any) {
    console.log(`❌ GAGAL`);
    const stderr = err.stderr?.toString() || "";
    const lines = stderr.split("\n").slice(-3).join("\n    ");
    if (lines) console.log(`  ${lines}`);
    failed++;
  }
}

console.log();
console.log("─".repeat(50));
console.log(`Hasil: ${passed} passed, ${failed} failed dari ${tests.length} test`);
console.log("─".repeat(50));
