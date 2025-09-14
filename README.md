# データインテリジェンスプラットフォーム

非技術者から専門家まで、全ユーザーが高度なデータ分析を直感的に実行できる統合型分析プラットフォーム。

## 特徴

- 🤖 適応型UXによるユーザーレベル別体験提供
- 💬 自然言語によるデータ分析指示
- 📊 高度なデータ可視化・ダッシュボード
- 🔄 ビジュアルETLパイプライン
- 🧠 AI駆動のスキーマ推論・データ理解
- 🔒 エンタープライズレベルのセキュリティ

## クイックスタート

### 前提条件
- Docker & Docker Compose
- Node.js 18+ (開発用)
- Python 3.11+ (開発用)

### 起動方法

1. プロジェクトディレクトリに移動
```bash
cd composter
```

2. 簡単テスト起動（推奨）
```bash
./test.sh
```

3. または手動で起動
```bash
# 環境変数をセットアップ（必要に応じて）
cp .env.example .env

# Dockerコンテナを起動
docker-compose up --build -d
```

4. アプリケーションにアクセス
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8000
- API仕様書: http://localhost:8000/docs
- MinIO Console: http://localhost:9001

### デフォルトログイン情報
- Email: admin@example.com
- Password: admin123

### テスト用データ
プロジェクトルートに `sample_data.csv` が含まれています。このファイルを使用してファイルアップロード機能をテストできます。

## 開発環境

### バックエンド開発
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### フロントエンド開発
```bash
cd frontend
npm install
npm run dev
```

## アーキテクチャ

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Data Layer    │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │   (Redis)       │
│ - Adaptive UI   │    │ - Query Engine  │    │   (MinIO)       │
│ - Visualization │    │ - NLP Processor │    │                 │
│ - Dashboard     │    │ - ML Pipeline   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 現在の実装状況

### ✅ 完了済み機能
- プロジェクト基盤（Docker環境）
- PostgreSQL + Redis + MinIO データ基盤
- FastAPI バックエンド基盤
- Next.js フロントエンド基盤
- ユーザー認証・認可システム
- 基本的なファイルアップロード機能
- データセット管理UI
- 管理者ページ（API設定）
- 適応型UXの基礎（ユーザーレベル別表示）

### 🚧 開発中・予定機能
- AIによるスキーマ推論機能
- 自然言語クエリエンジン
- データ分析・統計機能
- 高度な可視化・ダッシュボード
- ビジュアルETLパイプライン
- リアルタイムデータ処理
- 高度なセキュリティ機能

### 📋 次のステップ
1. **基本動作確認**: `./test.sh` でシステム全体をテスト
2. **データアップロード**: sample_data.csv を使用してアップロード機能をテスト
3. **API設定**: 管理者ページからOpenAI/Hugging Face APIキーを設定
4. **スキーマ推論**: 次フェーズでデータの自動理解機能を実装
5. **自然言語クエリ**: 「売上の平均を求めて」のような日本語分析を実装

## API仕様書

バックエンドを起動後、以下でAPI仕様書を確認できます：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc