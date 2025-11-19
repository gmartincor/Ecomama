import { createGetHandler, parseFilters } from "@/lib/api";
import { prisma } from "@/lib/prisma/client";

type MapDataFilters = {
  includeEvents?: boolean;
  includeListings?: boolean;
  eventType?: string;
  listingType?: string;
};

type MapEvent = {
  id: string;
  type: string;
  title: string;
  description: string;
  eventDate: Date | null;
  location: string | null;
  latitude: number;
  longitude: number;
  isPinned: boolean;
  author: { id: string; name: string };
};

type MapListing = {
  id: string;
  type: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  city: string | null;
  country: string | null;
  author: { id: string; name: string };
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

  const eventsPromise = includeEvents ? prisma.$queryRaw<MapEvent[]>`
    SELECT 
      e.id, e.type, e.title, e.description, e."eventDate", e.location,
      e.latitude, e.longitude, e."isPinned",
      json_build_object('id', u.id, 'name', u.name) as author
    FROM "Event" e
    INNER JOIN "User" u ON e."authorId" = u.id
    WHERE e.latitude IS NOT NULL AND e.longitude IS NOT NULL
    ${filters.eventType ? prisma.$queryRaw`AND e.type = ${filters.eventType}::text` : prisma.$queryRaw``}
    ORDER BY e."isPinned" DESC, e."createdAt" DESC
    LIMIT 200
  ` : Promise.resolve<MapEvent[]>([]);

  const listingsPromise = includeListings ? prisma.$queryRaw<MapListing[]>`
    SELECT 
      l.id, l.type, l.title, l.description,
      l.latitude, l.longitude, l.city, l.country,
      json_build_object('id', u.id, 'name', u.name) as author
    FROM "Listing" l
    INNER JOIN "User" u ON l."authorId" = u.id
    WHERE l.latitude IS NOT NULL AND l.longitude IS NOT NULL AND l.status = 'ACTIVE'
    ${filters.listingType ? prisma.$queryRaw`AND l.type = ${filters.listingType}::text` : prisma.$queryRaw``}
    ORDER BY l."createdAt" DESC
    LIMIT 200
  ` : Promise.resolve<MapListing[]>([]);

  const [events, listings] = await Promise.all([eventsPromise, listingsPromise]);

  return {
    events: events.map(e => ({
      ...e,
      itemType: 'event' as const,
    })),
    listings: listings.map(l => ({
      ...l,
      itemType: 'listing' as const,
    })),
  };
});
