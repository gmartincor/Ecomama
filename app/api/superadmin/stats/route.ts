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

    const stats = await superadminService.getGlobalStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching global stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
