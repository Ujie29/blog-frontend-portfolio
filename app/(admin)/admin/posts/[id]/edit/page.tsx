'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import type { OutputData } from '@editorjs/editorjs'
import {
  getCategories,
  Category,
} from '@/lib/admin/categories'
import {
  getPostById,
  updatePost,
  uploadImage,
  uploadCoverImage,
} from '@/lib/admin/posts'
import imageCompression from 'browser-image-compression'

const Editor = dynamic(() => import('@/components/admin/EditorEdit'), { ssr: false })

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = Number(params.id)

  const [title, setTitle] = useState('')
  const [initialContent, setInitialContent] = useState<OutputData>({ blocks: [] })
  const [editorInstance, setEditorInstance] = useState<any>(null)
  const [images, setImages] = useState<File[]>([])
  const [isPublished, setIsPublished] = useState(false)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)
  const [slug, setSlug] = useState('')

  const [categories, setCategories] = useState<Category[]>([])
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null)
  const [childCategoryId, setChildCategoryId] = useState<number | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await getPostById(String(postId))
        setTitle(postData.title)
        setInitialContent(JSON.parse(postData.content))
        setIsPublished(postData.isPublished)
        setCoverPreviewUrl(postData.coverImageUrl)
        setSlug(postData.slug)

        const categoryData = await getCategories()
        setCategories(categoryData)

        const parent = categoryData.find(parent =>
          parent.children?.some(child => child.id === postData.categoryId)
        )

        if (parent) {
          setParentCategoryId(parent.id)
          setChildCategoryId(postData.categoryId)
        } else {
          setParentCategoryId(postData.categoryId)
          setChildCategoryId(null)
        }
      } catch (err: any) {
        setError(err.message || '載入失敗')
      }
    }
    fetchData()
  }, [postId])

  const selectedParent = categories.find(c => c.id === parentCategoryId)
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
    if (!editorInstance) {
      setError('編輯器尚未準備好')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const savedContent = await editorInstance.save()

      let updatedContent = savedContent
      let coverImageUrl: string | null = coverPreviewUrl

      // ✅ 壓縮主圖後上傳
      if (coverImage) {
        const compressedCover = await imageCompression(coverImage, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
          fileType: 'image/webp', // ✅ 轉 WebP
          initialQuality: 0.8,
        })
        coverImageUrl = await uploadCoverImage(compressedCover)
      }

      // ✅ 壓縮內文圖後上傳
      if (images.length > 0) {
        const urlMap: Record<string, string> = {}
        for (const file of images) {
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
            fileType: 'image/webp', // ✅ 轉 WebP
            initialQuality: 0.8,
          })
          const url = await uploadImage(compressedFile)
          urlMap[file.name] = url
        }

        updatedContent = {
          ...savedContent,
          blocks: savedContent.blocks.map((block: any) => {
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

      const payload = {
        title,
        slug,
        content: JSON.stringify(updatedContent),
        isPublished: isPublished,
        categoryID: categoryIdToSend,
        coverImageUrl,
      }

      const updatedPost = await updatePost(postId, payload)
      router.push(
        `/admin/posts/${updatedPost.id}?title=${encodeURIComponent(updatedPost.title)}&slug=${updatedPost.slug}&isPublished=${updatedPost.isPublished}&coverImageUrl=${encodeURIComponent(updatedPost.coverImageUrl ?? '')}&createdAt=${encodeURIComponent(updatedPost.createdAt)}&updatedAt=${encodeURIComponent(updatedPost.updatedAt)}`
      )
    } catch (err: any) {
      setError(err.message || '更新失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">編輯文章</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-6 rounded">

        {/* 封面圖片 */}
        <div>
          <label className="block font-bold">主圖片（封面）</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              setCoverImage(file)
              if (file) {
                const blob = URL.createObjectURL(file)
                setCoverPreviewUrl(blob)
              }
            }}
            className="w-full border p-2 rounded"
          />
          {coverPreviewUrl && (
            <img src={coverPreviewUrl} alt="預覽圖" className="mt-2 max-w-xs rounded" />
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
          <Editor
            initialData={initialContent}
            onInstanceReady={(instance) => setEditorInstance(instance)}
            onImagesChange={setImages}
          />
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

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? '送出中...' : '更新文章'}
        </button>
      </form>
    </div>
  )
}