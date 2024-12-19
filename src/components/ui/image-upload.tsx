import { ChangeEvent, useCallback } from 'react';
import { useStorage } from '@/hooks/useStorage';
import { Button } from './button';
import { Progress } from './progress';

interface ImageUploadProps {
  onUploadComplete: (imageUrl: string) => void;
  onUploadError?: (error: Error) => void;
}

export function ImageUpload({ onUploadComplete, onUploadError }: ImageUploadProps) {
  const { uploadImage, uploadProgress } = useStorage();

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { url } = await uploadImage(file);
      onUploadComplete(url);
    } catch (error) {
      onUploadError?.(error as Error);
    }
  }, [uploadImage, onUploadComplete, onUploadError]);

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <Button
          type="button"
          variant="outline"
          disabled={uploadProgress.isUploading}
          asChild
        >
          <span>
            {uploadProgress.isUploading ? 'Uploading...' : 'Upload Image'}
          </span>
        </Button>
      </label>

      {uploadProgress.isUploading && (
        <Progress value={uploadProgress.progress} className="w-full" />
      )}
    </div>
  );
}
