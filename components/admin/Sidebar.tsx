'use client'

import { Home, FileText, Folder, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <aside
      className={`h-screen bg-gray-100 p-4 border-r transition-all duration-300 flex flex-col ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* 收合按鈕 */}
      <div className="flex justify-end mb-4">
        <Button variant="ghost" size="icon" onClick={onToggle}>
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* 標題 */}
      {isOpen && <div className="font-bold text-xl mb-6">後台管理</div>}

      {/* 選單連結 */}
      <nav className="space-y-2">
        <SidebarLink href="/admin/dashboard" icon={<Home className="w-5 h-5" />} label="儀表板" isOpen={isOpen} />
        <SidebarLink href="/admin/posts" icon={<FileText className="w-5 h-5" />} label="文章管理" isOpen={isOpen} />
        <SidebarLink href="/admin/about" icon={<SlidersHorizontal className="w-5 h-5" />} label="關於我" isOpen={isOpen} />
      </nav>
    </aside>
  )
}

function SidebarLink({
  href,
  icon,
  label,
  isOpen,
}: {
  href: string
  icon: React.ReactNode
  label: string
  isOpen: boolean
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 text-gray-700 hover:text-black p-2 rounded-md hover:bg-gray-200 transition"
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </Link>
  )
}