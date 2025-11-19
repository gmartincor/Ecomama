import { createGetHandler } from '@/lib/api';
import { getUserListings } from '@/features/listings/services/listingService';

export const dynamic = 'force-dynamic';

export const GET = createGetHandler(async ({ session }) => {
  return await getUserListings(session!.user.id);
});
