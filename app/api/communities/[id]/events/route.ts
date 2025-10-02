import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getEvents, createEvent } from "@/features/events/services/eventService";
import { isUserMemberOfCommunity } from "@/features/memberships/services/membershipService";
import { createEventSchema } from "@/lib/validations/eventValidation";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  const { id: communityId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const isMember = await isUserMemberOfCommunity(session.user.id, communityId);

    if (!isMember) {
      return NextResponse.json(
        { error: "You must be a member to view events" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const isPinned = searchParams.get("isPinned");
    const authorId = searchParams.get("authorId");

    const filters = {
      ...(type && { type: type as any }),
      ...(isPinned !== null && { isPinned: isPinned === "true" }),
      ...(authorId && { authorId }),
    };

    const events = await getEvents(communityId, filters);
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Params) {
  const { id: communityId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const isMember = await isUserMemberOfCommunity(session.user.id, communityId);

    if (!isMember) {
      return NextResponse.json(
        { error: "You must be a member to create events" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createEventSchema.parse(body);

    const event = await createEvent(communityId, session.user.id, {
      type: validatedData.type,
      title: validatedData.title,
      description: validatedData.description,
      eventDate: validatedData.eventDate ? new Date(validatedData.eventDate) : null,
      location: validatedData.location || null,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
