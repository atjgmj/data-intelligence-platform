'use client'

import Layout from '@/components/layout/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function VisualizationsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">可視化</h1>
          <p className="text-muted-foreground mt-2">
            インタラクティブなチャートとダッシュボード
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
              データ可視化機能とダッシュボードは次のフェーズで実装予定です。
              しばらくお待ちください。
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}