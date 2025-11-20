import { NextResponse } from 'next/server';
import { getUploads } from '@/lib/db/queries';
import { getPresignedUrl } from '@/lib/aws/upload';

export async function GET() {
  try {
    const uploads = await getUploads(50);
    
    // Generate presigned URLs for images
    const uploadsWithPresignedUrls = await Promise.all(
      uploads.map(async (upload) => {
        if (upload.image_url) {
          // Generate presigned URL (expires in 1 hour)
          const presignedUrl = await getPresignedUrl(upload.image_url);
          return {
            ...upload,
            image_url: presignedUrl,
          };
        }
        return upload;
      })
    );
    
    return NextResponse.json({
      data: uploadsWithPresignedUrls,
    });
  } catch (error) {
    console.error('Error fetching uploads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch uploads' },
      { status: 500 }
    );
  }
}
