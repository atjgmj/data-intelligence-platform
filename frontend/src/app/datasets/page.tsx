'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload'
import { useAuthStore } from '@/store/auth'
import { useDatasetStore } from '@/store/datasets'
import { formatBytes, formatDate, getFileIcon, getStatusColor } from '@/lib/utils'
import { Plus, Download, Trash2, Edit } from 'lucide-react'

export default function DatasetsPage() {
  const [showUpload, setShowUpload] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { datasets, fetchDatasets, deleteDataset, isLoading, error } = useDatasetStore()
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

  const handleUploadSuccess = (dataset: any) => {
    setShowUpload(false)
    // Refresh datasets list
    fetchDatasets()
  }

  const handleDeleteDataset = async (id: string, name: string) => {
    if (confirm(`「${name}」を削除してもよろしいですか？この操作は元に戻せません。`)) {
      try {
        await deleteDataset(id)
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  if (showUpload) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">データセットアップロード</h1>
              <p className="text-muted-foreground mt-2">
                新しいデータセットをアップロードします
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowUpload(false)}
            >
              戻る
            </Button>
          </div>

          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">データセット</h1>
            <p className="text-muted-foreground mt-2">
              アップロードしたデータセットの管理と分析
            </p>
          </div>
          <Button onClick={() => setShowUpload(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新しいデータセット
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : datasets.length === 0 ? (
          /* Empty State */
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">データセットがありません</h3>
              <p className="text-muted-foreground mb-6 text-center">
                最初のデータセットをアップロードして分析を始めましょう
              </p>
              <Button onClick={() => setShowUpload(true)}>
                <Plus className="h-4 w-4 mr-2" />
                データセットをアップロード
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Datasets Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasets.map((dataset) => (
              <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-2xl">{getFileIcon(dataset.file_type || 'unknown')}</span>
                        {dataset.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {dataset.description || 'No description'}
                      </CardDescription>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(dataset.status)}`}>
                      {dataset.status === 'ready' && '準備完了'}
                      {dataset.status === 'processing' && '処理中'}
                      {dataset.status === 'uploaded' && 'アップロード済'}
                      {dataset.status === 'error' && 'エラー'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* File Info */}
                    <div className="text-sm text-muted-foreground space-y-1">
                      {dataset.file_size && (
                        <div>サイズ: {formatBytes(dataset.file_size)}</div>
                      )}
                      <div>作成日: {formatDate(dataset.created_at)}</div>
                      {dataset.updated_at !== dataset.created_at && (
                        <div>更新日: {formatDate(dataset.updated_at!)}</div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex space-x-2">
                        {dataset.status === 'ready' && (
                          <Button size="sm" variant="outline" className="h-8">
                            <Download className="h-3 w-3 mr-1" />
                            分析
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-8">
                          <Edit className="h-3 w-3 mr-1" />
                          編集
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteDataset(dataset.id, dataset.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}