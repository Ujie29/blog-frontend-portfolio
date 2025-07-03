'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import '../../../globals.css'
import { Sidebar } from '../../../components/admin/Sidebar'
import { Breadcrumbs } from '../../../components/admin/Breadcrumbs'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    sessionStorage.removeItem('alreadyReloaded')
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (isLoginPage) {
        setAuthorized(true)
        setChecking(false)
        return
      }

      if (!user) {
        router.push('/admin/login')
      } else {
        setAuthorized(true)
        setChecking(false)
      }
    })

    return () => unsubscribe()
  }, [pathname, isLoginPage, router])

  if (checking) return <div className="p-10 text-center">🔐 驗證中...</div>
  if (!authorized) return null

  return isLoginPage ? (
    <main className="p-6 min-h-screen">{children}</main>
  ) : (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-white">
          <Breadcrumbs />
        </div>
        <main className="p-6 flex-1 min-h-[780px]">{children}</main>
      </div>
    </div>
  )
}