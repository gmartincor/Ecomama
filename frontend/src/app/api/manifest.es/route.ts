import { NextResponse } from 'next/server';
import { generateManifest } from '@/lib/pwa-manifest';

export async function GET() {
  const manifest = generateManifest('es');
  
  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
