import type { UpdateCommunityData } from "../types";

export const useAdminCommunity = (communityId: string) => {
  const updateCommunity = async (data: UpdateCommunityData) => {
    const response = await fetch(`/api/admin/community/${communityId}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update community");
    }

    return response.json();
  };

  return {
    updateCommunity,
  };
};
