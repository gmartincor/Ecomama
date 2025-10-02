import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { adminService } from "@/features/admin/services/adminService";
import { updateCommunitySchema } from "@/lib/validations/adminValidation";

export async function PUT(
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

    const body = await request.json();
    const validatedData = updateCommunitySchema.parse(body);

    const updatedCommunity = await adminService.updateCommunity(
      communityId,
      validatedData
    );

    return NextResponse.json(updatedCommunity);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid data", details: error },
        { status: 400 }
      );
    }
    console.error("Error updating community:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
