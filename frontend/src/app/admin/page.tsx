'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth'
import { apiClient } from '@/lib/api'
import { SystemConfig, SystemStatus } from '@/types'
import { AlertCircle, CheckCircle, Settings, Database, Server, HardDrive, Clock } from 'lucide-react'

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [config, setConfig] = useState<SystemConfig | null>(null)
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [openaiKey, setOpenaiKey] = useState('')
  const [huggingFaceKey, setHuggingFaceKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.skill_level !== 'expert') {
      router.push('/dashboard')
      return
    }
    
    fetchSystemData()
  }, [isAuthenticated, user, router])

  const fetchSystemData = async () => {
    try {
      const [configData, statusData] = await Promise.all([
        apiClient.getSystemConfig(),
        apiClient.getSystemStatus()
      ])
      setConfig(configData)
      setStatus(statusData)
    } catch (error: any) {
      setError('Failed to load system data')
    }
  }

  const handleUpdateApiConfig = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await apiClient.updateApiConfig({
        openai_api_key: openaiKey || undefined,
        hugging_face_api_key: huggingFaceKey || undefined
      })
      setSuccess('API設定が更新されました')
      setOpenaiKey('')
      setHuggingFaceKey('')
      fetchSystemData() // Refresh config
    } catch (error: any) {
      setError('API設定の更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated || user?.skill_level !== 'expert') {
    return null
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">システム管理</h1>
          <p className="text-muted-foreground mt-2">
            システム設定とステータスの管理
          </p>
        </div>

        {/* System Status Overview */}
        {status && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">システム</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {status.system.status === 'healthy' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium capitalize">
                    {status.system.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Version {status.system.version}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">データベース</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {status.database.status === 'connected' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium capitalize">
                    {status.database.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pool size: {status.database.pool_size}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ストレージ</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {status.storage.status === 'connected' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium capitalize">
                    {status.storage.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {status.storage.available_space}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">キュー</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {status.queues.status === 'healthy' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium capitalize">
                    {status.queues.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pending: {status.queues.pending_jobs}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              外部API設定
            </CardTitle>
            <CardDescription>
              機械学習とNLP機能のための外部APIキーを設定します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Status */}
            {config && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">OpenAI API</span>
                  <div className="flex items-center space-x-2">
                    {config.openai_configured ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">設定済み</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">未設定</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Hugging Face API</span>
                  <div className="flex items-center space-x-2">
                    {config.hugging_face_configured ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">設定済み</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">未設定</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle className="h-4 w-4" />
                {success}
              </div>
            )}

            {/* API Key Inputs */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="openai-key" className="text-sm font-medium">
                  OpenAI API Key
                </label>
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-..."
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  自然言語クエリ処理とテキスト分析に使用されます
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="huggingface-key" className="text-sm font-medium">
                  Hugging Face API Key
                </label>
                <Input
                  id="huggingface-key"
                  type="password"
                  placeholder="hf_..."
                  value={huggingFaceKey}
                  onChange={(e) => setHuggingFaceKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  機械学習モデルとNLP機能に使用されます
                </p>
              </div>
            </div>

            <Button 
              onClick={handleUpdateApiConfig}
              disabled={isLoading || (!openaiKey && !huggingFaceKey)}
              className="w-full"
            >
              {isLoading ? '更新中...' : 'API設定を更新'}
            </Button>
          </CardContent>
        </Card>

        {/* System Configuration */}
        {config && (
          <Card>
            <CardHeader>
              <CardTitle>システム制限</CardTitle>
              <CardDescription>
                現在のシステム制限値
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">最大ファイルサイズ</label>
                  <p className="text-2xl font-bold">{config.max_file_size_mb}MB</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">最大同時アップロード数</label>
                  <p className="text-2xl font-bold">{config.max_files_per_upload}ファイル</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}