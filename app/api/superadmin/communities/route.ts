import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { superadminService } from "@/features/superadmin/services/superadminService";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperadmin = await superadminService.isUserSuperadmin(session.user.id);
    if (!isSuperadmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const communities = await superadminService.getAllCommunities();
    return NextResponse.json(communities);
  } catch (error) {
    console.error("Error fetching communities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
