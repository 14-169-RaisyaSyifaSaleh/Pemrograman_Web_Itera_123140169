// Ambil elemen DOM
const inputJudul = document.querySelector("#taskName");
const inputMatkul = document.querySelector("#courseName");
const inputTenggat = document.querySelector("#deadline");
const tombolTambah = document.querySelector("#addTaskBtn");
const daftarTugas = document.querySelector("#taskList");
const pilihStatus = document.querySelector("#filterStatus");
const cariMatkul = document.querySelector("#filterCourse");
const jumlahTugas = document.querySelector("#taskCount");

const modalEdit = document.querySelector("#editModal");
const fieldNamaEdit = document.querySelector("#editName");
const fieldMatkulEdit = document.querySelector("#editCourse");
const fieldDeadlineEdit = document.querySelector("#editDeadline");
const tombolSimpanEdit = document.querySelector("#saveEdit");
const tombolBatalEdit = document.querySelector("#cancelEdit");

let dataTugas = JSON.parse(localStorage.getItem("dataTugas")) || [];
let indeksEditAktif = null;

// Simpan perubahan ke localStorage
function simpanKeStorage() {
  localStorage.setItem("dataTugas", JSON.stringify(dataTugas));
}

// Tampilkan daftar tugas ke halaman
function tampilkanTugas() {
  daftarTugas.innerHTML = "";

  const filterStatus = pilihStatus.value;
  const keywordMatkul = cariMatkul.value.toLowerCase();

  const hasilFilter = dataTugas.filter((item) => {
    const cocokStatus =
      filterStatus === "all" ||
      (filterStatus === "pending" && !item.selesai) ||
      (filterStatus === "completed" && item.selesai);
    const cocokMatkul = item.matkul.toLowerCase().includes(keywordMatkul);
    return cocokStatus && cocokMatkul;
  });

  if (hasilFilter.length === 0) {
    daftarTugas.innerHTML =
      '<p style="text-align:center;color:#666;">Belum ada tugas yang sesuai.</p>';
  }

  hasilFilter.forEach((tugas, index) => {
    const elemen = document.createElement("div");
    elemen.className = "task-card";
    if (tugas.selesai) elemen.classList.add("completed");

    elemen.innerHTML = `
      <div class="task-info">
        <h3>${tugas.judul}</h3>
        <p>${tugas.matkul}</p>
        <p>Deadline: ${tugas.tenggat}</p>
      </div>
      <div class="task-actions">
        <button onclick="ubahStatus(${index})">${
      tugas.selesai ? "Batal" : "Selesai"
    }</button>
        <button onclick="bukaModalEdit(${index})">Edit</button>
        <button onclick="hapusTugas(${index})">Hapus</button>
      </div>
    `;
    daftarTugas.appendChild(elemen);
  });

  const belumSelesai = dataTugas.filter((t) => !t.selesai).length;
  jumlahTugas.textContent = `Tugas Belum Selesai: ${belumSelesai}`;
}

// Tambah data tugas baru
tombolTambah.addEventListener("click", () => {
  const judul = inputJudul.value.trim();
  const matkul = inputMatkul.value.trim();
  const tenggat = inputTenggat.value;

  if (!judul || !matkul || !tenggat) {
    alert("Semua kolom wajib diisi!");
    return;
  }

  dataTugas.push({
    judul,
    matkul,
    tenggat,
    selesai: false,
  });

  simpanKeStorage();
  tampilkanTugas();

  // Reset input
  inputJudul.value = "";
  inputMatkul.value = "";
  inputTenggat.value = "";
});

// Ubah status selesai/belum
function ubahStatus(index) {
  dataTugas[index].selesai = !dataTugas[index].selesai;
  simpanKeStorage();
  tampilkanTugas();
}

// Hapus tugas
function hapusTugas(index) {
  if (confirm("Apakah kamu yakin ingin menghapus tugas ini?")) {
    dataTugas.splice(index, 1);
    simpanKeStorage();
    tampilkanTugas();
  }
}

// Modal edit tugas
function bukaModalEdit(index) {
  indeksEditAktif = index;
  const tugas = dataTugas[index];
  fieldNamaEdit.value = tugas.judul;
  fieldMatkulEdit.value = tugas.matkul;
  fieldDeadlineEdit.value = tugas.tenggat;
  modalEdit.style.display = "flex";
}

tombolSimpanEdit.addEventListener("click", () => {
  if (indeksEditAktif === null) return;

  dataTugas[indeksEditAktif].judul = fieldNamaEdit.value.trim();
  dataTugas[indeksEditAktif].matkul = fieldMatkulEdit.value.trim();
  dataTugas[indeksEditAktif].tenggat = fieldDeadlineEdit.value;

  simpanKeStorage();
  tampilkanTugas();
  modalEdit.style.display = "none";
});

tombolBatalEdit.addEventListener("click", () => {
  modalEdit.style.display = "none";
});

// Klik di luar modal → tutup
window.addEventListener("click", (e) => {
  if (e.target === modalEdit) modalEdit.style.display = "none";
});

// Filter otomatis
pilihStatus.addEventListener("change", tampilkanTugas);
cariMatkul.addEventListener("input", tampilkanTugas);

// Jalankan saat pertama dibuka
tampilkanTugas();
