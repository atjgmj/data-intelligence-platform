'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { useDatasetStore } from '@/store/datasets'
import { formatDate, getSkillLevelColor } from '@/lib/utils'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()
  const { datasets, fetchDatasets, isLoading } = useDatasetStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchDatasets()
  }, [isAuthenticated, router, fetchDatasets])

  if (!isAuthenticated) {
    return null
  }

  const recentDatasets = datasets.slice(0, 5)
  const readyDatasets = datasets.filter(d => d.status === 'ready')
  const processingDatasets = datasets.filter(d => d.status === 'processing')

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">ダッシュボード</h1>
          <p className="text-muted-foreground mt-2">
            おかえりなさい、{user?.email}さん
          </p>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>ユーザー情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">スキルレベル:</span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getSkillLevelColor(user?.skill_level || 'beginner')}`}>
                    {user?.skill_level === 'beginner' && '初心者'}
                    {user?.skill_level === 'intermediate' && '中級者'}
                    {user?.skill_level === 'expert' && '上級者'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">登録日:</span>
                  <span className="text-sm text-muted-foreground">
                    {user?.created_at && formatDate(user.created_at)}
                  </span>
                </div>
              </div>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  プロフィール編集
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                総データセット数
              </CardTitle>
              <div className="text-2xl">📊</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{datasets.length}</div>
              <p className="text-xs text-muted-foreground">
                全てのデータセット
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                分析準備完了
              </CardTitle>
              <div className="text-2xl">✅</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readyDatasets.length}</div>
              <p className="text-xs text-muted-foreground">
                分析可能なデータセット
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                処理中
              </CardTitle>
              <div className="text-2xl">⏳</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{processingDatasets.length}</div>
              <p className="text-xs text-muted-foreground">
                処理中のデータセット
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Datasets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>最近のデータセット</CardTitle>
              <CardDescription>
                最近アップロードされたデータセット
              </CardDescription>
            </div>
            <Link href="/datasets">
              <Button variant="outline" size="sm">
                全て表示
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">読み込み中...</p>
              </div>
            ) : recentDatasets.length > 0 ? (
              <div className="space-y-4">
                {recentDatasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{dataset.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {dataset.description || 'No description'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(dataset.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        dataset.status === 'ready' ? 'bg-green-100 text-green-800' :
                        dataset.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {dataset.status === 'ready' && '準備完了'}
                        {dataset.status === 'processing' && '処理中'}
                        {dataset.status === 'uploaded' && 'アップロード済'}
                        {dataset.status === 'error' && 'エラー'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  まだデータセットがありません
                </p>
                <Link href="/datasets">
                  <Button>
                    最初のデータセットをアップロード
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <Link href="/datasets">
              <CardHeader>
                <div className="text-3xl mb-2">📊</div>
                <CardTitle className="text-lg">データセット管理</CardTitle>
                <CardDescription>
                  データのアップロード・管理・変換を行う
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <Link href="/analysis">
              <CardHeader>
                <div className="text-3xl mb-2">🔍</div>
                <CardTitle className="text-lg">データ分析</CardTitle>
                <CardDescription>
                  自然言語でデータ分析を実行
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <Link href="/visualizations">
              <CardHeader>
                <div className="text-3xl mb-2">📈</div>
                <CardTitle className="text-lg">可視化</CardTitle>
                <CardDescription>
                  インタラクティブなチャートとダッシュボード
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>
    </Layout>
  )
}