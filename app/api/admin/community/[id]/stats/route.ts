import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { adminService } from "@/features/admin/services/adminService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: communityId } = await params;

    const isAdmin = await adminService.isUserCommunityAdmin(
      session.user.id,
      communityId
    );

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const stats = await adminService.getCommunityStats(communityId);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching community stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
