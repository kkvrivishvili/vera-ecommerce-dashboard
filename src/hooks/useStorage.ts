import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { compressImage } from '@/lib/utils/image-processing';

interface UploadProgress {
  progress: number;
  isUploading: boolean;
}

export function useStorage() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    isUploading: false,
  });

  const uploadImage = async (file: File, bucket: string = 'products') => {
    try {
      setUploadProgress({ progress: 0, isUploading: true });

      // Comprimir y convertir a WebP
      const compressedFile = await compressImage(file);

      // Generar nombre único para el archivo
      const fileExt = '.webp';
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = `${bucket}/${fileName}`;

      // Subir a Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/webp',
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setUploadProgress({ progress: 100, isUploading: false });

      return {
        url: publicUrl,
        path: filePath,
      };
    } catch (error) {
      setUploadProgress({ progress: 0, isUploading: false });
      throw error;
    }
  };

  const deleteImage = async (path: string, bucket: string = 'products') => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploadProgress,
  };
}
