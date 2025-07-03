'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase/client'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  // 嘗試從 Firebase 取得目前使用者
  useEffect(() => {
    const user = auth.currentUser
    setUserEmail(user?.email ?? null)
  }, [])

  // Google 登入邏輯
  const handleLogin = async () => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      const email = result.user.email
      if (!email || email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        alert('你沒有權限登入後台')
        await signOut(auth)
        setLoading(false)
        return
      }

      // 登入成功，導向後台
      router.push('/admin/posts')
    } catch (err) {
      alert('登入失敗')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    setUserEmail(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow p-6 rounded text-center space-y-4">
        <h1 className="text-xl font-bold">後台登入</h1>
        {userEmail ? (
          <>
            <p>👋 已登入：{userEmail}</p>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
              登出
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? '登入中...' : '使用 Google 登入'}
          </button>
        )}
      </div>
    </div>
  )
}