import { NextResponse } from 'next/server';

/**
 * Health check endpoint for monitoring
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ecomama-frontend',
  });
}
