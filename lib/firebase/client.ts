// lib/firebase/client.ts
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "blog-e7d77.firebaseapp.com",
  projectId: "blog-e7d77",
  storageBucket: "blog-e7d77.firebasestorage.app",
  messagingSenderId: "150778834677",
  appId: "1:150778834677:web:84e6bc4e23de6e0146dfbc",
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }
