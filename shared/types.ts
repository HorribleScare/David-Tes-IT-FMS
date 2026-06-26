export interface Department {
  id: number;
  name: string;
  headId: number | null;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  departmentId: number;
  position: string;
  joinDate: string;
  isActive: boolean;
}

export type AttendanceStatus = "present" | "late" | "absent" | "leave";
export type LeaveType = "sick" | "personal" | "annual";
export type LeaveStatus = "pending" | "approved" | "rejected";
export type UserRole = "admin" | "hr" | "employee";

export interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  clockIn: string;
  clockOut: string | null;
  status: AttendanceStatus;
  note: string;
}

export interface Leave {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  type: LeaveType;
  status: LeaveStatus;
  reason: string;
  approvedBy: number | null;
  createdAt: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  employeeId: number | null;
}

export type SafeUser = Omit<User, "passwordHash">;

export interface AttendanceSummary {
  employeeId: number;
  employeeName: string;
  department: string;
  totalPresent: number;
  totalLate: number;
  totalAbsent: number;
  totalLeave: number;
  totalDays: number;
}

export interface ApiRequest {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body?: string;
  headers?: Record<string, string>;
}

export interface ApiResponse {
  status: number;
  body: string;
}
