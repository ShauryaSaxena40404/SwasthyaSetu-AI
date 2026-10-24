-- ============================================================================
-- SWASTHYASETU AI — ISOLATED TRANSACTIONAL RLS TEST SUITE
-- Executes in a self-contained transaction with automatic ROLLBACK.
-- ============================================================================

begin;

-- 1. Setup deterministic test fixtures in auth.users
insert into auth.users (id, email)
values 
  ('00000000-0000-4000-a000-000000000001', 'patient1@test.local'),
  ('00000000-0000-4000-a000-000000000002', 'patient2@test.local'),
  ('00000000-0000-4000-a000-000000000003', 'doctor1@test.local')
on conflict (id) do nothing;

-- 2. Setup corresponding profiles
insert into public.profiles (id, name, email, role)
values
  ('00000000-0000-4000-a000-000000000001', 'Test Patient 1', 'patient1@test.local', 'patient'),
  ('00000000-0000-4000-a000-000000000002', 'Test Patient 2', 'patient2@test.local', 'patient'),
  ('00000000-0000-4000-a000-000000000003', 'Dr. Test Physician', 'doctor1@test.local', 'doctor')
on conflict (id) do nothing;

-- 3. Setup test health record for Patient 1
insert into public.health_records (id, patient_id, title, record_type, doctor_or_clinic)
values ('rec-test-1', '00000000-0000-4000-a000-000000000001', 'Private Diagnostic Blood Panel', 'lab_report', 'Pathology Lab');

-- 4. Setup test appointment for Patient 1 with Doctor 1
insert into public.appointments (id, patient_id, doctor_id, date, time_slot, status, symptoms_summary)
values ('apt-test-1', '00000000-0000-4000-a000-000000000001', '00000000-0000-4000-a000-000000000003', '2026-11-20', '10:00 AM', 'pending', 'Mild cough');

-- ----------------------------------------------------------------------------
-- TEST 1: Patient 2 attempts to SELECT Patient 1's private health record
-- EXPECTED RESULT: 0 rows returned (blocked by RLS)
-- ----------------------------------------------------------------------------
set local role authenticated;
set local "request.jwt.claim.sub" = '00000000-0000-4000-a000-000000000002';

do $$
declare
  v_count integer;
begin
  select count(*) into v_count from public.health_records where id = 'rec-test-1';
  if v_count <> 0 then
    raise exception 'TEST 1 FAILED: Patient 2 was able to view Patient 1 records!';
  end if;
  raise notice '✓ TEST 1 PASSED: Cross-patient private record access completely blocked.';
end $$;

-- ----------------------------------------------------------------------------
-- TEST 2: Patient 1 legitimately cancels their own pending appointment
-- EXPECTED RESULT: Status successfully transitions to 'cancelled'
-- ----------------------------------------------------------------------------
set local "request.jwt.claim.sub" = '00000000-0000-4000-a000-000000000001';

update public.appointments 
set status = 'cancelled' 
where id = 'apt-test-1';

do $$
declare
  v_status text;
begin
  select status into v_status from public.appointments where id = 'apt-test-1';
  if v_status <> 'cancelled' then
    raise exception 'TEST 2 FAILED: Patient could not cancel pending appointment.';
  end if;
  raise notice '✓ TEST 2 PASSED: Legitimate patient cancellation succeeded.';
end $$;

-- ----------------------------------------------------------------------------
-- TEST 3: Patient attempts to update protected fields during cancellation
-- EXPECTED RESULT: Error 42501 (Unauthorized: Parameters cannot be altered)
-- ----------------------------------------------------------------------------
do $$
begin
  -- Reset to pending for test
  update public.appointments set status = 'pending' where id = 'apt-test-1';
  
  -- Attempt to maliciously tamper with urgency level while cancelling
  update public.appointments 
  set status = 'cancelled', urgency_level = 'urgent' 
  where id = 'apt-test-1';

  raise exception 'TEST 3 FAILED: Field tampering during cancellation was allowed!';
exception
  when sqlstate '42501' then
    raise notice '✓ TEST 3 PASSED: Field tampering during cancellation successfully blocked with 42501.';
end $$;

-- ----------------------------------------------------------------------------
-- TEST 4: Patient attempts to modify their role to 'doctor'
-- EXPECTED RESULT: Error 42501 (Unauthorized: Client cannot modify role)
-- ----------------------------------------------------------------------------
do $$
begin
  update public.profiles set role = 'doctor' where id = '00000000-0000-4000-a000-000000000001';
  raise exception 'TEST 4 FAILED: Role self-promotion was not blocked!';
exception
  when sqlstate '42501' then
    raise notice '✓ TEST 4 PASSED: Role self-promotion blocked with 42501.';
end $$;

-- ----------------------------------------------------------------------------
-- TEST 5: Double-booking duplicate slot insertion
-- EXPECTED RESULT: Error unique_violation
-- ----------------------------------------------------------------------------
reset role; -- Run as admin to test database constraint directly
do $$
begin
  -- Reactivate appointment slot
  update public.appointments set status = 'confirmed' where id = 'apt-test-1';

  -- Attempt to insert second appointment for same doctor, date, and slot
  insert into public.appointments (id, patient_id, doctor_id, date, time_slot, status, symptoms_summary)
  values ('apt-test-conflict', '00000000-0000-4000-a000-000000000002', '00000000-0000-4000-a000-000000000003', '2026-11-20', '10:00 AM', 'pending', 'Conflicting booking');
  
  raise exception 'TEST 5 FAILED: Conflicting double booking was allowed!';
exception
  when unique_violation then
    raise notice '✓ TEST 5 PASSED: Double-booking constraint prevented conflicting reservation.';
end $$;

-- Clean rollback leaving zero dirty data in database
rollback;
