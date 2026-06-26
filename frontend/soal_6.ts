// ============================================================
// SOAL 6 (Frontend) — "Form Pengajuan Cuti"
// ============================================================
//
// 🎯 GAMBARAN:
// Karyawan mau ngajuin cuti lewat form. Kamu bikin form
// dengan validasi di sisi client (browser), sebelum data
// dikirim ke API.
//
// ============================================================

import type { LeaveType } from "../shared/types";

// ═══════════════════════════════════════════════════════════
// TUGAS KAMU:
// ═══════════════════════════════════════════════════════════
//
// 1. validateLeaveForm(data) → { valid, errors }
//
//    Validasi:
//    - leaveType: wajib dipilih
//    - startDate: wajib diisi
//    - endDate: wajib diisi, harus >= startDate
//    - reason: wajib, minimal 10 karakter (setelah trim)
//
//    Kalau semua lolos → { valid: true, errors: {} }
//    Kalau ada yang gagal → { valid: false, errors: { field: "pesan" } }
//
// 2. renderLeaveForm() → string HTML
//
//    Field:
//    - Dropdown tipe cuti (Sakit / Pribadi / Tahunan)
//    - Input tanggal mulai
//    - Input tanggal selesai
//    - Textarea alasan
//    - Tombol submit
//
// 3. calculateLeaveDays(startDate, endDate) → number
//
//    Hitung jumlah hari cuti (inklusif).
//    Contoh: 2024-02-01 sampai 2024-02-03 = 3 hari
//
// 4. renderSuccessMessage(leaveType, days) → string HTML
//
//    Contoh: "✅ Cuti Sakit (3 hari) berhasil diajukan!"
// ═══════════════════════════════════════════════════════════

interface LeaveFormData {
  leaveType: LeaveType | null;
  startDate: string;
  endDate: string;
  reason: string;
}

interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

function validateLeaveForm(data: LeaveFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.leaveType) {
    errors.leaveType = "Pilih tipe cuti";
  }

  if (!data.startDate) {
    errors.startDate = "Tanggal mulai wajib diisi";
  }

  if (!data.endDate) {
    errors.endDate = "Tanggal selesai wajib diisi";
  }

  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    errors.endDate = "Tanggal selesai harus >= tanggal mulai";
  }

  if (!data.reason || data.reason.trim().length < 10) {
    errors.reason = "Alasan minimal 10 karakter";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

function renderLeaveForm(): string {
  return `
    <form id="leave-form">
      <h2>Form Pengajuan Cuti</h2>

      <label>Tipe Cuti</label>
      <select name="leaveType">
        <option value="">Pilih</option>
        <option value="Sakit">Sakit</option>
        <option value="Pribadi">Pribadi</option>
        <option value="Tahunan">Tahunan</option>
      </select>

      <label>Tanggal Mulai</label>
      <input type="date" name="startDate" />

      <label>Tanggal Selesai</label>
      <input type="date" name="endDate" />

      <label>Alasan</label>
      <textarea name="reason"></textarea>

      <button type="submit">Ajukan Cuti</button>
    </form>
  `;
}

function calculateLeaveDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function renderSuccessMessage(leaveType: string, days: number): string {
  return `
    <div class="success">
      ✅ Cuti ${leaveType} (${days} hari) berhasil diajukan!
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// PERTANYAAN WAJIB — jawab di komentar bawah:
// ═══════════════════════════════════════════════════════════
//
// Q1: Validasi dikerjakan di CLIENT (browser) dan juga di
//     SERVER (soal 2). Apakah ini duplikasi yang sia-sia?
//
// Q2: calculateLeaveDays hitung SEMUA hari (termasuk Sabtu-
//     Minggu). Ada yg bilang harus hitung hari kerja aja.
//     Mana yang benar? Jelaskan.
//
// Q3: Form ngirim data ke API. Nama field di form mungkin
//     beda sama yang diharapkan API. Siapa yang harus
//     menyesuaikan? Frontend atau backend?
// ═══════════════════════════════════════════════════════════

// JAWABAN Q1:
// [Bukan duplikasi sia-sia. Client validation untuk UX agar cepat dan tidak perlu request ke server,
// sedangkan server validation untuk keamanan dan memastikan data benar. Keduanya wajib.]

// JAWABAN Q2:
// [Tergantung aturan bisnis. Kalau cuti dihitung kalender, semua hari termasuk weekend. Kalau cuti kerja,
// biasanya hanya hari kerja. Yang paling benar adalah mengikuti aturan perusahaan atau sistem yang dipakai.]

// JAWABAN Q3:
// [Backend yang menentukan standar data. Frontend harus menyesuaikan API karena backend adalah source of
// truth, tapi idealnya keduanya pakai kontrak API yang jelas (misalnya OpenAPI).]
