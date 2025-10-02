import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getListings, createListing } from "@/features/listings/services/listingService";
import { isUserMemberOfCommunity } from "@/features/memberships/services/membershipService";
import { createListingSchema } from "@/lib/validations/listingValidation";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const communityId = searchParams.get("communityId");

    if (!communityId) {
      return NextResponse.json({ error: "Community ID is required" }, { status: 400 });
    }

    const isMember = await isUserMemberOfCommunity(session.user.id, communityId);

    if (!isMember) {
      return NextResponse.json(
        { error: "You must be a member to view listings" },
        { status: 403 }
      );
    }

    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const authorId = searchParams.get("authorId");
    const search = searchParams.get("search");

    const filters = {
      ...(type && { type: type as any }),
      ...(status && { status: status as any }),
      ...(authorId && { authorId }),
      ...(search && { search }),
    };

    const listings = await getListings(communityId, filters);
    return NextResponse.json(listings);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { communityId, ...listingData } = body;

    if (!communityId) {
      return NextResponse.json({ error: "Community ID is required" }, { status: 400 });
    }

    const isMember = await isUserMemberOfCommunity(session.user.id, communityId);

    if (!isMember) {
      return NextResponse.json(
        { error: "You must be a member to create listings" },
        { status: 403 }
      );
    }

    const validatedData = createListingSchema.parse(listingData);

    const listing = await createListing(communityId, session.user.id, validatedData);

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
