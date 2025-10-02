import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id },
      include: {
        defaultCommunity: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
          },
        },
      },
    });

    if (!settings) {
      return NextResponse.json({
        userId: session.user.id,
        defaultCommunityId: null,
        emailNotifications: true,
        defaultCommunity: null,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { defaultCommunityId, emailNotifications } = body;

    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        ...(defaultCommunityId !== undefined && { defaultCommunityId }),
        ...(emailNotifications !== undefined && { emailNotifications }),
      },
      create: {
        userId: session.user.id,
        defaultCommunityId: defaultCommunityId || null,
        emailNotifications: emailNotifications ?? true,
      },
      include: {
        defaultCommunity: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
          },
        },
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
