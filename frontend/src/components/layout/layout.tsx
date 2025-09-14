'use client'

import React from 'react'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-primary-foreground text-lg font-bold">AI</span>
                </div>
                <span className="text-xl font-semibold">Data Intelligence Platform</span>
              </Link>
            </div>

            {/* Navigation */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                  ダッシュボード
                </Link>
                <Link href="/datasets" className="text-sm font-medium hover:text-primary">
                  データセット
                </Link>
                <Link href="/analysis" className="text-sm font-medium hover:text-primary">
                  分析
                </Link>
                <Link href="/visualizations" className="text-sm font-medium hover:text-primary">
                  可視化
                </Link>
                {user?.skill_level === 'expert' && (
                  <Link href="/admin" className="text-sm font-medium hover:text-primary">
                    管理
                  </Link>
                )}
              </nav>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {user?.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                  >
                    ログアウト
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      ログイン
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">
                      新規登録
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Data Intelligence Platform. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-primary">
                ドキュメント
              </Link>
              <Link href="/support" className="text-sm text-muted-foreground hover:text-primary">
                サポート
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                プライバシー
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout