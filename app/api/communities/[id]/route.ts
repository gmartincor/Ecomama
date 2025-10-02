import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { updateCommunitySchema } from "@/lib/validations/community";
import {
  getCommunityById,
  updateCommunity,
  deleteCommunity,
  isUserCommunityAdmin,
} from "@/features/communities/services/communityService";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const community = await getCommunityById(id);

    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    return NextResponse.json(community);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isSuperAdmin = session.user.role === "SUPERADMIN";
  const isAdmin = await isUserCommunityAdmin(session.user.id, id);

  if (!isSuperAdmin && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validatedData = updateCommunitySchema.parse(body);

    const community = await updateCommunity(id, validatedData);

    return NextResponse.json(community);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user || session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await deleteCommunity(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
