# Supabase Migration & Security Verification Guide

This directory contains the reviewed SQL migration scripts, storage policies, and automated transactional test suite for **SwasthyaSetu AI**.

---

## 📁 Migration Files Directory

- **[`supabase/migrations/01_initial_schema.sql`](file:///c:/Users/hp/Desktop/health%20care%20assistance/supabase/migrations/01_initial_schema.sql)**  
  *Main idempotent migration script creating:*
  - `profiles`, `doctor_profiles`, `appointments`, `consultations`, `health_records`, and `services`.
  - Database-enforced double booking constraint on doctor slots.
  - Anti-tampering triggers (`handle_new_user`, `guard_profile_updates`, `guard_doctor_verification`, `guard_appointment_updates`, `guard_consultation_integrity`).
  - Trusted admin promotion procedure (`admin_verify_and_promote_doctor`).
  - Column-level SQL grants preventing unauthorized writes.
  - Complete Row Level Security (RLS) policies for all tables.
  - Private storage bucket `health-records-private` with path-based patient RLS and MIME validation.
  - Initial verified government healthcare schemes seed data.

- **[`supabase/tests/rls_tests.sql`](file:///c:/Users/hp/Desktop/health%20care%20assistance/supabase/tests/rls_tests.sql)**  
  *Self-contained automated RLS test suite running inside an isolated transaction (`BEGIN ... ROLLBACK`). Leaves zero dirty data in your database.*

- **[`supabase/migrations/rollback.sql`](file:///c:/Users/hp/Desktop/health%20care%20assistance/supabase/migrations/rollback.sql)**  
  *Complete clean rollback script if you ever need to reset the schema.*

---

## 🚀 Execution Instructions (Supabase Dashboard)

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project.
3. In the left navigation, click on the **SQL Editor** (icon `>_`).
4. Click **New Query**.
5. Open and copy the entire contents of [`supabase/migrations/01_initial_schema.sql`](file:///c:/Users/hp/Desktop/health%20care%20assistance/supabase/migrations/01_initial_schema.sql).
6. Paste the SQL into the editor and click **Run** (or press `Ctrl+Enter`).
7. Confirm that the execution status shows **Success**.

### Optional: Running the Security Test Suite
1. In the **SQL Editor**, open another tab.
2. Copy and paste the contents of [`supabase/tests/rls_tests.sql`](file:///c:/Users/hp/Desktop/health%20care%20assistance/supabase/tests/rls_tests.sql).
3. Click **Run**.
4. In the output messages, you will see all 5 security test assertions pass:
   - `✓ TEST 1 PASSED: Cross-patient private record access completely blocked.`
   - `✓ TEST 2 PASSED: Legitimate patient cancellation succeeded.`
   - `✓ TEST 3 PASSED: Field tampering during cancellation successfully blocked with 42501.`
   - `✓ TEST 4 PASSED: Role self-promotion blocked with 42501.`
   - `✓ TEST 5 PASSED: Double-booking constraint prevented conflicting reservation.`
