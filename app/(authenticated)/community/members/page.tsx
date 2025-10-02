'use client';

import { useCommunityMembers } from '@/features/profiles/hooks/useProfile';
import { useCommunityStore } from '@/lib/stores/useCommunityStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MemberGrid } from '@/features/profiles/components/MemberGrid';
import { TabNavigation } from '@/features/dashboard/components';
import { PageError } from '@/components/common/PageError';
import { useRouter } from 'next/navigation';
import type { TabConfig } from '@/features/dashboard/types';

const DASHBOARD_TABS: TabConfig[] = [
  { id: "feed", label: "Feed", href: "/community", icon: "📰" },
  { id: "members", label: "Miembros", href: "/community/members", icon: "👥" },
  { id: "offers", label: "Ofertas", href: "/community/offers", icon: "🌾" },
  { id: "demands", label: "Demandas", href: "/community/demands", icon: "🛒" },
];

export default function CommunityMembersPage() {
  const router = useRouter();
  const { activeCommunity } = useCommunityStore();
  const communityId = activeCommunity?.id || '';
  const { members, isLoading, error, refetch } = useCommunityMembers(communityId);

  if (!activeCommunity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <p className="text-gray-600 mb-4">
            No tienes una comunidad activa seleccionada
          </p>
          <Button onClick={() => router.push('/communities/map')}>
            Explorar Comunidades
          </Button>
        </Card>
      </div>
    );
  }

  if (error) {
    return <PageError message={error} onRetry={refetch} onBack={() => router.back()} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Miembros de {activeCommunity.name}</h1>
        <p className="text-gray-600 mt-2">
          {members.length} {members.length === 1 ? 'miembro' : 'miembros'}
        </p>
      </div>

      <TabNavigation tabs={DASHBOARD_TABS} />

      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <MemberGrid 
            members={members} 
            onMemberClick={(id) => router.push(`/profile/${id}`)}
          />
        )}
      </div>
    </div>
  );
}
