# 📝 blog-frontend

This project is a personal blog system's frontend service built with Next.js, implementing modern blog frontend and admin dashboard interfaces with complete features including rich text editing, admin login, category browsing, and more.

---

## 📌 Project Features

- Uses **Next.js full development** (App Router)
- Clear separation of frontend and backend architecture:
  - `(member)/`: Frontend user interface
  - `(admin)/admin/`: Admin dashboard interface
- Supports rich text editor (Editor.js + plugin extensions)
- Adopts Firebase authentication and data storage
- Integrates Google OAuth admin login mechanism
- Deployment method: **Deploy Next.js application using Vercel or other platforms**

---

## 🧱 Tech Stack

- Next.js (App Router)
- TypeScript
- Firebase Auth / Firestore / Storage
- Editor.js Rich Text Editor
- Tailwind CSS + Radix UI
- Google OAuth Authentication
- Lucide React Icon Library
- Responsive Design, SEO Optimization

---

## 📁 Project Architecture Overview

```bash
blog-frontend/
├── app/                        # Next.js App Router routing
│   ├── (member)/              # Frontend user interface
│   └── (admin)/admin/         # Admin dashboard interface
├── components/                # UI components (admin/member)
├── lib/firebase/client.ts     # Firebase initialization, unified API layer management
├── public/                    # Static assets (favicon, preview images)
├── middleware.ts              # Middleware: restrict host origins
├── package.json               # Package list and commands
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── README.md
```

---

## 🚀 Deployment Commands (Local Development)

### 📦 Install Dependencies
```bash
npm install
```

### 🌐 Start Development Server
```bash
npm run dev
```

### 🔨 Build Production Version
```bash
npm run build
```

### 🚀 Start Production Server
```bash
npm start
```

---

## 🔧 Environment Variables Configuration

Please add a `.env.local` file in the project root directory:

```bash
# 🔐 Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key

# 👤 Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=you@example.com
```

---

## 🎯 Main Features

### ✍️ Content Management
- Editor.js rich text editor
- Article categorization and tag management
- Image upload and media management
- Article carousel and recommendation features

### 🔐 Authentication and Security
- Google OAuth login
- Firebase Auth user management
- Admin permission control
- Middleware security protection

### 🎨 User Interface
- Tailwind CSS responsive design
- Radix UI component library
- Dark/light mode support
- SEO optimization and Meta tags

### 📱 Feature Pages
- Article browsing and search
- Category navigation
- Privacy policy
- About me page