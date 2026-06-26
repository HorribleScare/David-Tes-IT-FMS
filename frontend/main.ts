import { renderApp as renderSoal5 } from "./soal_5";
import { renderLeaveForm } from "./soal_6";
import { renderSearchBar, renderAttendanceTable, searchAttendance, filterByDate, filterByStatus } from "./soal_7";
import { renderProfilePage } from "./soal_8";
import { attendances } from "../shared/store";

const NAV_ITEMS = [
  { label: "Daftar Karyawan", soal: 5 },
  { label: "Form Cuti", soal: 6 },
  { label: "Cari Absensi", soal: 7 },
  { label: "Profil Karyawan", soal: 8 },
];

function renderNav() {
  const nav = document.getElementById("nav")!;
  nav.innerHTML = NAV_ITEMS
    .map((item) => `<a href="#" data-soal="${item.soal}">${item.label}</a>`)
    .join("");

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const soal = Number((e.target as HTMLElement).dataset.soal);
      showSoal(soal);
    });
  });
}

function showSoal(soal: number) {
  const app = document.getElementById("app")!;

  switch (soal) {
    case 5:
      app.innerHTML = renderSoal5();
      break;
    case 6:
      app.innerHTML = renderLeaveForm();
      break;
    case 7:
      app.innerHTML = renderSearchBar() + renderAttendanceTable(attendances);
      setupSearchListeners();
      break;
    case 8:
      app.innerHTML = renderProfilePage(101);
      break;
    default:
      app.innerHTML = "<p>Soal tidak dikenal</p>";
  }
}

function setupSearchListeners() {
  const input = document.querySelector<HTMLInputElement>(".search-bar input[type=text]");
  const dateInput = document.querySelector<HTMLInputElement>(".search-bar input[type=date]");
  const statusSelect = document.querySelector<HTMLSelectElement>(".search-bar select");
  const button = document.querySelector<HTMLButtonElement>(".search-bar button");

  if (!input || !dateInput || !statusSelect || !button) return;

  function doSearch() {
    const query = input!.value;
    const date = dateInput!.value;
    const status = statusSelect!.value;
    const searched = searchAttendance(query);
    const byDate = filterByDate(searched, date);
    const filtered = filterByStatus(byDate, status);
    const container = document.getElementById("filter-results");
    if (container) {
      container.innerHTML = renderAttendanceTable(filtered);
    }
  }

  button.addEventListener("click", doSearch);
  input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") doSearch();
  });
}

renderNav();
showSoal(5);
