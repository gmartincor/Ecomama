import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'avatars');
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export type FileUploadResult = {
  url: string;
  filename: string;
};

export const uploadAvatar = async (file: File): Promise<FileUploadResult> => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('El archivo no debe superar 5MB');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Formato de imagen no permitido');
  }

  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const timestamp = Date.now();
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `avatar-${timestamp}.${ext}`;
  const filepath = join(UPLOAD_DIR, filename);

  await writeFile(filepath, buffer);

  return {
    url: `/uploads/avatars/${filename}`,
    filename,
  };
};

export const isValidImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(parsedUrl.pathname);
  } catch {
    return false;
  }
};
