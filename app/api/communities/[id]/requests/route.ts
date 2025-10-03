import { membershipRequestSchema } from "@/lib/validations/membership";
import { createMembershipRequest, getPendingRequestsByCommunity } from "@/features/memberships/services/membershipService";
import { isUserCommunityAdmin } from "@/features/communities/services/communityService";
import { createGetHandler, createPostHandler } from "@/lib/api";
import { UserRole } from "@prisma/client";

export const POST = createPostHandler(
  async ({ session, params, body }) => {
    const communityId = params!.id;
    return await createMembershipRequest(session!.user.id, communityId, body.message);
  },
  membershipRequestSchema.pick({ message: true })
);

export const GET = createGetHandler(
  async ({ params }) => {
    const communityId = params!.id;
    return await getPendingRequestsByCommunity(communityId);
  },
  true,
  async ({ session, params }) => {
    if (!session) return false;

    const isSuperAdmin = session.user.role === UserRole.SUPERADMIN;
    if (isSuperAdmin) return true;

    const communityId = params!.id;
    return await isUserCommunityAdmin(session.user.id, communityId);
  }
);
