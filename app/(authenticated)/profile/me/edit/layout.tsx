import { AuthenticatedLayout } from "@/components/layout";
import { ProfileCheckWrapper } from "@/components/layout/ProfileCheckWrapper";

export default function ProfileEditLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileCheckWrapper skipCheck>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </ProfileCheckWrapper>
  );
}
