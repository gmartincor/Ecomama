import { eventRepository, EventWithAuthor, EventFilters } from '@/lib/repositories/event-repository';
import type { CreateEventData, UpdateEventData } from '../types';

export const getEvents = async (
  filters?: EventFilters
): Promise<EventWithAuthor[]> => {
  return eventRepository.findAll(filters);
};

export const getEventById = async (eventId: string): Promise<EventWithAuthor | null> => {
  return eventRepository.findById(eventId, { includeAuthor: true });
};

export const createEvent = async (
  authorId: string,
  data: CreateEventData
): Promise<EventWithAuthor> => {
  return eventRepository.createEvent(authorId, data);
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

export const isUserEventAuthor = async (
  userId: string,
  eventId: string
): Promise<boolean> => {
  return eventRepository.isAuthor(userId, eventId);
};
