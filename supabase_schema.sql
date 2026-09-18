-- ============================================================================
-- MİDAD AKADEMİ — SUPABASE POSTGRESQL VERİTABANI ŞEMASI (SCHEMA)
-- ============================================================================
-- Bu dosyayı Supabase Dashboard -> SQL Editor alanına yapıştırıp "Run" butonuna basarak
-- tüm tabloları, yetkilendirme politikalarını (RLS) ve başlangıç verilerini oluşturabilirsiniz.
-- Proje URL: https://bvmztjljiumjsvejudgi.supabase.co
-- ============================================================================

-- 1. APPOINTMENTS (DERS RANDEVULARI) TABLOSU
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    course TEXT NOT NULL,
    teacher TEXT NOT NULL DEFAULT 'Şeyh Mahmud el-Ezheri',
    platform TEXT NOT NULL DEFAULT 'Google Meet',
    meeting_url TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexler (Hızlı arama ve filtreleme için)
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments (date);
CREATE INDEX IF NOT EXISTS idx_appointments_student_email ON public.appointments (student_email);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments (status);

-- 2. TRIAL_APPLICATIONS (ÜCRETSİZ DENEME DERSİ BAŞVURULARI) TABLOSU
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trial_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_name TEXT,
    student_name TEXT NOT NULL,
    student_age TEXT,
    country TEXT,
    email TEXT,
    phone TEXT,
    course TEXT NOT NULL,
    platform TEXT NOT NULL DEFAULT 'Google Meet',
    time_slot TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trial_created_at ON public.trial_applications (created_at DESC);

-- 3. PROFILES (KULLANICI PROFİLLERİ) TABLOSU
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'teacher')),
    course TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- ============================================================================
-- RLS'i aktif hale getiriyoruz
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizleyelim (varsa tekrar oluştururken hata vermemesi için)
DROP POLICY IF EXISTS "Public full access to appointments" ON public.appointments;
DROP POLICY IF EXISTS "Public insert to trial applications" ON public.trial_applications;
DROP POLICY IF EXISTS "Public read trial applications" ON public.trial_applications;
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public update profiles" ON public.profiles;

-- Appointments Politikası:
-- Anonim ve giriş yapmış herkes randevuları okuyabilir, randevu oluşturabilir ve güncelleyebilir (Demo/Web arayüzü uyumluluğu için)
CREATE POLICY "Public full access to appointments"
ON public.appointments
FOR ALL
USING (true)
WITH CHECK (true);

-- Trial Applications Politikası:
-- Herkes deneme dersi başvurusu gönderebilir, yöneticiler görebilir
CREATE POLICY "Public insert to trial applications"
ON public.trial_applications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public read trial applications"
ON public.trial_applications
FOR SELECT
USING (true);

CREATE POLICY "Public update trial applications"
ON public.trial_applications
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Profiles Politikası:
CREATE POLICY "Public read profiles"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Public insert or update profiles"
ON public.profiles
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================================================
-- BAŞLANGIÇ VERİLERİ (SEED DATA)
-- ============================================================================
INSERT INTO public.appointments (id, date, time, student_name, student_email, course, teacher, platform, meeting_url, status, created_at)
VALUES
  (
    'apt_seed_1',
    '2026-03-20',
    '14:00 - 14:45',
    'Yusuf Demir',
    'ogrenci@midad.com',
    'Tecvidli Kur''an-ı Kerim',
    'Şeyh Mahmud el-Ezheri',
    'Google Meet',
    'https://meet.google.com/mid-yusuf-demo',
    'confirmed',
    NOW() - INTERVAL '2 days'
  ),
  (
    'apt_seed_2',
    '2026-03-22',
    '10:30 - 11:15',
    'Yusuf Demir',
    'ogrenci@midad.com',
    'Ahlak & İslami Değerler',
    'Fatma Zehra Hoca',
    'Zoom Education',
    'https://zoom.us/j/84920491823',
    'confirmed',
    NOW() - INTERVAL '1 day'
  ),
  (
    'apt_seed_3',
    '2026-03-25',
    '16:30 - 17:15',
    'Amina Kaya',
    'amina@example.com',
    'Elif-Bâ & Sıfırdan Kur''an',
    'Şeyh Mahmud el-Ezheri',
    'Google Meet',
    'https://meet.google.com/mid-amina-meet',
    'pending',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- Demo Kullanıcı Profilleri
INSERT INTO public.profiles (email, full_name, role, course)
VALUES
  ('admin@midad.com', 'Midad Yönetici', 'admin', 'Genel Yönetim'),
  ('ogrenci@midad.com', 'Yusuf Demir', 'student', 'Tecvidli Kur''an-ı Kerim')
ON CONFLICT (email) DO NOTHING;
