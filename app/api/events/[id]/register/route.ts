import { createPostHandler, createDeleteHandler } from '@/lib/api';
import { 
  registerForEvent, 
  cancelEventRegistration 
} from '@/features/events/services/eventAttendeeService';

export const POST = createPostHandler(async ({ session, params }) => {
  const eventId = params?.id as string;
  
  if (!eventId) {
    throw new Error('ID del evento requerido');
  }

  return await registerForEvent(session!.user.id, eventId);
});

export const DELETE = createDeleteHandler(async ({ session, params }) => {
  const eventId = params?.id as string;
  
  if (!eventId) {
    throw new Error('ID del evento requerido');
  }

  return await cancelEventRegistration(session!.user.id, eventId);
});
