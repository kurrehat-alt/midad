/**
 * Midad Quran & Arabic Academy - Interactive Logic
 * Features:
 * - 7 Languages Engine with RTL/LTR Switching (TR, EN, FR, DE, IT, RU, AR)
 * - 52 Weekly Rotating Islamic Moral Values Engine
 * - Interactive Calendar Class Appointment System
 * - Student Portal (Login, Demo Login, Upcoming Meet/Zoom Classes, Progress)
 * - Admin Control Panel (Login, Demo Login, Statistics, Reservations Table, Meet/Zoom Link Editor)
 * - Google Meet & Zoom Class Booking with WhatsApp Generator
 * - Course Quick-Select & Auto-Scroll
 * - Mobile Drawer & Accessible Modals
 */

const WHATSAPP_PHONE = "905411021218";

// ==========================================================================
// 1. Languages Configuration
// ==========================================================================
const SUPPORTED_LANGS = ["tr", "en", "fr", "de", "it", "ru", "ar"];
const DEFAULT_LANG = "tr";

const LANG_CONFIG = {
  tr: { name: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  en: { name: "English", flag: "🇬🇧", dir: "ltr" },
  fr: { name: "Français", flag: "🇫🇷", dir: "ltr" },
  de: { name: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  it: { name: "Italiano", flag: "🇮🇹", dir: "ltr" },
  ru: { name: "Русский", flag: "🇷🇺", dir: "ltr" },
  ar: { name: "العربية", flag: "🇸🇦", dir: "rtl" }
};

// ==========================================================================
// 2. Weekly Islamic Values Dictionary (52-Week Cycle)
// ==========================================================================
const WEEKLY_VALUES_MULTILINGUAL = [
  {
    tr: { val: "Doğruluk (Sıdk)", title: "Kimse görmediğinde bile doğru olanı yaparım.", kw1: "Açıklık", kw2: "Güven" },
    en: { val: "Truthfulness (Sidq)", title: "I choose honesty even when nobody is watching.", kw1: "Clarity", kw2: "Trust" },
    fr: { val: "Sincérité (Sidq)", title: "Je suis honnête même quand personne ne me regarde.", kw1: "Clarté", kw2: "Confiance" },
    de: { val: "Wahrhaftigkeit (Sidq)", title: "Ich handle aufrichtig, auch wenn mich niemand sieht.", kw1: "Klarheit", kw2: "Vertrauen" },
    it: { val: "Veridicità (Sidq)", title: "Scelgo la sincerità anche quando nessuno mi guarda.", kw1: "Chiarezza", kw2: "Fiducia" },
    ru: { val: "Правдивость (Сидк)", title: "Я говорю правду, даже когда меня никто не видит.", kw1: "Ясность", kw2: "Доверие" },
    ar: { val: "الصدق", title: "أنا صادق… حتى حين لا يراني أحد", kw1: "وضوح", kw2: "ثقة" }
  },
  {
    tr: { val: "Emanet & Güvenilirlik", title: "Bana emanet edileni korur, sözümü tutarım.", kw1: "Vefa", kw2: "Sorumluluk" },
    en: { val: "Trustworthiness (Amanah)", title: "I honor my promises and protect what is entrusted to me.", kw1: "Loyalty", kw2: "Integrity" },
    fr: { val: "Fidélité au Dépôt (Amanah)", title: "Je respecte mes engagements et protège ce qui m'est confié.", kw1: "Loyauté", kw2: "Responsabilité" },
    de: { val: "Vertrauenswürdigkeit (Amanah)", title: "Ich halte meine Versprechen und hüte Anvertrautes.", kw1: "Treue", kw2: "Verlässlichkeit" },
    it: { val: "Fidatezza (Amanah)", title: "Custodisco ciò che mi viene affidato e mantengo la parola.", kw1: "Lealtà", kw2: "Dovere" },
    ru: { val: "Надежность (Аманат)", title: "Я храню доверенное мне и всегда держу слово.", kw1: "Верность", kw2: "Доверие" },
    ar: { val: "الأمانة", title: "أحفظ ما استُؤمنت عليه وأؤديه كما يجب", kw1: "حفظ", kw2: "وفاء" }
  },
  {
    tr: { val: "Merhamet & Şefkat", title: "Gerçek gücüm, başkalarına nazik ve merhametli olduğumda belirir.", kw1: "Nezaket", kw2: "Şefkat" },
    en: { val: "Mercy & Kindness (Rahmah)", title: "My strength shows when I am gentle and merciful to others.", kw1: "Kindness", kw2: "Compassion" },
    fr: { val: "Miséricorde & Douceur (Rahmah)", title: "Ma force se révèle lorsque je suis bienveillant envers autrui.", kw1: "Douceur", kw2: "Empathie" },
    de: { val: "Barmherzigkeit (Rahmah)", title: "Wahre Stärke zeigt sich in Sanftmut und Mitgefühl.", kw1: "Güte", kw2: "Mitgefühl" },
    it: { val: "Misericordia & Dolcezza (Rahmah)", title: "La mia forza si manifesta quando tratto gli altri con dolcezza.", kw1: "Dolcezza", kw2: "Empatia" },
    ru: { val: "Милосердие (Рахма)", title: "Моя сила проявляется в доброте и сострадании к другим.", kw1: "Доброта", kw2: "Забота" },
    ar: { val: "الرحمة", title: "قوتي تظهر حين أرفق بغيري", kw1: "رفق", kw2: "عطف" }
  },
  {
    tr: { val: "Saygı & Hürmet", title: "Farklı düşünsem bile nezaketimi korur, hakkı gözetirim.", kw1: "Edep", kw2: "Hürmet" },
    en: { val: "Respect & Manners (Ihtiram)", title: "I disagree politely and honor the dignity of others.", kw1: "Etiquette", kw2: "Dignity" },
    fr: { val: "Respect & Bienséance (Ihtiram)", title: "J'exprime mes désaccords avec politesse et respecte chacun.", kw1: "Politesse", kw2: "Égard" },
    de: { val: "Respekt & Höflichkeit (Ihtiram)", title: "Ich bleibe auch bei Meinungsverschiedenheiten stets respektvoll.", kw1: "Höflichkeit", kw2: "Achtung" },
    it: { val: "Rispetto & Buone Maniere (Ihtiram)", title: "Discutere con educazione significa rispettare la dignità altrui.", kw1: "Educazione", kw2: "Stima" },
    ru: { val: "Уважение и благовоспитанность (Ихтирам)", title: "Я высказываю свое мнение вежливо и уважаю каждого.", kw1: "Этикет", kw2: "Почтение" },
    ar: { val: "الاحترام", title: "أختلف بأدب وأحفظ حق غيري", kw1: "أدب", kw2: "تقدير" }
  },
  {
    tr: { val: "Sabır & Metanet", title: "Zorluklarla karşılaştığımda sakin kalır ve azimle devam ederim.", kw1: "Sebat", kw2: "Sükunet" },
    en: { val: "Patience & Perseverance (Sabr)", title: "I stay calm and determined when things become challenging.", kw1: "Resilience", kw2: "Calm" },
    fr: { val: "Patience & Persévérance (Sabr)", title: "Je garde mon calme et poursuis mes efforts face aux défis.", kw1: "Endurance", kw2: "Sérénité" },
    de: { val: "Geduld & Ausdauer (Sabr)", title: "Ich bewahre Ruhe und Entschlossenheit in schwierigen Momenten.", kw1: "Ausdauer", kw2: "Gelassenheit" },
    it: { val: "Pazienza & Resilienza (Sabr)", title: "Mantengo la calma e vado avanti con determinazione.", kw1: "Costanza", kw2: "Serenità" },
    ru: { val: "Терпение и стойкость (Сабр)", title: "Я сохраняю спокойствие и продолжаю путь, когда трудно.", kw1: "Стойкость", kw2: "Покой" },
    ar: { val: "الصبر", title: "أهدأ وأواصل حين تصبح الأمور صعبة", kw1: "ثبات", kw2: "هدوء" }
  }
];

let currentLang = DEFAULT_LANG;
const WEEK_ANCHOR = new Date(2026, 0, 5);

function getStartOfCurrentWeek(d = new Date()) {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

function getWeeklyData(lang) {
  const weekStart = getStartOfCurrentWeek();
  const weekNumber = Math.floor((weekStart - WEEK_ANCHOR) / (7 * 24 * 60 * 60 * 1000));
  const index = Math.abs(weekNumber) % WEEKLY_VALUES_MULTILINGUAL.length;
  const item = WEEKLY_VALUES_MULTILINGUAL[index][lang] || WEEKLY_VALUES_MULTILINGUAL[index]["en"];

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  let localeCode = lang === "ar" ? "ar-SA" : lang;
  let dateRangeStr = "";
  try {
    const formatter = new Intl.DateTimeFormat(localeCode, { day: "numeric", month: "short" });
    dateRangeStr = `${formatter.format(weekStart)} – ${formatter.format(weekEnd)}`;
  } catch (e) {
    dateRangeStr = `${weekStart.getDate()} – ${weekEnd.getDate()}`;
  }

  return {
    ...item,
    dateRange: dateRangeStr
  };
}

function updateWeeklyCard(lang) {
  const data = getWeeklyData(lang);
  const valEl = document.getElementById("weekly-value");
  const titleEl = document.getElementById("weekly-title");
  const kw1El = document.getElementById("weekly-kw1");
  const kw2El = document.getElementById("weekly-kw2");
  const rangeEl = document.getElementById("weekly-range");

  if (valEl) valEl.textContent = data.val;
  if (titleEl) titleEl.textContent = data.title;
  if (kw1El) kw1El.textContent = data.kw1;
  if (kw2El) kw2El.textContent = data.kw2;
  if (rangeEl) rangeEl.textContent = data.dateRange;
}

// ==========================================================================
// 3. Persistent Local Store & Seed Data
// ==========================================================================
const DEFAULT_SEED_APPOINTMENTS = [
  {
    id: "apt_1",
    date: "2026-03-20",
    time: "18:00 - 18:45",
    studentName: "Yusuf Demir",
    studentEmail: "ogrenci@midad.com",
    course: "Tecvidli Kur'an-ı Kerim",
    teacher: "Şeyh Mahmud el-Ezheri",
    platform: "Google Meet",
    meetingUrl: "https://meet.google.com/mid-quran-live",
    status: "confirmed",
    createdAt: "2026-03-15T10:00:00Z"
  },
  {
    id: "apt_2",
    date: "2026-03-22",
    time: "10:30 - 11:15",
    studentName: "Yusuf Demir",
    studentEmail: "ogrenci@midad.com",
    course: "Ahlak & İslami Değerler",
    teacher: "Fatma Zehra Hoca",
    platform: "Zoom Education",
    meetingUrl: "https://zoom.us/j/84920491823",
    status: "confirmed",
    createdAt: "2026-03-16T14:30:00Z"
  },
  {
    id: "apt_3",
    date: "2026-03-25",
    time: "16:30 - 17:15",
    studentName: "Amina Kaya",
    studentEmail: "amina@example.com",
    course: "Elif-Bâ & Sıfırdan Kur'an",
    teacher: "Şeyh Mahmud el-Ezheri",
    platform: "Google Meet",
    meetingUrl: "https://meet.google.com/mid-amina-meet",
    status: "pending",
    createdAt: "2026-03-17T09:15:00Z"
  }
];

function getStoredAppointments() {
  try {
    const raw = localStorage.getItem("midad_appointments");
    if (!raw) {
      localStorage.setItem("midad_appointments", JSON.stringify(DEFAULT_SEED_APPOINTMENTS));
      return DEFAULT_SEED_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_SEED_APPOINTMENTS;
  }
}

function saveAppointments(list) {
  try {
    localStorage.setItem("midad_appointments", JSON.stringify(list));
  } catch (e) {
    console.error("Storage save error", e);
  }
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem("midad_current_user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem("midad_current_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("midad_current_user");
  }
  updateNavUserUI();
}

// ==========================================================================
// 4. Interactive Calendar Engine
// ==========================================================================
let calCurrentYear = 2026;
let calCurrentMonth = 2; // March (0-indexed: 0=Jan, 1=Feb, 2=Mar)
let selectedCalDate = "2026-03-20";
let selectedCalSlot = null;

const STANDARD_SLOTS = [
  "09:00 - 09:45",
  "10:30 - 11:15",
  "14:00 - 14:45",
  "16:30 - 17:15",
  "18:00 - 18:45",
  "20:00 - 20:45"
];

const WEEKDAY_NAMES = {
  tr: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  fr: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  it: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
  ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  ar: ["إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"]
};

function renderCalendar() {
  const monthDisplay = document.getElementById("cal-month-display");
  const weekdaysRow = document.getElementById("cal-weekdays-row");
  const daysGrid = document.getElementById("cal-days-grid");

  if (!daysGrid) return;

  // 1. Update Month Display
  const tempDate = new Date(calCurrentYear, calCurrentMonth, 1);
  const locale = currentLang === "ar" ? "ar-SA" : currentLang;
  try {
    const monthFormatter = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
    if (monthDisplay) monthDisplay.textContent = monthFormatter.format(tempDate);
  } catch (e) {
    if (monthDisplay) monthDisplay.textContent = `${calCurrentMonth + 1} / ${calCurrentYear}`;
  }

  // 2. Update Weekdays Row
  if (weekdaysRow) {
    const daysArr = WEEKDAY_NAMES[currentLang] || WEEKDAY_NAMES["en"];
    weekdaysRow.innerHTML = daysArr.map(d => `<span>${d}</span>`).join("");
  }

  // 3. Calculate First Day & Total Days in Month
  const firstDayIndex = (new Date(calCurrentYear, calCurrentMonth, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(calCurrentYear, calCurrentMonth + 1, 0).getDate();
  const appointments = getStoredAppointments();

  daysGrid.innerHTML = "";

  // Leading empty cells
  for (let i = 0; i < firstDayIndex; i++) {
    const empty = document.createElement("div");
    empty.className = "cal-day-cell disabled";
    daysGrid.appendChild(empty);
  }

  // Days of month
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === calCurrentYear && today.getMonth() === calCurrentMonth;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${calCurrentYear}-${String(calCurrentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const cell = document.createElement("div");
    cell.className = "cal-day-cell";
    cell.textContent = String(day);

    if (isCurrentMonth && day === today.getDate()) {
      cell.classList.add("today");
    }

    if (dateStr === selectedCalDate) {
      cell.classList.add("selected");
    }

    // Has booked classes indicator
    const hasBookings = appointments.some(a => a.date === dateStr && a.status !== "cancelled");
    if (hasBookings) {
      const dot = document.createElement("span");
      dot.className = "dot";
      cell.appendChild(dot);
    }

    cell.addEventListener("click", () => {
      selectedCalDate = dateStr;
      selectedCalSlot = null;
      renderCalendar();
      renderSlotsForSelectedDate();
      updateBookingSummary();
    });

    daysGrid.appendChild(cell);
  }

  renderSlotsForSelectedDate();
  updateBookingSummary();
}

function renderSlotsForSelectedDate() {
  const container = document.getElementById("cal-slots-container");
  const dateLabel = document.getElementById("cal-selected-date-label");
  if (!container) return;

  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANG];

  if (!selectedCalDate) {
    if (dateLabel) dateLabel.textContent = dict.cal_select_date || "Tarih Seçiniz";
    container.innerHTML = `<p style="padding:20px; text-align:center; color:var(--text-muted); font-size:13px;">${dict.cal_select_date}</p>`;
    return;
  }

  // Format date label
  try {
    const dParts = selectedCalDate.split("-");
    const dObj = new Date(Number(dParts[0]), Number(dParts[1]) - 1, Number(dParts[2]));
    const locale = currentLang === "ar" ? "ar-SA" : currentLang;
    const dFormatter = new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "long" });
    if (dateLabel) dateLabel.textContent = dFormatter.format(dObj);
  } catch (e) {
    if (dateLabel) dateLabel.textContent = selectedCalDate;
  }

  // Read appointments for this date
  const appointments = getStoredAppointments();
  const bookedTimes = appointments
    .filter(a => a.date === selectedCalDate && a.status !== "cancelled")
    .map(a => a.time);

  container.innerHTML = "";

  STANDARD_SLOTS.forEach(slotTime => {
    const isBooked = bookedTimes.includes(slotTime);
    const isSelected = selectedCalSlot === slotTime;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `slot-btn ${isBooked ? "booked" : isSelected ? "selected" : "available"}`;

    const timeSpan = document.createElement("span");
    timeSpan.textContent = slotTime;

    const badgeSpan = document.createElement("span");
    badgeSpan.className = "slot-badge-status";
    badgeSpan.textContent = isBooked
      ? (dict.cal_slot_booked || "Dolu")
      : isSelected
      ? (dict.cal_slot_selected || "Seçildi")
      : (dict.cal_slot_available || "Müsait");

    btn.appendChild(timeSpan);
    btn.appendChild(badgeSpan);

    if (!isBooked) {
      btn.addEventListener("click", () => {
        selectedCalSlot = slotTime;
        renderSlotsForSelectedDate();
        updateBookingSummary();
      });
    }

    container.appendChild(btn);
  });
}

function updateBookingSummary() {
  const summaryText = document.getElementById("booking-summary-text");
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANG];

  if (!summaryText) return;

  if (selectedCalDate && selectedCalSlot) {
    summaryText.innerHTML = `<strong>${selectedCalDate}</strong> &bull; <span>${selectedCalSlot}</span>`;
  } else if (selectedCalDate) {
    summaryText.textContent = `${selectedCalDate} — ${dict.cal_select_slot || "Saat Seçiniz"}`;
  } else {
    summaryText.textContent = dict.cal_alert_select_both || "Lütfen tarih ve saat seçiniz";
  }
}

function handleCalendarBookingSubmit(e) {
  e.preventDefault();
  const statusBox = document.getElementById("cal-status-box");
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANG];

  if (!selectedCalDate || !selectedCalSlot) {
    if (statusBox) {
      statusBox.textContent = dict.cal_alert_select_both || "Lütfen önce takvimden bir gün ve saat seçiniz.";
      statusBox.className = "cal-status-box error";
      statusBox.style.display = "block";
    }
    return;
  }

  const nameInput = document.getElementById("cal-student-name");
  const emailInput = document.getElementById("cal-student-email");
  const courseSelect = document.getElementById("cal-course-select");
  const teacherSelect = document.getElementById("cal-teacher-select");
  const platformRadio = document.querySelector('input[name="cal-platform"]:checked');

  const studentName = nameInput ? nameInput.value.trim() : "";
  const studentEmail = emailInput ? emailInput.value.trim() : "";
  const course = courseSelect ? courseSelect.options[courseSelect.selectedIndex].text : "Tecvidli Kur'an-ı Kerim";
  const teacher = teacherSelect ? teacherSelect.options[teacherSelect.selectedIndex].text : "Şeyh Mahmud el-Ezheri";
  const platform = platformRadio && platformRadio.value === "zoom" ? "Zoom Education" : "Google Meet";

  if (!studentName || !studentEmail) {
    if (statusBox) {
      statusBox.textContent = dict.form_err_req || "Lütfen gerekli alanları doldurunuz.";
      statusBox.className = "cal-status-box error";
      statusBox.style.display = "block";
    }
    return;
  }

  // Generate unique Meeting URL
  const randomRoom = Math.random().toString(36).substring(2, 8);
  const meetingUrl = platform.includes("Zoom")
    ? `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`
    : `https://meet.google.com/mid-${randomRoom}`;

  // Save new appointment
  const newAppointment = {
    id: `apt_${Date.now()}`,
    date: selectedCalDate,
    time: selectedCalSlot,
    studentName,
    studentEmail,
    course,
    teacher,
    platform,
    meetingUrl,
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  const currentList = getStoredAppointments();
  currentList.unshift(newAppointment);
  saveAppointments(currentList);
  // Async sync to Supabase / Backend
  if (window.MidadBackend && typeof window.MidadBackend.createAppointment === "function") {
    window.MidadBackend.createAppointment(newAppointment).catch(err => console.warn("[Midad] Supabase sync error:", err));
  }

  if (statusBox) {
    statusBox.textContent = `✓ ${dict.cal_success_msg || "Randevunuz oluşturuldu!"} (${platform})`;
    statusBox.className = "cal-status-box success";
    statusBox.style.display = "block";
  }

  // Refresh Slots
  selectedCalSlot = null;
  renderCalendar();

  // If student dashboard is open or user is logged in, refresh dashboard
  const user = getCurrentUser();
  if (user && user.role === "student") {
    renderStudentDashboard();
  }
}

// ==========================================================================
// 5. Student Portal & Dashboard
// ==========================================================================
function openStudentModal() {
  const backdrop = document.getElementById("student-modal-backdrop");
  if (!backdrop) return;

  const user = getCurrentUser();
  const loginView = document.getElementById("student-login-view");
  const dashView = document.getElementById("student-dashboard-view");

  if (user && user.role === "student") {
    if (loginView) loginView.style.display = "none";
    if (dashView) dashView.style.display = "block";
    renderStudentDashboard();
  } else {
    if (loginView) loginView.style.display = "block";
    if (dashView) dashView.style.display = "none";
  }

  backdrop.classList.add("active");
}

function closeStudentModal() {
  const backdrop = document.getElementById("student-modal-backdrop");
  if (backdrop) backdrop.classList.remove("active");
}

function renderStudentDashboard() {
  const user = getCurrentUser();
  if (!user) return;

  const nameEl = document.getElementById("student-dash-name");
  const courseEl = document.getElementById("student-dash-course");
  const listEl = document.getElementById("student-appointments-list");
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANG];

  if (nameEl) nameEl.textContent = user.name || "Yusuf Demir";
  if (courseEl) courseEl.textContent = user.course || "Tecvidli Kur'an-ı Kerim";

  if (!listEl) return;

  const appointments = getStoredAppointments();
  const myAppointments = appointments.filter(a =>
    a.studentEmail.toLowerCase() === user.email.toLowerCase() && a.status !== "cancelled"
  );

  if (myAppointments.length === 0) {
    listEl.innerHTML = `<p style="padding:16px; color:var(--text-muted); font-size:13.5px;">${dict.student_no_upcoming}</p>`;
    return;
  }

  listEl.innerHTML = myAppointments.map(apt => {
    const isMeet = apt.platform.includes("Meet");
    const joinBtnClass = isMeet ? "btn-join-meeting meet" : "btn-join-meeting zoom";
    const joinBtnText = isMeet ? (dict.student_join_meet || "Google Meet'e Katıl") : (dict.student_join_zoom || "Zoom'a Katıl");

    return `
      <div class="appointment-item-card" data-id="${apt.id}">
        <div class="apt-time-badge">
          <span>${apt.date}</span>
          ${apt.time}
        </div>
        <div class="apt-details">
          <strong>${apt.course}</strong>
          <span>👨‍🏫 ${apt.teacher} &bull; 💻 ${apt.platform}</span>
        </div>
        <div class="apt-actions">
          <a href="${apt.meetingUrl}" target="_blank" rel="noopener noreferrer" class="${joinBtnClass}">
            <svg viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            <span>${joinBtnText}</span>
          </a>
          <button type="button" class="btn-cancel-apt" onclick="cancelAppointment('${apt.id}')">
            ${dict.student_cancel || "İptal"}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function cancelAppointment(id) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANG];
  if (!confirm("Bu randevuyu iptal etmek istediğinize emin misiniz?")) return;

  let appointments = getStoredAppointments();
  appointments = appointments.map(a => {
    if (a.id === id) {
      return { ...a, status: "cancelled" };
    }
    return a;
  });
  saveAppointments(appointments);
  // Async sync cancellation to Supabase / Backend
  if (window.MidadBackend && typeof window.MidadBackend.updateAppointmentStatus === "function") {
    window.MidadBackend.updateAppointmentStatus(id, "cancelled").catch(err => console.warn("[Midad] Supabase cancel error:", err));
  }

  renderStudentDashboard();
  renderCalendar();
}

// ==========================================================================
// 6. Admin Control Panel
// ==========================================================================
function openAdminModal() {
  const backdrop = document.getElementById("admin-modal-backdrop");
  if (!backdrop) return;

  const user = getCurrentUser();
  const loginView = document.getElementById("admin-login-view");
  const dashView = document.getElementById("admin-dashboard-view");

  if (user && user.role === "admin") {
    if (loginView) loginView.style.display = "none";
    if (dashView) dashView.style.display = "block";
    renderAdminDashboard();
  } else {
    if (loginView) loginView.style.display = "block";
    if (dashView) dashView.style.display = "none";
  }

  backdrop.classList.add("active");
}

function closeAdminModal() {
  const backdrop = document.getElementById("admin-modal-backdrop");
  if (backdrop) backdrop.classList.remove("active");
}

function renderAdminDashboard() {
  const tbody = document.getElementById("admin-appointments-tbody");
  const totalEl = document.getElementById("admin-stat-total");
  const confEl = document.getElementById("admin-stat-confirmed");
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANG];

  const appointments = getStoredAppointments();

  if (totalEl) totalEl.textContent = String(appointments.length);
  if (confEl) confEl.textContent = String(appointments.filter(a => a.status === "confirmed").length);

  if (!tbody) return;

  tbody.innerHTML = appointments.map(apt => {
    let statusClass = "pending";
    let statusText = dict.student_status_pending || "Beklemede";

    if (apt.status === "confirmed") {
      statusClass = "confirmed";
      statusText = dict.student_status_confirmed || "Onaylandı";
    } else if (apt.status === "completed") {
      statusClass = "completed";
      statusText = dict.student_status_completed || "Tamamlandı";
    } else if (apt.status === "cancelled") {
      statusClass = "cancelled";
      statusText = dict.student_status_cancelled || "İptal Edildi";
    }

    return `
      <tr>
        <td>
          <strong>${apt.studentName}</strong><br>
          <small style="color:var(--text-muted)">${apt.studentEmail}</small>
        </td>
        <td>
          <strong>${apt.course}</strong><br>
          <small style="color:var(--text-muted)">👨‍🏫 ${apt.teacher}</small>
        </td>
        <td>
          <strong>${apt.date}</strong><br>
          <small>${apt.time}</small>
        </td>
        <td>
          <strong>${apt.platform}</strong><br>
          <a href="${apt.meetingUrl}" target="_blank" rel="noopener" style="font-size:11.5px; color:var(--meet-blue); text-decoration:underline;">
            Bağlantıyı Aç / Open
          </a>
        </td>
        <td>
          <span class="status-tag ${statusClass}">${statusText}</span>
        </td>
        <td>
          <div class="table-actions-cell">
            <button type="button" class="btn-tbl-action approve" onclick="adminUpdateStatus('${apt.id}', 'confirmed')">✓</button>
            <button type="button" class="btn-tbl-action complete" onclick="adminUpdateStatus('${apt.id}', 'completed')">✔</button>
            <button type="button" class="btn-tbl-action cancel" onclick="adminUpdateStatus('${apt.id}', 'cancelled')">✕</button>
            <button type="button" class="btn-tbl-action" onclick="adminEditMeetingLink('${apt.id}')">🔗</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function adminUpdateStatus(id, newStatus) {
  let appointments = getStoredAppointments();
  appointments = appointments.map(a => a.id === id ? { ...a, status: newStatus } : a);
  saveAppointments(appointments);
  if (window.MidadBackend && typeof window.MidadBackend.updateAppointmentStatus === "function") {
    window.MidadBackend.updateAppointmentStatus(id, newStatus).catch(err => console.warn("[Midad] Supabase status error:", err));
  }
  renderAdminDashboard();
  renderCalendar();
}

function adminEditMeetingLink(id) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANG];
  let appointments = getStoredAppointments();
  const target = appointments.find(a => a.id === id);
  if (!target) return;

  const newUrl = prompt(dict.admin_edit_link_prompt || "Yeni link giriniz:", target.meetingUrl);
  if (newUrl && newUrl.trim()) {
    appointments = appointments.map(a => a.id === id ? { ...a, meetingUrl: newUrl.trim() } : a);
    saveAppointments(appointments);
    if (window.MidadBackend && typeof window.MidadBackend.updateAppointmentMeetingLink === "function") {
      window.MidadBackend.updateAppointmentMeetingLink(id, newUrl.trim()).catch(err => console.warn("[Midad] Supabase link error:", err));
    }
    renderAdminDashboard();
  }
}

// ==========================================================================
// 7. Navigation User State & Logout
// ==========================================================================
function updateNavUserUI() {
  const user = getCurrentUser();
  const loggedOutBox = document.getElementById("portal-logged-out");
  const loggedInBox = document.getElementById("portal-logged-in");
  const navName = document.getElementById("nav-user-name");
  const navAvatar = document.getElementById("nav-user-avatar");

  if (user) {
    if (loggedOutBox) loggedOutBox.style.display = "none";
    if (loggedInBox) loggedInBox.style.display = "flex";
    if (navName) navName.textContent = user.name;
    if (navAvatar) {
      const initials = (user.name || "U").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
      navAvatar.textContent = initials;
    }
  } else {
    if (loggedOutBox) loggedOutBox.style.display = "flex";
    if (loggedInBox) loggedInBox.style.display = "none";
  }
}

// ==========================================================================
// 8. Main Language Switch Engine
// ==========================================================================
function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) {
    lang = DEFAULT_LANG;
  }
  currentLang = lang;
  localStorage.setItem("midad_lang", lang);

  const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
  const config = LANG_CONFIG[lang] || LANG_CONFIG[DEFAULT_LANG];

  // 1. Set HTML dir and lang attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = config.dir;

  // 2. Update Page Title
  document.title = `${dict.brand_name} | ${dict.brand_tagline}`;

  // 3. Update all text nodes marked with data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // 4. Update all placeholders marked with data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  // 5. Update language dropdown UI
  const currentFlagEl = document.getElementById("current-lang-flag");
  const currentNameEl = document.getElementById("current-lang-name");
  if (currentFlagEl) currentFlagEl.textContent = config.flag;
  if (currentNameEl) currentNameEl.textContent = config.name;

  document.querySelectorAll(".lang-option").forEach(opt => {
    opt.classList.toggle("selected", opt.getAttribute("data-lang") === lang);
  });

  // 6. Update Weekly Value Card
  updateWeeklyCard(lang);

  // 7. Re-render Calendar with localized month and weekdays
  renderCalendar();

  // Close mobile drawer if open
  const drawer = document.getElementById("mobile-drawer");
  const toggle = document.getElementById("mobile-toggle");
  if (drawer && drawer.classList.contains("active")) {
    drawer.classList.remove("active");
    if (toggle) toggle.classList.remove("open");
  }
}

// ==========================================================================
// 9. WhatsApp Trial Registration Message Builder
// ==========================================================================
function generateWhatsAppUrl(formData, lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
  
  const lines = [
    dict.whatsapp_msg_prefix || "Assalamu Alaikum,",
    "",
    `👤 ${dict.label_parent}: ${formData.parentName}`,
    `🎓 ${dict.label_student}: ${formData.studentName}`,
    `🎂 ${dict.label_age}: ${formData.studentAge}`,
    `🌍 ${dict.label_country}: ${formData.country}`,
    `📖 ${dict.label_course}: ${formData.course}`,
    `💻 ${dict.label_platform}: ${formData.platform}`,
    `⏰ ${dict.label_time}: ${formData.timeSlot}`,
    "",
    "Barakallahu Feekum."
  ];

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
}

// ==========================================================================
// 10. DOM Ready Initialization
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Detect Initial Language
  const savedLang = localStorage.getItem("midad_lang");
  const browserLang = (navigator.language || navigator.userLanguage || "").slice(0, 2).toLowerCase();
  const initialLang = savedLang || (SUPPORTED_LANGS.includes(browserLang) ? browserLang : DEFAULT_LANG);

  setLanguage(initialLang);
  updateNavUserUI();
  // Backend / Supabase initial sync
  if (window.MidadBackend && typeof window.MidadBackend.getAppointments === "function") {
    window.MidadBackend.getAppointments().then(data => {
      if (data && data.length > 0) {
        renderCalendar();
        const u = getCurrentUser();
        if (u && u.role === "admin") renderAdminDashboard();
        if (u && u.role === "student") renderStudentDashboard();
      }
    }).catch(err => console.warn("[Midad] Initial fetch fallback:", err));
  }

  // Realtime subscription listener
  window.addEventListener("midad:appointments-changed", () => {
    renderCalendar();
    const u = getCurrentUser();
    if (u && u.role === "admin") renderAdminDashboard();
    if (u && u.role === "student") renderStudentDashboard();
  });

  // 2. Language Dropdown Toggle
  const langBtn = document.getElementById("lang-btn");
  const langDropdown = document.getElementById("lang-dropdown");

  if (langBtn && langDropdown) {
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle("active");
    });

    document.querySelectorAll(".lang-option").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const selectedLang = btn.getAttribute("data-lang");
        setLanguage(selectedLang);
        langDropdown.classList.remove("active");
      });
    });

    document.addEventListener("click", () => {
      langDropdown.classList.remove("active");
    });
  }

  // 3. Mobile Navigation Toggle
  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.toggle("active");
      mobileToggle.classList.toggle("open", isOpen);
      mobileToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileDrawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("active");
        mobileToggle.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 4. Calendar Month Navigation Listeners
  const prevMonthBtn = document.getElementById("cal-prev-month");
  const nextMonthBtn = document.getElementById("cal-next-month");

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      calCurrentMonth--;
      if (calCurrentMonth < 0) {
        calCurrentMonth = 11;
        calCurrentYear--;
      }
      renderCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener("click", () => {
      calCurrentMonth++;
      if (calCurrentMonth > 11) {
        calCurrentMonth = 0;
        calCurrentYear++;
      }
      renderCalendar();
    });
  }

  // 5. Calendar Booking Form Submit
  const calForm = document.getElementById("calendar-booking-form");
  if (calForm) {
    calForm.addEventListener("submit", handleCalendarBookingSubmit);
  }

  // Auto-fill student details in calendar form if logged in
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.role === "student") {
    const calName = document.getElementById("cal-student-name");
    const calEmail = document.getElementById("cal-student-email");
    if (calName) calName.value = currentUser.name || "";
    if (calEmail) calEmail.value = currentUser.email || "";
  }

  // 6. Portal Modal Trigger Listeners
  const btnStudentModal = document.getElementById("btn-open-student-modal");
  const btnAdminModal = document.getElementById("btn-open-admin-modal");
  const mBtnStudentLogin = document.getElementById("m-btn-student-login");
  const mBtnAdminLogin = document.getElementById("m-btn-admin-login");
  const btnOpenUserDash = document.getElementById("btn-open-user-dash");
  const btnNavLogout = document.getElementById("btn-nav-logout");

  if (btnStudentModal) btnStudentModal.addEventListener("click", openStudentModal);
  if (btnAdminModal) btnAdminModal.addEventListener("click", openAdminModal);
  if (mBtnStudentLogin) mBtnStudentLogin.addEventListener("click", openStudentModal);
  if (mBtnAdminLogin) mBtnAdminLogin.addEventListener("click", openAdminModal);

  if (btnOpenUserDash) {
    btnOpenUserDash.addEventListener("click", () => {
      const u = getCurrentUser();
      if (u && u.role === "admin") openAdminModal();
      else openStudentModal();
    });
  }

  if (btnNavLogout) {
    btnNavLogout.addEventListener("click", () => {
      setCurrentUser(null);
      closeStudentModal();
      closeAdminModal();
    });
  }

  // Modal Close Buttons
  const closeStudentBtn = document.getElementById("close-student-modal");
  const closeAdminBtn = document.getElementById("close-admin-modal");
  if (closeStudentBtn) closeStudentBtn.addEventListener("click", closeStudentModal);
  if (closeAdminBtn) closeAdminBtn.addEventListener("click", closeAdminModal);

  // Close modals on backdrop click
  const sBackdrop = document.getElementById("student-modal-backdrop");
  const aBackdrop = document.getElementById("admin-modal-backdrop");
  if (sBackdrop) {
    sBackdrop.addEventListener("click", (e) => {
      if (e.target === sBackdrop) closeStudentModal();
    });
  }
  if (aBackdrop) {
    aBackdrop.addEventListener("click", (e) => {
      if (e.target === aBackdrop) closeAdminModal();
    });
  }

  // Student Login Form & Demo Quick Login
  const studentForm = document.getElementById("student-login-form");
  const btnStudentDemoFill = document.getElementById("btn-student-demo-fill");
  const btnStudentLogout = document.getElementById("btn-student-logout");
  const btnStudentBookMore = document.getElementById("btn-student-book-more");

  if (btnStudentDemoFill) {
    btnStudentDemoFill.addEventListener("click", () => {
      setCurrentUser({
        role: "student",
        name: "Yusuf Demir",
        email: "ogrenci@midad.com",
        course: "Tecvidli Kur'an-ı Kerim"
      });
      openStudentModal();
    });
  }

  if (studentForm) {
    studentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("student-login-email").value;
      setCurrentUser({
        role: "student",
        name: email.split("@")[0].toUpperCase(),
        email: email,
        course: "Tecvidli Kur'an-ı Kerim"
      });
      openStudentModal();
    });
  }

  if (btnStudentLogout) {
    btnStudentLogout.addEventListener("click", () => {
      setCurrentUser(null);
      closeStudentModal();
    });
  }

  if (btnStudentBookMore) {
    btnStudentBookMore.addEventListener("click", () => {
      closeStudentModal();
      const calSec = document.getElementById("calendar-section");
      if (calSec) calSec.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Admin Login Form & Demo Quick Login
  const adminForm = document.getElementById("admin-login-form");
  const btnAdminDemoFill = document.getElementById("btn-admin-demo-fill");
  const btnAdminLogout = document.getElementById("btn-admin-logout");
  const btnAdminScrollCal = document.getElementById("btn-admin-scroll-cal");

  if (btnAdminDemoFill) {
    btnAdminDemoFill.addEventListener("click", () => {
      setCurrentUser({
        role: "admin",
        name: "Midad Yönetici",
        email: "admin@midad.com"
      });
      openAdminModal();
    });
  }

  if (adminForm) {
    adminForm.addEventListener("submit", (e) => {
      e.preventDefault();
      setCurrentUser({
        role: "admin",
        name: "Midad Yönetici",
        email: "admin@midad.com"
      });
      openAdminModal();
    });
  }

  if (btnAdminLogout) {
    btnAdminLogout.addEventListener("click", () => {
      setCurrentUser(null);
      closeAdminModal();
    });
  }

  if (btnAdminScrollCal) {
    btnAdminScrollCal.addEventListener("click", () => {
      closeAdminModal();
      const calSec = document.getElementById("calendar-section");
      if (calSec) calSec.scrollIntoView({ behavior: "smooth" });
    });
  }

  // 7. FAQ Accordion (Single-Open behavior)
  const faqDetails = document.querySelectorAll(".faq-wrap details");
  faqDetails.forEach(item => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqDetails.forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // 8. Course Card Quick-Select Button
  document.querySelectorAll(".btn-course-enroll").forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const courseId = button.getAttribute("data-course");
      const selectCourse = document.getElementById("field-course");
      const calSelectCourse = document.getElementById("cal-course-select");
      if (selectCourse && courseId) selectCourse.value = courseId;
      if (calSelectCourse && courseId) calSelectCourse.value = courseId;
      
      const calSection = document.getElementById("calendar-section");
      if (calSection) {
        calSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // 9. Booking Form Submission Handler (WhatsApp)
  const form = document.getElementById("trial-form");
  const statusAlert = document.getElementById("form-status-alert");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (statusAlert) {
        statusAlert.className = "form-status-alert";
        statusAlert.style.display = "none";
      }

      let isValid = true;
      const requiredInputs = form.querySelectorAll("[required]");

      requiredInputs.forEach(input => {
        const group = input.closest(".form-group") || input.closest(".consent-wrap");
        if (!input.checkValidity()) {
          isValid = false;
          if (group) group.classList.add("invalid");
        } else {
          if (group) group.classList.remove("invalid");
        }
      });

      if (!isValid) {
        if (statusAlert) {
          const dict = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANG];
          statusAlert.textContent = dict.form_err_req || "Please fill in all required fields.";
          statusAlert.classList.add("error");
          statusAlert.style.display = "block";
        }
        return;
      }

      const parentName = document.getElementById("field-parent-name")?.value.trim() || "";
      const studentName = document.getElementById("field-student-name")?.value.trim() || "";
      const studentAge = document.getElementById("field-student-age")?.value || "";
      const country = document.getElementById("field-country")?.value.trim() || "";
      
      const courseSelect = document.getElementById("field-course");
      const course = courseSelect?.options[courseSelect.selectedIndex]?.text || "";

      const platformRadio = form.querySelector('input[name="platform"]:checked');
      const platform = platformRadio?.value === "zoom" ? "Zoom Education" : "Google Meet";

      const timeSlotSelect = document.getElementById("field-time-slot");
      const timeSlot = timeSlotSelect?.options[timeSlotSelect.selectedIndex]?.text || "";

      const whatsappUrl = generateWhatsAppUrl({
        parentName,
        studentName,
        studentAge,
        country,
        course,
        platform,
        timeSlot
      }, currentLang);
      // Async sync trial application to Supabase
      if (window.MidadBackend && typeof window.MidadBackend.submitTrialApplication === "function") {
        window.MidadBackend.submitTrialApplication({
          parent_name: parentName,
          student_name: studentName,
          student_age: studentAge,
          country: country,
          course: course,
          platform: platform,
          time_slot: timeSlot,
          phone: document.getElementById("field-phone")?.value.trim() || "",
          email: document.getElementById("field-email")?.value.trim() || "",
          notes: document.getElementById("field-notes")?.value.trim() || ""
        }).catch(err => console.warn("[Midad] Trial submit error:", err));
      }

      if (statusAlert) {
        statusAlert.textContent = "✓ WhatsApp açılıyor... / Opening WhatsApp...";
        statusAlert.classList.add("success");
        statusAlert.style.display = "block";
      }

      const win = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      if (!win) {
        window.location.assign(whatsappUrl);
      }
    });

    form.querySelectorAll("input, select").forEach(control => {
      control.addEventListener("input", () => {
        const group = control.closest(".form-group") || control.closest(".consent-wrap");
        if (group && control.checkValidity()) {
          group.classList.remove("invalid");
        }
      });
      control.addEventListener("change", () => {
        const group = control.closest(".form-group") || control.closest(".consent-wrap");
        if (group && control.checkValidity()) {
          group.classList.remove("invalid");
        }
      });
    });
  }

  // 10. Update Footer Year
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
