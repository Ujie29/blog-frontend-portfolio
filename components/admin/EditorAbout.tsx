'use client'

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import EditorJS, { OutputData } from '@editorjs/editorjs'

import Header from '@editorjs/header'
import List from '@editorjs/list'
import ImageTool from '@editorjs/image'
import CodeTool from '@editorjs/code'
import Quote from '@editorjs/quote'
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Delimiter from '@editorjs/delimiter'
import Paragraph from '@editorjs/paragraph'

const TextColorPlugin: any = require('editorjs-text-color-plugin')

type Props = {
  initialData?: OutputData
  readOnly?: boolean
  onInstanceReady?: (instance: EditorJS) => void
  onImagesChange?: (images: File[]) => void
}

// ✅ 使用 forwardRef 讓外層可以清空圖片清單
const EditorAbout = forwardRef(({
  initialData,
  readOnly = true,
  onInstanceReady,
  onImagesChange,
}: Props, ref) => {
  const editorRef = useRef<EditorJS | null>(null)
  const holderRef = useRef<HTMLDivElement | null>(null)
  const imageFilesRef = useRef<File[]>([])

  // ✅ 提供清空方法給外層
  useImperativeHandle(ref, () => ({
    clearImages: () => {
      imageFilesRef.current = []
    },
  }))

  useEffect(() => {
    if (!holderRef.current) return

    const editor = new EditorJS({
      holder: holderRef.current,
      data: initialData || { blocks: [] },
      readOnly,
      autofocus: false,
      tools: {
        header: {
          class: Header as unknown as any,
          config: {
            levels: [2, 3, 4],
            defaultLevel: 2,
            className: 'text-2xl font-bold my-4',
          },
        },
        list: {
          class: List as unknown as any,
          inlineToolbar: true,
        },
        image: {
          class: ImageTool as unknown as any,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                const exists = imageFilesRef.current.some(f => f.name === file.name && f.size === file.size)
                if (!exists) {
                  imageFilesRef.current.push(file)
                  onImagesChange?.([...imageFilesRef.current])
                }

                const blobUrl = URL.createObjectURL(file)
                return {
                  success: 1,
                  file: {
                    url: blobUrl,
                    name: file.name,
                  },
                }
              },
            },
          },
        },
        code: CodeTool as unknown as any,
        quote: Quote as unknown as any,
        embed: {
          class: Embed as unknown as any,
          config: {
            services: {
              youtube: true,
              twitter: true,
              codepen: true,
            },
          },
        },
        table: Table as unknown as any,
        delimiter: Delimiter as unknown as any,
        paragraph: {
          class: Paragraph as unknown as any,
          inlineToolbar: ['bold', 'italic', 'link', 'textColor', 'marker'],
        },
        textColor: {
          class: TextColorPlugin,
          config: {
            type: 'text',
            defaultColor: '#FF1300',
            colorCollections: ['#EC7878', '#9C27B0', '#0070f3', '#03A9F4', '#00BCD4', '#4CAF50', '#FF9800', '#FF5722'],
          },
        },
        marker: {
          class: TextColorPlugin,
          config: {
            type: 'marker',
            defaultColor: '#FFFF00',
            colorCollections: ['#FFFF00', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'],
          },
        },
      },
      onReady: () => {
        editorRef.current = editor
        onInstanceReady?.(editor)
      },
    })

    return () => {
      editor.isReady
        .then(() => {
          editor.destroy?.()
        })
        .catch(() => {
          console.warn('Editor cleanup skipped due to init failure.')
        })
    }
  }, [initialData, readOnly])

  return (
    <div
      ref={holderRef}
      className="border p-4 rounded bg-white min-h-[200px] prose max-w-none prose-p:my-2 prose-li:my-1 prose-img:my-4"
    />
  )
})

EditorAbout.displayName = 'EditorAbout'

export default EditorAbout