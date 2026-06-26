import { employees, attendances } from "./shared/store";

function loadModules(): { soal2: any; soal4: any; soal8: any } {
  const log = console.log;
  console.log = () => {};
  const s2 = require("./backend/soal_2");
  require("./backend/soal_1");
  require("./backend/soal_3");
  const s4 = require("./backend/soal_4");
  const s8 = require("./frontend/soal_8");
  console.log = log;
  return { soal2: s2, soal4: s4, soal8: s8 };
}

function checkAll() {
  const { soal2, soal4, soal8 } = loadModules();

  let passed = 0;
  let total = 6;

  console.log("Verifikasi Sistem Absensi\n");

  // 1. Store
  const storeOk = employees.length > 0 && attendances.length > 0;
  console.log(`${storeOk ? "PASS" : "FAIL"} [1/6] Data store`);
  if (storeOk) passed++;

  // 2. POST /employees
  let postEmpOk = false;
  try {
    const fn = soal2.handleRequest;
    if (typeof fn === "function") {
      const res = fn({ method: "POST", path: "/employees", body: '{"name":"X","email":"x@c.com","departmentId":1,"position":"X"}', headers: {} });
      postEmpOk = res && typeof res.status === "number" && res.status !== 501;
    }
  } catch {}
  console.log(`${postEmpOk ? "PASS" : "FAIL"} [2/6] POST /employees`);
  if (postEmpOk) passed++;

  // 3. POST /attendances
  let postAttOk = false;
  try {
    const fn = soal2.handleRequest;
    if (typeof fn === "function") {
      const res = fn({ method: "POST", path: "/attendances", body: '{"employeeId":101,"date":"2024-06-01","status":"present","clockIn":"08:00"}', headers: {} });
      postAttOk = res && typeof res.status === "number" && res.status !== 501;
    }
  } catch {}
  console.log(`${postAttOk ? "PASS" : "FAIL"} [3/6] POST /attendances`);
  if (postAttOk) passed++;

  // 4. Login
  let loginOk = false;
  try {
    const fn = soal4.login;
    if (typeof fn === "function") {
      const result = fn("sari@company.com", "hr456");
      loginOk = result && typeof result === "object" && typeof result.token === "string";
    }
  } catch {}
  console.log(`${loginOk ? "PASS" : "FAIL"} [4/6] Login`);
  if (loginOk) passed++;

  // 5. Auth header
  let headerOk = false;
  try {
    const fn = soal8.getAuthHeaders;
    if (typeof fn === "function") {
      const h = fn("test-token");
      headerOk = h &&
        typeof h["Authorization"] === "string" &&
        h["Authorization"].includes("Bearer ") &&
        h["X-Auth-Token"] === "test-token";
    }
  } catch {}
  console.log(`${headerOk ? "PASS" : "FAIL"} [5/6] Auth header`);
  if (headerOk) passed++;

  // 6. Tipe ID
  const typesOk = employees.every((e) => typeof e.id === "number") &&
                  attendances.every((a) => typeof a.employeeId === "number");
  console.log(`${typesOk ? "PASS" : "FAIL"} [6/6] Tipe ID`);
  if (typesOk) passed++;

  console.log(`\n${passed}/${total} lolos`);
  if (passed === total) {
    console.log("\nBackend dan frontend terintegrasi penuh.");
  }
}

checkAll();
