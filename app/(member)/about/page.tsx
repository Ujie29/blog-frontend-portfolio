import { getAboutMe, getPosts } from '@/lib/member/posts'
import { getCategories } from '@/lib/member/categories'
import Sidebar from '@/components/member/Sidebar'
import Link from 'next/link'
import edjsHTML from 'editorjs-html'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'

export default async function AboutPage() {
  const about = await getAboutMe()
  if (!about) notFound()

  const categories = await getCategories()
  const latestPosts = (await getPosts()).data

  // 解析 Editor.js 內容
  let html = ''
  try {
    const data = typeof about.content === 'string' ? JSON.parse(about.content) : about.content
    const parser = edjsHTML({
      header: ({ data }) => `<h${data.level}>${data.text}</h${data.level}>`,
      paragraph: ({ data }) => `<p>${data.text}</p>`,
      image: ({ data }) => {
        const classes = [
          'my-4',
          data.withBorder ? 'border border-gray-300' : '',
          data.withBackground ? 'bg-gray-100 p-4' : '',
          data.stretched ? 'w-full' : 'max-w-[90%] mx-auto',
          'rounded shadow-sm',
        ].join(' ')
        return `<div class="${classes.trim()}">
          <img src="${data.file.url}" alt="${data.caption}" class="w-full h-auto object-contain" />
          ${data.caption ? `<div class="text-sm text-gray-500 mt-2 text-center">${data.caption}</div>` : ''}
        </div>`
      },
      list: ({ data }) => {
        const items = data.items as { content: string; meta?: any }[]
        const tag = data.style === 'ordered' ? 'ol' : 'ul'
        return `<${tag}>${items.map((item) => `<li>${item.content}</li>`).join('')}</${tag}>`
      },
      quote: ({ data }) => `<blockquote>${data.text}<br/>— ${data.caption}</blockquote>`,
      code: ({ data }) => `<pre><code>${data.code}</code></pre>`,
    })
    const blocksHTML = parser.parse(data)
    html = Array.isArray(blocksHTML) ? blocksHTML.join('') : blocksHTML
  } catch {
    html = '<p class="text-red-500">內容解析錯誤</p>'
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 lg:px-[80px] py-10 flex flex-col lg:flex-row gap-6">
      {/* 🔹 左側主欄 */}
      <article className="w-full lg:w-2/3 space-y-6">
        {/* 麵包屑 */}
        <div className="text-sm text-gray-600 flex items-center gap-1 mb-4">
          <Link href="/" className="hover:underline text-gray-800">首頁</Link>
          <span className="mx-1 text-gray-400">›</span>
          <span className="text-red-600 font-semibold">關於我</span>
        </div>

        <h1 className="text-3xl font-bold">關於我</h1>

        <p className="text-sm text-gray-400">
          更新於 {new Date(about.updatedAt).toLocaleDateString('zh-Hant')}
        </p>

        <div
          className="prose max-w-none prose-p:my-2 prose-li:my-1 prose-img:my-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>

      {/* 🔹 右側 Sidebar */}
      <Sidebar posts={latestPosts.slice(0, 5)} categories={categories} />
    </div>
  )
}