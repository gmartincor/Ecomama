import { getMembershipRequestsByUser } from "@/features/memberships/services/membershipService";
import { createGetHandler } from "@/lib/api";

export const GET = createGetHandler(async ({ session }) => {
  return await getMembershipRequestsByUser(session!.user.id);
});
