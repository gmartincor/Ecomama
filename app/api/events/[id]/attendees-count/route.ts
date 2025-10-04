import { createGetHandler } from '@/lib/api';
import { getEventAttendeesCount } from '@/features/events/services/eventAttendeeService';

export const GET = createGetHandler(async ({ params }) => {
  const eventId = params?.id as string;
  
  if (!eventId) {
    throw new Error('ID del evento requerido');
  }

  const count = await getEventAttendeesCount(eventId);
  
  return { count };
}, false);
