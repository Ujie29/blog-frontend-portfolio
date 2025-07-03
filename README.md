# 📝 Blog Frontend 部落格前台系統

這是一個使用 [Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/) + [Firebase](https://firebase.google.com/) + [Editor.js](https://editorjs.io/) 建構的現代化部落格前端系統，支援管理員登入、文章編輯、分類瀏覽、SEO、隱私政策與關於我頁面等。

## 🚀 功能特色

- ✍️ 富文字編輯器（Editor.js + 插件）
- 🔐 管理員登入（Google OAuth）
- 📂 分類與標籤管理
- 🧭 文章輪播、導覽列、隨機推薦等互動功能
- 🎨 UI 使用 Tailwind CSS + Radix UI 元件庫
- ☁️ 整合 Firebase Auth、Firestore、Storage（需搭配後端或 Firebase Functions）

## 🧰 使用技術

| 類別       | 技術                     |
|------------|--------------------------|
| 前端框架   | Next.js (App Router)     |
| 樣式工具   | Tailwind CSS             |
| 認證機制   | Firebase Auth (Google 登入) |
| 資料儲存   | Firebase Firestore（假設後端整合） |
| 文字編輯器 | Editor.js + 插件         |
| 圖示庫     | Lucide React             |

## 📦 安裝與開發

### 1️⃣ 安裝依賴
```bash
npm install
```

### 2️⃣ 啟動開發伺服器
```bash
npm run dev
```

## 🛠️ 環境變數設定

請在專案根目錄新增 `.env.local` 檔案，設定以下內容：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=你的Firebase API金鑰
NEXT_PUBLIC_ADMIN_EMAIL=you@example.com
```

> ✅ 注意：這些變數在前端使用，請確保 API 金鑰為 Web 專用金鑰，並搭配 Firebase 安全規則使用。

## 📁 專案結構說明

```
blog-frontend/
├── app/                        # Next.js App Router 路由
│   ├── (member)/              # 一般使用者介面
│   └── (admin)/admin/         # 管理者後台
├── components/                # UI 元件（admin/member）
├── lib/firebase/client.ts     # Firebase 初始化、呼叫api層統一管理
├── public/                    # 靜態資源（favicon、預覽圖）
├── middleware.ts              # 中介層：限制主機來源
├── package.json               # 套件清單與指令
└── README.md
```

## 🔐 登入與安全性設計

- 登入使用 **Firebase Google OAuth**
- 僅允許特定 email 登入後台，email 設定於 `NEXT_PUBLIC_ADMIN_EMAIL`
- Firebase Config 寫於環境變數中，避免硬編碼
- 使用 `middleware.ts` 限制網站僅允許特定來源存取（如 `ujie30.com`）