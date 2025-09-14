'use client'

import Layout from '@/components/layout/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DemoPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">プラットフォームデモ</h1>
          <p className="text-xl text-muted-foreground">
            データインテリジェンスプラットフォームの主要機能をご体験ください
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">📊</div>
              <CardTitle>データセット管理</CardTitle>
              <CardDescription>
                CSV、JSON、Excelファイルのアップロードとスキーマ自動推論
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/datasets">
                <Button className="w-full">データセットを試す</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">🔍</div>
              <CardTitle>データ分析</CardTitle>
              <CardDescription>
                自然言語クエリによる高度なデータ分析機能
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/analysis">
                <Button className="w-full">分析を試す</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">📈</div>
              <CardTitle>可視化</CardTitle>
              <CardDescription>
                AI駆動のチャート推奨とインタラクティブな可視化
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/visualizations">
                <Button className="w-full">可視化を試す</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">🎯</div>
              <CardTitle>ダッシュボード</CardTitle>
              <CardDescription>
                リアルタイムデータ監視とカスタマイズ可能なダッシュボード
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button className="w-full">ダッシュボードを見る</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">⚙️</div>
              <CardTitle>管理機能</CardTitle>
              <CardDescription>
                ユーザー管理、権限設定、システム監視機能
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button className="w-full">管理機能を見る</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">🚀</div>
              <CardTitle>今すぐ始める</CardTitle>
              <CardDescription>
                アカウントを作成して全機能をご利用ください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/register">
                <Button className="w-full">無料登録</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline">ホームに戻る</Button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}