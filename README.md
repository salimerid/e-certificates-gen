# TBC Construction Admin Dashboard & Certificate Generator

A modern Next.js dashboard panel for **TBC Construction**, featuring authentication, personnel and training records management, MySQL database persistence via Docker Compose, and 2-page ID card certificate PDF generation matching `generate-certificate.pdf` with dynamic QR code verification.

---

## 🌟 Key Features

1. **Modern TBC Construction Dashboard**:
   - Rebranded to **TBC Construction** with custom corporate geometric logo (`public/images/tbc-logo.png` & `public/images/tbc-logo.svg`).
   - Clean, modern SaaS aesthetic with Lucide React icons, real-time KPI metrics cards, and responsive data tables.
   - Sidebar navigation: **All Records** and **Add Record**.
   - Search & filter records by name, ID, site, or job title.
   - Dynamic badge counts and action buttons for QR view, certificate download, edit, and deletion.

2. **Authentication**:
   - Protected `/admin/*` routes with Next.js middleware and JWT cookies (`hsse_auth_token`).
   - Sign in page at `/login` with default demo credentials:
     - **Email:** `admin@hsse.com`
     - **Password:** `admin123`
   - Secure password hashing with bcrypt.

3. **Complete CRUD Operations**:
   - **Add New Record (`/admin/create`)**:
     - Personal Information (Name, HSSE Profile ID, People ID, Site, Department, Job Title, Role Scope, People Type, Joining Date, Portrait Photo).
     - Certificate & Card details with auto-generation of certificate numbers.
     - Dynamic training log rows with "+ Add Training" and "Remove" options (Topic, Training Site, Dates, Hours, Score %, Training Drive, Methodology, Recertification Date).
   - **Update Record (`/admin/[id]/edit`)**: Pre-populated form to update personal details and all training rows.
   - **Delete Record**: Confirmation prompt and cascade deletion from MySQL.

4. **Certificate PDF Generation (Matches `generate-certificate.pdf`)**:
   - Two-sided landscape ID card format (755.25 x 475.5 pt).
   - **Page 1 (Front)**:
     - Bureau Veritas logo, faint emblem watermark, Certificate No, Ref.#, Issued On, Valid until.
     - Person's portrait photo.
     - Name, ID No, Company, Issuance No.
     - Bottom certification notice and contact details.
   - **Page 2 (Back)**:
     - High-resolution QR Code pointing to the public details page.
     - Certificate details (Type, Model, Trainer, Location).
     - Full legal disclaimer paragraph.
     - Verification link in red.

5. **Public Details Page via QR Code (No Login Required)**:
   - When the QR code on the certificate card is scanned, it redirects directly to `/record/[uuid]`.
   - Accessible to anyone **without logging in**.
   - Renders the exact **Individual Training Log** layout from `info/Individual Training Log – MD IKRAM HUSSAIN.html`.
   - Includes printable view and a button to download the official Certificate PDF.

6. **MySQL Database in Same Project**:
   - Configured via [docker-compose.yml](file:///Users/ahmed/Projects/Work/certificate-gen/docker-compose.yml) running MySQL 8.0 on port `3306`.
   - Managed with Prisma ORM (`prisma/schema.prisma`).
   - Seed script (`prisma/seed.mjs`) pre-populates initial records and admin account.

---

## 🚀 Getting Started

### 1. Start MySQL Database
Ensure Docker is running, then run:
```bash
docker compose up -d
```

### 2. Push Schema & Seed Initial Data
```bash
npx prisma db push
node prisma/seed.mjs
```

### 3. Run Next.js Development Server
```bash
npm run dev
```
Or run the production build:
```bash
npm run build
npm run start
```
Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Login Credentials
- **URL**: [http://localhost:3000/login](http://localhost:3000/login)
- **TBC Administrator Email**: `admin@tbc.com` or `admin@hsse.com`
- **Password**: `admin123`
