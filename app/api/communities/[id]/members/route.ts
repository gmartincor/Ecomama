import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getCommunityMembers } from "@/features/profiles/services/profileService";
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
        { error: "You must be a member to view community members" },
        { status: 403 }
      );
    }

    const members = await getCommunityMembers(communityId);
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
