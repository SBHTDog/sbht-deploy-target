# Upload Manager - AWS RDS & S3 Integration

A Next.js application that demonstrates uploading text content to AWS RDS (PostgreSQL) and images to AWS S3. This application is designed to run in a private subnet with access to RDS and S3 via NAT Gateway.

## Architecture

- **Frontend**: Next.js 16 with React 19, TypeScript, and Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL on AWS RDS (private subnet)
- **Storage**: AWS S3 (accessed via NAT Gateway)
- **Network**: Private subnet deployment

## Project Structure

```
shbt-deploy-target/
├── app/
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.ts          # Upload endpoint (POST)
│   │   └── uploads/
│   │       └── route.ts          # Get uploads endpoint (GET)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main homepage
├── components/
│   ├── UploadForm.tsx            # Upload form component
│   └── UploadsList.tsx           # List of uploads component
├── lib/
│   ├── aws/
│   │   ├── s3-client.ts          # S3 client configuration
│   │   └── upload.ts             # S3 upload utilities
│   └── db/
│       ├── index.ts              # PostgreSQL connection pool
│       ├── queries.ts            # Database queries
│       └── schema.sql            # Database schema
├── .env.example                  # Environment variables template
└── package.json
```

## Features

- ✅ Upload text content to PostgreSQL (AWS RDS)
- ✅ Upload images to AWS S3
- ✅ Image preview before upload
- ✅ File type validation (JPEG, PNG, GIF, WebP)
- ✅ File size validation (max 5MB)
- ✅ View recent uploads with images
- ✅ Responsive design with dark mode support
- ✅ Real-time upload status feedback

## Prerequisites

1. **AWS RDS PostgreSQL instance** in a private subnet
2. **AWS S3 bucket** for storing images (private bucket)
3. **NAT Gateway** configured for private subnet outbound access
4. **ECS Task Role** with S3 and RDS permissions (recommended) OR AWS access keys for local development

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your AWS and database credentials:

```env
# Database Configuration
DB_HOST=your-rds-instance.region.rds.amazonaws.com
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET_NAME=your-s3-bucket-name
```

### 2. Database Setup

Connect to your PostgreSQL database and run the schema:

```bash
psql -h your-rds-instance.region.rds.amazonaws.com -U your_user -d your_database -f lib/db/schema.sql
```

Or manually execute the SQL in `lib/db/schema.sql`.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## AWS IAM Permissions

### For ECS Deployment (Recommended)

Attach this policy to your **ECS Task Role**:

### S3 Permissions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### RDS Permissions
Ensure your EC2 instance (or container) security group allows outbound traffic to the RDS security group on port 5432.

## Deployment

This application is configured for standalone deployment with Docker:

```bash
npm run build
npm start
```

The `next.config.ts` includes `output: "standalone"` for optimized container deployments.

## Database Schema

The `uploads` table:

```sql
- id: Serial primary key
- text_content: Text (required)
- image_url: S3 object key (optional) - e.g., "uploads/2025-11-20/uuid.jpg"
- created_at: Timestamp
- updated_at: Timestamp (auto-updated)
```

**Note**: `image_url` stores the S3 key, not the full URL. Presigned URLs are generated on-demand when fetching uploads.

## S3 Bucket Configuration

This application uses **presigned URLs** for secure, time-limited access to S3 objects:

- ✅ S3 bucket should be **PRIVATE** (block all public access)
- ✅ Presigned URLs expire after 1 hour (configurable)
- ✅ New URLs are generated each time uploads are fetched
- ✅ Better security - no public access to S3 objects

See `S3_BUCKET_POLICY.md` for detailed configuration instructions.

## API Endpoints

### POST /api/upload
Upload text and optional image.

**Request**: `multipart/form-data`
- `text` (required): Text content
- `image` (optional): Image file

**Response**: 
```json
{
  "message": "Upload successful",
  "data": {
    "id": 1,
    "text_content": "Your text",
    "image_url": "https://bucket.s3.region.amazonaws.com/...",
    "created_at": "2025-11-20T...",
    "updated_at": "2025-11-20T..."
  }
}
```

### GET /api/uploads
Get recent uploads (last 50).

**Response**:
```json
{
  "data": [...]
}
```

## Security Considerations

- Application runs in private subnet
- RDS accessed directly via private subnet (no public access)
- S3 accessed via NAT Gateway
- **S3 bucket is PRIVATE** - presigned URLs provide time-limited access
- Presigned URLs expire after 1 hour (configurable)
- Environment variables for sensitive credentials
- File type and size validation
- Connection pooling for database efficiency

## Technologies Used

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **AWS SDK v3** - S3 operations
- **node-postgres (pg)** - PostgreSQL client
- **Docker** - Containerization support

## License

MIT
