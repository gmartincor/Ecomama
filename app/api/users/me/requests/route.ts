import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getMembershipRequestsByUser } from "@/features/memberships/services/membershipService";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requests = await getMembershipRequestsByUser(session.user.id);
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
