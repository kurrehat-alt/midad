// ============================================================================
// MİDAD AKADEMİ — NODE.JS / EXPRESS & SUPABASE BACKEND SERVER
// ============================================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 8080;

// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || "https://bvmztjljiumjsvejudgi.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "sb_publishable_9XRWjwc3lMh9EeTCE-YwTQ_uuKUdDsw";

let supabase = null;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false
    }
  });
  console.log(`[Supabase] Client initialized: ${SUPABASE_URL}`);
} catch (err) {
  console.error("[Supabase] Initialization error:", err.message);
}

// In-Memory Fallback Store (Used if Supabase table is not yet migrated)
let memoryAppointments = [
  {
    id: "apt_1",
    date: "2026-03-20",
    time: "14:00 - 14:45",
    student_name: "Yusuf Demir",
    student_email: "ogrenci@midad.com",
    course: "Tecvidli Kur'an-ı Kerim",
    teacher: "Şeyh Mahmud el-Ezheri",
    platform: "Google Meet",
    meeting_url: "https://meet.google.com/mid-yusuf-demo",
    status: "confirmed",
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "apt_2",
    date: "2026-03-22",
    time: "10:30 - 11:15",
    student_name: "Yusuf Demir",
    student_email: "ogrenci@midad.com",
    course: "Ahlak & İslami Değerler",
    teacher: "Fatma Zehra Hoca",
    platform: "Zoom Education",
    meeting_url: "https://zoom.us/j/84920491823",
    status: "confirmed",
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "apt_3",
    date: "2026-03-25",
    time: "16:30 - 17:15",
    student_name: "Amina Kaya",
    student_email: "amina@example.com",
    course: "Elif-Bâ & Sıfırdan Kur'an",
    teacher: "Şeyh Mahmud el-Ezheri",
    platform: "Google Meet",
    meeting_url: "https://meet.google.com/mid-amina-meet",
    status: "pending",
    created_at: new Date().toISOString()
  }
];

let memoryTrials = [];

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// ============================================================================
// REST API ENDPOINTS
// ============================================================================

// 1. Health & Config Endpoint
app.get("/api/health", async (req, res) => {
  let supabaseStatus = "disconnected";
  let tableFound = false;

  if (supabase) {
    try {
      const { data, error } = await supabase.from("appointments").select("id").limit(1);
      if (!error) {
        supabaseStatus = "connected";
        tableFound = true;
      } else if (error.code === "PGRST205") {
        supabaseStatus = "connected (tables_pending_migration)";
      } else {
        supabaseStatus = `error: ${error.message}`;
      }
    } catch (e) {
      supabaseStatus = `exception: ${e.message}`;
    }
  }

  res.json({
    status: "ok",
    service: "Midad Academy Backend",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    supabase: {
      status: supabaseStatus,
      url: SUPABASE_URL,
      tableReady: tableFound
    }
  });
});

// 2. Public Config (Client can fetch Supabase keys dynamically)
app.get("/api/config", (req, res) => {
  res.json({
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_KEY
  });
});

// 3. GET /api/appointments — List all appointments (or filter by email/status)
app.get("/api/appointments", async (req, res) => {
  const { email, status } = req.query;

  if (supabase) {
    try {
      let query = supabase.from("appointments").select("*").order("created_at", { ascending: false });
      if (email) query = query.ilike("student_email", email);
      if (status) query = query.eq("status", status);

      const { data, error } = await query;
      if (!error && data) {
        return res.json({ success: true, source: "supabase", count: data.length, data });
      }
      console.warn("[Appointments] Supabase read fallback:", error?.message);
    } catch (err) {
      console.warn("[Appointments] Supabase exception:", err.message);
    }
  }

  // Fallback to memory
  let results = [...memoryAppointments];
  if (email) {
    results = results.filter(a => a.student_email.toLowerCase() === email.toLowerCase());
  }
  if (status) {
    results = results.filter(a => a.status === status);
  }
  res.json({ success: true, source: "local_memory", count: results.length, data: results });
});

// 4. POST /api/appointments — Book / Create an appointment
app.post("/api/appointments", async (req, res) => {
  const body = req.body;

  if (!body.date || !body.time || !body.student_name || !body.student_email || !body.course) {
    return res.status(400).json({
      success: false,
      error: "date, time, student_name, student_email ve course alanları zorunludur."
    });
  }

  const newApt = {
    id: body.id || `apt_${Date.now()}`,
    date: body.date,
    time: body.time,
    student_name: body.student_name,
    student_email: body.student_email,
    course: body.course,
    teacher: body.teacher || "Şeyh Mahmud el-Ezheri",
    platform: body.platform || "Google Meet",
    meeting_url: body.meeting_url || (body.platform?.includes("Zoom")
      ? `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`
      : `https://meet.google.com/mid-${Math.random().toString(36).substring(2, 8)}`),
    status: body.status || "confirmed",
    notes: body.notes || "",
    created_at: body.created_at || new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from("appointments").insert([newApt]).select();
      if (!error && data) {
        // Also sync memory
        memoryAppointments.unshift(newApt);
        return res.status(201).json({ success: true, source: "supabase", data: data[0] });
      }
      console.warn("[Appointments] Supabase insert fallback:", error?.message);
    } catch (err) {
      console.warn("[Appointments] Supabase insert exception:", err.message);
    }
  }

  // Memory fallback
  memoryAppointments.unshift(newApt);
  res.status(201).json({ success: true, source: "local_memory", data: newApt });
});

// 5. PATCH /api/appointments/:id — Update status or meeting URL
app.patch("/api/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .update(updates)
        .eq("id", id)
        .select();

      if (!error && data && data.length > 0) {
        // Sync memory
        const idx = memoryAppointments.findIndex(a => a.id === id);
        if (idx !== -1) memoryAppointments[idx] = { ...memoryAppointments[idx], ...updates };
        return res.json({ success: true, source: "supabase", data: data[0] });
      }
    } catch (err) {
      console.warn("[Appointments] Supabase update exception:", err.message);
    }
  }

  // Memory fallback
  const idx = memoryAppointments.findIndex(a => a.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Randevu bulunamadı." });
  }

  memoryAppointments[idx] = { ...memoryAppointments[idx], ...updates };
  res.json({ success: true, source: "local_memory", data: memoryAppointments[idx] });
});

// 6. DELETE /api/appointments/:id — Cancel or Delete appointment
app.delete("/api/appointments/:id", async (req, res) => {
  const { id } = req.params;

  if (supabase) {
    try {
      // Soft cancel or hard delete depending on query
      if (req.query.hard === "true") {
        await supabase.from("appointments").delete().eq("id", id);
      } else {
        await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
      }
    } catch (err) {
      console.warn("[Appointments] Supabase delete exception:", err.message);
    }
  }

  // Memory update
  const idx = memoryAppointments.findIndex(a => a.id === id);
  if (idx !== -1) {
    if (req.query.hard === "true") {
      memoryAppointments.splice(idx, 1);
    } else {
      memoryAppointments[idx].status = "cancelled";
    }
  }

  res.json({ success: true, message: "Randevu güncellendi/silindi." });
});

// 7. POST /api/trial — Register Free Trial
app.post("/api/trial", async (req, res) => {
  const trialData = {
    ...req.body,
    created_at: new Date().toISOString(),
    status: "new"
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from("trial_applications").insert([trialData]).select();
      if (!error && data) {
        memoryTrials.unshift(trialData);
        return res.status(201).json({ success: true, source: "supabase", data: data[0] });
      }
    } catch (err) {
      console.warn("[Trial] Supabase insert exception:", err.message);
    }
  }

  memoryTrials.unshift(trialData);
  res.status(201).json({ success: true, source: "local_memory", data: trialData });
});

// 8. GET /api/stats — Dashboard Statistics
app.get("/api/stats", async (req, res) => {
  let list = memoryAppointments;

  if (supabase) {
    try {
      const { data } = await supabase.from("appointments").select("status");
      if (data) list = data;
    } catch (e) {}
  }

  const total = list.length;
  const confirmed = list.filter(a => a.status === "confirmed").length;
  const pending = list.filter(a => a.status === "pending").length;
  const completed = list.filter(a => a.status === "completed").length;
  const cancelled = list.filter(a => a.status === "cancelled").length;

  res.json({
    success: true,
    stats: {
      total,
      confirmed,
      pending,
      completed,
      cancelled,
      trialsCount: memoryTrials.length
    }
  });
});

// 9. POST /api/auth/login — User Authentication
app.post("/api/auth/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: "E-posta adresi gereklidir." });
  }

  // Admin Check
  if (email.toLowerCase().includes("admin") || role === "admin") {
    return res.json({
      success: true,
      user: {
        id: "usr_admin",
        email: email || "admin@midad.com",
        name: "Midad Yönetici",
        role: "admin"
      },
      token: "mock-jwt-admin-token"
    });
  }

  // Student Check
  return res.json({
    success: true,
    user: {
      id: "usr_student",
      email: email || "ogrenci@midad.com",
      name: email.split("@")[0] || "Yusuf Demir",
      role: "student",
      course: "Tecvidli Kur'an-ı Kerim"
    },
    token: "mock-jwt-student-token"
  });
});

// ============================================================================
// STATIC FILES & SPA FALLBACK
// ============================================================================
app.use(express.static(path.join(__dirname)));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ============================================================================
// START SERVER
// ============================================================================
app.listen(PORT, "0.0.0.0", () => {
  console.log("==========================================================");
  console.log(`[Midad Backend] Sunucu port ${PORT} üzerinde çalışıyor:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`👉 API Health: http://localhost:${PORT}/api/health`);
  console.log(`👉 Supabase URL: ${SUPABASE_URL}`);
  console.log("==========================================================");
});
