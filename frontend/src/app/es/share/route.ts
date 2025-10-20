import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string | null;
    const text = formData.get('text') as string | null;
    const url = formData.get('url') as string | null;

    if (url?.includes('/products/')) {
      return NextResponse.redirect(new URL(url, request.url));
    }

    const homeUrl = new URL('/es', request.url);
    if (title) homeUrl.searchParams.set('shared_title', title);
    if (text) homeUrl.searchParams.set('shared_text', text);
    if (url) homeUrl.searchParams.set('shared_url', url);

    return NextResponse.redirect(homeUrl);
  } catch {
    return NextResponse.redirect(new URL('/es', request.url));
  }
}

export async function GET() {
  return NextResponse.redirect(new URL('/es', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
