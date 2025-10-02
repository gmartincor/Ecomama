import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { togglePinEvent, isUserAdminOfEventCommunity } from "@/features/events/services/eventService";
import { pinEventSchema } from "@/lib/validations/eventValidation";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

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
        { error: "Only community admins can pin/unpin events" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = pinEventSchema.parse(body);

    const event = await togglePinEvent(eventId, validatedData.isPinned);
    return NextResponse.json(event);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
