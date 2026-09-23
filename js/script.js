"use strict";
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initNavigation();
  initNotifications();
  initPomodoro();
  initNewNoteForm();
  initNoteDeletion();
  initWeeklyStats();
  initAiAssistant();
  initPlanDeHoy();
  initExamCountdown();
  initNotesFilter();
});

/*  TEMA CLARO / OSCURO */
function initThemeToggle() {
  const STORAGE_KEY = "studify-theme";
  const toggleButtons = document.querySelectorAll(".js-theme-toggle");
  const themeIcons = document.querySelectorAll(".js-theme-icon");

  const applyTheme = (theme) => {
    if (theme !== "light" && theme !== "dark") return 1;
    document.documentElement.setAttribute("data-bs-theme", theme);
    themeIcons.forEach((icon) => {
      icon.classList.toggle("bi-moon-stars", theme === "light");
      icon.classList.toggle("bi-sun-fill", theme === "dark");
    });
    return 0;
  };

  const saveTheme = (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
      return 0;
    } catch (error) {
      return 1;
    }
  };

  // Preferencia guardada, o la del sistema operativo si es la primera visita
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-bs-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      const applyCode = applyTheme(nextTheme);
      if (applyCode !== 0) return;
      saveTheme(nextTheme);
    });
  });
}

/* NAVEGACIÓN
 */
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-pills .nav-link");
  const offcanvasEl = document.getElementById("sidebarOffcanvas");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // Le saco "active" a todos los links (de ambos menús) y se lo
      // pongo solo al que corresponde 
      const targetHref = link.getAttribute("href");
      navLinks.forEach((otherLink) => {
        const isMatch = otherLink.getAttribute("href") === targetHref;
        otherLink.classList.toggle("active", isMatch);
      });

      // Si el link se clickeó dentro del offcanvas, lo cerramos
      if (offcanvasEl && offcanvasEl.contains(link)) {
        const offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
        offcanvasInstance.hide();
      }
    });
  });
}

/*  NOTIFICACIONES
*/
function initNotifications() {
  const notifButtons = document.querySelectorAll(".js-notif-btn");

  notifButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Como hay un botón de notificaciones en desktop y otro en
      // mobile, ocultamos el badge en los dos para que no queden
      // desincronizados.
      document.querySelectorAll(".js-notif-badge").forEach((badge) => {
        badge.classList.add("d-none");
      });
    });
  });
}

/* TEMPORIZADOR POMODORO
*/
function initPomodoro() {
  const STUDY_MINUTES = 25;
  const BREAK_MINUTES = 5;

  const ring = document.getElementById("pomodoroRing");
  const timeLabel = document.getElementById("pomodoroTime");
  const statusLabel = document.getElementById("pomodoroStatus");
  const toggleButton = document.getElementById("btnPomodoroToggle");
  const toggleIcon = document.getElementById("btnPomodoroToggleIcon");
  const toggleLabel = document.getElementById("btnPomodoroToggleLabel");
  const sessionsList = document.getElementById("pomodoroSesionesList");
  const statHours = document.getElementById("statHours");
  const statSessions = document.getElementById("statSessions");

  if (!ring || !toggleButton) return; 

  let isBreak = false;
  let totalSeconds = STUDY_MINUTES * 60;
  let remainingSeconds = totalSeconds;
  let intervalId = null;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const updateDisplay = () => {
    timeLabel.textContent = formatTime(remainingSeconds);
    const progress = (remainingSeconds / totalSeconds) * 100;
    ring.style.setProperty("--progress", progress.toFixed(2));
  };

  const setRunningUI = (running) => {
    toggleIcon.classList.toggle("bi-play-fill", !running);
    toggleIcon.classList.toggle("bi-pause-fill", running);
    toggleLabel.textContent = running ? "Pausar" : "Iniciar";
  };

  const addCompletedSession = () => {
    // La primera vez, reemplazamos el mensaje de "sin sesiones".
    if (sessionsList.children.length === 1 && sessionsList.dataset.empty !== "false") {
      sessionsList.innerHTML = "";
      sessionsList.dataset.empty = "false";
    }

    const time = new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    const item = document.createElement("li");
    item.className = "d-flex align-items-center gap-2 py-1";
    item.innerHTML = `<i class="bi bi-check-circle-fill text-success"></i> Sesión de estudio completada - ${time}`;
    sessionsList.prepend(item);
  };

  const updateStatsAfterSession = () => {
    // Suma 25 minutos (0.42 h aprox.) a las horas de estudio de la semana.
    if (statHours) {
      const currentHours = parseFloat(statHours.textContent) || 0;
      const newHours = currentHours + STUDY_MINUTES / 60;
      statHours.textContent = `${newHours.toFixed(1)} h`;
    }
    if (statSessions) {
      const currentSessions = parseInt(statSessions.textContent, 10) || 0;
      statSessions.textContent = String(currentSessions + 1);
    }
  };

  const switchMode = () => {
    isBreak = !isBreak;
    totalSeconds = (isBreak ? BREAK_MINUTES : STUDY_MINUTES) * 60;
    remainingSeconds = totalSeconds;
    statusLabel.textContent = isBreak ? "Descanso" : "Tiempo de estudio";
    updateDisplay();
  };

  const tick = () => {
    remainingSeconds -= 1;

    if (remainingSeconds < 0) {
      const wasStudySession = !isBreak;
      if (wasStudySession) {
        addCompletedSession();
        updateStatsAfterSession();
      }
      switchMode();
      return;
    }

    updateDisplay();
  };

  const startTimer = () => {
    intervalId = setInterval(tick, 1000);
    setRunningUI(true);
  };

  const pauseTimer = () => {
    clearInterval(intervalId);
    intervalId = null;
    setRunningUI(false);
  };

  toggleButton.addEventListener("click", () => {
    if (intervalId) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  updateDisplay();
}

/*  ALTA DE APUNTES
 */
function initNewNoteForm() {
  const form = document.getElementById("formNuevoApunte");
  const notesList = document.getElementById("notesList");
  const emptyState = document.getElementById("notesEmptyState");
  const statNotes = document.getElementById("statNotes");
  const modalEl = document.getElementById("modalNuevoApunte");

  if (!form || !notesList) return;

  const createNoteElement = (titulo, materia) => {
    const today = new Date().toLocaleDateString("es-AR");

    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center gap-3 px-0";
    li.dataset.subject = materia;
    li.innerHTML = `
      <span class="bg-danger-subtle text-danger rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style="width:40px;height:40px;">
        <i class="bi bi-file-earmark-pdf-fill"></i>
      </span>
      <div class="flex-grow-1">
        <p class="mb-0 fw-semibold small">${titulo}</p>
        <p class="mb-0 text-secondary small">${materia} · Subido el ${today}</p>
      </div>
      <button class="btn btn-sm btn-light border-0 text-secondary js-delete-note" aria-label="Eliminar apunte" title="Eliminar apunte">
        <i class="bi bi-trash3"></i>
      </button>
    `;
    return li;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const tituloInput = document.getElementById("apunteTitulo");
    const materiaInput = document.getElementById("apunteMateria");
    const titulo = tituloInput.value.trim();
    const materia = materiaInput.value.trim();

    if (!titulo || !materia) return; 

    notesList.prepend(createNoteElement(titulo, materia));
    emptyState.classList.add("d-none");

    if (statNotes) {
      const current = parseInt(statNotes.textContent, 10) || 0;
      statNotes.textContent = String(current + 1);
    }

    form.reset();

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.hide();
  });
}

/* BAJA DE APUNTES */
function initNoteDeletion() {
  const notesList = document.getElementById("notesList");
  const emptyState = document.getElementById("notesEmptyState");
  const statNotes = document.getElementById("statNotes");

  if (!notesList) return;

  notesList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".js-delete-note");
    if (!deleteButton) return;

    const noteItem = deleteButton.closest(".list-group-item");
    if (!noteItem) return;

    // Pequeña animación de salida antes de sacar el elemento del DOM.
    noteItem.classList.add("note-removing");
    noteItem.addEventListener(
      "transitionend",
      () => {
        noteItem.remove();

        if (statNotes) {
          const current = parseInt(statNotes.textContent, 10) || 0;
          statNotes.textContent = String(Math.max(current - 1, 0));
        }

        if (notesList.children.length === 0) {
          emptyState.classList.remove("d-none");
        }
      },
      { once: true }
    );
  });
}

/* ESTADÍSTICAS SEMANALES
*/
function initWeeklyStats() {
  const select = document.getElementById("weeklyPeriodSelect");
  const chart = document.getElementById("weeklyChartBars");
  const totalLabel = document.getElementById("weeklyTotalHours");

  if (!select || !chart) return;

  // Horas de estudio por día, según el período elegido.
  const DATASETS = {
    actual: { Lun: 3, Mar: 4.5, Mié: 5.5, Jue: 4.8, Vie: 3.5, Sáb: 1.5, Dom: 0.3 },
    anterior: { Lun: 2.5, Mar: 3, Mié: 4, Jue: 3.8, Vie: 4.2, Sáb: 2, Dom: 1 },
    mes: { Lun: 3.6, Mar: 3.9, Mié: 4.2, Jue: 4, Vie: 3.4, Sáb: 2.2, Dom: 1.1 },
  };

  const bars = chart.querySelectorAll(".weekly-chart-bar");

  const renderDataset = (datasetKey) => {
    const data = DATASETS[datasetKey] || DATASETS.actual;
    let total = 0;

    bars.forEach((bar) => {
      const day = bar.dataset.day;
      const value = data[day] ?? 0;
      bar.style.setProperty("--valor", value);
      total += value;
    });

    if (totalLabel) {
      totalLabel.textContent = total.toFixed(1);
    }
  };

  select.addEventListener("change", () => renderDataset(select.value));
  renderDataset(select.value);
}

/* ASISTENTE IA
 */
function initAiAssistant() {
  const form = document.getElementById("aiForm");
  const input = document.getElementById("aiInput");
  const chatLog = document.getElementById("aiChatLog");
  const emptyState = document.getElementById("aiChatEmptyState");

  if (!form || !input || !chatLog) return;

  const TIPS = [
    { keywords: ["pomodoro", "concentr", "enfoc"], reply: "El método Pomodoro funciona mejor con bloques de 25 minutos de estudio y 5 de descanso. ¡Probá iniciar uno desde la tarjeta de Pomodoro!" },
    { keywords: ["examen", "parcial", "evalu"], reply: "Para preparar un examen, te recomiendo repasar tus apuntes con la técnica de repetición espaciada: repasalos hoy, en 2 días y en una semana." },
    { keywords: ["apunte", "resumen", "nota"], reply: "Podés crear un nuevo apunte con el botón \"Nuevo Apunte\" de arriba, y organizarlo por materia para encontrarlo más fácil después." },
    { keywords: ["dormir", "descans", "cansad"], reply: "Descansar bien es clave para estudiar: intentá dormir al menos 7-8 horas y usar las pausas del Pomodoro para despejarte." },
  ];

  const getReplyFor = (message) => {
    const normalized = message.toLowerCase();
    const match = TIPS.find((tip) => tip.keywords.some((keyword) => normalized.includes(keyword)));
    return match
      ? match.reply
      : "Todavía estoy aprendiendo sobre ese tema. Mientras tanto, ¿querés que te sugiera una técnica de estudio o te ayude a organizar tus apuntes?";
  };

  const appendMessage = (text, author) => {
    const bubble = document.createElement("div");
    bubble.className = `ai-chat-bubble ai-chat-bubble--${author}`;
    bubble.textContent = text;
    chatLog.appendChild(bubble);
    chatLog.scrollTop = chatLog.scrollHeight;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = input.value.trim();
    if (!message) return;

    if (emptyState) emptyState.classList.add("d-none");

    appendMessage(message, "user");
    input.value = "";
    input.focus();

    // Simula el tiempo de "pensado" de la IA antes de responder.
    window.setTimeout(() => {
      appendMessage(getReplyFor(message), "bot");
    }, 500);
  });
}

/* PLAN DE HOY */
function initPlanDeHoy() {
  const fechaLabel = document.getElementById("planDeHoyFecha");
  const list = document.getElementById("planDeHoyList");
  const progressBar = document.getElementById("planDeHoyProgressBar");
  const resumenBadge = document.getElementById("planDeHoyResumen");

  if (!list || !progressBar || !resumenBadge) return;

  // Fecha de hoy, con el primer carácter en mayúscula ("Miércoles, 23...").
  if (fechaLabel) {
    const hoy = new Date().toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    fechaLabel.textContent = hoy.charAt(0).toUpperCase() + hoy.slice(1);
  }

  const checkboxes = list.querySelectorAll(".js-plan-check");

  const updateProgress = () => {
    const total = checkboxes.length;
    const completadas = list.querySelectorAll(".js-plan-check:checked").length;
    const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;

    progressBar.style.width = `${porcentaje}%`;
    progressBar.closest(".progress").setAttribute("aria-valuenow", String(porcentaje));
    resumenBadge.textContent = `${completadas} de ${total} completadas`;

    // Cuando se completa todo el plan, la barra pasa a verde.
    progressBar.classList.toggle("bg-success", porcentaje === 100);
  };

  list.addEventListener("change", (event) => {
    const checkbox = event.target.closest(".js-plan-check");
    if (!checkbox) return;

    const label = list.querySelector(`label[for="${checkbox.id}"]`);
    if (label) {
      label.classList.toggle("text-decoration-line-through", checkbox.checked);
      label.classList.toggle("text-secondary", checkbox.checked);
    }

    updateProgress();
  });

  updateProgress();
}

/* CONTADOR DE DÍAS PARA LOS PRÓXIMOS EXÁMENES
   */
function initExamCountdown() {
  const examCards = document.querySelectorAll(".js-exam-card");
  if (!examCards.length) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  examCards.forEach((card) => {
    const badge = card.querySelector(".js-exam-countdown");
    const examDate = new Date(`${card.dataset.examDate}T00:00:00`);
    const diffDays = Math.round((examDate - today) / MS_PER_DAY);

    if (!badge) return;

    badge.classList.remove("bg-secondary-subtle", "text-secondary", "bg-warning-subtle", "text-warning", "bg-danger-subtle", "text-danger");

    if (diffDays < 0) {
      badge.textContent = "Rendido";
      badge.classList.add("bg-secondary-subtle", "text-secondary");
    } else if (diffDays === 0) {
      badge.textContent = "¡Es hoy!";
      badge.classList.add("bg-danger-subtle", "text-danger");
    } else if (diffDays <= 7) {
      badge.textContent = `En ${diffDays} día${diffDays === 1 ? "" : "s"}`;
      badge.classList.add("bg-danger-subtle", "text-danger");
    } else if (diffDays <= 15) {
      badge.textContent = `En ${diffDays} días`;
      badge.classList.add("bg-warning-subtle", "text-warning");
    } else {
      badge.textContent = `En ${diffDays} días`;
      badge.classList.add("bg-secondary-subtle", "text-secondary");
    }
  });
}

/* FILTRO DE "MIS APUNTES" POR MATERIA */
function initNotesFilter() {
  const filterGroup = document.getElementById("notesFilterGroup");
  const notesGrid = document.getElementById("allNotesGrid");
  const emptyState = document.getElementById("allNotesEmptyState");

  if (!filterGroup || !notesGrid) return;

  const filterButtons = filterGroup.querySelectorAll(".js-notes-filter");
  const noteCards = notesGrid.querySelectorAll(".js-note-card");

  const applyFilter = (subject) => {
    let visibleCount = 0;

    noteCards.forEach((card) => {
      const matches = subject === "todas" || card.dataset.subject === subject;
      card.classList.toggle("d-none", !matches);
      if (matches) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.classList.toggle("d-none", visibleCount > 0);
    }
  };

  filterGroup.addEventListener("click", (event) => {
    const button = event.target.closest(".js-notes-filter");
    if (!button) return;

    filterButtons.forEach((btn) => {
      btn.classList.remove("btn-primary", "active");
      btn.classList.add("btn-outline-primary");
    });
    button.classList.remove("btn-outline-primary");
    button.classList.add("btn-primary", "active");

    applyFilter(button.dataset.filter);
  });
}


/* MODO FOCO */
function initFocusMode() {
  const overlay = document.getElementById("focusMode");
  const openButtons = document.querySelectorAll(".js-focus-mode");
  const closeButtons = document.querySelectorAll(".js-focus-close");
  const timerButton = document.querySelector(".js-focus-timer");
  const timeLabel = document.getElementById("focusTime");
  const progress = overlay ? overlay.querySelector(".focus-progress span") : null;

  if (!overlay || !openButtons.length) return;

  let seconds = 25 * 60;
  let intervalId = null;

  const render = () => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (timeLabel) {
      timeLabel.textContent = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    if (progress) {
      progress.style.transform = `scaleX(${seconds / (25 * 60)})`;
    }
  };

  const stop = () => {
    clearInterval(intervalId);
    intervalId = null;
    if (timerButton) {
      timerButton.innerHTML = '<i class="bi bi-play-fill"></i> Empezar sesión';
    }
  };

  const reset = () => {
    stop();
    seconds = 25 * 60;
    render();
  };

  const close = () => {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("studify-focus-active");
    reset();
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("studify-focus-active");
      render();
    });
  });

  closeButtons.forEach((button) => button.addEventListener("click", close));

  timerButton?.addEventListener("click", () => {
    if (intervalId) {
      stop();
      return;
    }

    timerButton.innerHTML = '<i class="bi bi-pause-fill"></i> Pausar sesión';
    intervalId = setInterval(() => {
      seconds -= 1;
      render();

      if (seconds <= 0) {
        stop();
        seconds = 0;
        render();
        timerButton.innerHTML = '<i class="bi bi-check-lg"></i> Sesión completada';
      }
    }, 1000);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      close();
    }
  });

  render();
}
