# 💊 Pharma Financial Management System

A complete web-based financial tracking application built to manage **income**, **expenses**, and **reports** for a Pharma Distributor business. Developed using **Django** and **React** for seamless performance, clean UI, and powerful reporting.

---

## 🚀 Tech Stack

### 🔧 Backend
- **Django** – High-level Python web framework
- **Django REST Framework (DRF)** – API development
- **PostgreSQL** – Primary database (SQLite used in development)
- **xlsxwriter** – For Excel report exports
- **weasyprint/reportlab** – For PDF exports

### 🎨 Frontend
- **React.js** – UI library
- **Tailwind CSS** – Utility-first CSS framework
- **React Router** – Client-side routing
- **React Hook Form** – Form management and validation
- **Recharts** – Chart library for dashboards

### ☁️ Deployment
- **Frontend** → Vercel
- **Backend** → Railway or Render

---

## 📦 Features

### ✅ Income Management
- Records income from **medicines sold to other medical shop owners**
- Capture:
  - Medical shop name
  - Medicine list sold
  - Billing number
  - Payment breakdown by mode (Cash, UPI, Cheque)
  - Cheque status: `Pending`, `Cleared`, `Bounced`
  - Partial payment tracking (paid vs pending)
  - Payment date logs

### ✅ Expense Management
- Categories:
  - Staff salaries
  - Rent
  - Petrol
  - Utility bills
  - Office supplies
  - Maintenance
  - Others with description
- Date and amount tracking

### 📊 Dashboard
- Graphs and summaries for:
  - Daily / Weekly / Monthly profit-loss
  - Pending payments

### 📁 Reports
- Filterable by:
  - Date
  - Category
  - Payment mode / status
- Export to:
  - Excel
  - PDF

### 🔎 Search & Filters
- By:
  - Medical shop name
  - Category
  - Date
  - Cheque status

---

## 🏗️ Project Setup Instructions

### 🔨 Backend (Django + DRF)

```bash
# Step 1: Clone the repo
git clone git@github.com:your-username/pharma-finance.git
cd pharma-finance/backend

# Step 2: Create virtual environment and activate it
python -m venv venv
source venv/bin/activate  # on Windows: venv\Scripts\activate

# Step 3: Install dependencies
pip install -r requirements.txt

# Step 4: Apply migrations and run server
python manage.py migrate
python manage.py runserver
```

### 🧪 Sample Data
- Add medical shops, incomes, expenses, and cheque entries via the Django admin or API.

---

### 🌐 Frontend (React + Tailwind)

```bash
# Step 1: Navigate to frontend directory
cd ../frontend

# Step 2: Install dependencies
npm install

# Step 3: Start development server
npm run dev
```

---

## 🔌 Backend & Frontend Integration

- Backend API base URL (in `.env`):  
  `VITE_API_URL=http://127.0.0.1:8000/api`

- Axios is used in frontend to fetch and send data.

---

## 🌍 Deployment

### Frontend
- Deploy React app on **Vercel**
- Configure `VITE_API_URL` environment variable

### Backend
- Deploy Django app on **Railway** or **Render**
- Use **PostgreSQL** in production
- Configure:
  - `DATABASE_URL`
  - `ALLOWED_HOSTS`
  - Static files (with WhiteNoise or CDN)

---

## 🧱 Next Steps (Project Breakdown)

We will build the project **brick-by-brick**, starting from:

1. Initial folder structure (Django + React)
2. Model & API setup (Income, Expense, Cheques)
3. Basic React layout, routing & form pages
4. Dashboard UI with charts
5. Filters & export buttons
6. Final deployment

Each step includes:
- What we build
- Folder & file structure
- Terminal commands
- Code snippets
- Integration instructions

---

## 👨‍💻 Author

Guided step-by-step with ❤️ by Prasad Kuri  
Built for **HealLabs Pharma Distributor**

---
