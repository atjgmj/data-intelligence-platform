'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatBytes, getFileIcon } from '@/lib/utils'
import { useDatasetStore } from '@/store/datasets'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  onUploadSuccess?: (dataset: any) => void
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [datasetName, setDatasetName] = useState('')
  const [datasetDescription, setDatasetDescription] = useState('')
  const { uploadDataset, isUploading, uploadProgress, error } = useDatasetStore()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(acceptedFiles)
    
    // Auto-generate name from first file
    if (acceptedFiles.length > 0 && !datasetName) {
      const fileName = acceptedFiles[0].name.replace(/\.[^/.]+$/, '')
      setDatasetName(fileName)
    }
  }, [datasetName])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json'],
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 5,
    maxSize: 2 * 1024 * 1024 * 1024 // 2GB
  })

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !datasetName) return

    try {
      // For now, upload only the first file
      const file = selectedFiles[0]
      const dataset = await uploadDataset(file, datasetName, datasetDescription)
      
      // Reset form
      setSelectedFiles([])
      setDatasetName('')
      setDatasetDescription('')
      
      onUploadSuccess?.(dataset)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          データセットアップロード
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Drop Zone */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
            {isDragActive ? (
              <p className="text-primary">ファイルをここにドロップしてください</p>
            ) : (
              <>
                <p className="text-sm font-medium">
                  ファイルをドロップするか、クリックしてファイルを選択
                </p>
                <p className="text-xs text-muted-foreground">
                  CSV, XLSX, JSON, PDF形式に対応（最大2GB）
                </p>
              </>
            )}
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">選択されたファイル:</h4>
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getFileIcon(file.type)}</span>
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Dataset Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="dataset-name" className="text-sm font-medium">
              データセット名 *
            </label>
            <Input
              id="dataset-name"
              placeholder="例: 売上データ2024"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="dataset-description" className="text-sm font-medium">
              説明（オプション）
            </label>
            <Input
              id="dataset-description"
              placeholder="このデータセットについて簡単に説明してください"
              value={datasetDescription}
              onChange={(e) => setDatasetDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>アップロード中...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || !datasetName || isUploading}
          className="w-full"
        >
          {isUploading ? 'アップロード中...' : 'データセットをアップロード'}
        </Button>
      </CardContent>
    </Card>
  )
}