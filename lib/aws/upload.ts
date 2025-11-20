import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from './s3-client';
import crypto from 'crypto';

const BUCKET_NAME = process.env.S3_BUCKET_NAME || process.env.AWS_S3_BUCKET_NAME || '';

/**
 * Upload a file to S3
 * @param file - File buffer
 * @param fileName - Original file name
 * @param contentType - MIME type of the file
 * @returns S3 object key (not the URL)
 */
export async function uploadToS3(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  // Generate unique filename
  const fileExtension = fileName.split('.').pop();
  const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;
  const key = `uploads/${new Date().toISOString().split('T')[0]}/${uniqueFileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Return the S3 key (not the URL - we'll generate presigned URLs when needed)
  return key;
}

/**
 * Generate a presigned URL for an S3 object
 * @param key - S3 object key
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Presigned URL
 */
export async function getPresignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return presignedUrl;
}

/**
 * Validate file type
 */
export function validateImageFile(contentType: string): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(contentType);
}

/**
 * Validate file size (max 5MB)
 */
export function validateFileSize(size: number): boolean {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return size <= maxSize;
}
