import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { getStorageAdapter } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
        },
        { status: 400 }
      );
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: 'File size exceeds 10MB limit',
        },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Allowed types: JPEG, PNG, WebP, PDF, DOC, DOCX',
        },
        { status: 400 }
      );
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substr(2, 9)}.${extension}`;
    
    const storage = getStorageAdapter();
    
    try {
      const uploadedFileName = await storage.upload(file, fileName);
      const fileUrl = storage.getUrl(uploadedFileName);
      
      return NextResponse.json({
        success: true,
        data: {
          fileName: uploadedFileName,
          url: fileUrl,
          originalName: file.name,
          size: file.size,
          type: file.type,
        },
      });
    } catch (uploadError) {
      console.error('File upload error:', uploadError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to upload file',
          message: uploadError instanceof Error ? uploadError.message : 'Unknown upload error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process upload',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    
    if (!fileName) {
      return NextResponse.json(
        {
          success: false,
          error: 'File name is required',
        },
        { status: 400 }
      );
    }
    
    const storage = getStorageAdapter();
    
    try {
      await storage.delete(fileName);
      
      return NextResponse.json({
        success: true,
        message: 'File deleted successfully',
      });
    } catch (deleteError) {
      console.error('File delete error:', deleteError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete file',
          message: deleteError instanceof Error ? deleteError.message : 'Unknown delete error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process delete',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}