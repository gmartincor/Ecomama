import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/utils/auth-helpers';
import { uploadAvatar } from '@/lib/services/fileUpload';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó archivo' },
        { status: 400 }
      );
    }

    const result = await uploadAvatar(file);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al subir archivo' },
      { status: 500 }
    );
  }
}
