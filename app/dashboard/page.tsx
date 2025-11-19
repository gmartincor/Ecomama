import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const targetRoute = session.user.role === 'SUPERADMIN' 
    ? '/superadmin/dashboard' 
    : '/tablon';

  redirect(targetRoute);
}
