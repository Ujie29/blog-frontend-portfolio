import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 允許的主網域清單
const allowedHosts = ['ujie30.com', 'www.ujie30.com', 'localhost:3000']

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''

  const isAllowed = allowedHosts.some((allowed) => host.includes(allowed))

  if (!isAllowed) {
    // 非允許網域來源 → 永久轉址回主網址
    return NextResponse.redirect('https://ujie30.com', 301)
  }

  return NextResponse.next()
}