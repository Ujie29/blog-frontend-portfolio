import { fetchApi } from '@/lib/fetcher'
import { cache } from 'react'

export type PostListDto = {
    slug: string
    title: string
    summary: string
    coverImageUrl: string
    createdAt: string
  }

export type PostDto = {
    title: string
    content: string
    summary: string
    categoryId: string
    coverImageUrl: string
    createdAt: string
  }

export type AboutMeDto = {
  id: number
  content: string
  updatedAt: string
}

export type PaginatedPostResponse = {
  page: number
  limit: number
  totalCount: number
  data: PostListDto[]
}
  
// 抓取文章列表（預設排序好）
export async function getPosts(page = 1, limit = 10): Promise<PaginatedPostResponse> {
  const url = `${process.env.NEXT_PUBLIC_MEMBER_API}/api/post?page=${page}&limit=${limit}`
  return fetchApi<PaginatedPostResponse>(url)
}
  
// 取得單篇文章(快取包裝)
const _getPostBySlug = async (slug: string): Promise<PostDto | null> => {
  try {
    return await fetchApi<PostDto>(`${process.env.NEXT_PUBLIC_MEMBER_API}/api/post/${slug}`)
  } catch {
    return null
  }
}
export const getPostBySlug = cache(_getPostBySlug)

// 從分類取得該分類下的文章
export async function getPostsByCategory(slug: string, page = 1, limit = 10): Promise<PaginatedPostResponse> {
  const url = `${process.env.NEXT_PUBLIC_MEMBER_API}/api/post/category/${slug}?page=${page}&limit=${limit}`
  return fetchApi<PaginatedPostResponse>(url)
}

// 取得關於我內容
export async function getAboutMe(): Promise<AboutMeDto | null> {
  try {
    return await fetchApi<AboutMeDto>(`${process.env.NEXT_PUBLIC_MEMBER_API}/api/post/about`)
  } catch {
    return null
  }
}

// 取得分類下的隨機文章（用於延伸閱讀 / 相關文章）
export async function getRandomPostsByCategory(categoryId: number, slug: string): Promise<PostListDto[]> {
  const url = `${process.env.NEXT_PUBLIC_MEMBER_API}/api/post/randomCategoryPost`

  return fetchApi<PostListDto[]>(url, {
    method: 'POST',
    body: JSON.stringify({ categoryId, slug }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}