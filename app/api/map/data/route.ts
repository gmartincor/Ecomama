import { createGetHandler, parseFilters } from "@/lib/api";
import { prisma } from "@/lib/prisma/client";
import type { EventType, ListingType } from "@prisma/client";

type MapDataFilters = {
  includeEvents?: boolean;
  includeListings?: boolean;
  eventType?: string;
  listingType?: string;
};

export const GET = createGetHandler(async ({ searchParams }) => {
  const filters = parseFilters<MapDataFilters>(searchParams!, {
    includeEvents: { type: 'boolean' },
    includeListings: { type: 'boolean' },
    eventType: { type: 'string' },
    listingType: { type: 'string' },
  });

  const includeEvents = filters.includeEvents !== false;
  const includeListings = filters.includeListings !== false;

  const eventsPromise = includeEvents 
    ? prisma.event.findMany({
        where: {
          latitude: { not: null },
          longitude: { not: null },
          ...(filters.eventType && { type: filters.eventType as EventType }),
        },
        select: {
          id: true,
          type: true,
          title: true,
          description: true,
          eventDate: true,
          location: true,
          latitude: true,
          longitude: true,
          isPinned: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' },
        ],
        take: 200,
      })
    : Promise.resolve([]);

  const listingsPromise = includeListings
    ? prisma.listing.findMany({
        where: {
          latitude: { not: null },
          longitude: { not: null },
          status: 'ACTIVE',
          ...(filters.listingType && { type: filters.listingType as ListingType }),
        },
        select: {
          id: true,
          type: true,
          title: true,
          description: true,
          latitude: true,
          longitude: true,
          city: true,
          country: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 200,
      })
    : Promise.resolve([]);

  const [events, listings] = await Promise.all([eventsPromise, listingsPromise]);

  return {
    events: events.map(e => ({
      ...e,
      latitude: e.latitude!,
      longitude: e.longitude!,
      itemType: 'event' as const,
    })),
    listings: listings.map(l => ({
      ...l,
      latitude: l.latitude!,
      longitude: l.longitude!,
      itemType: 'listing' as const,
    })),
  };
});
