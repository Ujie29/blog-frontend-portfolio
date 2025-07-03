'use client'

import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'

type Props = {
  slug: string
  title: string
  summary: string
  createdAt: string
  coverImageUrl?: string
}

export default function PostCard({ slug, title, summary, createdAt, coverImageUrl }: Props) {
  const date = new Date(createdAt).toLocaleDateString('zh-Hant', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return (
    <article className="pb-10 border-b">
      {/* 日期 + 標題 */}
      <div className="flex flex-wrap items-center gap-4 mb-2">
        <span className="text-sm text-red-600 font-semibold">{date}</span>
        <Link href={`/posts/${slug}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>
      </div>

      {/* 圖片 */}
      {coverImageUrl && (
        <Link href={`/posts/${slug}`} className="block mt-2 mb-4 overflow-hidden rounded-md">
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full max-h-[700px] object-cover"
          />
        </Link>
      )}

      {/* 摘要 */}
      {summary && (
        <p className="text-gray-700 text-base leading-relaxed mb-4 line-clamp-3 md:line-clamp-3">
          {summary}
        </p>
      )}

      {/* 繼續閱讀靠右 */}
<div className="flex justify-end mt-6">
  <Link
    href={`/posts/${slug}`}
    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-white text-gray-800 font-medium px-6 py-3 text-base rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
  >
    繼續閱讀
    <HiArrowRight className="w-5 h-5" />
  </Link>
</div>
    </article>
  )
}