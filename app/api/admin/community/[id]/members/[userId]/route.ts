import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { adminService } from "@/features/admin/services/adminService";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: communityId, userId } = await params;

    const isAdmin = await adminService.isUserCommunityAdmin(
      session.user.id,
      communityId
    );

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (session.user.id === userId) {
      return NextResponse.json(
        { error: "Cannot remove yourself" },
        { status: 400 }
      );
    }

    await adminService.removeMember(communityId, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
