"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { MemberManagementTable } from "@/features/admin/components";
import { useAdminMembers } from "@/features/admin/hooks";

export default function AdminMembersPage() {
  const params = useParams();
  const { data: session } = useSession();
  const communityId = params?.id as string;
  const { members, isLoading, error, removeMember } = useAdminMembers(communityId);

  if (isLoading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando miembros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestión de Miembros</h1>
        <p className="text-muted-foreground mt-2">
          Administra los miembros de tu comunidad
        </p>
      </div>
      <MemberManagementTable 
        members={members}
        currentUserId={session.user.id}
        onRemoveMember={removeMember}
      />
    </div>
  );
}
