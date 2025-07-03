'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'
import type { PostListDto } from '@/lib/member/posts'
import type { NestedCategory } from '@/lib/member/categories'
import AdBlock from './AdBlock'

interface SidebarProps {
  posts: PostListDto[]
  categories: NestedCategory[]
}

export default function Sidebar({ posts, categories }: SidebarProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <aside className="w-full lg:w-[440px] bg-gray-50 p-6 rounded-2xl shadow-lg space-y-20">
      {/* ✅ Apple風格頭像 + 自我介紹 + 社群連結 */}
      <div className="flex flex-col items-center text-center space-y-5">
        <img
          src="https://pub-232b427d08154bedbdd8a1763c54e859.r2.dev/%E5%A4%A7%E9%A0%AD%E7%85%A7.jpg"
          alt="ujie avatar"
          className="w-36 h-36 object-cover rounded-full shadow-sm border border-gray-200"
        />
        {/* ✅ 自我介紹區塊（左對齊，文章段落風格） */}
        <div className="flex items-start space-x-4">
          {/* 右側文字內容 */}
          <div className="space-y-3 text-left text-gray-800">
            <p className="text-base font-semibold">嗨，我是 Ujie！</p>
            <p className="text-sm leading-relaxed text-gray-600">
              透過這個部落格，我想分享生活中的美好時刻，無論是美食探索、旅遊、生活紀錄等，還是一些技術領域的心得與經驗。
            </p>
            <p className="text-sm leading-relaxed text-gray-600">
              也希望在這裡寫下自己的故事，留下人生每個階段的點點滴滴，鼓舞自己不斷地成長，能在將來能有所回憶。
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => alert('Facebook：敬請期待！')}
            className="w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:text-black hover:border-transparent flex items-center justify-center transition-all"
            aria-label="Facebook"
          >
            <FaFacebookF size={16} />
          </button>
          <button
            onClick={() => alert('Instagram：敬請期待！')}
            className="w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:text-black hover:border-transparent flex items-center justify-center transition-all"
            aria-label="Instagram"
          >
            <FaInstagram size={16} />
          </button>
          <button
            onClick={() => alert('YouTube：敬請期待！')}
            className="w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:text-black hover:border-transparent flex items-center justify-center transition-all"
            aria-label="YouTube"
          >
            <FaYoutube size={16} />
          </button>
          <button
            onClick={() => alert('Email：敬請期待！')}
            className="w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:text-black hover:border-transparent flex items-center justify-center transition-all"
            aria-label="Email"
          >
            <HiOutlineMail size={18} />
          </button>
        </div>
      </div>

      {/* ✅ Google AdSense 廣告區塊（可放多個） */}
      <AdBlock />

      {/* ✅ 最新文章 */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">最新文章</h2>
        <ul className="space-y-5">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/posts/${post.slug}`}
                className="flex justify-between items-center group bg-white hover:bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 p-4 space-x-4"
              >
                <div className="flex-1 space-y-2">
                  <h3 className="text-base font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString('zh-Hant')}
                  </p>
                </div>
                <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ 分類清單 */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">分類</h2>
        <ul className="text-base space-y-4 text-gray-800">
          {categories.map((category) => {
            const isExpanded = expandedId === category.id
            return (
              <li key={category.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Link
                    href={`/category/${category.slug}`}
                    className="font-medium hover:text-blue-600 transition-colors"
                    onClick={() => setExpandedId(null)}
                  >
                    {category.name}
                  </Link>
                  {category.children.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setExpandedId(prev => prev === category.id ? null : category.id)
                      }}
                      className="text-gray-500 text-lg px-2 hover:text-blue-500 transition-colors"
                    >
                      {isExpanded ? '−' : '+'}
                    </button>
                  )}
                </div>
                {isExpanded && category.children.length > 0 && (
                  <ul className="mt-2 ml-4 border-l border-gray-200 pl-4 space-y-3 text-sm text-gray-600">
                    {category.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/category/${child.slug}`}
                          onClick={() => setExpandedId(null)}
                          className="hover:text-blue-500 block transition-colors"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {/* ✅ Google AdSense 廣告區塊（可放多個） */}
      <AdBlock />

      {/* ✅ 網站統計資料 */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold mb-3 border-b pb-2">網站人氣統計</h2>
        <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
          <p>今日人氣：<span className="font-bold text-red-600">暫無資料</span></p>
          <p>累計人氣：<span className="font-bold text-red-600">暫無資料</span></p>
        </div>
      </div>

      {/* ✅ 在線人數 */}
      <div className="text-center space-y-3">
        <h2 className="text-lg font-semibold mb-3 border-b pb-2">現在在線人數</h2>
        <div className="inline-block bg-red-100 text-red-600 font-bold py-2 px-6 rounded-full text-xl shadow transition-transform duration-200 hover:scale-105">
          暫無資料
        </div>
      </div>

      {/* ✅ Google AdSense 廣告區塊（可放多個） */}
      <AdBlock />

    </aside>
  )
}