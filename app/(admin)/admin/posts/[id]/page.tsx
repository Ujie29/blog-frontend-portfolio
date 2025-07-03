'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams, useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getPostById, deletePost, Post } from '@/lib/admin/posts'

export default function PostDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const queryIsPublished = searchParams.get('isPublished')
  const queryCoverImageUrl = searchParams.get('coverImageUrl')
  const queryCreatedAt = searchParams.get('createdAt')
  const queryUpdatedAt = searchParams.get('updatedAt')

  useEffect(() => {
    const queryTitle = searchParams.get('title')
    const querySummary = searchParams.get('summary')
    const querySlug = searchParams.get('slug')

    // ✅ 如果 query 中有資料，優先使用（從上一頁帶來）
    if (queryTitle && querySummary && querySlug) {
      setPost({
        id: Number(id),
        title: queryTitle,
        summary: querySummary,
        slug: querySlug,
        content: '',
        isPublished: queryIsPublished === 'true',
        createdAt: queryCreatedAt ?? '',
        updatedAt: queryUpdatedAt ?? '',
        categoryId: 0,
        coverImageUrl: queryCoverImageUrl || null,
      })
      setLoading(false)
    } else {
      // 否則正常打 API
      const fetchPost = async () => {
        try {
          const result = await getPostById(id)
          setPost(result)
        } catch (err: any) {
          setError(err.message || '未知錯誤')
        } finally {
          setLoading(false)
        }
      }

      fetchPost()
    }
  }, [id, searchParams])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deletePost(id)
      router.push('/admin/posts')
    } catch (err: any) {
      alert(err.message || '刪除時發生錯誤')
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  // const renderContent = () => {
  //   if (!post?.content) return <p className="text-gray-400">（無內容）</p>

  //   try {
  //     const parsed = JSON.parse(post.content)
  //     return parsed.blocks.map((block: any) => {
  //       if (block.type === 'paragraph') {
  //         return <p key={block.id} className="mb-2">{block.data.text}</p>
  //       }

  //       if (block.type === 'header') {
  //         const level = Math.max(1, Math.min(block.data.level, 6))
  //         const tagName = `h${level}`
  //         return React.createElement(
  //           tagName as any,
  //           { key: block.id, className: 'font-bold my-2' },
  //           block.data.text
  //         )
  //       }

  //       if (block.type === 'image') {
  //         return (
  //           <div key={block.id} className="my-4">
  //             <img src={block.data.file.url} alt="" className="max-w-full rounded" />
  //           </div>
  //         )
  //       }

  //       return null
  //     })
  //   } catch {
  //     return <p className="text-red-500">❌ 無法解析內容格式</p>
  //   }
  // }

  return (
    <div className="space-y-4 flex flex-col flex-1">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">文章詳情</h1>
        <div className="space-x-2">
          <Link
            href={`/admin/posts/${id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            編輯文章
          </Link>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            刪除文章
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">載入中...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : post ? (
        <div className="bg-white shadow rounded p-6 space-y-4">
          <div><strong>標題：</strong>{post.title}</div>
          <div><strong>Slug：</strong>{post.slug}</div>
          <div><strong>摘要：</strong>{post.summary}</div>
          <div><strong>狀態：</strong>{post.isPublished ? '✅ 已發布' : '📝 草稿'}</div>
          <div><strong>建立時間：</strong>{new Date(post.createdAt).toLocaleString()}</div>
          <div><strong>更新時間：</strong>{new Date(post.updatedAt).toLocaleString()}</div>

          {post.coverImageUrl && (
            <div>
              <strong>封面圖：</strong>
              <div className="mt-2">
                <img
                  src={post.coverImageUrl}
                  alt="封面圖"
                  className="w-full max-w-md rounded shadow"
                />
              </div>
            </div>
          )}

          {/* <div>
            <strong>內容：</strong>
            <div className="mt-2 prose">{renderContent()}</div>
          </div> */}
        </div>
      ) : null}

      {/* 刪除確認 Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold">確定要刪除這篇文章嗎？</h2>
            <p className="text-sm text-gray-600">此動作無法復原。</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                disabled={deleting}
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? '刪除中...' : '確認刪除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}