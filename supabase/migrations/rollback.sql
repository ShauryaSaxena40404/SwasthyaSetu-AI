-- ============================================================================
-- SWASTHYASETU AI — MIGRATION ROLLBACK SCRIPT
-- Drops all Phase 2 schema objects, triggers, and policies cleanly.
-- ============================================================================

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

drop function if exists public.guard_profile_updates() cascade;
drop function if exists public.guard_doctor_verification() cascade;
drop function if exists public.guard_appointment_updates() cascade;
drop function if exists public.guard_consultation_integrity() cascade;
drop function if exists public.admin_verify_and_promote_doctor(uuid, text, text, text, integer, text, text);

drop table if exists public.health_records cascade;
drop table if exists public.consultations cascade;
drop table if exists public.appointments cascade;
drop table if exists public.doctor_profiles cascade;
drop table if exists public.profiles cascade;
drop table if exists public.services cascade;

-- Storage bucket cleanup
delete from storage.buckets where id = 'health-records-private';
