import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getUserProfile, canViewProfile } from "@/features/profiles/services/profileService";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  const { id: userId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const canView = await canViewProfile(session.user.id, userId);

    if (!canView) {
      return NextResponse.json(
        { error: "You can only view profiles of members in your communities" },
        { status: 403 }
      );
    }

    const profile = await getUserProfile(userId);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
