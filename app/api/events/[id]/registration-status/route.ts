import { createGetHandler } from '@/lib/api';
import { isUserRegistered } from '@/features/events/services/eventAttendeeService';

export const GET = createGetHandler(async ({ session, params }) => {
  const eventId = params?.id as string;
  
  if (!eventId) {
    throw new Error('ID del evento requerido');
  }

  const isRegistered = await isUserRegistered(session!.user.id, eventId);
  
  return { isRegistered };
});
