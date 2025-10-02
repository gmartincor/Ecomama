import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { superadminService } from "@/features/superadmin/services/superadminService";
import { updateCommunityStatusSchema } from "@/lib/validations/superadminValidation";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperadmin = await superadminService.isUserSuperadmin(session.user.id);
    if (!isSuperadmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: communityId } = await params;
    const body = await request.json();
    const validatedData = updateCommunityStatusSchema.parse(body);

    const updatedCommunity = await superadminService.updateCommunityStatus(
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperadmin = await superadminService.isUserSuperadmin(session.user.id);
    if (!isSuperadmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: communityId } = await params;
    await superadminService.deleteCommunity(communityId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting community:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
