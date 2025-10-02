import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { membershipRequestSchema } from "@/lib/validations/membership";
import {
  createMembershipRequest,
  getPendingRequestsByCommunity,
} from "@/features/memberships/services/membershipService";
import { isUserCommunityAdmin } from "@/features/communities/services/communityService";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, { params }: Params) {
  const { id: communityId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = membershipRequestSchema.parse({
      communityId,
      message: body.message,
    });

    const membershipRequest = await createMembershipRequest(
      session.user.id,
      communityId,
      validatedData.message
    );

    return NextResponse.json(membershipRequest, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("already have")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (error.name === "ZodError") {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
      }
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: Params) {
  const { id: communityId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isSuperAdmin = session.user.role === "SUPERADMIN";
  const isAdmin = await isUserCommunityAdmin(session.user.id, communityId);

  if (!isSuperAdmin && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const requests = await getPendingRequestsByCommunity(communityId);
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
