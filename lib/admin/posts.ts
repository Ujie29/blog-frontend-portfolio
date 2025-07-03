import { fetchApi } from '@/lib/fetcher'
import { OutputData } from '@editorjs/editorjs'

export type Post = {
  id: number
  title: string
  summary: string
  content: string
  isPublished: boolean
  categoryId: number
  coverImageUrl: string | null
  createdAt: string
  updatedAt: string
  slug: string
}

export type PostList = {
  id: number
  title: string
  summary: string
  sortId: number
  createdAt: string
  updatedAt: string
}

type PostListApiResponse = {
  page: number
  limit: number
  totalCount: number
  data: PostList[]
}
export type UpdatePostInput = CreatePostInput
export type CreatePostInput = {
  title: string
  slug: string
  categoryID: number
  content: string
  isPublished: boolean
  coverImageUrl: string | null
}

type UploadUrlResponse = {
  uploadUrl: string
  imageUrl: string
}

export type AboutMe = {
  id: number
  content: OutputData
  updatedAt: string
}

export type UpdateAboutMeInput = {
  content: string
}

export const getPosts = (page: number, limit: number, search: string) => {
  const url = `${process.env.NEXT_PUBLIC_ADMIN_API}/api/post/?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  return fetchApi<PostListApiResponse>(url, { auth: true, revalidate: false })
}

export const getPostById = (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_ADMIN_API}/api/post/${id}`
  return fetchApi<Post>(url, { auth: true, revalidate: false })
}

export const createPost = (input: CreatePostInput) => {
  return fetchApi<Post>(
    `${process.env.NEXT_PUBLIC_ADMIN_API}/api/post/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      auth: true,
      revalidate: false,
    }
  )
}

export const updatePost = (id: number, data: UpdatePostInput) => {
  const url = `${process.env.NEXT_PUBLIC_ADMIN_API}/api/post/${id}/`
  return fetchApi<Post>(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    auth: true,
    revalidate: false,
  })
}

export const deletePost = (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_ADMIN_API}/api/post/${id}`
  return fetchApi<null>(url, { method: 'DELETE', auth: true, revalidate: false })
}

// 取得預簽名上傳 URL
export const getImageUploadUrl = (filename: string) => {
  const url = `${process.env.NEXT_PUBLIC_ADMIN_API}/api/post/upload-url?filename=${filename}`
  return fetchApi<UploadUrlResponse>(url, { auth: true, revalidate: false })
}

// 上傳檔案到預簽名 URL
export const uploadFileToUrl = (uploadUrl: string, file: File) => {
  return fetch(uploadUrl, {
    method: 'PUT',
    body: file,
  })
}

// 整合流程：上傳圖片並取得 imageUrl
export const uploadImage = async (file: File): Promise<string> => {
  const { uploadUrl, imageUrl } = await getImageUploadUrl(file.name)
  await uploadFileToUrl(uploadUrl, file)
  return imageUrl
}

/**
 * 上傳主圖片（文章封面圖）用的函式
 *
 * 用途：當使用者建立文章時，上傳一張作為「文章列表封面圖」的主圖片。
 * 特點：
 * - 上傳時機延後到「送出表單」才上傳
 * - 自動幫你產生獨特的檔名（帶 cover 前綴）
 * - 回傳圖片在 R2 上的公開 URL，可直接存進資料庫使用
 *
 * 使用範例：
 * const coverImageUrl = await uploadCoverImage(file)
 */
export const uploadCoverImage = async (file: File): Promise<string> => {
  const filename = `cover_${Date.now()}_${file.name}`
  const { uploadUrl, imageUrl } = await getImageUploadUrl(filename)
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
  })
  return imageUrl
}

// 取得 About Me 資料
export const getAboutMe = async (): Promise<AboutMe> => {
  const url = `${process.env.NEXT_PUBLIC_ADMIN_API}/api/post/about`
  const raw = await fetchApi<{ id: number; content: string; updatedAt: string }>(url, { auth: true, revalidate: false })

  return {
    id: raw.id,
    content: JSON.parse(raw.content),
    updatedAt: raw.updatedAt,
  }
}

// 更新 About Me 資料
export const updateAboutMe = (input: UpdateAboutMeInput) => {
  const url = `${process.env.NEXT_PUBLIC_ADMIN_API}/api/post/about`
  return fetchApi<AboutMe>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    auth: true,
    revalidate: false,
  })
}