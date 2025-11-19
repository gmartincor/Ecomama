import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { checkProfileCompletion } from '@/lib/utils/profile-checker';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role === 'SUPERADMIN') {
      return NextResponse.json({
        isComplete: true,
        missingFields: [],
      });
    }

    const status = await checkProfileCompletion(session.user.id);

    return NextResponse.json(status);
  } catch (error) {
    console.error('[API] Profile status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
