import { NextRequest, NextResponse } from 'next/server';
import { createUpload } from '@/lib/db/queries';
import { uploadToS3, validateImageFile, validateFileSize } from '@/lib/aws/upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const textContent = formData.get('text') as string;
    const imageFile = formData.get('image') as File | null;

    // Validate text content
    if (!textContent || textContent.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;

    // Handle image upload if provided
    if (imageFile) {
      // Validate file type
      if (!validateImageFile(imageFile.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' },
          { status: 400 }
        );
      }

      // Validate file size
      if (!validateFileSize(imageFile.size)) {
        return NextResponse.json(
          { error: 'File size exceeds 5MB limit' },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to S3 and get the S3 key
      imageUrl = await uploadToS3(buffer, imageFile.name, imageFile.type);
    }

    // Save to PostgreSQL (imageUrl is now the S3 key, not the full URL)
    const upload = await createUpload(textContent, imageUrl);

    return NextResponse.json(
      {
        message: 'Upload successful',
        data: upload,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Upload endpoint - use POST method' },
    { status: 200 }
  );
}
