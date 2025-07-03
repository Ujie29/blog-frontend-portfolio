'use client'

import { useEffect, useRef } from 'react'
import EditorJS, { OutputData } from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import ImageTool from '@editorjs/image'

const CodeTool: any = require('@editorjs/code')
const QuoteTool: any = require('@editorjs/quote')
const EmbedTool: any = require('@editorjs/embed')
const TableTool: any = require('@editorjs/table')
const DelimiterTool: any = require('@editorjs/delimiter')
const ParagraphTool: any = require('@editorjs/paragraph')
const TextColorPlugin: any = require('editorjs-text-color-plugin')

const HeaderTool: any = {
  class: Header,
  config: {
    levels: [2, 3, 4],
    defaultLevel: 2,
    className: 'text-2xl font-bold my-4',
  },
}

const ListTool: any = {
  class: List,
  inlineToolbar: true,
}

// 文字顏色工具
const ColorPlugin = {
  class: TextColorPlugin,
  config: {
    colorCollections: ['#EC7878', '#9C27B0', '#0070f3', '#03A9F4', '#00BCD4', '#4CAF50', '#FF9800', '#FF5722'],
    defaultColor: '#FF1300',
    type: 'text', // 文字顏色
  },
}

// 螢光筆工具
const MarkerPlugin = {
  class: TextColorPlugin,
  config: {
    colorCollections: ['#FFFF00', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'],
    defaultColor: '#FFFF00',
    type: 'marker', // 背景色（螢光筆）
  },
}

type Props = {
  data?: OutputData
  onChange: (data: OutputData) => void
  onImagesChange?: (images: File[]) => void
}

const Editor = ({ data, onChange, onImagesChange }: Props) => {
  const ejInstance = useRef<EditorJS | null>(null)
  const imageFilesRef = useRef<File[]>([])

  useEffect(() => {
    if (!ejInstance.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        autofocus: true,
        data: data || { blocks: [] },

        async onChange() {
          const saved = await editor.save()
          onChange(saved)
        },

        tools: {
          header: HeaderTool,
          list: ListTool,

          paragraph: {
            class: ParagraphTool,
            inlineToolbar: ['bold', 'italic', 'link', 'textColor', 'marker'],
          },

          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const blobUrl = URL.createObjectURL(file)
                  imageFilesRef.current.push(file)
                  onImagesChange?.([...imageFilesRef.current])

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
          } as any,

          code: CodeTool,
          quote: QuoteTool,

          embed: {
            class: EmbedTool,
            config: {
              services: {
                youtube: true,
                codepen: true,
                twitter: true,
              },
            },
          },

          table: TableTool,
          delimiter: DelimiterTool,
          textColor: ColorPlugin,
          marker: MarkerPlugin,
        },
      })

      ejInstance.current = editor
    }

    return () => {
      ejInstance.current?.destroy?.()
      ejInstance.current = null
    }
  }, [])

  return (
    <div
      id="editorjs"
      spellCheck={false}
      className="border p-4 rounded bg-white min-h-[200px] prose max-w-none prose-p:my-2 prose-li:my-1 prose-img:my-4"
    />
  )
}

export default Editor