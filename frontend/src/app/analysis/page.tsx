'use client'

import Layout from '@/components/layout/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalysisPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">データ分析</h1>
          <p className="text-muted-foreground mt-2">
            自然言語でデータ分析を実行
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>🚧 開発中</CardTitle>
            <CardDescription>
              この機能は現在開発中です
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              自然言語クエリエンジンとデータ分析機能は次のフェーズで実装予定です。
              しばらくお待ちください。
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}