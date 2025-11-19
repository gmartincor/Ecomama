import { AuthenticatedLayout } from "@/components/layout";
import { ProfileCheckWrapper } from "@/components/layout/ProfileCheckWrapper";

export const dynamic = 'force-dynamic';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileCheckWrapper>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </ProfileCheckWrapper>
  );
}
