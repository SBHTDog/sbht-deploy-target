# sbht-deploy-target

<details open>
<summary><strong>🇰🇷 한국어</strong></summary>

## 📋 프로젝트 개요

**sbht-deploy-target**은 실제 배포 대상이 되는 애플리케이션 서비스입니다. 텍스트와 이미지를 업로드하고 관리하는 웹 애플리케이션으로, AWS S3와 RDS PostgreSQL을 통합하여 안전하고 확장 가능한 파일 관리 시스템을 제공합니다.

이 프로젝트는 Softbank Hackerthon 2025를 위한 SBHTDog 조직의 배포 대상 애플리케이션입니다.

## ✨ 주요 기능

### 📤 파일 업로드

- **텍스트 업로드**: 텍스트 콘텐츠를 PostgreSQL에 저장
- **이미지 업로드**: 이미지 파일을 AWS S3에 자동 업로드
- **미리보기**: 업로드 전 이미지 미리보기 기능
- **파일 유효성 검사**:
  - 지원 형식: JPEG, PNG, GIF, WebP
  - 최대 파일 크기: 5MB
- **실시간 피드백**: 업로드 진행 상태 표시

### 📋 콘텐츠 관리

- **업로드 목록**: 최근 업로드된 콘텐츠 목록 표시
- **이미지 조회**: S3 Presigned URL을 통한 안전한 이미지 접근
- **메타데이터**: 업로드 시간 및 상태 정보

### 🎨 사용자 인터페이스

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **다크 모드**: 자동 다크 모드 지원
- **직관적 UX**: 드래그 앤 드롭, 클릭 업로드
- **에러 처리**: 사용자 친화적인 에러 메시지

### 🔐 보안

- **안전한 파일 저장**: S3 버킷 암호화
- **접근 제어**: IAM 역할 기반 접근
- **Presigned URL**: 시간 제한이 있는 이미지 URL
- **입력 검증**: 파일 타입 및 크기 검증

### 네트워크 구성

- **프라이빗 서브넷**: ECS Fargate 컨테이너 실행
- **NAT Gateway**: S3 및 외부 서비스 접근
- **보안 그룹**: ALB로부터의 트래픽만 허용
- **VPC 엔드포인트**: S3 접근 최적화 (선택사항)

## 🛠️ 기술 스택

### 프론트엔드

- **Next.js 16.0.3**: React 기반 풀스택 프레임워크 (App Router)
- **React 19.2.0**: UI 컴포넌트 라이브러리
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크

### 백엔드

- **Next.js API Routes**: 서버리스 API 엔드포인트
- **AWS SDK v3**: AWS 서비스 통합
  - `@aws-sdk/client-s3`: S3 클라이언트
  - `@aws-sdk/s3-request-presigner`: Presigned URL 생성
- **pg**: PostgreSQL 클라이언트

### 데이터베이스 & 스토리지

- **PostgreSQL**: 메타데이터 저장
  - 텍스트 콘텐츠
  - 이미지 S3 키
  - 타임스탬프
- **AWS S3**: 이미지 파일 저장
  - 암호화 활성화
  - 버전 관리
  - 라이프사이클 정책

### DevOps

- **Docker**: 컨테이너화
- **ECS Fargate**: 서버리스 컨테이너 실행
- **ECR**: Docker 이미지 저장소

## 📂 프로젝트 구조

```
sbht-deploy-target/
├── app/
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.ts              # 업로드 API (POST)
│   │   └── uploads/
│   │       └── route.ts              # 목록 조회 API (GET)
│   ├── layout.tsx                    # 루트 레이아웃
│   ├── page.tsx                      # 메인 페이지
│   └── globals.css                   # 글로벌 스타일
├── components/
│   ├── UploadForm.tsx                # 업로드 폼 컴포넌트
│   └── UploadsList.tsx               # 목록 컴포넌트
├── lib/
│   ├── aws/
│   │   ├── s3-client.ts              # S3 클라이언트 설정
│   │   └── upload.ts                 # S3 업로드 유틸리티
│   └── db/
│       ├── index.ts                  # PostgreSQL 연결 풀
│       ├── queries.ts                # 데이터베이스 쿼리
│       └── schema.sql                # 데이터베이스 스키마
├── Dockerfile                        # Docker 이미지 빌드
├── task-definition.json              # ECS 태스크 정의
├── package.json                      # 의존성 관리
├── tsconfig.json                     # TypeScript 설정
└── next.config.ts                    # Next.js 설정
```

## 🚀 시작하기

### 사전 요구사항

- Node.js >= 18
- PostgreSQL >= 14
- AWS 계정
- AWS CLI 설치 및 구성
- Docker (선택사항)

### 로컬 개발 환경 설정

#### 1. 저장소 클론

```bash
git clone https://github.com/SBHTDog/sbht-deploy-target.git
cd sbht-deploy-target
```

#### 2. 의존성 설치

```bash
npm install
```

#### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=deploy_db

# AWS Configuration
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=your-bucket-name

# AWS Credentials (로컬 개발용)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

⚠️ **주의**: ECS에서 실행 시 AWS 자격 증명은 자동으로 IAM 역할에서 가져옵니다.

#### 4. 데이터베이스 설정

PostgreSQL에서 데이터베이스 생성:

```sql
CREATE DATABASE deploy_db;
```

스키마 적용:

```bash
psql -U your_username -d deploy_db -f lib/db/schema.sql
```

#### 5. S3 버킷 생성

AWS Console 또는 CLI를 사용하여 S3 버킷 생성:

```bash
aws s3 mb s3://your-bucket-name --region ap-northeast-2
```

#### 6. 개발 서버 시작

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### Docker로 실행

#### Docker 이미지 빌드

```bash
docker build -t sbht-deploy-target:latest .
```

#### Docker 컨테이너 실행

```bash
docker run -p 3000:3000 \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_USERNAME=your-username \
  -e DB_PASSWORD=your-password \
  -e DB_NAME=deploy_db \
  -e AWS_REGION=ap-northeast-2 \
  -e S3_BUCKET_NAME=your-bucket-name \
  sbht-deploy-target:latest
```

## 📝 API 엔드포인트

### `POST /api/upload`

텍스트와 이미지를 업로드합니다.

**Request:**

- Content-Type: `multipart/form-data`
- Body:
  - `text` (required): 텍스트 콘텐츠
  - `image` (optional): 이미지 파일 (최대 5MB)

**Response:**

```json
{
  "message": "Upload successful",
  "data": {
    "id": 123,
    "text_content": "Hello World",
    "image_url": "uploads/2025/11/21/image-uuid.jpg",
    "created_at": "2025-11-21T12:00:00Z"
  }
}
```

**Error Response:**

```json
{
  "error": "Text content is required"
}
```

### `GET /api/uploads`

업로드된 콘텐츠 목록을 조회합니다.

**Query Parameters:**

- `limit` (optional): 페이지당 항목 수 (기본값: 10)
- `offset` (optional): 오프셋 (기본값: 0)

**Response:**

```json
{
  "uploads": [
    {
      "id": 123,
      "text_content": "Hello World",
      "image_url": "https://presigned-url...",
      "created_at": "2025-11-21T12:00:00Z"
    }
  ]
}
```

## 📊 데이터베이스 스키마

### `uploads` 테이블

```sql
CREATE TABLE uploads (
  id SERIAL PRIMARY KEY,
  text_content TEXT NOT NULL,
  image_url VARCHAR(512),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_uploads_created_at ON uploads(created_at DESC);

-- 트리거
CREATE TRIGGER update_uploads_updated_at
  BEFORE UPDATE ON uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**컬럼 설명:**

- `id`: 기본 키 (자동 증가)
- `text_content`: 텍스트 콘텐츠
- `image_url`: S3 이미지 키 (경로)
- `created_at`: 생성 시간
- `updated_at`: 수정 시간 (자동 업데이트)

## 🔐 AWS IAM 권한

### ECS Task Role 필요 권한

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::your-bucket-name"
    }
  ]
}
```

## 🎨 컴포넌트 설명

### UploadForm

업로드 폼을 제공하는 클라이언트 컴포넌트

**Features:**

- 텍스트 입력 필드
- 이미지 파일 선택
- 이미지 미리보기
- 파일 유효성 검사
- 로딩 상태 표시
- 에러 및 성공 메시지

### UploadsList

업로드된 콘텐츠 목록을 표시하는 클라이언트 컴포넌트

**Features:**

- 카드 형식의 목록 표시
- Presigned URL로 이미지 표시
- 생성 시간 표시
- 자동 새로고침
- 로딩 스켈레톤

## 🔄 배포 프로세스

### ECS Fargate 배포

1. **ECR에 이미지 푸시**

   ```bash
   aws ecr get-login-password --region ap-northeast-2 | \
     docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com

   docker tag sbht-deploy-target:latest <ecr-url>:latest
   docker push <ecr-url>:latest
   ```

2. **ECS 서비스 업데이트**
   - ECS가 자동으로 새 이미지를 감지하고 배포
   - Blue/Green 배포 지원 (CodeDeploy)

### 환경 변수 (SSM Parameter Store)

프로덕션 환경에서는 환경 변수를 SSM Parameter Store에 저장:

```bash
aws ssm put-parameter \
  --name "/sbht/prod/db/host" \
  --value "your-rds-endpoint" \
  --type String

aws ssm put-parameter \
  --name "/sbht/prod/db/password" \
  --value "your-password" \
  --type SecureString
```

## 🧪 테스트

### 수동 테스트

#### 업로드 테스트

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "text=Test content" \
  -F "image=@test-image.jpg"
```

#### 목록 조회 테스트

```bash
curl http://localhost:3000/api/uploads?limit=10
```

## 🔒 보안 모범 사례

### 구현된 보안 기능

1. **파일 검증**:
   - MIME 타입 확인
   - 파일 크기 제한
   - 파일 확장자 화이트리스트
2. **S3 보안**:
   - 버킷 암호화
   - 퍼블릭 액세스 차단
   - Presigned URL 사용 (시간 제한)
3. **데이터베이스**:
   - 프라이빗 서브넷
   - 보안 그룹 제한
   - SSL/TLS 연결
4. **네트워크**:
   - VPC 격리
   - 보안 그룹 규칙
   - NAT Gateway를 통한 아웃바운드

## 📈 성능 최적화

### 구현된 최적화

- **연결 풀링**: PostgreSQL 연결 풀
- **캐싱**: S3 Presigned URL 캐싱
- **코드 스플리팅**: Next.js App Router

</details>

<details>
<summary><strong>🇯🇵 日本語</strong></summary>

## 📋 プロジェクト概要

**sbht-deploy-target**は、実際のデプロイメント対象となるアプリケーションサービスです。テキストと画像をアップロードおよび管理する Web アプリケーションで、AWS S3 と RDS PostgreSQL を統合し、安全でスケーラブルなファイル管理システムを提供します。

このプロジェクトは、Softbank Hackerthon 2025 のための SBHTDog 組織のデプロイメント対象アプリケーションです。

## ✨ 主な機能

### 📤 ファイルアップロード

- **テキストアップロード**: テキストコンテンツを PostgreSQL に保存
- **画像アップロード**: 画像ファイルを AWS S3 に自動アップロード
- **プレビュー**: アップロード前の画像プレビュー機能
- **ファイル検証**:
  - 対応形式: JPEG, PNG, GIF, WebP
  - 最大ファイルサイズ: 5MB
- **リアルタイムフィードバック**: アップロード進行状況表示

### 📋 コンテンツ管理

- **アップロードリスト**: 最近アップロードされたコンテンツリスト表示
- **画像取得**: S3 Presigned URL による安全な画像アクセス
- **メタデータ**: アップロード時刻および状態情報

### 🎨 ユーザーインターフェース

- **レスポンシブデザイン**: モバイル、タブレット、デスクトップ対応
- **ダークモード**: 自動ダークモード対応
- **直感的 UX**: ドラッグ＆ドロップ、クリックアップロード
- **エラー処理**: ユーザーフレンドリーなエラーメッセージ

### 🔐 セキュリティ

- **安全なファイル保存**: S3 バケット暗号化
- **アクセス制御**: IAM ロールベースのアクセス
- **Presigned URL**: 時間制限付き画像 URL
- **入力検証**: ファイルタイプおよびサイズ検証

### ネットワーク構成

- **プライベートサブネット**: ECS Fargate コンテナ実行
- **NAT ゲートウェイ**: S3 および外部サービスアクセス
- **セキュリティグループ**: ALB からのトラフィックのみ許可
- **VPC エンドポイント**: S3 アクセス最適化 (オプション)

## 🛠️ 技術スタック

### フロントエンド

- **Next.js 16.0.3**: React ベースのフルスタックフレームワーク (App Router)
- **React 19.2.0**: UI コンポーネントライブラリ
- **TypeScript**: 型安全性
- **Tailwind CSS**: ユーティリティベース CSS フレームワーク

### バックエンド

- **Next.js API Routes**: サーバーレス API エンドポイント
- **AWS SDK v3**: AWS サービス統合
  - `@aws-sdk/client-s3`: S3 クライアント
  - `@aws-sdk/s3-request-presigner`: Presigned URL 生成
- **pg**: PostgreSQL クライアント

### データベース & ストレージ

- **PostgreSQL**: メタデータ保存
  - テキストコンテンツ
  - 画像 S3 キー
  - タイムスタンプ
- **AWS S3**: 画像ファイル保存
  - 暗号化有効化
  - バージョン管理
  - ライフサイクルポリシー

### DevOps

- **Docker**: コンテナ化
- **ECS Fargate**: サーバーレスコンテナ実行
- **ECR**: Docker イメージリポジトリ

## 📂 プロジェクト構造

```
sbht-deploy-target/
├── app/
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.ts              # アップロードAPI (POST)
│   │   └── uploads/
│   │       └── route.ts              # リスト取得API (GET)
│   ├── layout.tsx                    # ルートレイアウト
│   ├── page.tsx                      # メインページ
│   └── globals.css                   # グローバルスタイル
├── components/
│   ├── UploadForm.tsx                # アップロードフォームコンポーネント
│   └── UploadsList.tsx               # リストコンポーネント
├── lib/
│   ├── aws/
│   │   ├── s3-client.ts              # S3クライアント設定
│   │   └── upload.ts                 # S3アップロードユーティリティ
│   └── db/
│       ├── index.ts                  # PostgreSQL接続プール
│       ├── queries.ts                # データベースクエリ
│       └── schema.sql                # データベーススキーマ
├── Dockerfile                        # Dockerイメージビルド
├── task-definition.json              # ECSタスク定義
├── package.json                      # 依存関係管理
├── tsconfig.json                     # TypeScript設定
└── next.config.ts                    # Next.js設定
```

## 🚀 はじめに

### 前提条件

- Node.js >= 18
- PostgreSQL >= 14
- AWS アカウント
- AWS CLI のインストールと設定
- Docker (オプション)

### ローカル開発環境のセットアップ

#### 1. リポジトリのクローン

```bash
git clone https://github.com/SBHTDog/sbht-deploy-target.git
cd sbht-deploy-target
```

#### 2. 依存関係のインストール

```bash
npm install
```

#### 3. 環境変数の設定

`.env.local`ファイルを作成し、以下の内容を入力:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=deploy_db

# AWS Configuration
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=your-bucket-name

# AWS Credentials (ローカル開発用)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

⚠️ **注意**: ECS で実行時、AWS 認証情報は自動的に IAM ロールから取得されます。

#### 4. データベースのセットアップ

PostgreSQL でデータベースを作成:

```sql
CREATE DATABASE deploy_db;
```

スキーマの適用:

```bash
psql -U your_username -d deploy_db -f lib/db/schema.sql
```

#### 5. S3 バケットの作成

AWS Console または CLI を使用して S3 バケットを作成:

```bash
aws s3 mb s3://your-bucket-name --region ap-northeast-2
```

#### 6. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで`http://localhost:3000`にアクセス

### Docker で実行

#### Docker イメージのビルド

```bash
docker build -t sbht-deploy-target:latest .
```

#### Docker コンテナの実行

```bash
docker run -p 3000:3000 \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_USERNAME=your-username \
  -e DB_PASSWORD=your-password \
  -e DB_NAME=deploy_db \
  -e AWS_REGION=ap-northeast-2 \
  -e S3_BUCKET_NAME=your-bucket-name \
  sbht-deploy-target:latest
```

## 📝 API エンドポイント

### `POST /api/upload`

テキストと画像をアップロードします。

**Request:**

- Content-Type: `multipart/form-data`
- Body:
  - `text` (required): テキストコンテンツ
  - `image` (optional): 画像ファイル (最大 5MB)

**Response:**

```json
{
  "message": "Upload successful",
  "data": {
    "id": 123,
    "text_content": "Hello World",
    "image_url": "uploads/2025/11/21/image-uuid.jpg",
    "created_at": "2025-11-21T12:00:00Z"
  }
}
```

**Error Response:**

```json
{
  "error": "Text content is required"
}
```

### `GET /api/uploads`

アップロードされたコンテンツリストを取得します。

**Query Parameters:**

- `limit` (optional): ページあたりの項目数 (デフォルト: 10)
- `offset` (optional): オフセット (デフォルト: 0)

**Response:**

```json
{
  "uploads": [
    {
      "id": 123,
      "text_content": "Hello World",
      "image_url": "https://presigned-url...",
      "created_at": "2025-11-21T12:00:00Z"
    }
  ]
}
```

## 📊 データベーススキーマ

### `uploads` テーブル

```sql
CREATE TABLE uploads (
  id SERIAL PRIMARY KEY,
  text_content TEXT NOT NULL,
  image_url VARCHAR(512),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_uploads_created_at ON uploads(created_at DESC);

-- トリガー
CREATE TRIGGER update_uploads_updated_at
  BEFORE UPDATE ON uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**カラム説明:**

- `id`: プライマリキー (自動インクリメント)
- `text_content`: テキストコンテンツ
- `image_url`: S3 画像キー (パス)
- `created_at`: 作成時刻
- `updated_at`: 更新時刻 (自動更新)

## 🔐 AWS IAM 権限

### ECS Task Role 必要権限

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::your-bucket-name"
    }
  ]
}
```

## 🎨 コンポーネント説明

### UploadForm

アップロードフォームを提供するクライアントコンポーネント

**Features:**

- テキスト入力フィールド
- 画像ファイル選択
- 画像プレビュー
- ファイル検証
- ローディング状態表示
- エラーおよび成功メッセージ

### UploadsList

アップロードされたコンテンツリストを表示するクライアントコンポーネント

**Features:**

- カード形式のリスト表示
- Presigned URL で画像表示
- 作成時刻表示
- 自動リフレッシュ
- ローディングスケルトン

## 🔄 デプロイメントプロセス

### ECS Fargate デプロイ

1. **ECR にイメージをプッシュ**

   ```bash
   aws ecr get-login-password --region ap-northeast-2 | \
     docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com

   docker tag sbht-deploy-target:latest <ecr-url>:latest
   docker push <ecr-url>:latest
   ```

2. **ECS サービスの更新**
   - ECS が自動的に新しいイメージを検出してデプロイ
   - Blue/Green デプロイメント対応 (CodeDeploy)

### 環境変数 (SSM Parameter Store)

本番環境では環境変数を SSM Parameter Store に保存:

```bash
aws ssm put-parameter \
  --name "/sbht/prod/db/host" \
  --value "your-rds-endpoint" \
  --type String

aws ssm put-parameter \
  --name "/sbht/prod/db/password" \
  --value "your-password" \
  --type SecureString
```

## 🧪 テスト

### 手動テスト

#### アップロードテスト

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "text=Test content" \
  -F "image=@test-image.jpg"
```

#### リスト取得テスト

```bash
curl http://localhost:3000/api/uploads?limit=10
```

## 🔒 セキュリティのベストプラクティス

### 実装されたセキュリティ機能

1. **ファイル検証**:
   - MIME タイプ確認
   - ファイルサイズ制限
   - ファイル拡張子ホワイトリスト
2. **S3 セキュリティ**:
   - バケット暗号化
   - パブリックアクセス禁止
   - Presigned URL 使用 (時間制限)
3. **データベース**:
   - プライベートサブネット
   - セキュリティグループ制限
   - SSL/TLS 接続
4. **ネットワーク**:
   - VPC 分離
   - セキュリティグループルール
   - NAT ゲートウェイ経由のアウトバウンド

## 📈 パフォーマンス最適化

### 実装された最適化

- **接続プーリング**: PostgreSQL 接続プール
- **キャッシング**: S3 Presigned URL キャッシング
- **コード分割**: Next.js App Router

</details>
