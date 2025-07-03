'use client'

import { useEffect, useState } from 'react'

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-5 right-5 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white shadow-md transition-all duration-500 ease-in-out transform active:scale-90 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="回到最上方"
    >
      <span className="text-lg font-bold">↑</span>
    </button>
  )
}