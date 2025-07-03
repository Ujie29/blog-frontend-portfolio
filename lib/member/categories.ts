import { fetchApi } from '@/lib/fetcher'

// 分類資料型別
export type Category = {
  id: number
  name: string
  slug: string
  parent?: number | null
}

// 巢狀分類資料型別（用於樹狀分類 UI）
export type NestedCategory = Category & {
  children: NestedCategory[]
}

// 取得所有分類資料
export async function getCategories(): Promise<NestedCategory[]> {
  return fetchApi<NestedCategory[]>(`${process.env.NEXT_PUBLIC_MEMBER_API}/api/category`)
}