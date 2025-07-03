'use client'

import Link from 'next/link'

interface RelatedPost {
  slug: string
  title: string
  coverImageUrl: string
  summary?: string
}

export default function RelatedPosts({ posts }: { posts: RelatedPost[] }) {
  return (
    <div className="my-14">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-800">你可能也會喜歡</h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group rounded-2xl overflow-hidden shadow-sm border bg-white hover:shadow-md transition-all duration-300"
          >
            {/* 圖片 */}
            <div className="relative overflow-hidden">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* 內文 */}
            <div className="p-4">

              {/* 標題 */}
              <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                {post.title}
              </h3>
              {/* ✅ 摘要 */}
              {post.summary && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {post.summary}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}