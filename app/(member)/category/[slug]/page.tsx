import { getCategories } from '@/lib/member/categories'
import { getPostsByCategory } from '@/lib/member/posts'
import PostCard from '@/components/member/PostCard'
import Sidebar from '@/components/member/Sidebar'
import Link from 'next/link'
import React from 'react'
import { Metadata } from 'next'
import AdBlock from '@/components/member/AdBlock'

export const dynamic = 'force-static'

function flattenCategories(categories: any[]): any[] {
  return categories.flatMap((cat) =>
    cat.children && cat.children.length > 0
      ? [cat, ...flattenCategories(cat.children)]
      : [cat]
  )
}

export async function generateMetadata(props: any): Promise<Metadata> {
  const slug = props.params?.slug
  const categories = await getCategories()
  const all = flattenCategories(categories)
  const category = all.find((cat) => cat.slug === slug)

  if (!category) {
    return {
      title: '找不到分類',
    }
  }

  return {
    title: `${category.name} | 分類文章`,
    description: `這是 ${category.name} 分類下的所有文章`,
    openGraph: {
      title: `${category.name} | 分類文章`,
      description: `這是 ${category.name} 分類下的所有文章`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${category.name} | 分類文章`,
      description: `這是 ${category.name} 分類下的所有文章`,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: any) {
  const slug = params.slug
  const currentPage = parseInt(searchParams?.page || '1', 10)
  const limit = 15

  const categories = await getCategories()
  const all = flattenCategories(categories)
  const category = all.find((cat) => cat.slug === params.slug)

  if (!category) return <p>找不到分類</p>

  const { data: posts, totalCount } = await getPostsByCategory(category.slug, currentPage, limit)
  const totalPages = Math.ceil(totalCount / limit)

  const parentCategory = category.parent
    ? all.find((cat) => cat.id === category.parent)
    : null

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 lg:px-[80px] py-10 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-2/3">
        <div className="mb-6 text-sm text-gray-600 flex items-center gap-1">
          <Link href="/" className="hover:underline text-gray-800">首頁</Link>
          <span className="mx-1 text-gray-400">›</span>
          {parentCategory && (
            <>
              <Link href={`/category/${parentCategory.slug}`} className="hover:underline text-gray-800">
                {parentCategory.name}
              </Link>
              <span className="mx-1 text-gray-400">›</span>
            </>
          )}
          <span className="text-red-600 font-bold">{category.name}</span>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="min-h-[300px] flex items-center justify-center text-gray-500">
            這個分類目前沒有文章。
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

                  {/* ✅ 插入一個廣告在第 3 篇之後 */}
                  {index === 2 && <AdBlock />}
                </React.Fragment>
              ))}
            </ul>
        )}

        {/* ✅ 分頁 UI */}
          <div className="mt-10 flex justify-center gap-2 flex-wrap text-sm">
            {currentPage > 1 && (
              <Link
                href={`/category/${category.slug}?page=${currentPage - 1}`}
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
                      href={`/category/${category.slug}?page=${p}`}
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
                href={`/category/${category.slug}?page=${currentPage + 1}`}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                下一頁
              </Link>
            )}
          </div>
            {/* ✅ Google AdSense 廣告區塊（可放多個） */}
            <AdBlock />
      </div>

      <Sidebar posts={posts.slice(0, 5)} categories={categories} />
    </div>
  )
}