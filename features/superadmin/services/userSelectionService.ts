import { prisma } from "@/lib/prisma/client";

export type SelectableUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export const getSelectableUsers = async (): Promise<SelectableUser[]> => {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["USER", "ADMIN"],
      },
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return users;
};
