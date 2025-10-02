import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import {
  getListingById,
  updateListing,
  deleteListing,
  isUserListingAuthor,
} from "@/features/listings/services/listingService";
import { updateListingSchema } from "@/lib/validations/listingValidation";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  const { id: listingId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const listing = await getListingById(listingId);

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json(listing);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  const { id: listingId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const isAuthor = await isUserListingAuthor(session.user.id, listingId);

    if (!isAuthor) {
      return NextResponse.json(
        { error: "Only the author can update this listing" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateListingSchema.parse(body);

    const listing = await updateListing(listingId, validatedData);

    return NextResponse.json(listing);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id: listingId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const isAuthor = await isUserListingAuthor(session.user.id, listingId);

    if (!isAuthor) {
      return NextResponse.json(
        { error: "Only the author can delete this listing" },
        { status: 403 }
      );
    }

    await deleteListing(listingId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
