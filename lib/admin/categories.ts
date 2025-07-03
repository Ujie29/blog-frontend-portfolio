import { fetchApi } from '@/lib/fetcher'

export type Category = {
  id: number
  name: string
  children: Category[]
}

export const getCategories = () => {
  return fetchApi<Category[]>(
    `${process.env.NEXT_PUBLIC_ADMIN_API}/api/category/`,
    { auth: true }
  )
}