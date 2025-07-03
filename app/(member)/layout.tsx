import '../../globals.css'
import HeaderNav from '@/components/member/HeaderNav'
import { getCategories } from "@/lib/member/categories"; 
import Link from 'next/link'
import BackToTopButton from '@/components/member/BackToTopButton'

export const metadata = {
  title: 'Ujie 的部落格 - 美食、旅遊、技術與生活紀錄分享',
  description: 'Ujie 的部落格，分享美食、旅遊、技術心得與生活紀錄，透過文字記錄每個精彩時刻，與你一起品味生活與成長。',
  openGraph: {
    title: 'Ujie 的部落格 - 美食、旅遊、技術與生活紀錄分享',
    description: '分享生活中的美好時刻，無論是美食探索、旅遊紀錄，或是技術心得與成長故事，歡迎一起品味生活、一起前進。',
    url: 'https://www.ujie30.com/',
    siteName: 'Ujie 的部落格',
    images: [
      {
        url: '/preview.png',
        width: 1200,
        height: 630,
        alt: 'Ujie 的部落格預覽圖',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ujie 的部落格 - 美食、旅遊、技術與生活紀錄分享',
    description: '嗨，我是 Ujie！在這裡分享生活中的點滴與心得，包括旅遊、美食、技術與人生故事，一起品味生活的每一刻。',
    images: ['/preview.png'],
  },
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '96x96', url: '/favicon-96x96.png' },
    { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
    { rel: 'shortcut icon', url: '/favicon.ico' },
  ],
  manifest: '/site.webmanifest',
  other: {
    'apple-mobile-web-app-title': 'Ujie Blog',
    'keywords': 'Ujie, 部落格, 美食, 旅遊, 技術, 生活, 3C, Apple, 心得分享',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="zh-Hant">
      <head>
        {/* ✅ 直接塞進 src 中，這樣部署後 HTML 裡會是實體值 */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <LayoutShell categories={categories}>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}

// ✅ 接收從 parent 傳來的 categories
function LayoutShell({
  children,
  categories,
}: {
  children: React.ReactNode
  categories: any[]
}) {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-y-2 border-gray-200 bg-white shadow-sm">
        <HeaderNav categories={categories} />
      </header>
      <main className="flex-1">{children}</main>

      <footer className="mt-10 text-sm text-gray-500 text-center space-y-3 border-t pt-6">
        <div className="space-x-4">
          <Link href="/" className="hover:underline hover:text-blue-600">首頁</Link>
          <Link href="/about" className="hover:underline hover:text-blue-600">關於我</Link>
          <Link href="/privacy-policy" className="hover:underline hover:text-blue-600">隱私權政策</Link>
        </div>
        <div className="text-xs text-gray-400">
          © 2025 Ujie 的部落格｜美食 × 旅遊 × 技術 × 日常 × 生活紀錄．All Rights Reserved.
        </div>
      </footer>
      {/* 回到最上方按鈕 */}
      <BackToTopButton />
    </div>
  )
}