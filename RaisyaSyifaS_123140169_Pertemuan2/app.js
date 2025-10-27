// Kelas Schedule untuk mengelola objek jadwal
class Schedule {
  constructor(id, course, day, start, end, room) {
    this.id = id;
    this.course = course;
    this.day = day;
    this.start = start;
    this.end = end;
    this.room = room;
  }
}

// Kelas Task untuk mengelola objek tugas
class Task {
  constructor(id, title, course, deadline, priority, completed = false) {
    this.id = id;
    this.title = title;
    this.course = course;
    this.deadline = deadline;
    this.priority = priority;
    this.completed = completed;
  }
}

// Kelas Attendance untuk mengelola objek kehadiran
class Attendance {
  constructor(id, course, date, status) {
    this.id = id;
    this.course = course;
    this.date = date;
    this.status = status;
  }
}

// Kelas Dashboard untuk mengelola semua data
class Dashboard {
  constructor() {
    this.schedules = [];
    this.tasks = [];
    this.attendances = [];
  }

  // Method untuk jadwal
  addSchedule(course, day, start, end, room) {
    const schedule = new Schedule(Date.now(), course, day, start, end, room);
    this.schedules.push(schedule);
    return schedule;
  }

  deleteSchedule(id) {
    this.schedules = this.schedules.filter((s) => s.id !== id);
  }

  updateSchedule(id, course, day, start, end, room) {
    const schedule = this.schedules.find((s) => s.id === id);
    if (schedule) {
      schedule.course = course;
      schedule.day = day;
      schedule.start = start;
      schedule.end = end;
      schedule.room = room;
      return schedule;
    }
    return null;
  }

  // Method untuk tugas
  addTask(title, course, deadline, priority, completed = false) {
    const task = new Task(
      Date.now(),
      title,
      course,
      deadline,
      priority,
      completed
    );
    this.tasks.push(task);
    return task;
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  updateTask(id, title, course, deadline, priority, completed) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.title = title;
      task.course = course;
      task.deadline = deadline;
      task.priority = priority;
      task.completed = completed;
      return task;
    }
    return null;
  }

  toggleTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      return task.completed;
    }
    return false;
  }

  // Method untuk kehadiran
  addAttendance(course, date, status) {
    const attendance = new Attendance(Date.now(), course, date, status);
    this.attendances.push(attendance);
    return attendance;
  }

  deleteAttendance(id) {
    this.attendances = this.attendances.filter((a) => a.id !== id);
  }

  updateAttendance(id, course, date, status) {
    const attendance = this.attendances.find((a) => a.id === id);
    if (attendance) {
      attendance.course = course;
      attendance.date = date;
      attendance.status = status;
      return attendance;
    }
    return null;
  }

  // Method untuk statistik
  getStats() {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter((t) => t.completed).length;
    const totalAttendances = this.attendances.length;
    const presentAttendances = this.attendances.filter(
      (a) => a.status === "hadir"
    ).length;
    const attendanceRate =
      totalAttendances > 0
        ? Math.round((presentAttendances / totalAttendances) * 100)
        : 0;

    return {
      totalSchedules: this.schedules.length,
      totalTasks,
      completedTasks,
      attendanceRate,
    };
  }
}

// Inisialisasi dashboard
const dashboard = new Dashboard();

// Arrow function untuk menyimpan ke localStorage
const saveToStorage = async () => {
  try {
    const data = {
      schedules: dashboard.schedules,
      tasks: dashboard.tasks,
      attendances: dashboard.attendances,
    };
    localStorage.setItem("dashboardData", JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving data:", error);
    showToast("Gagal menyimpan data", "error");
    return false;
  }
};

// Arrow function untuk memuat dari localStorage
const loadFromStorage = async () => {
  try {
    const data = localStorage.getItem("dashboardData");
    if (data) {
      const parsed = JSON.parse(data);
      dashboard.schedules = parsed.schedules || [];
      dashboard.tasks = parsed.tasks || [];
      dashboard.attendances = parsed.attendances || [];
    }
    return true;
  } catch (error) {
    console.error("Error loading data:", error);
    showToast("Gagal memuat data", "error");
    return false;
  }
};

// Arrow function untuk menampilkan notifikasi
const showToast = (message, type = "success") => {
  const toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = "toast";

  const bgColor =
    type === "success" ? "#d4edda" : type === "error" ? "#f8d7da" : "#d1ecf1";
  const textColor =
    type === "success" ? "#155724" : type === "error" ? "#721c24" : "#0c5460";

  toast.style.backgroundColor = bgColor;
  toast.style.color = textColor;
  toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${
              type === "success"
                ? "check-circle"
                : type === "error"
                ? "x-circle"
                : "info-circle"
            } me-2"></i>
            <span>${message}</span>
        </div>
    `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideIn 0.3s ease reverse";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Arrow function untuk render jadwal
const renderSchedules = () => {
  const scheduleList = document.getElementById("schedule-list");
  if (!scheduleList) return;

  if (dashboard.schedules.length === 0) {
    scheduleList.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-calendar-x" style="font-size: 3rem;"></i>
                <p>Belum ada jadwal</p>
            </div>
        `;
    return;
  }

  // Menggunakan template literals untuk rendering dinamis
  scheduleList.innerHTML = dashboard.schedules
    .map(
      (schedule) => `
        <div class="schedule-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="d-flex align-items-center mb-2">
                        <span class="time-badge me-2">${schedule.start} - ${schedule.end}</span>
                        <strong>${schedule.course}</strong>
                    </div>
                    <div class="text-muted">
                        <i class="bi bi-calendar3"></i> ${schedule.day} | 
                        <i class="bi bi-geo-alt"></i> ${schedule.room}
                    </div>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-primary btn-action edit-schedule" data-id="${schedule.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-action delete-schedule" data-id="${schedule.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  // Event listeners untuk tombol
  document.querySelectorAll(".edit-schedule").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.dataset.id);
      const schedule = dashboard.schedules.find((s) => s.id === id);
      if (schedule) {
        document.getElementById("scheduleId").value = schedule.id;
        document.getElementById("scheduleCourse").value = schedule.course;
        document.getElementById("scheduleDay").value = schedule.day;
        document.getElementById("scheduleStart").value = schedule.start;
        document.getElementById("scheduleEnd").value = schedule.end;
        document.getElementById("scheduleRoom").value = schedule.room;
        new bootstrap.Modal(document.getElementById("scheduleModal")).show();
      }
    });
  });

  document.querySelectorAll(".delete-schedule").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const id = parseInt(this.dataset.id);
      if (confirm("Hapus jadwal ini?")) {
        dashboard.deleteSchedule(id);
        await saveToStorage();
        renderSchedules();
        updateStats();
        showToast("Jadwal dihapus");
      }
    });
  });
};

// Arrow function untuk render tugas
const renderTasks = () => {
  const taskList = document.getElementById("task-list");
  if (!taskList) return;

  if (dashboard.tasks.length === 0) {
    taskList.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-clipboard-x" style="font-size: 3rem;"></i>
                <p>Belum ada tugas</p>
            </div>
        `;
    return;
  }

  // Menggunakan template literals untuk rendering dinamis
  taskList.innerHTML = dashboard.tasks
    .map(
      (task) => `
        <div class="task-item ${task.completed ? "task-completed" : ""}">
            <div class="d-flex justify-content-between align-items-center">
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center mb-2">
                        <div class="form-check me-3">
                            <input class="form-check-input task-checkbox" type="checkbox" 
                                   data-id="${task.id}" ${
        task.completed ? "checked" : ""
      }>
                        </div>
                        <strong>${task.title}</strong>
                        <span class="priority-badge priority-${
                          task.priority
                        } ms-2">
                            ${
                              task.priority === "high"
                                ? "Tinggi"
                                : task.priority === "medium"
                                ? "Sedang"
                                : "Rendah"
                            }
                        </span>
                    </div>
                    <div class="text-muted">
                        <i class="bi bi-book"></i> ${task.course} | 
                        <i class="bi bi-calendar-event"></i> ${task.deadline}
                    </div>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-primary btn-action edit-task" data-id="${
                      task.id
                    }">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-action delete-task" data-id="${
                      task.id
                    }">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  // Event listeners untuk checkbox
  document.querySelectorAll(".task-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", async function () {
      const id = parseInt(this.dataset.id);
      const completed = dashboard.toggleTask(id);
      await saveToStorage();
      renderTasks();
      updateStats();
      showToast(completed ? "Tugas selesai" : "Tugas belum selesai");
    });
  });

  // Event listeners untuk tombol edit
  document.querySelectorAll(".edit-task").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.dataset.id);
      const task = dashboard.tasks.find((t) => t.id === id);
      if (task) {
        document.getElementById("taskId").value = task.id;
        document.getElementById("taskTitle").value = task.title;
        document.getElementById("taskCourse").value = task.course;
        document.getElementById("taskDeadline").value = task.deadline;
        document.getElementById("taskPriority").value = task.priority;
        document.getElementById("taskCompleted").checked = task.completed;
        new bootstrap.Modal(document.getElementById("taskModal")).show();
      }
    });
  });

  // Event listeners untuk tombol hapus
  document.querySelectorAll(".delete-task").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const id = parseInt(this.dataset.id);
      if (confirm("Hapus tugas ini?")) {
        dashboard.deleteTask(id);
        await saveToStorage();
        renderTasks();
        updateStats();
        showToast("Tugas dihapus");
      }
    });
  });
};

// Arrow function untuk render kehadiran
const renderAttendances = () => {
  const attendanceList = document.getElementById("attendance-list");
  if (!attendanceList) return;

  if (dashboard.attendances.length === 0) {
    attendanceList.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-person-x" style="font-size: 3rem;"></i>
                <p>Belum ada data kehadiran</p>
            </div>
        `;
    return;
  }

  // Menggunakan template literals untuk rendering dinamis
  attendanceList.innerHTML = dashboard.attendances
    .map(
      (attendance) => `
        <div class="schedule-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${attendance.course}</strong>
                    <div class="text-muted">
                        <i class="bi bi-calendar3"></i> ${attendance.date} | 
                        <i class="bi bi-person-check"></i> ${
                          attendance.status === "hadir"
                            ? "Hadir"
                            : "Tidak Hadir"
                        }
                    </div>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-danger btn-action delete-attendance" data-id="${
                      attendance.id
                    }">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  // Event listeners untuk tombol hapus
  document.querySelectorAll(".delete-attendance").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const id = parseInt(this.dataset.id);
      if (confirm("Hapus data kehadiran ini?")) {
        dashboard.deleteAttendance(id);
        await saveToStorage();
        renderAttendances();
        updateStats();
        showToast("Data kehadiran dihapus");
      }
    });
  });
};

// Arrow function untuk update statistik
const updateStats = () => {
  const stats = dashboard.getStats();
  const totalSchedulesEl = document.getElementById("total-schedules");
  const totalTasksEl = document.getElementById("total-tasks");
  const completedTasksEl = document.getElementById("completed-tasks");
  const attendanceRateEl = document.getElementById("attendance-rate");

  if (totalSchedulesEl) totalSchedulesEl.textContent = stats.totalSchedules;
  if (totalTasksEl) totalTasksEl.textContent = stats.totalTasks;
  if (completedTasksEl) completedTasksEl.textContent = stats.completedTasks;
  if (attendanceRateEl)
    attendanceRateEl.textContent = stats.attendanceRate + "%";
};

// Event listener untuk save schedule
const setupScheduleForm = () => {
  const saveBtn = document.getElementById("saveSchedule");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", async () => {
    const id = document.getElementById("scheduleId").value;
    const course = document.getElementById("scheduleCourse").value;
    const day = document.getElementById("scheduleDay").value;
    const start = document.getElementById("scheduleStart").value;
    const end = document.getElementById("scheduleEnd").value;
    const room = document.getElementById("scheduleRoom").value;

    if (course && day && start && end && room) {
      if (id) {
        // Update existing
        dashboard.updateSchedule(parseInt(id), course, day, start, end, room);
      } else {
        // Add new
        dashboard.addSchedule(course, day, start, end, room);
      }

      await saveToStorage();
      renderSchedules();
      updateStats();
      bootstrap.Modal.getInstance(
        document.getElementById("scheduleModal")
      ).hide();
      document.getElementById("scheduleForm").reset();
      showToast(id ? "Jadwal diperbarui" : "Jadwal ditambahkan");
    }
  });
};

// Event listener untuk save task
const setupTaskForm = () => {
  const saveBtn = document.getElementById("saveTask");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", async () => {
    const id = document.getElementById("taskId").value;
    const title = document.getElementById("taskTitle").value;
    const course = document.getElementById("taskCourse").value;
    const deadline = document.getElementById("taskDeadline").value;
    const priority = document.getElementById("taskPriority").value;
    const completed = document.getElementById("taskCompleted").checked;

    if (title && course && deadline) {
      if (id) {
        // Update existing
        dashboard.updateTask(
          parseInt(id),
          title,
          course,
          deadline,
          priority,
          completed
        );
      } else {
        // Add new
        dashboard.addTask(title, course, deadline, priority, completed);
      }

      await saveToStorage();
      renderTasks();
      updateStats();
      bootstrap.Modal.getInstance(document.getElementById("taskModal")).hide();
      document.getElementById("taskForm").reset();
      showToast(id ? "Tugas diperbarui" : "Tugas ditambahkan");
    }
  });
};

// Event listener untuk save attendance
const setupAttendanceForm = () => {
  const saveBtn = document.getElementById("saveAttendance");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", async () => {
    const id = document.getElementById("attendanceId").value;
    const course = document.getElementById("attendanceCourse").value;
    const date = document.getElementById("attendanceDate").value;
    const status = document.querySelector(
      'input[name="status"]:checked'
    )?.value;

    if (course && date && status) {
      if (id) {
        // Update existing
        dashboard.updateAttendance(parseInt(id), course, date, status);
      } else {
        // Add new
        dashboard.addAttendance(course, date, status);
      }

      await saveToStorage();
      renderAttendances();
      updateStats();
      bootstrap.Modal.getInstance(
        document.getElementById("attendanceModal")
      ).hide();
      document.getElementById("attendanceForm").reset();
      showToast(id ? "Kehadiran diperbarui" : "Kehadiran dicatat");
    }
  });
};

// Setup form reset ketika modal ditutup
const setupModalReset = () => {
  const scheduleModal = document.getElementById("scheduleModal");
  const taskModal = document.getElementById("taskModal");
  const attendanceModal = document.getElementById("attendanceModal");

  if (scheduleModal) {
    scheduleModal.addEventListener("hidden.bs.modal", () => {
      document.getElementById("scheduleForm").reset();
      document.getElementById("scheduleId").value = "";
    });
  }

  if (taskModal) {
    taskModal.addEventListener("hidden.bs.modal", () => {
      document.getElementById("taskForm").reset();
      document.getElementById("taskId").value = "";
    });
  }

  if (attendanceModal) {
    attendanceModal.addEventListener("hidden.bs.modal", () => {
      document.getElementById("attendanceForm").reset();
      document.getElementById("attendanceId").value = "";
    });
  }
};

// Fungsi async untuk inisialisasi aplikasi
const initApp = async () => {
  try {
    await loadFromStorage();
    renderSchedules();
    renderTasks();
    renderAttendances();
    updateStats();

    // Setup event listeners
    setupScheduleForm();
    setupTaskForm();
    setupAttendanceForm();
    setupModalReset();

    // Set today's date as default for attendance
    const today = new Date().toISOString().split("T")[0];
    const attendanceDateEl = document.getElementById("attendanceDate");
    if (attendanceDateEl) attendanceDateEl.value = today;

    showToast("Aplikasi berhasil dimuat");
  } catch (error) {
    console.error("Error initializing app:", error);
    showToast("Gagal memuat aplikasi", "error");
  }
};

// Jalankan aplikasi ketika DOM siap
document.addEventListener("DOMContentLoaded", initApp);
