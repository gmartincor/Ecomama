import { eventRepository, EventWithAuthor, EventFilters } from '@/lib/repositories/event-repository';
import type { CreateEventData, UpdateEventData } from '../types';

export const getEvents = async (
  communityId: string,
  filters?: Omit<EventFilters, 'communityId'>
): Promise<EventWithAuthor[]> => {
  return eventRepository.findByCommunity({ communityId, ...filters });
};

export const getEventById = async (eventId: string): Promise<EventWithAuthor | null> => {
  return eventRepository.findById(eventId, { includeAuthor: true });
};

export const createEvent = async (
  communityId: string,
  authorId: string,
  data: CreateEventData
): Promise<EventWithAuthor> => {
  return eventRepository.createEvent(communityId, authorId, data);
};

export const updateEvent = async (
  eventId: string,
  data: UpdateEventData
): Promise<EventWithAuthor> => {
  return eventRepository.updateEvent(eventId, data);
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  await eventRepository.delete(eventId);
};

export const togglePinEvent = async (
  eventId: string,
  isPinned: boolean
): Promise<EventWithAuthor> => {
  return eventRepository.togglePin(eventId, isPinned);
};

export const isUserAdminOfEventCommunity = async (
  userId: string,
  eventId: string
): Promise<boolean> => {
  return eventRepository.isUserAdminOfCommunity(userId, eventId);
};
