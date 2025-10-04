'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

type AvatarUploadProps = {
  currentAvatar?: string | null;
  onAvatarChange: (avatarUrl: string | null) => void;
  disabled?: boolean;
};

export const AvatarUpload = ({ currentAvatar, onAvatarChange, disabled }: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al subir la imagen');
      }

      const { url } = await response.json();
      setPreviewUrl(url);
      onAvatarChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
      setPreviewUrl(currentAvatar || null);
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label>Foto de Perfil</Label>
      
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
        <div className="relative shrink-0">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Avatar"
                width={144}
                height={144}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-14 h-14 sm:w-16 sm:h-16 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full sm:w-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="hidden"
          />
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClick}
              disabled={disabled || isUploading}
              className="text-sm"
            >
              {isUploading ? 'Subiendo...' : previewUrl ? 'Cambiar Foto' : 'Subir Foto'}
            </Button>

            {previewUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={disabled || isUploading}
                className="text-sm"
              >
                Eliminar Foto
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center sm:text-left">
            JPG, PNG, GIF o WEBP. Máx 5MB.
          </p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};
