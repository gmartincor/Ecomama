import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getCommunityStats } from "@/features/dashboard/services/dashboardService";
import { isUserMemberOfCommunity } from "@/features/memberships/services/membershipService";

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
        { error: "You must be a member to view community stats" },
        { status: 403 }
      );
    }

    const stats = await getCommunityStats(communityId);
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
