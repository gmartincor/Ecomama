import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { createCommunitySchema } from "@/lib/validations/community";
import { createCommunity, getAllCommunities } from "@/features/communities/services/communityService";
import type { CommunityFilters } from "@/features/communities/types";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validatedData = createCommunitySchema.parse(body);

    const community = await createCommunity(validatedData, session.user.id);

    return NextResponse.json(community, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: CommunityFilters = {
      latitude: searchParams.get("latitude") ? Number(searchParams.get("latitude")) : undefined,
      longitude: searchParams.get("longitude") ? Number(searchParams.get("longitude")) : undefined,
      radiusKm: searchParams.get("radiusKm") ? Number(searchParams.get("radiusKm")) : undefined,
      status: searchParams.get("status") as "ACTIVE" | "INACTIVE" | undefined,
      search: searchParams.get("search") || undefined,
    };

    const communities = await getAllCommunities(filters);

    return NextResponse.json(communities);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
