import fs from 'fs';
import path from 'path';

export interface StorageAdapter {
  upload(file: File, fileName: string): Promise<string>;
  delete(fileName: string): Promise<void>;
  getUrl(fileName: string): string;
}

export class LocalStorageAdapter implements StorageAdapter {
  private uploadDir: string;

  constructor(uploadDir = '/tmp/uploads') {
    this.uploadDir = uploadDir;
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  }

  async upload(file: File, fileName: string): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const filePath = path.join(this.uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);
    
    return fileName;
  }

  async delete(fileName: string): Promise<void> {
    const filePath = path.join(this.uploadDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getUrl(fileName: string): string {
    return `/api/uploads/${fileName}`;
  }
}

export class S3StorageAdapter implements StorageAdapter {
  // TODO: Implement S3 adapter for production
  async upload(file: File, fileName: string): Promise<string> {
    throw new Error('S3 adapter not implemented yet');
  }

  async delete(fileName: string): Promise<void> {
    throw new Error('S3 adapter not implemented yet');
  }

  getUrl(fileName: string): string {
    throw new Error('S3 adapter not implemented yet');
  }
}

// Factory function to get the appropriate storage adapter
export function getStorageAdapter(): StorageAdapter {
  if (process.env.NODE_ENV === 'production' && process.env.AWS_S3_BUCKET) {
    return new S3StorageAdapter();
  }
  return new LocalStorageAdapter();
}