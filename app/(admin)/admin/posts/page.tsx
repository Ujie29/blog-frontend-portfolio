'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPosts } from '@/lib/admin/posts'
import { PostList } from '@/lib/admin/posts'

export default function AdminPostListPage() {
  const [postList, setPosts] = useState<PostList[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

const handleSearch = () => {
  setSearch(searchInput)
  setPage(1)
}
  // 取得資料
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const data = await getPosts(page, limit, search)
        setPosts(data.data)
        setTotalCount(data.totalCount)
      } catch (err: any) {
        setError(err.message || '未知錯誤')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [page, limit, search])

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* 上方標題與按鈕 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">文章列表</h1>
        <Link
          href="/admin/posts/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          新增文章
        </Link>
      </div>

      {/* 搜尋欄 */}
      <div className="flex justify-end items-center space-x-2">
        <input
          type="text"
          placeholder="搜尋標題或摘要..."
          className="border px-3 py-2 rounded w-64 text-sm"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-550 transition"
        >
          搜尋
        </button>
      </div>

      {/* 表格與資料 */}
      <div className="bg-white rounded shadow flex flex-col flex-1">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="border-b text-gray-600">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">標題</th>
                <th className="px-3 py-2">摘要</th>
                <th className="px-3 py-2">建立日期</th>
                <th className="px-3 py-2">更新日期</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-gray-500">載入中...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-red-500">{error}</td>
                </tr>
              ) : postList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-gray-400">目前沒有任何文章</td>
                </tr>
              ) : (
                postList.map((post, index) => (
                  <tr key={post.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-3 py-2">{(page - 1) * limit + index + 1}</td>
                    <td className="px-3 py-2 font-medium">
                      <Link href={`/admin/posts/${post.id}`} className="text-blue-600 hover:underline">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-3 py-2 max-w-xs overflow-hidden text-ellipsis whitespace-normal" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {post.summary}
                    </td>
                    <td className="px-3 py-6">{new Date(post.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-6">{new Date(post.updatedAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分頁固定底部 */}
        <div className="border-t mt-auto px-3 py-[14.7px] bg-white">
          <div className="flex justify-end items-center space-x-2 text-sm text-gray-600">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded border ${
                  page === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
