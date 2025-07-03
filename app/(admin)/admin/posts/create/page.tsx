'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { OutputData } from '@editorjs/editorjs'
import { createPost, uploadImage, uploadCoverImage } from '@/lib/admin/posts'
import { getCategories, Category } from '@/lib/admin/categories'
import imageCompression from 'browser-image-compression' // 圖片壓縮套件

const Editor = dynamic(() => import('@/components/admin/EditorCreate'), { ssr: false })

export default function CreatePostPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState<OutputData | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [isPublished, setIsPublished] = useState(false)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [slug, setSlug] = useState('')

  const [categories, setCategories] = useState<Category[]>([])
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null)
  const [childCategoryId, setChildCategoryId] = useState<number | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch {
        console.error('載入分類失敗')
      }
    }
    fetchCategories()
  }, [])

  const selectedParent = categories.find((c) => c.id === parentCategoryId)
  const childCategories = selectedParent?.children ?? []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const categoryIdToSend = childCategoryId ?? parentCategoryId
    if (!categoryIdToSend) {
      setError('請選擇分類')
      return
    }
    if (!slug.trim()) {
      setError('請輸入 slug')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let updatedContent = content
      let coverImageUrl: string | null = null

      // ✅ 上傳主圖片（若有）→ 壓縮後上傳
      if (coverImage) {
        const compressedCover = await imageCompression(coverImage, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
          fileType: 'image/webp', // ✅ 轉 WebP
          initialQuality: 0.8,
        }) // ✅ 壓縮主圖
        coverImageUrl = await uploadCoverImage(compressedCover)
      }

      // ✅ 上傳內文圖片（若有）→ 壓縮後上傳
      if (images.length > 0 && content) {
        const urlMap: Record<string, string> = {}

        for (const file of images) {
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
            fileType: 'image/webp', // ✅ 轉 WebP
            initialQuality: 0.8,
          }) // ✅ 壓縮內文圖片
          const url = await uploadImage(compressedFile)
          urlMap[file.name] = url
        }

        updatedContent = {
          ...content,
          blocks: content.blocks.map((block) => {
            if (
              block.type === 'image' &&
              block.data.file &&
              urlMap[block.data.file.name]
            ) {
              return {
                ...block,
                data: {
                  ...block.data,
                  file: {
                    url: urlMap[block.data.file.name],
                  },
                },
              }
            }
            return block
          }),
        }
      }
      if (!updatedContent) {
        throw new Error('內容不能為空')
      }
      
      // ✅ 建立文章
      const result = await createPost({
        title,
        slug,
        categoryID: categoryIdToSend,
        content: JSON.stringify(updatedContent),
        isPublished: isPublished,
        coverImageUrl,
      })

    router.push(
      `/admin/posts/${result.id}?title=${encodeURIComponent(result.title)}&slug=${result.slug}&isPublished=${result.isPublished}&coverImageUrl=${encodeURIComponent(result.coverImageUrl ?? '')}&createdAt=${encodeURIComponent(result.createdAt)}&updatedAt=${encodeURIComponent(result.updatedAt)}`
    )
    } catch (err: any) {
      setError(err.message || '未知錯誤')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">新增文章</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-6 rounded">

        {/* ✅ 主圖片 */}
        <div>
          <label className="block font-bold">主圖片（封面）</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              setCoverImage(file)

              // ✅ 新增：產生預覽圖
              if (file) {
                const blob = URL.createObjectURL(file)
                setCoverPreviewUrl(blob)
              }
            }}
            className="w-full border p-2 rounded"
          />

          {/* ✅ 新增：預覽圖片 */}
          {coverPreviewUrl && (
            <img
              src={coverPreviewUrl}
              alt="封面預覽"
              className="mt-2 max-w-xs rounded shadow"
            />
          )}
        </div>

        {/* 標題 */}
        <div>
          <label className="block font-bold">標題</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block font-bold">Slug（網址識別用，必填）</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border p-2 rounded"
            required
            placeholder="例如：how-to-use-editorjs"
          />
          <p className="text-sm text-gray-500 mt-1">* Slug 會用在網址中，例如 /posts/your-slug</p>
        </div>

        {/* 分類（父層） */}
        <div>
          <label className="block font-bold">分類（父層）</label>
          <select
            value={parentCategoryId ?? ''}
            onChange={(e) => {
              const id = Number(e.target.value)
              setParentCategoryId(id)
              setChildCategoryId(null)
            }}
            className="w-full border p-2 rounded"
            required
          >
            <option value="" disabled>請選擇父分類</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* 分類（子層） */}
        {childCategories.length > 0 && (
          <div>
            <label className="block font-bold">分類（子層）</label>
            <select
              value={childCategoryId ?? ''}
              onChange={(e) => setChildCategoryId(Number(e.target.value))}
              className="w-full border p-2 rounded"
              required
            >
              <option value="" disabled>請選擇子分類</option>
              {childCategories.map((child) => (
                <option key={child.id} value={child.id}>{child.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* 內容 */}
        <div>
          <label className="block font-bold">內容</label>
          <Editor onChange={setContent} onImagesChange={setImages} />
        </div>

        {/* 是否發布 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            id="published"
            className="mr-2"
          />
          <label htmlFor="published">是否發布</label>
        </div>

        {/* 錯誤訊息 */}
        {error && <p className="text-red-500">{error}</p>}

        {/* 提交按鈕 */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? '送出中...' : '建立文章'}
        </button>
      </form>
    </div>
  )
}