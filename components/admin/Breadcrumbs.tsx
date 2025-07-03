'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

// segment 對照中文名稱
const nameMap: Record<string, string> = {
  posts: '文章管理',
  new: '新增文章',
  edit: '編輯文章',
  categories: '分類管理',
  about: '關於我',
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const isDashboard = pathname === '/admin/dashboard'

  if (isDashboard) {
    // ✅ 儀表板只顯示首頁
    return (
      <nav className="bg-gray-50 border-b px-6 py-3 text-sm text-gray-500">
        <ol className="flex items-center space-x-1">
          <li className="text-gray-700">首頁</li>
        </ol>
      </nav>
    )
  }

  // 其他頁面（從 admin 後開始）
  const crumbs = segments.slice(1)
  const fullPaths = crumbs.map((_, i) => '/' + ['admin', ...crumbs.slice(0, i + 1)].join('/'))

  return (
    <nav className="bg-gray-50 border-b px-6 py-3 text-sm text-gray-500">
      <ol className="flex flex-wrap items-center space-x-1">
        {/* 固定首頁連結 */}
        <li>
          <Link href="/admin/dashboard" className="hover:underline text-gray-700">首頁</Link>
        </li>

        {/* 其他階層 */}
        {crumbs.map((seg, idx) => (
          <li key={idx} className="flex items-center">
            <span className="mx-1">/</span>
            {idx === crumbs.length - 1 ? (
              <span className="text-gray-700">{nameMap[seg] || decodeURIComponent(seg)}</span>
            ) : (
              <Link href={fullPaths[idx]} className="hover:underline text-gray-700">
                {nameMap[seg] || decodeURIComponent(seg)}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
