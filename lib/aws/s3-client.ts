import { S3Client } from '@aws-sdk/client-s3';

// Initialize S3 client for ECS Task
// The AWS SDK automatically uses the ECS Task Role credentials via the credential provider chain
// No explicit credentials needed - the SDK will:
// 1. Check for ECS container credentials (ECS_CONTAINER_METADATA_URI)
// 2. Fall back to EC2 instance profile if needed
// 3. Network traffic to S3 goes through NAT Gateway (private subnet)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-northeast-2',
});

export default s3Client;
