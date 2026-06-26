import type { Department, Employee, Attendance, Leave, User } from "./types";

// ── Department ─────────────────────────────────────────────
export const departments: Department[] = [
  { id: 1, name: "HR", headId: 1 },
  { id: 2, name: "Engineering", headId: 3 },
  { id: 3, name: "Marketing", headId: 5 },
  { id: 4, name: "Finance", headId: 7 },
];

// ── Employee ───────────────────────────────────────────────
// ID mulai dari 101 (legacy)
export const employees: Employee[] = [
  { id: 101, name: "Sari Dewi", email: "sari@company.com", departmentId: 1, position: "HR Manager", joinDate: "2020-03-15", isActive: true },
  { id: 102, name: "Budi Santoso", email: "budi@company.com", departmentId: 1, position: "HR Staff", joinDate: "2021-06-01", isActive: true },
  { id: 103, name: "Andi Pratama", email: "andi@company.com", departmentId: 2, position: "Tech Lead", joinDate: "2019-11-20", isActive: true },
  { id: 104, name: "Rina Wijaya", email: "rina@company.com", departmentId: 2, position: "Frontend Developer", joinDate: "2022-01-10", isActive: true },
  { id: 105, name: "Dimas Adi", email: "dimas@company.com", departmentId: 3, position: "Marketing Lead", joinDate: "2020-08-05", isActive: true },
  { id: 106, name: "Fitri Handayani", email: "fitri@company.com", departmentId: 3, position: "Content Writer", joinDate: "2022-03-22", isActive: true },
  { id: 107, name: "Agus Wirawan", email: "agus@company.com", departmentId: 4, position: "Finance Manager", joinDate: "2018-07-14", isActive: true },
  { id: 108, name: "Dewi Lestari", email: "dewi@company.com", departmentId: 4, position: "Accountant", joinDate: "2021-10-01", isActive: true },
  { id: 109, name: "Rizky Fauzi", email: "rizky@company.com", departmentId: 2, position: "Backend Developer", joinDate: "2023-05-15", isActive: false },
];

// ── Attendance ─────────────────────────────────────────────
export const attendances: Attendance[] = [
  { id: 1, employeeId: 101, date: "2024-01-15", clockIn: "08:00", clockOut: "17:00", status: "present", note: "" },
  { id: 2, employeeId: 102, date: "2024-01-15", clockIn: "08:45", clockOut: "17:00", status: "late", note: "Macet" },
  { id: 3, employeeId: 103, date: "2024-01-15", clockIn: "07:55", clockOut: "17:00", status: "present", note: "" },
  { id: 4, employeeId: 104, date: "2024-01-15", clockIn: "09:15", clockOut: "17:30", status: "late", note: "Dokter gigi" },
  { id: 5, employeeId: 105, date: "2024-01-15", clockIn: "07:50", clockOut: "16:30", status: "present", note: "" },
  { id: 6, employeeId: 106, date: "2024-01-15", clockIn: "", clockOut: null, status: "absent", note: "Sakit (konfirmasi WA)" },
  { id: 7, employeeId: 107, date: "2024-01-15", clockIn: "08:00", clockOut: "17:00", status: "present", note: "" },
  { id: 8, employeeId: 108, date: "2024-01-15", clockIn: "", clockOut: null, status: "leave", note: "Cuti tahunan" },
  { id: 9, employeeId: 101, date: "2024-01-16", clockIn: "08:05", clockOut: "17:00", status: "present", note: "" },
  { id: 10, employeeId: 103, date: "2024-01-16", clockIn: "07:50", clockOut: "17:00", status: "present", note: "" },
  { id: 11, employeeId: 105, date: "2024-01-16", clockIn: "", clockOut: null, status: "absent", note: "Dinas luar" },
  { id: 12, employeeId: 108, date: "2024-01-16", clockIn: "", clockOut: null, status: "leave", note: "Cuti tahunan" },
];

// ── Leave ──────────────────────────────────────────────────
export const leaves: Leave[] = [
  { id: 1, employeeId: 106, startDate: "2024-01-15", endDate: "2024-01-16", type: "sick", status: "approved", reason: "Demam tinggi", approvedBy: 101, createdAt: "2024-01-14T09:00:00Z" },
  { id: 2, employeeId: 108, startDate: "2024-01-15", endDate: "2024-01-19", type: "annual", status: "approved", reason: "Liburan keluarga", approvedBy: 107, createdAt: "2024-01-10T14:00:00Z" },
  { id: 3, employeeId: 104, startDate: "2024-02-01", endDate: "2024-02-01", type: "personal", status: "pending", reason: "Acara keluarga", approvedBy: null, createdAt: "2024-01-20T10:00:00Z" },
  { id: 4, employeeId: 102, startDate: "2024-02-10", endDate: "2024-02-12", type: "annual", status: "pending", reason: "Liburan", approvedBy: null, createdAt: "2024-01-22T08:00:00Z" },
];

// ── User ───────────────────────────────────────────────────
export const users: User[] = [
  { id: 1, email: "admin@company.com", name: "System Admin", passwordHash: "hashed_admin123", role: "admin", employeeId: null },
  { id: 2, email: "sari@company.com", name: "Sari Dewi", passwordHash: "hashed_hr456", role: "hr", employeeId: 101 },
  { id: 3, email: "andi@company.com", name: "Andi Pratama", passwordHash: "hashed_tech789", role: "employee", employeeId: 103 },
  { id: 4, email: "rina@company.com", name: "Rina Wijaya", passwordHash: "hashed_rina321", role: "employee", employeeId: 104 },
];

// ── ID Counters ────────────────────────────────────────────
export let nextEmployeeId = 110;
export let nextAttendanceId = 13;
export let nextLeaveId = 5;
export let nextUserId = 5;

// ── Auth Session ───────────────────────────────────────────
export const sessions = new Map<string, { userId: number; token: string; createdAt: Date }>();
