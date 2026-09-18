// ============================================================================
// MİDAD AKADEMİ — CLIENT-SIDE BACKEND & SUPABASE ENTEGRASYONU
// ============================================================================

(function () {
  "use strict";

  const SUPABASE_CONFIG = {
    url: "https://bvmztjljiumjsvejudgi.supabase.co",
    key: "sb_publishable_9XRWjwc3lMh9EeTCE-YwTQ_uuKUdDsw"
  };

  let supabaseClient = null;
  let isConnected = false;
  let realtimeChannel = null;

  // 1. Initialize Supabase Client
  function initSupabase() {
    if (window.supabase && typeof window.supabase.createClient === "function") {
      try {
        supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key, {
          auth: {
            persistSession: true,
            autoRefreshToken: true
          }
        });
        isConnected = true;
        console.log("[Midad Supabase] Client başarıyla yüklendi:", SUPABASE_CONFIG.url);
        initRealtime();
      } catch (e) {
        console.warn("[Midad Supabase] Başlatma hatası:", e.message);
      }
    } else {
      console.warn("[Midad Supabase] supabase SDK bulunamadı, API / LocalStorage kullanılacak.");
    }
  }

  // 2. Realtime Subscription (Canlı Veritabanı Dinleyici)
  function initRealtime() {
    if (!supabaseClient) return;
    try {
      realtimeChannel = supabaseClient
        .channel("public:appointments")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "appointments" },
          (payload) => {
            console.log("[Midad Realtime] Randevu değişikliği algılandı:", payload);
            // Tetikleyici olay fırlat
            window.dispatchEvent(new CustomEvent("midad:appointments-changed", { detail: payload }));
          }
        )
        .subscribe((status) => {
          console.log("[Midad Realtime] Kanal durumu:", status);
        });
    } catch (e) {
      console.warn("[Midad Realtime] Kurulum uyarısı:", e.message);
    }
  }

  // 3. Randevuları Getir (Supabase -> Backend API -> LocalStorage)
  async function getAppointments(filterEmail) {
    // 1. Supabase Doğrudan Sorgu
    if (supabaseClient) {
      try {
        let query = supabaseClient.from("appointments").select("*").order("created_at", { ascending: false });
        if (filterEmail) {
          query = query.ilike("student_email", filterEmail);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          const mapped = data.map(mapDbToClient);
          syncToLocalCache(mapped);
          return mapped;
        }
      } catch (e) {
        console.warn("[Midad Backend] Supabase getAppointments istisna:", e.message);
      }
    }

    // 2. Backend REST API Sorgusu (/api/appointments)
    try {
      const url = filterEmail ? `/api/appointments?email=${encodeURIComponent(filterEmail)}` : "/api/appointments";
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map(mapDbToClient);
          syncToLocalCache(mapped);
          return mapped;
        }
      }
    } catch (e) {
      // Backend api offline veya static host
    }

    // 3. LocalStorage Fallback
    return getLocalCache();
  }

  // 4. Yeni Randevu Oluştur
  async function createAppointment(aptData) {
    const payload = mapClientToDb(aptData);

    // 1. Supabase'e yaz
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from("appointments").insert([payload]).select();
        if (!error && data && data.length > 0) {
          console.log("[Midad Supabase] Randevu Supabase'e kaydedildi:", data[0]);
          const result = mapDbToClient(data[0]);
          updateLocalSingle(result);
          return { success: true, source: "supabase", data: result };
        }
      } catch (e) {
        console.warn("[Midad Supabase] Insert hatası:", e.message);
      }
    }

    // 2. Backend REST API'ye yaz
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        const result = mapDbToClient(json.data);
        updateLocalSingle(result);
        return { success: true, source: "backend_api", data: result };
      }
    } catch (e) {}

    // 3. LocalStorage Fallback
    updateLocalSingle(aptData);
    return { success: true, source: "local_storage", data: aptData };
  }

  // 5. Randevu Durumu Güncelle
  async function updateAppointmentStatus(id, newStatus) {
    // 1. Supabase Güncelle
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.from("appointments").update({ status: newStatus }).eq("id", id);
        if (!error) {
          console.log(`[Midad Supabase] Randevu ${id} durumu '${newStatus}' yapıldı.`);
        }
      } catch (e) {}
    }

    // 2. Backend API Güncelle
    try {
      await fetch(`/api/appointments/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {}

    // 3. Local Storage Senkronizasyonu
    const local = getLocalCache();
    const updated = local.map(a => a.id === id ? { ...a, status: newStatus } : a);
    localStorage.setItem("midad_appointments", JSON.stringify(updated));
    return true;
  }

  // 6. Toplantı Linki Güncelle
  async function updateAppointmentMeetingLink(id, newUrl) {
    if (supabaseClient) {
      try {
        await supabaseClient.from("appointments").update({ meeting_url: newUrl }).eq("id", id);
      } catch (e) {}
    }

    try {
      await fetch(`/api/appointments/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meeting_url: newUrl })
      });
    } catch (e) {}

    const local = getLocalCache();
    const updated = local.map(a => a.id === id ? { ...a, meetingUrl: newUrl } : a);
    localStorage.setItem("midad_appointments", JSON.stringify(updated));
    return true;
  }

  // 7. Ücretsiz Deneme Dersi Başvurusu Gönder
  async function submitTrialApplication(formData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from("trial_applications").insert([formData]).select();
        if (!error) {
          return { success: true, source: "supabase" };
        }
      } catch (e) {}
    }

    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) return { success: true, source: "backend_api" };
    } catch (e) {}

    return { success: true, source: "offline_fallback" };
  }

  // 8. Model Dönüştürücüler (Database snake_case <-> Client camelCase)
  function mapDbToClient(item) {
    return {
      id: item.id,
      date: item.date,
      time: item.time,
      studentName: item.student_name || item.studentName || "",
      studentEmail: item.student_email || item.studentEmail || "",
      course: item.course || "",
      teacher: item.teacher || "Şeyh Mahmud el-Ezheri",
      platform: item.platform || "Google Meet",
      meetingUrl: item.meeting_url || item.meetingUrl || "",
      status: item.status || "confirmed",
      notes: item.notes || "",
      createdAt: item.created_at || item.createdAt || new Date().toISOString()
    };
  }

  function mapClientToDb(item) {
    return {
      id: item.id || `apt_${Date.now()}`,
      date: item.date,
      time: item.time,
      student_name: item.studentName,
      student_email: item.studentEmail,
      course: item.course,
      teacher: item.teacher || "Şeyh Mahmud el-Ezheri",
      platform: item.platform || "Google Meet",
      meeting_url: item.meetingUrl || "",
      status: item.status || "confirmed",
      notes: item.notes || "",
      created_at: item.createdAt || new Date().toISOString()
    };
  }

  // 9. Yardımcı Depolama Metodları
  function getLocalCache() {
    try {
      const raw = localStorage.getItem("midad_appointments");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function syncToLocalCache(list) {
    try {
      localStorage.setItem("midad_appointments", JSON.stringify(list));
    } catch (e) {}
  }

  function updateLocalSingle(apt) {
    const list = getLocalCache();
    const existsIndex = list.findIndex(a => a.id === apt.id);
    if (existsIndex >= 0) {
      list[existsIndex] = apt;
    } else {
      list.unshift(apt);
    }
    syncToLocalCache(list);
  }

  // 10. Dışa Aktarılan Global Nesne
  window.MidadBackend = {
    config: SUPABASE_CONFIG,
    getClient: () => supabaseClient,
    isConnected: () => isConnected,
    getAppointments,
    createAppointment,
    updateAppointmentStatus,
    updateAppointmentMeetingLink,
    submitTrialApplication,
    refreshSync: async () => {
      return await getAppointments();
    }
  };

  // Sayfa yüklendiğinde otomatik başlat
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSupabase);
  } else {
    initSupabase();
  }
})();
