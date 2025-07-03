import { getPostBySlug, getPosts, getPostsByCategory } from '@/lib/member/posts'
import RandomPostGrid from '@/components/member/RandomPostCarousel'
import { getRandomPostsByCategory } from '@/lib/member/posts'
import { getCategories } from '@/lib/member/categories'
import { notFound } from 'next/navigation'
import edjsHTML from 'editorjs-html'
import Sidebar from '@/components/member/Sidebar'
import Link from 'next/link'
import AdBlock from '@/components/member/AdBlock'
import RelatedPosts from '@/components/member/RelatedPosts'
import PostNavigator from '@/components/member/PostNavigator'

export const dynamic = 'force-static'

function flattenCategories(categories: any[]): any[] {
  return categories.flatMap((cat) =>
    cat.children && cat.children.length > 0
      ? [cat, ...flattenCategories(cat.children)]
      : [cat]
  )
}

export async function generateMetadata(props: any) {
  const slug = props.params?.slug
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.summary ?? '',
    openGraph: {
      title: post.title,
      description: post.summary ?? '',
      url: `https://www.ujie30.com/posts/${slug}`,
      images: [
        {
          url: post.coverImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary ?? '',
      images: [post.coverImageUrl],
    },
  }
}

export default async function PostPage(props: any) {
  const slug = props.params?.slug
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  // 🔍 取得分類資料
  const categories = await getCategories()
  const all = flattenCategories(categories)
  const currentCategory = all.find((cat) => cat.id === post.categoryId)
  const parentCategory = currentCategory?.parent
    ? all.find((cat) => cat.id === currentCategory.parent)
    : null

  // 🔍 撈同分類的其他文章（排除自己），不足則補全站最新文章
  let relatedPosts: {
    slug: string
    title: string
    coverImageUrl: string
  }[] = []

  // 🔍 獲取分類隨機文章
  const randomPosts = await getRandomPostsByCategory(Number(post.categoryId), slug)

  if (currentCategory) {
    const sameCategoryPosts = (await getPostsByCategory(currentCategory.slug, 1, 12)).data
      .filter((p: any) => p.slug !== slug)

    let fallbackPosts: any[] = []

    if (sameCategoryPosts.length < 6) {
      fallbackPosts = (await getPosts(1, 10)).data
        .filter((p: any) => p.slug !== slug && p.categoryId !== currentCategory.id)
    }

    // ✅ 合併後去除重複（依照 slug）
    const combined = [...sameCategoryPosts, ...fallbackPosts]
    const uniquePosts = Array.from(
      new Map(combined.map((p) => [p.slug, p])).values()
    )

    // ✅ 最後只保留最多 6 筆
    relatedPosts = uniquePosts.slice(0, 6)
  }

  // 📌 Sidebar 顯示全站最新文章
  const latestPosts = (await getPosts()).data

  // 🔍 同分類所有文章（包含自己）
  const categoryPosts = (await getPostsByCategory(currentCategory.slug, 1, 999)).data
  // 🔃 排序（舊 → 新）
  const sortedPosts = categoryPosts.sort(
    (a: any, b: any) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
  // ✅ 現在找出目前這篇的位置
  const currentIndex = sortedPosts.findIndex(p => p.slug === slug)
  // ✅ 正確取得上一篇與下一篇
  const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null

  // 🔧 解析 Editor.js 內容
  let html = ''
  try {
    const data = typeof post.content === 'string' ? JSON.parse(post.content) : post.content
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
        if (data.style === 'checklist') {
          return items.map(
            (item) =>
              `<div class="flex items-center gap-2 mb-1">
                <input type="checkbox" ${item.meta?.checked ? 'checked' : ''} disabled />
                <span>${item.content}</span>
              </div>`
          ).join('')
        }
        const tag = data.style === 'ordered' ? 'ol' : 'ul'
        return `<${tag}>${items.map((item) => `<li>${item.content}</li>`).join('')}</${tag}>`
      },
      quote: ({ data }) => `<blockquote>${data.text}<br/>— ${data.caption}</blockquote>`,
      code: ({ data }) => `<pre><code>${data.code}</code></pre>`,
      table: ({ data }) => {
        const rows = data.content
          .map(
            (row: string[]) =>
              `<tr>${row.map((cell) => `<td class="border px-4 py-2 whitespace-nowrap">${cell}</td>`).join('')}</tr>`
          )
          .join('')

        return `
          <div class="overflow-x-auto w-full my-4">
            <table class="min-w-[600px] table-auto border-collapse border border-gray-300">
              <tbody>${rows}</tbody>
            </table>
          </div>
        `
      },
      delimiter: () => `<div class="text-center my-6 text-xl text-gray-400">* * *</div>`,
      embed: ({ data }) => {
        return `
          <div class="aspect-video w-full my-4 rounded overflow-hidden">
            <iframe 
              class="w-full h-full"
              src="${data.embed}" 
              frameborder="0" 
              allowfullscreen
            ></iframe>
          </div>
        `
      }
    })

    const blocksHTML = parser.parse(data)
    html = Array.isArray(blocksHTML) ? blocksHTML.join('') : blocksHTML
  } catch {
    html = '<p class="text-red-500">文章內容解析錯誤</p>'
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 lg:px-[80px] py-10 flex flex-col lg:flex-row gap-6">

      {/* 🔹 左側主欄：麵包屑 + 文章內容 */}
      <article className="w-full lg:w-2/3 space-y-6">

        {/* ✅ 麵包屑導航 */}
        <div className="text-sm text-gray-600 flex flex-wrap items-center gap-1 mb-4">
          <Link href="/" className="hover:underline text-gray-800">首頁</Link>
          <span className="mx-1 text-gray-400">›</span>

          {currentCategory?.parent ? (
            <>
              <Link href={`/category/${parentCategory?.slug}`} className="hover:underline text-gray-800">
                {parentCategory?.name}
              </Link>
              <span className="mx-1 text-gray-400">›</span>

              <Link href={`/category/${currentCategory.slug}`} className="hover:underline text-gray-800">
                {currentCategory.name}
              </Link>
              <span className="mx-1 text-gray-400">›</span>
            </>
          ) : (
            <>
              <Link href={`/category/${currentCategory?.slug}`} className="hover:underline text-gray-800">
                {currentCategory?.name}
              </Link>
              <span className="mx-1 text-gray-400">›</span>
            </>
          )}

          <span className="text-red-600 font-semibold break-words block sm:inline">{post.title}</span>
        </div>

        {/* 🔹 文章標題 */}
        <h1 className="text-3xl font-bold">{post.title}</h1>

        {/* ✅ Google AdSense 廣告 */}
        <AdBlock />

        {/* 🔹 發佈日期 */}
        <p className="text-sm text-gray-400">
          發佈於 {new Date(post.createdAt).toLocaleDateString('zh-Hant')}
        </p>

        {/* 🔹 HTML 文章內容 */}
        <div
          className="prose max-w-none prose-p:my-2 prose-li:my-1 prose-img:my-4
            prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* ✅ Google 廣告 */}
        <AdBlock />

        {/* ✅ 延伸閱讀 Carousel 區塊 */}
        {randomPosts.length > 0 && <RandomPostGrid posts={randomPosts} />}

        {/* ✅ 你感興趣的內容區塊 */}
        <RelatedPosts posts={relatedPosts} />

        {/* ✅「上一篇 / 下一篇」區塊 */}
        <PostNavigator
          prev={prevPost ? {
            slug: prevPost.slug,
            title: prevPost.title,
            coverImageUrl: prevPost.coverImageUrl,
            summary: prevPost.summary,
          } : undefined}
          next={nextPost ? {
            slug: nextPost.slug,
            title: nextPost.title,
            coverImageUrl: nextPost.coverImageUrl,
            summary: nextPost.summary,
          } : undefined}
        />
      </article>

      {/* 🔹 Sidebar（最新文章 + 分類） */}
      <Sidebar posts={latestPosts.slice(0, 5)} categories={categories} />
    </div>
  )
}