import { execSync } from "child_process";
import * as path from "path";

const soalFiles = [
  "backend/soal_1.ts",
  "backend/soal_2.ts",
  "backend/soal_3.ts",
  "backend/soal_4.ts",
  "frontend/soal_5.ts",
  "frontend/soal_6.ts",
  "frontend/soal_7.ts",
  "frontend/soal_8.ts",
];

console.log("=".repeat(55));
console.log("  HOME TEST — Fullstack Software Engineer");
console.log("  TypeScript Syntax Checker");
console.log("=".repeat(55));
console.log();
console.log("🔍 Mengecek semua file soal...\n");

let allOk = true;

for (const file of soalFiles) {
  const filePath = path.join(__dirname, file);
  try {
    execSync(`npx tsc --noEmit --strict ${file}`, {
    stdio: "pipe",
  });
    console.log(`  ✅ ${file} — OK`);
  } catch (err: any) {
    const output = err.stdout?.toString() || err.stderr?.toString() || "";
    const lines = output
      .split("\n")
      .filter((l: string) => l.includes(file) && l.includes("error"))
      .slice(0, 3);

    if (lines.length > 0) {
      console.log(`  ❌ ${file} — TYPE ERROR:`);
      lines.forEach((l: string) => console.log(`     ${l.trim()}`));
      allOk = false;
    } else {
      console.log(`  ✅ ${file} — OK (syntax valid)`);
    }
  }
}

console.log();
if (allOk) {
  console.log("✅ Semua file valid. Siap untuk submit!");
} else {
  console.log("❌ Ada type error. Perbaiki dulu sebelum submit.");
}

console.log();
console.log("─".repeat(55));
console.log("Untuk run setiap soal:");
console.log("  Backend:");
console.log("    npm run be1   (Soal 1 - Schema & Data Store)");
console.log("    npm run be2   (Soal 2 - API Handlers)");
console.log("    npm run be3   (Soal 3 - Data Aggregation)");
console.log("    npm run be4   (Soal 4 - Auth & Middleware)");
console.log("  Frontend:");
console.log("    npm run fe    (Soal 5-8 di browser via Vite)");
console.log("  Verifikasi:");
console.log("    npm run verify  (Integration checker)");
console.log("  Testing:");
console.log("    npm test");
console.log("  Syntax check:");
console.log("    npm run check");
console.log("─".repeat(55));
