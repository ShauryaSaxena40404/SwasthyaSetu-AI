-- ============================================================================
-- SWASTHYASETU AI — PRODUCTION DATABASE MIGRATION (PHASE 2 REVISED)
-- Schema: Profiles, Doctor Profiles, Appointments, Consultations,
--         Health Records, Services, and Private Medical Storage.
-- Security: Strict RLS, anti-tampering triggers, and column-level grants.
-- ============================================================================

-- 0. EXTENSIONS & PREREQUISITES
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 1. SCHEMAS & TABLES
-- ============================================================================

-- 1.1 PROFILES (Linked 1:1 to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null unique,
  role text not null default 'patient' check (role in ('patient', 'doctor')),
  phone text,
  gender text check (gender in ('male', 'female', 'other')),
  age integer check (age > 0 and age < 125),
  abha_id text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 1.2 DOCTOR PROFILES (Professional verification & availability)
create table if not exists public.doctor_profiles (
  id uuid default gen_random_uuid() primary key,
  doctor_id uuid not null references public.profiles(id) on delete cascade unique,
  specialty text not null,
  registration_number text not null,
  qualifications text not null,
  experience_years integer not null default 0 check (experience_years >= 0),
  is_verified boolean not null default false, -- Immutable by client connection
  verification_date timestamptz,
  verified_by text,
  hospital_or_clinic text,
  available_days text[] default array['Monday','Tuesday','Wednesday','Thursday','Friday']::text[],
  time_slots text[] default array['09:30 AM','11:00 AM','02:30 PM','04:00 PM']::text[],
  languages text[] default array['English','Hindi']::text[],
  bio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 1.3 APPOINTMENTS (With double-booking prevention)
create table if not exists public.appointments (
  id text default ('apt-' || substr(md5(random()::text), 1, 8)) primary key,
  patient_id uuid not null references public.profiles(id) on delete cascade,
  doctor_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  time_slot text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'rejected')),
  urgency_level text not null default 'routine' check (urgency_level in ('routine', 'moderate', 'urgent')),
  symptoms_summary text not null,
  consultation_id text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Double-booking prevention index
create unique index if not exists idx_unique_doctor_booking_slot 
  on public.appointments (doctor_id, date, time_slot) 
  where (status not in ('cancelled', 'rejected'));

-- 1.4 CONSULTATIONS (Intake, draft synthesis, and doctor clinical notes)
create table if not exists public.consultations (
  id text default ('cons-' || substr(md5(random()::text), 1, 8)) primary key,
  appointment_id text references public.appointments(id) on delete set null,
  patient_id uuid not null references public.profiles(id) on delete cascade,
  doctor_id uuid not null references public.profiles(id) on delete cascade,
  patient_input jsonb not null default '{}'::jsonb,
  ai_draft_summary jsonb not null default '{}'::jsonb,
  clinical_notes text default '',
  doctor_recommendations text default '',
  status text not null default 'draft' check (status in ('draft', 'in_progress', 'completed')),
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 1.5 HEALTH RECORDS (Strict patient private locker)
create table if not exists public.health_records (
  id text default ('rec-' || substr(md5(random()::text), 1, 8)) primary key,
  patient_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  record_type text not null check (record_type in ('lab_report', 'prescription', 'consultation_summary', 'vaccination_record')),
  date date not null default current_date,
  doctor_or_clinic text not null,
  storage_path text, -- References private Supabase storage bucket
  file_size text,
  file_type text default 'PDF',
  notes text,
  created_at timestamptz default now() not null
);

-- 1.6 SERVICES (Verified government healthcare initiatives)
create table if not exists public.services (
  id text primary key,
  name text not null,
  name_hindi text not null,
  category text not null,
  description text not null,
  description_hindi text not null,
  eligibility text not null,
  required_documents text[] default array[]::text[],
  application_steps text[] default array[]::text[],
  official_portal_url text not null,
  helpline text not null,
  last_verified_date date not null default current_date,
  is_verified boolean not null default true,
  verification_authority text not null default 'Ministry of Health & Family Welfare',
  coverage_details text not null,
  created_at timestamptz default now() not null
);

-- ============================================================================
-- 2. INDEXES FOR QUERY OPTIMIZATION
-- ============================================================================
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_doctor_profiles_specialty on public.doctor_profiles(specialty);
create index if not exists idx_doctor_profiles_verified on public.doctor_profiles(is_verified);
create index if not exists idx_appointments_patient on public.appointments(patient_id);
create index if not exists idx_appointments_doctor on public.appointments(doctor_id);
create index if not exists idx_appointments_date on public.appointments(date);
create index if not exists idx_consultations_patient on public.consultations(patient_id);
create index if not exists idx_consultations_doctor on public.consultations(doctor_id);
create index if not exists idx_health_records_patient on public.health_records(patient_id);
create index if not exists idx_services_category on public.services(category);

-- ============================================================================
-- 3. ANTI-TAMPERING & INTEGRITY TRIGGERS
-- ============================================================================

-- 3.1 SECURE NEW USER TRIGGER (Forces role to 'patient', safe fallbacks)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_email text;
  v_name text;
begin
  v_email := coalesce(new.email, 'no-email-' || new.id::text || '@swasthyasetu.local');
  v_name := coalesce(new.raw_user_meta_data->>'name', split_part(v_email, '@', 1));
  if trim(v_name) = '' then
    v_name := 'Patient ' || substr(new.id::text, 1, 6);
  end if;

  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    v_email,
    v_name,
    'patient' -- HARDCODED: Public registration can NEVER self-assign the doctor role
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3.2 PROFILE IMMUTABILITY GUARD
create or replace function public.guard_profile_updates()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.role <> old.role and current_user not in ('service_role', 'supabase_admin') then
    raise exception 'Unauthorized: Client cannot modify role.' using errcode = '42501';
  end if;

  if new.id <> old.id then
    raise exception 'Unauthorized: User ID is immutable.' using errcode = '42501';
  end if;

  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tr_guard_profile_updates on public.profiles;
create trigger tr_guard_profile_updates
  before update on public.profiles
  for each row execute procedure public.guard_profile_updates();

-- 3.3 DOCTOR VERIFICATION GUARD
create or replace function public.guard_doctor_verification()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.is_verified <> old.is_verified and current_user not in ('service_role', 'supabase_admin') then
    raise exception 'Unauthorized: Practitioner verification requires admin authority.' using errcode = '42501';
  end if;

  if new.doctor_id <> old.doctor_id then
    raise exception 'Unauthorized: doctor_id assignment is immutable.' using errcode = '42501';
  end if;

  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tr_guard_doctor_verification on public.doctor_profiles;
create trigger tr_guard_doctor_verification
  before update on public.doctor_profiles
  for each row execute procedure public.guard_doctor_verification();

-- 3.4 APPOINTMENT UPDATE GUARD (Protects cancellations against field tampering)
create or replace function public.guard_appointment_updates()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if current_user not in ('service_role', 'supabase_admin') then
    -- Immutable IDs
    if new.patient_id <> old.patient_id or new.doctor_id <> old.doctor_id then
      raise exception 'Unauthorized: patient_id and doctor_id are immutable.' using errcode = '42501';
    end if;

    -- If the caller is the patient
    if auth.uid() = old.patient_id then
      if old.status <> 'pending' then
        raise exception 'Unauthorized: Only pending appointments can be cancelled by patient.' using errcode = '42501';
      end if;

      if new.status <> 'cancelled' then
        raise exception 'Unauthorized: Patients may only change status to cancelled.' using errcode = '42501';
      end if;

      -- Patient cannot alter doctor notes or appointment parameters during cancellation
      if new.urgency_level <> old.urgency_level or
         new.date <> old.date or
         new.time_slot <> old.time_slot or
         new.symptoms_summary <> old.symptoms_summary or
         coalesce(new.notes, '') <> coalesce(old.notes, '') or
         coalesce(new.consultation_id, '') <> coalesce(old.consultation_id, '') then
        raise exception 'Unauthorized: Parameters cannot be altered during cancellation.' using errcode = '42501';
      end if;
    end if;
  end if;

  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tr_guard_appointment_updates on public.appointments;
create trigger tr_guard_appointment_updates
  before update on public.appointments
  for each row execute procedure public.guard_appointment_updates();

-- 3.5 CONSULTATION INTEGRITY GUARD (Cross-table linkage & clinical notes protection)
create or replace function public.guard_consultation_integrity()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_appt record;
begin
  if current_user not in ('service_role', 'supabase_admin') then
    -- Verify appointment relationship on insert/update
    if new.appointment_id is not null then
      select patient_id, doctor_id into v_appt 
      from public.appointments 
      where id = new.appointment_id;

      if not found then
        raise exception 'Invalid appointment reference.' using errcode = '23503';
      end if;

      if new.patient_id <> v_appt.patient_id or new.doctor_id <> v_appt.doctor_id then
        raise exception 'Consultation participants do not match linked appointment.' using errcode = '42501';
      end if;
    end if;

    -- Update rules
    if tg_op = 'UPDATE' then
      if new.patient_id <> old.patient_id or new.doctor_id <> old.doctor_id then
        raise exception 'Consultation participant IDs are immutable.' using errcode = '42501';
      end if;

      -- Patient editing draft
      if auth.uid() = old.patient_id then
        if old.status <> 'draft' then
          raise exception 'Patient cannot modify completed consultations.' using errcode = '42501';
        end if;
        if new.clinical_notes <> old.clinical_notes or
           new.doctor_recommendations <> old.doctor_recommendations or
           new.status <> old.status then
          raise exception 'Unauthorized: Patients cannot modify clinical notes or status.' using errcode = '42501';
        end if;
      end if;

      -- Doctor editing
      if auth.uid() = old.doctor_id then
        if new.patient_input::text <> old.patient_input::text or
           new.ai_draft_summary::text <> old.ai_draft_summary::text then
          raise exception 'Doctor cannot alter patient self-reported intake history.' using errcode = '42501';
        end if;
      end if;
    end if;
  end if;

  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tr_guard_consultation_integrity on public.consultations;
create trigger tr_guard_consultation_integrity
  before insert or update on public.consultations
  for each row execute procedure public.guard_consultation_integrity();

-- ============================================================================
-- 4. TRUSTED ADMIN PROMOTION PROCEDURE (NO PUBLIC CLIENT ACCESS)
-- ============================================================================
create or replace function public.admin_verify_and_promote_doctor(
  target_user_id uuid,
  p_specialty text,
  p_registration_number text,
  p_qualifications text,
  p_experience_years integer,
  p_hospital text,
  p_admin_identifier text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- Strictly restricted to service_role or admin
  if current_user not in ('service_role', 'supabase_admin') then
    raise exception 'Unauthorized: Administrative credentials required.' using errcode = '42501';
  end if;

  update public.profiles 
  set role = 'doctor', updated_at = now()
  where id = target_user_id;

  insert into public.doctor_profiles (
    doctor_id, specialty, registration_number, qualifications,
    experience_years, is_verified, verification_date, verified_by, hospital_or_clinic
  )
  values (
    target_user_id, p_specialty, p_registration_number, p_qualifications,
    p_experience_years, true, now(), p_admin_identifier, p_hospital
  )
  on conflict (doctor_id) do update set
    specialty = excluded.specialty,
    registration_number = excluded.registration_number,
    qualifications = excluded.qualifications,
    experience_years = excluded.experience_years,
    is_verified = true,
    verification_date = now(),
    verified_by = excluded.verified_by,
    hospital_or_clinic = excluded.hospital_or_clinic,
    updated_at = now();
end;
$$;

-- Revoke from all public and standard authenticated roles
revoke execute on function public.admin_verify_and_promote_doctor from public, anon, authenticated;

-- ============================================================================
-- 5. COLUMN-LEVEL SQL GRANTS
-- ============================================================================
revoke all on public.profiles from public;
revoke all on public.doctor_profiles from public;
revoke all on public.appointments from public;
revoke all on public.consultations from public;
revoke all on public.health_records from public;
revoke all on public.services from public;

-- Profiles: Authenticated users can select and update demographic fields only
grant select on public.profiles to authenticated;
grant update (name, phone, gender, age, abha_id) on public.profiles to authenticated;

-- Doctor Profiles: Public directory reading, doctor edits bio/schedule only
grant select on public.doctor_profiles to authenticated, anon;
grant update (hospital_or_clinic, available_days, time_slots, languages, bio) on public.doctor_profiles to authenticated;

-- Appointments, Consultations, Health Records, Services
grant select, insert, update on public.appointments to authenticated;
grant select, insert, update on public.consultations to authenticated;
grant select, insert, update, delete on public.health_records to authenticated;
grant select on public.services to authenticated, anon;

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.doctor_profiles enable row level security;
alter table public.appointments enable row level security;
alter table public.consultations enable row level security;
alter table public.health_records enable row level security;
alter table public.services enable row level security;

-- 6.1 PROFILES POLICIES
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_select_doctor_assigned_patient" on public.profiles;
create policy "profiles_select_doctor_assigned_patient"
  on public.profiles for select to authenticated
  using (
    exists (
      select 1 from public.appointments
      where appointments.doctor_id = auth.uid()
        and appointments.patient_id = profiles.id
    )
  );

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 6.2 DOCTOR PROFILES POLICIES
drop policy if exists "doctor_profiles_select_directory" on public.doctor_profiles;
create policy "doctor_profiles_select_directory"
  on public.doctor_profiles for select to authenticated, anon
  using (true);

drop policy if exists "doctor_profiles_update_own" on public.doctor_profiles;
create policy "doctor_profiles_update_own"
  on public.doctor_profiles for update to authenticated
  using (auth.uid() = doctor_id)
  with check (auth.uid() = doctor_id);

-- 6.3 APPOINTMENTS POLICIES
drop policy if exists "appointments_select_patient" on public.appointments;
create policy "appointments_select_patient"
  on public.appointments for select to authenticated
  using (auth.uid() = patient_id);

drop policy if exists "appointments_select_doctor" on public.appointments;
create policy "appointments_select_doctor"
  on public.appointments for select to authenticated
  using (auth.uid() = doctor_id);

drop policy if exists "appointments_insert_patient" on public.appointments;
create policy "appointments_insert_patient"
  on public.appointments for insert to authenticated
  with check (auth.uid() = patient_id);

drop policy if exists "appointments_update_patient_cancel" on public.appointments;
create policy "appointments_update_patient_cancel"
  on public.appointments for update to authenticated
  using (auth.uid() = patient_id and status = 'pending')
  with check (auth.uid() = patient_id and status in ('pending', 'cancelled'));

drop policy if exists "appointments_update_doctor_manage" on public.appointments;
create policy "appointments_update_doctor_manage"
  on public.appointments for update to authenticated
  using (auth.uid() = doctor_id)
  with check (auth.uid() = doctor_id);

-- 6.4 CONSULTATIONS POLICIES
drop policy if exists "consultations_select_participants" on public.consultations;
create policy "consultations_select_participants"
  on public.consultations for select to authenticated
  using (auth.uid() = patient_id or auth.uid() = doctor_id);

drop policy if exists "consultations_insert_patient" on public.consultations;
create policy "consultations_insert_patient"
  on public.consultations for insert to authenticated
  with check (auth.uid() = patient_id);

drop policy if exists "consultations_update_patient_draft" on public.consultations;
create policy "consultations_update_patient_draft"
  on public.consultations for update to authenticated
  using (auth.uid() = patient_id and status = 'draft')
  with check (auth.uid() = patient_id and status = 'draft');

drop policy if exists "consultations_update_doctor_sign" on public.consultations;
create policy "consultations_update_doctor_sign"
  on public.consultations for update to authenticated
  using (auth.uid() = doctor_id)
  with check (auth.uid() = doctor_id);

-- 6.5 HEALTH RECORDS POLICIES (Strict Patient Privacy Sandbox)
drop policy if exists "health_records_all_owner_only" on public.health_records;
create policy "health_records_all_owner_only"
  on public.health_records for all to authenticated
  using (auth.uid() = patient_id)
  with check (auth.uid() = patient_id);

-- 6.6 SERVICES POLICIES (Read-Only)
drop policy if exists "services_select_public" on public.services;
create policy "services_select_public"
  on public.services for select to authenticated, anon
  using (true);

-- ============================================================================
-- 7. PRIVATE MEDICAL STORAGE (health-records-private)
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'health-records-private',
  'health-records-private',
  false,
  10485760, -- 10 MB limit
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png'];

drop policy if exists "storage_records_insert_patient" on storage.objects;
create policy "storage_records_insert_patient"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'health-records-private' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "storage_records_select_patient" on storage.objects;
create policy "storage_records_select_patient"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'health-records-private' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "storage_records_delete_patient" on storage.objects;
create policy "storage_records_delete_patient"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'health-records-private' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================================
-- 8. INITIAL VERIFIED SERVICES SEED DATA
-- ============================================================================
insert into public.services (
  id, name, name_hindi, category, description, description_hindi,
  eligibility, required_documents, application_steps, official_portal_url,
  helpline, last_verified_date, is_verified, verification_authority, coverage_details
) values
(
  'pm-jay',
  'Ayushman Bharat PM-JAY',
  'आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना',
  'Insurance & Financial Aid',
  'World’s largest government-funded healthcare assurance scheme offering up to ₹5,00,000 per family per year for secondary and tertiary care hospitalization.',
  'द्वितीयक और तृतीयक अस्पताल में भर्ती के लिए प्रति परिवार प्रति वर्ष ₹5 लाख तक का कैशलेस स्वास्थ्य बीमा।',
  'SECC 2011 deprivation criteria and citizens aged 70+ regardless of income under the Senior Citizen PM-JAY expansion.',
  array['Aadhaar Card', 'Ration Card / PM-JAY Family ID', 'Linked Mobile Number'],
  array[
    'Check eligibility on beneficiary.nha.gov.in using mobile and Aadhaar',
    'Visit nearest Ayushman Mitra kiosk at empanelled hospital for biometric e-KYC',
    'Generate Ayushman Golden Card for cashless admission'
  ],
  'https://beneficiary.nha.gov.in',
  '14555 / 1800-111-565',
  '2026-09-15',
  true,
  'National Health Authority (NHA) & MoHFW',
  'Covers over 1,949 medical procedures across 27,000+ empanelled public and private hospitals.'
),
(
  'esanjeevani',
  'eSanjeevani National Telemedicine Service',
  'ई-संजीवनी राष्ट्रीय टेलीकंसल्टेशन सेवा',
  'Telemedicine',
  'The National Teleconsultation Service by the Ministry of Health & Family Welfare connecting citizens directly to registered medical practitioners from home.',
  'घर बैठे सरकारी एवं पैनल के डॉक्टरों से निःशुल्क डिजिटल ओपीडी परामर्श प्राप्त करें।',
  'All Indian citizens with an internet-enabled smartphone, tablet, or computer.',
  array['Mobile phone number for OTP', 'Aadhaar or ABHA ID', 'Previous prescriptions (optional)'],
  array[
    'Log into esanjeevani.mohfw.gov.in or mobile app',
    'Select state and OPD specialty (General Medicine, Pediatrics, etc.)',
    'Consult clinician via audio/video call and download signed electronic prescription'
  ],
  'https://esanjeevani.mohfw.gov.in',
  '1075 / 011-23978046',
  '2026-10-01',
  true,
  'Ministry of Health & Family Welfare (MoHFW)',
  'Free government tele-OPD active in all states and union territories.'
),
(
  'jan-aushadhi',
  'Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)',
  'प्रधानमंत्री भारतीय जनऔषधि परियोजना',
  'Medicine & Pharmacy',
  'Government initiative ensuring access to high-quality unbranded generic medicines at 50% to 90% lower prices compared to branded market alternatives.',
  'ब्रांडेड दवाओं की तुलना में 50% से 90% कम कीमत पर उच्च गुणवत्ता वाली जेनेरिक दवाएं।',
  'Open to all citizens without income or residency restrictions.',
  array['Valid medical prescription from registered doctor for scheduled drugs'],
  array[
    'Locate nearest Jan Aushadhi Kendra using Jan Aushadhi Sugam portal or app',
    'Present valid prescription',
    'Receive equivalent therapeutic generic medicines tested by NABL accredited labs'
  ],
  'https://janaushadhi.gov.in',
  '1800-180-8080',
  '2026-08-20',
  true,
  'Pharmaceuticals & Medical Devices Bureau of India (PMBI)',
  'Product basket of over 2,047 generic medicines and 300 surgical items across 10,000+ Kendras.'
),
(
  'tele-manas',
  'Tele-MANAS (Mental Health Helpline)',
  'टेली-मानस (राष्ट्रीय मानसिक स्वास्थ्य हेल्पलाइन)',
  'Mental Health',
  '24/7 round-the-clock free tele-mental health assistance helpline providing psychological first-aid and clinical triage in 20+ regional Indian languages.',
  'तनाव, चिंता, अवसाद एवं मानसिक स्वास्थ्य परामर्श हेतु 24x7 निःशुल्क एवं गोपनीय हेल्पलाइन।',
  'Any person experiencing anxiety, depression, exam stress, grief, or emotional distress across India.',
  array['None required. Completely anonymous and confidential.'],
  array[
    'Dial toll-free 14416 or 1800-891-4416',
    'Select preferred language from IVR prompts',
    'Connect with certified mental health counselor or clinical psychologist'
  ],
  'https://telemanas.mohfw.gov.in',
  '14416 / 1800-891-4416',
  '2026-09-30',
  true,
  'NIMHANS & Ministry of Health and Family Welfare',
  'Tier-1 mental health counseling with Tier-2 clinical psychiatric referrals.'
)
on conflict (id) do nothing;
