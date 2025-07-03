'use client'

import { useRef } from 'react'
import { PostListDto } from '@/lib/member/posts'
import Link from 'next/link'

export default function RandomPostGrid({ posts }: { posts: PostListDto[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const { offsetWidth } = scrollRef.current
    scrollRef.current.scrollBy({ left: direction === 'left' ? -offsetWidth : offsetWidth, behavior: 'smooth' })
  }

  return (
    <div className="relative mb-8">
      {/* 標題置中 */}
      <h2 className="text-xl font-bold mb-4 text-center">延伸閱讀</h2>

      {/* 桌面版：網格顯示 */}
      <div className="hidden md:grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="flex items-start gap-4 bg-white rounded-lg p-4 hover:shadow transition"
          >
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-base font-semibold line-clamp-2 mb-1 hover:text-blue-600 transition">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">{post.summary}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(post.createdAt).toLocaleDateString('zh-Hant')}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* 手機版：垂直排列，一行一行顯示 */}
      <div className="md:hidden flex flex-col gap-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="flex items-center gap-3 bg-white rounded-lg p-3 hover:shadow transition"
          >
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-12 h-12 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold line-clamp-1 mb-1 hover:text-blue-600 transition">
                {post.title}
              </h3>
              <p className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleDateString('zh-Hant')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}