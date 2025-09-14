'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import Link from 'next/link'

export default function HomePage() {
  const { isAuthenticated, getCurrentUser } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on page load
    const token = localStorage.getItem('access_token')
    if (token) {
      getCurrentUser().catch(() => {
        // Token is invalid, redirect to login
        router.push('/login')
      })
    }
  }, [getCurrentUser, router])

  // If authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            データインテリジェンス
            <br />
            <span className="text-primary">プラットフォーム</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            非技術者から専門家まで、全ユーザーが高度なデータ分析を直感的に実行できる統合型分析プラットフォーム
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto">
              無料で始める
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              デモを見る
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full">
          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">🤖</div>
              <CardTitle className="text-lg">適応型UX</CardTitle>
              <CardDescription>
                ユーザーのスキルレベルに応じて最適なインターフェースを自動提供
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">💬</div>
              <CardTitle className="text-lg">自然言語クエリ</CardTitle>
              <CardDescription>
                「売上の平均を求めて」など、日本語でのデータ分析指示が可能
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">📊</div>
              <CardTitle className="text-lg">高度な可視化</CardTitle>
              <CardDescription>
                AI駆動のチャート推奨とインタラクティブなダッシュボード
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl w-full">
          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">🔄</div>
              <CardTitle className="text-lg">ビジュアルETL</CardTitle>
              <CardDescription>
                ドラッグ&ドロップでデータ変換パイプラインを構築
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">🔒</div>
              <CardTitle className="text-lg">エンタープライズセキュリティ</CardTitle>
              <CardDescription>
                高度な認証・認可機能とデータプライバシー保護
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </Layout>
  )
}