# SwasthyaSetu AI — Healthcare Access Assistant

> **Problem Statement:** "Create a safe assistant for explaining verified healthcare services and preparing users for consultations, with escalation for urgent concerns."

SwasthyaSetu AI is an independent, trustworthy healthcare access web application built with **React, Vite, TypeScript, and Tailwind CSS**. Inspired by India’s landmark **eSanjeevani National Telemedicine Service** and the **Ayushman Bharat Digital Mission (ABDM)**, the application helps citizens understand verified public healthcare initiatives, structure symptom information into clinical draft summaries for doctor consultations, and escalate life-threatening symptoms directly to official emergency helplines.

---

## ⚠️ Important Prototype Notice
*SwasthyaSetu AI is an independent software prototype for educational and demonstration purposes. It is **not** an official service of the Ministry of Health & Family Welfare (MoHFW), Government of India, or eSanjeevani. All AI-generated outputs are unverified draft summaries for clinician review and never constitute a medical diagnosis or prescription.*

---

## ✨ Key Features & Capabilities

### 1. AI Healthcare Assistant & Emergency Escalation
- **Verified Information Guidance:** Explains government schemes (Ayushman Bharat PM-JAY, eSanjeevani Teleconsultation, Jan Aushadhi Kendras, Tele-MANAS 24/7 mental health).
- **Source Citations:** Every response includes verifiable source links and verification timestamps.
- **Rule-Based Emergency Safety Layer:** Deterministic screening runs before ordinary chat processing. If red-flag symptoms are detected (crushing chest pain, FAST stroke symptoms, severe respiratory failure, anaphylaxis, severe trauma), normal chat is halted and urgent **108 (Ambulance)** and **112 (National Emergency)** guidance is displayed immediately.

### 2. Clinical Consultation Preparation
- Structured intake form capturing:
  - Primary symptoms & duration
  - Relevant medical history
  - Current medications & supplements
  - Known drug allergies
  - Optional patient notes
- Backend synthesis into a structured **Draft for Clinician Review**:
  - Formulated Chief Complaint
  - Synthesized Clinical Brief
  - Suggested clarifying questions to ask the doctor
  - Review & edit capability before attaching to an appointment.

### 3. Patient Portal
- **Dashboard Overview:** Upcoming appointment status, recent signed doctor consultation summaries, quick action cards, and verified schemes.
- **Appointment Booking:** View available demo doctors (e.g. Dr. Ananya Sharma - Internal Medicine, Dr. Rajesh Verma - Cardiology, Dr. Priya Nambiar - Pediatrics) with **double-booking prevention**.
- **Private Health Records:** Compartmentalized storage for diagnostic lab tests, telemedicine prescriptions, and vaccination certificates with upload simulation.

### 4. Doctor Portal
- **Clinical Appointment Queue:** Triage incoming consultation requests (Pending, Confirmed, Completed).
- **Patient Summary Viewer:** View patient-provided intake and AI draft summaries (clearly marked with caution disclaimers).
- **Clinical Documentation:** Dedicated space for recorded vitals, physical findings, and licensed clinician recommendations/follow-up regimen.
- **Doctor Profile:** NMC council registration numbers, credentials, and verification status badges.

### 5. Multilingual & Accessible UI
- Quick toggle between **English** and **हिन्दी (Hindi)**.
- Color palette tailored to Indian healthcare:
  - Primary Teal: `#087E8B`
  - Dark Teal: `#075E68`
  - Verified Green: `#10B981`
  - Alert Red: `#EF4444`
  - Subtle borders and high-contrast accessible typography (Plus Jakarta Sans).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 with Vite |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS with custom healthcare palette |
| **Routing** | React Router v6 (Protected Role Routes) |
| **Icons** | Lucide React |
| **Backend (Optional / Full-Stack)** | Express.js REST API with CORS & JSON body parsing |
| **State & Persistence** | AuthContext + Dual-Mode API Service (REST + Offline Fallback) |

---

## 📡 REST API Endpoints Specification

The frontend connects via a centralized typed service layer in `src/services/api.ts` to the following REST endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate patient or doctor credentials |
| `POST` | `/api/auth/register` | Register new user with role-specific metadata |
| `GET` | `/api/auth/me` | Retrieve currently authenticated profile |
| `GET` | `/api/patient/dashboard` | Fetch patient appointments, consultations, records count |
| `POST` | `/api/assistant/chat` | Send message to AI assistant with safety screening |
| `POST` | `/api/assistant/prepare-consultation` | Generate structured clinician consultation draft |
| `GET` | `/api/services` | Query verified healthcare schemes with search/filter |
| `GET` | `/api/appointments` | Get appointments for patient or clinic |
| `POST` | `/api/appointments` | Request appointment (enforces double-booking check) |
| `PATCH` | `/api/appointments/:id/status` | Doctor updates appointment status (Confirm/Decline) |
| `GET` | `/api/doctor/appointments` | Doctor queue, today's schedule, pending requests |
| `GET` | `/api/consultations/:id` | Fetch consultation intake, draft, and clinical notes |
| `POST` | `/api/consultations/:id/notes` | Doctor saves notes and signs off consultation |
| `GET` | `/api/health-records` | Retrieve patient's private records |
| `POST` | `/api/health-records/upload` | Upload new diagnostic record |

*Note: If the backend Express server is not running or network connectivity fails, the frontend automatically switches to the interactive **Demo Mode** with persistent client storage and a visible banner.*

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create or review `.env`:
```env
VITE_API_BASE_URL=/api
VITE_USE_MOCK_API=false
PORT=5000
```

### 3. Running the Application

#### Option A: Run Full Stack (Frontend + Backend Server)
```bash
npm run dev:all
```
- Frontend: `http://localhost:5173`
- REST API Server: `http://localhost:5000`

#### Option B: Run Frontend Standalone (with Automatic Interactive Demo Fallback)
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 End-to-End Demonstration Walkthrough

To verify the complete healthcare flow required by the master prompt:

1. **Patient Login:**
   - Click **"Patient Portal (1-Click Demo)"** on the landing page or use `patient@demo.swasthyasetu.in` (`demo123`).
2. **AI Health Assistant Query:**
   - Navigate to **"AI Health Assistant"**.
   - Click a suggested prompt (e.g. *"How do I prepare for a doctor consultation?"* or *"Explain a verified healthcare service"*).
   - Observe sourced citations with verified links to official portals (MoHFW, NHA).
   - Test safety screening by typing `"I have severe crushing chest pain"` → observe immediate high-priority emergency escalation to **108 / 112**.
3. **Consultation Preparation:**
   - Go to **"Prepare for Doctor"**.
   - Fill in symptoms, duration (e.g. *"Occasional dizziness and headache for 2 weeks"*), medications, and allergies.
   - Click **"Generate Consultation Draft"**.
   - Review and edit the synthesized draft and suggested questions.
   - Click **"Book Appointment with this Draft"**.
4. **Book Appointment:**
   - Select doctor **Dr. Ananya Sharma**, choose date and demo time slot.
   - Submit request. Double-booking check ensures no overlapping slot.
5. **Doctor Review & Sign-Off:**
   - Use the top demo banner or logout/login to switch to **"Doctor View"** (`Dr. Ananya Sharma`).
   - In the **Pending Requests** queue, see the newly created appointment.
   - Click **"Accept Request"** (status updates to Confirmed).
   - Click **"Open Clinical Notes & Summary"**.
   - Review the patient's self-reported intake and unverified AI draft.
   - Enter physical examination findings in **Clinical Examination & Findings**.
   - Enter follow-up instructions in **Doctor Recommendations**.
   - Click **"Sign & Mark Consultation Completed"**.
6. **Patient Follow-Up Verification:**
   - Switch back to **Patient View** via the top banner.
   - Open **"My Appointments"** or **Dashboard** to see the updated **"Completed"** status with doctor-signed recommendations!

---

## 🔒 Security & Privacy Practices
- Zero exposure of API keys, DB credentials, or secrets in frontend bundle.
- Role-based route guard (`ProtectedRoute`) verifies authorized roles.
- Scoped data access: Doctors only access authorized patient appointments.
- Synthetic, fictional demonstration accounts only.
