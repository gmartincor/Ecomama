import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { respondToRequestSchema } from "@/lib/validations/membership";
import {
  approveMembershipRequest,
  rejectMembershipRequest,
} from "@/features/memberships/services/membershipService";
import { isUserCommunityAdmin } from "@/features/communities/services/communityService";

type Params = {
  params: Promise<{
    id: string;
    requestId: string;
  }>;
};

export async function PUT(request: Request, { params }: Params) {
  const { id: communityId, requestId } = await params;
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
    const body = await request.json();
    const validatedData = respondToRequestSchema.parse(body);

    const updatedRequest =
      validatedData.status === "APPROVED"
        ? await approveMembershipRequest(requestId, validatedData.responseMessage)
        : await rejectMembershipRequest(requestId, validatedData.responseMessage);

    return NextResponse.json(updatedRequest);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
