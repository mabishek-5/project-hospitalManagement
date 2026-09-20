/*
# Hospital Management System — core tables

1. New Tables
- `patients`
  - id (uuid, primary key)
  - patient_code (text, unique, human-readable ID like P-001)
  - name (text, not null)
  - age (int, not null, check >= 0)
  - gender (text, not null, check in Male/Female/Other)
  - phone (text, not null)
  - email (text)
  - address (text)
  - blood_group (text, check in A+/A-/B+/B-/AB+/AB-/O+/O-)
  - medical_condition (text)
  - created_at (timestamptz)
- `doctors`
  - id (uuid, primary key)
  - doctor_code (text, unique, human-readable ID like D-001)
  - name (text, not null)
  - specialization (text, not null)
  - department (text, not null)
  - phone (text, not null)
  - email (text)
  - experience (int, not null, check >= 0)
  - created_at (timestamptz)
- `appointments`
  - id (uuid, primary key)
  - appointment_code (text, unique, human-readable ID like A-001)
  - patient_id (uuid, references patients(id) on delete cascade)
  - doctor_id (uuid, references doctors(id) on delete cascade)
  - appointment_date (date, not null)
  - appointment_time (text, not null)
  - reason (text)
  - status (text, not null default 'Scheduled', check in Scheduled/Completed/Cancelled)
  - created_at (timestamptz)

2. Security
- Enable RLS on all three tables.
- This is a single-tenant demo app with NO sign-in screen, so policies use
  `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)` because
  the data is intentionally shared/public across the hospital staff UI.

3. Sample Data
- Inserts 8 patients, 8 doctors, and 8 appointments so the app looks populated on first open.
*/

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_code text UNIQUE NOT NULL,
  name text NOT NULL,
  age int NOT NULL CHECK (age >= 0),
  gender text NOT NULL CHECK (gender IN ('Male','Female','Other')),
  phone text NOT NULL,
  email text,
  address text,
  blood_group text CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  medical_condition text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_patients" ON patients;
CREATE POLICY "anon_select_patients" ON patients FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_patients" ON patients;
CREATE POLICY "anon_insert_patients" ON patients FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_patients" ON patients;
CREATE POLICY "anon_update_patients" ON patients FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_patients" ON patients;
CREATE POLICY "anon_delete_patients" ON patients FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_code text UNIQUE NOT NULL,
  name text NOT NULL,
  specialization text NOT NULL,
  department text NOT NULL,
  phone text NOT NULL,
  email text,
  experience int NOT NULL CHECK (experience >= 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_doctors" ON doctors;
CREATE POLICY "anon_select_doctors" ON doctors FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_doctors" ON doctors;
CREATE POLICY "anon_insert_doctors" ON doctors FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_doctors" ON doctors;
CREATE POLICY "anon_update_doctors" ON doctors FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_doctors" ON doctors;
CREATE POLICY "anon_delete_doctors" ON doctors FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_code text UNIQUE NOT NULL,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled','Completed','Cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_appointments" ON appointments;
CREATE POLICY "anon_select_appointments" ON appointments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;
CREATE POLICY "anon_insert_appointments" ON appointments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_appointments" ON appointments;
CREATE POLICY "anon_update_appointments" ON appointments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_appointments" ON appointments;
CREATE POLICY "anon_delete_appointments" ON appointments FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- Sample data: patients
INSERT INTO patients (patient_code, name, age, gender, phone, email, address, blood_group, medical_condition) VALUES
('P-001', 'John Carter', 45, 'Male', '+1-555-0101', 'john.carter@email.com', '12 Oak Street, Springfield', 'O+', 'Hypertension'),
('P-002', 'Emily Davis', 32, 'Female', '+1-555-0102', 'emily.davis@email.com', '88 Maple Avenue, Riverdale', 'A-', 'Asthma'),
('P-003', 'Michael Chen', 58, 'Male', '+1-555-0103', 'michael.chen@email.com', '45 Pine Road, Lakeside', 'B+', 'Type 2 Diabetes'),
('P-004', 'Sarah Johnson', 27, 'Female', '+1-555-0104', 'sarah.johnson@email.com', '9 Cedar Lane, Hill Valley', 'AB+', 'Migraine'),
('P-005', 'Robert Wilson', 63, 'Male', '+1-555-0105', 'robert.wilson@email.com', '230 Elm Street, Greendale', 'O-', 'Arthritis'),
('P-006', 'Linda Martinez', 39, 'Female', '+1-555-0106', 'linda.martinez@email.com', '17 Birch Boulevard, Brookfield', 'A+', 'Allergic Rhinitis'),
('P-007', 'David Thompson', 51, 'Male', '+1-555-0107', 'david.thompson@email.com', '34 Willow Way, Fairview', 'B-', 'Coronary Artery Disease'),
('P-008', 'Jessica Brown', 24, 'Female', '+1-555-0108', 'jessica.brown@email.com', '56 Aspen Court, Westwood', 'O+', 'Anemia')
ON CONFLICT (patient_code) DO NOTHING;

-- Sample data: doctors
INSERT INTO doctors (doctor_code, name, specialization, department, phone, email, experience) VALUES
('D-001', 'Dr. Alice Roberts', 'Cardiology', 'Cardiology', '+1-555-0201', 'alice.roberts@hospital.com', 15),
('D-002', 'Dr. James Smith', 'Neurology', 'Neurology', '+1-555-0202', 'james.smith@hospital.com', 12),
('D-003', 'Dr. Olivia Taylor', 'Pediatrics', 'Pediatrics', '+1-555-0203', 'olivia.taylor@hospital.com', 8),
('D-004', 'Dr. Daniel Lee', 'Orthopedics', 'Orthopedics', '+1-555-0204', 'daniel.lee@hospital.com', 18),
('D-005', 'Dr. Sophia Garcia', 'Dermatology', 'Dermatology', '+1-555-0205', 'sophia.garcia@hospital.com', 10),
('D-006', 'Dr. William Clark', 'General Medicine', 'General Medicine', '+1-555-0206', 'william.clark@hospital.com', 20),
('D-007', 'Dr. Emma Lewis', 'Gynecology', 'Gynecology', '+1-555-0207', 'emma.lewis@hospital.com', 14),
('D-008', 'Dr. Matthew Walker', 'Psychiatry', 'Psychiatry', '+1-555-0208', 'matthew.walker@hospital.com', 9)
ON CONFLICT (doctor_code) DO NOTHING;

-- Sample data: appointments (reference the patient/doctor codes above by sub-selecting their ids)
INSERT INTO appointments (appointment_code, patient_id, doctor_id, appointment_date, appointment_time, reason, status)
SELECT 'A-001', p.id, d.id, CURRENT_DATE + 1, '09:00', 'Routine cardiac check-up', 'Scheduled'
FROM patients p, doctors d WHERE p.patient_code='P-001' AND d.doctor_code='D-001'
ON CONFLICT (appointment_code) DO NOTHING;

INSERT INTO appointments (appointment_code, patient_id, doctor_id, appointment_date, appointment_time, reason, status)
SELECT 'A-002', p.id, d.id, CURRENT_DATE + 1, '10:30', 'Migraine consultation', 'Scheduled'
FROM patients p, doctors d WHERE p.patient_code='P-004' AND d.doctor_code='D-002'
ON CONFLICT (appointment_code) DO NOTHING;

INSERT INTO appointments (appointment_code, patient_id, doctor_id, appointment_date, appointment_time, reason, status)
SELECT 'A-003', p.id, d.id, CURRENT_DATE + 2, '14:00', 'Diabetes management review', 'Scheduled'
FROM patients p, doctors d WHERE p.patient_code='P-003' AND d.doctor_code='D-006'
ON CONFLICT (appointment_code) DO NOTHING;

INSERT INTO appointments (appointment_code, patient_id, doctor_id, appointment_date, appointment_time, reason, status)
SELECT 'A-004', p.id, d.id, CURRENT_DATE, '11:15', 'Joint pain assessment', 'Completed'
FROM patients p, doctors d WHERE p.patient_code='P-005' AND d.doctor_code='D-004'
ON CONFLICT (appointment_code) DO NOTHING;

INSERT INTO appointments (appointment_code, patient_id, doctor_id, appointment_date, appointment_time, reason, status)
SELECT 'A-005', p.id, d.id, CURRENT_DATE + 3, '08:45', 'Skin rash evaluation', 'Scheduled'
FROM patients p, doctors d WHERE p.patient_code='P-006' AND d.doctor_code='D-005'
ON CONFLICT (appointment_code) DO NOTHING;

INSERT INTO appointments (appointment_code, patient_id, doctor_id, appointment_date, appointment_time, reason, status)
SELECT 'A-006', p.id, d.id, CURRENT_DATE - 2, '15:30', 'Asthma follow-up', 'Completed'
FROM patients p, doctors d WHERE p.patient_code='P-002' AND d.doctor_code='D-006'
ON CONFLICT (appointment_code) DO NOTHING;

INSERT INTO appointments (appointment_code, patient_id, doctor_id, appointment_date, appointment_time, reason, status)
SELECT 'A-007', p.id, d.id, CURRENT_DATE + 5, '13:00', 'Anemia treatment plan', 'Scheduled'
FROM patients p, doctors d WHERE p.patient_code='P-008' AND d.doctor_code='D-006'
ON CONFLICT (appointment_code) DO NOTHING;

INSERT INTO appointments (appointment_code, patient_id, doctor_id, appointment_date, appointment_time, reason, status)
SELECT 'A-008', p.id, d.id, CURRENT_DATE - 5, '09:30', 'CAD diagnostic review', 'Cancelled'
FROM patients p, doctors d WHERE p.patient_code='P-007' AND d.doctor_code='D-001'
ON CONFLICT (appointment_code) DO NOTHING;