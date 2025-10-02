import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import {
  getEventById,
  updateEvent,
  deleteEvent,
  isUserAdminOfEventCommunity,
} from "@/features/events/services/eventService";
import { updateEventSchema } from "@/lib/validations/eventValidation";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  const { id: eventId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const event = await getEventById(eventId);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  const { id: eventId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const isAdmin = await isUserAdminOfEventCommunity(session.user.id, eventId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Only community admins can update events" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateEventSchema.parse(body);

    const event = await updateEvent(eventId, {
      ...(validatedData.type && { type: validatedData.type }),
      ...(validatedData.title && { title: validatedData.title }),
      ...(validatedData.description && { description: validatedData.description }),
      ...(validatedData.eventDate !== undefined && {
        eventDate: validatedData.eventDate ? new Date(validatedData.eventDate) : null,
      }),
      ...(validatedData.location !== undefined && { location: validatedData.location }),
    });

    return NextResponse.json(event);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id: eventId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const isAdmin = await isUserAdminOfEventCommunity(session.user.id, eventId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Only community admins can delete events" },
        { status: 403 }
      );
    }

    await deleteEvent(eventId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
