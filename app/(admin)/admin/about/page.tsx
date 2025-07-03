'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import type { OutputData } from '@editorjs/editorjs'
import imageCompression from 'browser-image-compression'
import { getAboutMe, updateAboutMe, uploadImage } from '@/lib/admin/posts'

type EditorBlock = {
  type: string
  data: {
    file?: {
      name?: string
    }
    [key: string]: any
  }
}

// 🔧 動態載入編輯器
const EditorAbout = dynamic(() => import('@/components/admin/EditorAbout'), {
  ssr: false,
})

export default function AboutPage() {
  const editorRef = useRef<any>(null)
  const imageFilesRef = useRef<File[]>([])

  const [initialData, setInitialData] = useState<OutputData | null>(null)
  const [readOnly, setReadOnly] = useState(true)
  const [loading, setLoading] = useState(true)

  // 取得初始資料
  useEffect(() => {
    async function fetchAbout() {
      try {
        const about = await getAboutMe()
        setInitialData(about.content)
      } catch (error) {
        console.error('❌ 載入關於我失敗:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAbout()
  }, [])

  // 儲存關於我內容
  async function handleSave() {
    if (!editorRef.current) return

    const saved = await editorRef.current.save()
    if (!saved || !saved.blocks) {
      alert('⚠️ 無內容可儲存')
      return
    }

    const urlMap: Record<string, string> = {}

    // 🔍 過濾有被實際用到的圖片檔案（以 blob 名稱為 key）
    const usedBlobNames = new Set<string>()
    for (const block of saved.blocks) {
      if (block.type === 'image' && block.data?.file?.url?.startsWith('blob:')) {
        if (block.data?.file?.name) {
          usedBlobNames.add(block.data.file.name)
        }
      }
    }

    const usedFiles = imageFilesRef.current.filter(file =>
      usedBlobNames.has(file.name)
    )

    // 🗂️ 上傳圖片（僅針對還沒上傳過的 blob）
    for (const file of usedFiles) {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.8,
      })

      const url = await uploadImage(compressed)
      urlMap[file.name] = url
    }

    // 🔁 替換 EditorJS 內容中的 blob URL
    const updatedContent: OutputData = {
      ...saved,
      blocks: saved.blocks.map((block: EditorBlock) => {
        if (
          block.type === 'image' &&
          block.data?.file?.name &&
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

    // 🧠 呼叫後端更新 API
    await updateAboutMe({ content: JSON.stringify(updatedContent) })

    // 🧹 清除暫存圖片
    imageFilesRef.current = []

    // ✅ 更新狀態
    setInitialData(updatedContent)
    setReadOnly(true)
    alert('✅ 已儲存關於我內容')
  }

  if (loading) return <p className="p-4">載入中...</p>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">關於我</h1>
        {readOnly ? (
          <button
            onClick={() => setReadOnly(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            編輯
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              儲存
            </button>
            <button
              onClick={() => setReadOnly(true)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              取消
            </button>
          </div>
        )}
      </div>

      <EditorAbout
        initialData={initialData || { blocks: [] }}
        readOnly={readOnly}
        onInstanceReady={(instance) => (editorRef.current = instance)}
        onImagesChange={(files) => {
          imageFilesRef.current = files
        }}
      />
    </div>
  )
}
