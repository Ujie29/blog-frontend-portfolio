import { auth } from '@/lib/firebase/client'

type ApiResponse<T> = {
  code: string
  message: string
  data: T
}

interface FetchApiOptions extends RequestInit {
  revalidate?: number | false
  auth?: boolean
}

export async function fetchApi<T>(
  url: string,
  options: FetchApiOptions = {}
): Promise<T> {
  const { revalidate = 0, auth: needAuth, ...restOptions } = options
  const headers = new Headers(restOptions.headers || {})

  if (needAuth) {
    const user = auth.currentUser
    const token = user ? await user.getIdToken() : null
    if (!token) throw new Error('尚未登入')
    headers.set('Authorization', `Bearer ${token}`)
  }

  // 🟢 這裡用 any 是為了支援 Next.js 專用的 fetch 擴充屬性（next / revalidate / cache）測試
  const fetchOptions: any = {
    ...restOptions,
    headers,
  }

  if (revalidate === false) {
    fetchOptions.cache = 'no-store'
  } else {
    fetchOptions.next = { revalidate }
  }

  const res = await fetch(url, fetchOptions)

  if (!res.ok) throw new Error(`HTTP 錯誤：${res.status}`)

  const json: ApiResponse<T> = await res.json()

  if (json.code !== 'OK') throw new Error(json.message || 'API 回傳錯誤')

  return json.data
}