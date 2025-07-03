'use client'

import Link from 'next/link'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'

interface PostInfo {
  slug: string
  title: string
  coverImageUrl: string
  summary: string
}

export default function PostNavigator({
  prev,
  next,
}: {
  prev?: PostInfo
  next?: PostInfo
}) {
  if (!prev && !next) return null

  const columnClass = prev && next ? 'w-1/2' : 'w-full'

  return (
    <div className="mt-14 pt-10">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-800">繼續閱讀</h2>

      <div className="flex gap-4">
        {prev && (
          <Link
            href={`/posts/${prev.slug}`}
            className={`${columnClass} group relative flex flex-col rounded-xl overflow-hidden hover:shadow-lg transition`}
          >
            {/* 圖片當背景，文字覆蓋在上面 */}
            <div className="relative h-48">
              <img
                src={prev.coverImageUrl}
                alt={prev.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 p-4 flex flex-col justify-end h-full text-white">
                <p className="text-xs flex items-center gap-1">
                  <HiArrowLeft className="inline-block w-4 h-4" />
                  上一篇
                </p>
                <h3 className="text-base font-semibold mt-1 group-hover:text-blue-400 line-clamp-2">
                  {prev.title}
                </h3>
                <p className="text-sm mt-2 text-white/80 line-clamp-2">
                  {prev.summary}
                </p>
              </div>
            </div>
          </Link>
        )}

        {next && (
          <Link
            href={`/posts/${next.slug}`}
            className={`${columnClass} group relative flex flex-col rounded-xl overflow-hidden hover:shadow-lg transition`}
          >
            <div className="relative h-48">
              <img
                src={next.coverImageUrl}
                alt={next.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 p-4 flex flex-col justify-end h-full text-white text-right">
                <p className="text-xs flex items-center gap-1 justify-end">
                  下一篇
                  <HiArrowRight className="inline-block w-4 h-4" />
                </p>
                <h3 className="text-base font-semibold mt-1 group-hover:text-blue-400 line-clamp-2">
                  {next.title}
                </h3>
                <p className="text-sm mt-2 text-white/80 line-clamp-2">
                  {next.summary}
                </p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}