import { createGetHandler } from '@/lib/api';
import { getUserEvents } from '@/features/events/services/eventAttendeeService';

export const GET = createGetHandler(async ({ session }) => {
  return await getUserEvents(session!.user.id);
});
