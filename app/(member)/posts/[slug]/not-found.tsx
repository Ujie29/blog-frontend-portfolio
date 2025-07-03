// app/posts/[id]/not-found.tsx

export default function NotFound() {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold">找不到這篇文章</h2>
        <p className="text-gray-500 mt-2">你訪問的文章不存在或尚未發佈。</p>
      </div>
    )
  }
  