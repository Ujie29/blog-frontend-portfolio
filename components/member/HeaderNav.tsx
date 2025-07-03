"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  children?: Category[];
}

export default function HeaderNav({ categories }: { categories: Category[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 lg:px-[80px]">
        <nav className="relative flex items-center justify-between h-20">
          {/* ✅ 桌面版 LOGO + 選單 */}
          <div className="hidden md:flex items-center gap-10 w-full">
            {/* LOGO only */}
            <Link href="/" className="shrink-0 flex items-center">
              <img
                src="/logo.jpeg"
                alt="Ujie 的部落格"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* 主分類選單 */}
            <ul className="flex gap-6 text-gray-800 font-medium text-lg relative z-50">
              {/* 關於我 */}
              <li>
                <Link
                  href="/about"
                  className="inline-block px-4 py-2 hover:text-yellow-600"
                >
                  關於我
                </Link>
              </li>

              {/* 分類列表 */}
              {categories.map((category) => (
                <li key={category.slug} className="relative group">
                  <Link
                    href={`/category/${category.slug}`}
                    className="inline-block px-4 py-2 hover:text-yellow-600"
                  >
                    {category.name}
                  </Link>

                  {/* 子分類 dropdown */}
                  {category.children && category.children.length > 0 && (
                    <div className="absolute left-0 top-full mt-2 w-56 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <ul className="py-2">
                        {category.children.map((child) => (
                          <li key={child.slug}>
                            <Link
                              href={`/category/${child.slug}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ 手機版 LOGO + 漢堡 */}
          <div className="flex items-center justify-between w-full md:hidden relative">
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="block">
                <img
                  src="/logo.jpeg"
                  alt="Ujie 的部落格"
                  className="h-10 w-auto object-contain"
                />
              </Link>
            </div>

            {/* 漢堡按鈕 */}
            <button
              className="ml-auto text-gray-700"
              onClick={() => {
                setActiveCategoryId(null);
                setIsMobileMenuOpen((prev) => !prev);
              }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* ✅ 手機版選單 */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4">
          <ul className="flex flex-col gap-2 text-gray-800 font-medium">
            <li>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-lg hover:text-yellow-600"
              >
                關於我
              </Link>
            </li>

            {categories.map((category) => (
              <li key={category.slug}>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/category/${category.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-lg hover:text-yellow-600"
                  >
                    {category.name}
                  </Link>
                  {category.children && category.children.length > 0 && (
                    <button
                      onClick={() =>
                        setActiveCategoryId((prev) =>
                          prev === category.id ? null : category.id
                        )
                      }
                      className="text-lg text-gray-500 px-2"
                    >
                      {activeCategoryId === category.id ? "−" : "+"}
                    </button>
                  )}
                </div>

                {category.children &&
                  activeCategoryId === category.id && (
                    <ul className="pl-4 mt-1 text-gray-600 text-sm">
                      {category.children.map((child) => (
                        <li key={child.slug}>
                          <Link
                            href={`/category/${child.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block py-2 text-base hover:text-yellow-600"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}