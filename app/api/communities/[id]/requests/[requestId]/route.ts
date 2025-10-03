import { respondToRequestSchema } from "@/lib/validations/membership";
import { approveMembershipRequest, rejectMembershipRequest } from "@/features/memberships/services/membershipService";
import { isUserCommunityAdmin } from "@/features/communities/services/communityService";
import { createPutHandler } from "@/lib/api";
import { UserRole } from "@prisma/client";

export const PUT = createPutHandler(
  async ({ params, body }) => {
    const { requestId } = params!;
    
    return body.status === "APPROVED"
      ? await approveMembershipRequest(requestId, body.responseMessage)
      : await rejectMembershipRequest(requestId, body.responseMessage);
  },
  respondToRequestSchema,
  async ({ session, params }) => {
    if (!session) return false;

    const isSuperAdmin = session.user.role === UserRole.SUPERADMIN;
    if (isSuperAdmin) return true;

    const communityId = params!.id;
    return await isUserCommunityAdmin(session.user.id, communityId);
  }
);
