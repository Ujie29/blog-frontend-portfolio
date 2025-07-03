import { getPosts } from '@/lib/member/posts'
import { getCategories } from '@/lib/member/categories'
import Sidebar from '@/components/member/Sidebar'
import PostCard from '@/components/member/PostCard'
import Link from 'next/link'
import React from 'react'
import AdBlock from '@/components/member/AdBlock'

export const dynamic = 'force-static'

export default async function HomePage(props: any) {
  const currentPage = parseInt(props.searchParams?.page || '1', 10)
  const limit = 15

  // ✅ 傳入目前頁數與筆數限制
  const { data: posts, totalCount } = await getPosts(currentPage, limit)
  const categories = await getCategories()
  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 lg:px-[80px] py-10 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-2/3">
        <section>
          {posts.length === 0 ? (
            <div className="min-h-[300px] flex items-center justify-center text-gray-500">
              目前尚無發佈的文章。
            </div>
          ) : (
            <ul className="space-y-6">
                {posts.map((post, index) => (
                  <React.Fragment key={`post-${post.slug}`}>
                    <li>
                      <PostCard
                        slug={post.slug}
                        title={post.title}
                        summary={post.summary}
                        createdAt={post.createdAt}
                        coverImageUrl={post.coverImageUrl}
                      />
                    </li>

                    {/* ✅ 在第 3 篇文章之後插入一個廣告 */}
                    {index === 2 && <AdBlock />}
                  </React.Fragment>
                ))}
            </ul>
          )}

          {/* ✅ 數字型分頁 UI（上一頁 1 2 3 ... 下一頁） */}
            <div className="mt-10 flex justify-center gap-2 flex-wrap text-sm">
              {currentPage > 1 && (
                <Link
                  href={`/?page=${currentPage - 1}`}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  上一頁
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true
                  if (p === 1 || p === totalPages) return true
                  if (Math.abs(p - currentPage) <= 1) return true
                  if (currentPage <= 3 && p <= 5) return true
                  if (currentPage >= totalPages - 2 && p >= totalPages - 4) return true
                  return false
                })
                .map((p, i, arr) => {
                  const prev = arr[i - 1]
                  const showEllipsis = prev && p - prev > 1

                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && <span className="px-2">...</span>}
                      <Link
                        href={`/?page=${p}`}
                        className={`px-3 py-1 border rounded hover:bg-gray-100 ${
                          p === currentPage ? 'bg-gray-800 text-white border-gray-800' : ''
                        }`}
                      >
                        {p}
                      </Link>
                    </React.Fragment>
                  )
                })}

              {currentPage < totalPages && (
                <Link
                  href={`/?page=${currentPage + 1}`}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  下一頁
                </Link>
              )}
            </div>
            {/* ✅ Google AdSense 廣告區塊（可放多個） */}
            <AdBlock />
        </section>
      </div>

      <Sidebar posts={posts.slice(0, 5)} categories={categories} />
    </div>
  )
}