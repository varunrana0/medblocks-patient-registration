# 🏥 Patient Registration App

A modern, frontend-only Patient Registration system built with **Next.js App Router**, **TypeScript**, **ShadCN UI**, and **Pglite**. It allows you to register, view, and search patients — with real-time **cross-tab synchronization** of search input using the **BroadcastChannel API**.

---

## 🚀 Features

- ✅ Register new patients with form validation
- ✅ View all patients in a searchable table
- ✅ Real-time cross-tab search synchronization
- ✅ Hybrid usage of Server and Client components with App Router
- ✅ Fully local persistence using `pglite` (SQLite in the browser)
- ✅ Accessible UI powered by ShadCN (Radix + TailwindCSS)
- ✅ Built with a **modular structure** separating components, types, utilities, and logic.

---

## 🧰 Tech Stack

| Tool                 | Purpose                          |
| -------------------- | -------------------------------- |
| Next.js (App Router) | Routing and rendering            |
| TypeScript           | Static typing                    |
| ShadCN UI            | Beautiful, accessible components |
| Tailwind CSS         | Utility-first styling            |
| Pglite               | SQLite embedded in browser       |
| BroadcastChannel     | Sync search state across tabs    |

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/patient-registration-app.git
cd patient-registration-app
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Run the Development Server

```bash
pnpm dev
# or
npm run dev
```

Now open your browser and go to:

```
http://localhost:3000
```

---

## 🧪 Usage Instructions

1. **Register a Patient**

   - Fill out the registration form on the homepage.
   - Click "Submit" to save data locally using `pglite`.

2. **View Patients**

   - All patients are listed in a table with fields like name, age, gender, contact, blood group, etc.
   - All Patients are automatically synced across all open tabs using **BroadcastChannel**.

3. **Search Patients**
   - Use the search input to filter patients by name, email, or contact number.
   - The search term automatically syncs across all open tabs using **BroadcastChannel**.

---

## 📁 Project Structure

```
.
├── app/
│   └── page.tsx                            # Home page route
├── components/
│   └── Patients/                           # Table to display all patients
│       ├── RegisterPatient.tsx             # Form to register patient
│       └── PatientsTable.tsx               # Table to display all patients
│       └── PatientsTableWrapper.tsx        # Wrapper for Patients React component
│       └── Patient.schema.tsx              # Zod schema for patient data
│       └── constant.ts                     # Patient Component constants
│       └── types.ts                        # Shared type definitions
├── actions/
│   └── actions.ts                          # Server function to perform actions
├── lib/
│   └── db.ts                               # Database connection
│   └── utils.ts                            # Helper functions
└── SETUP_INSTRUCTIONS.md                               # You're here!
```

---

## 🧐 Highlights

🔄 **BroadcastChannel**

- Ensures seamless tab-to-tab communication — e.g., Typing a search term in one tab updates the filter on all others.
- Ensures seamless tab-to-tab communication — e.g., Newly registered patients are immediately reflected in all open tabs via `BroadcastChannel` for real-time updates.

🌟 **ShadCN UI**

- **Radix UI** for accessible UI components.
- **Tailwind CSS** for utility-first styling.

📚 **TypeScript**

- **Static typing** for better code quality and maintainability.

🚀 **Next.js App Router**

- **Hybrid rendering** using Server and Client components.
- **Modular structure** separating components, types, utilities, and logic.

📦 **Pglite**

- **SQLite** embedded in the browser.
- **Real-time synchronization** using **BroadcastChannel** for cross-tab communication.

🎉 **Modularity**

- **Modular structure** separating components, types, utilities, and logic.

---
