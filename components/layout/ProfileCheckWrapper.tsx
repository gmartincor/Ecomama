import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { checkProfileCompletion } from "@/lib/utils/profile-checker";

interface ProfileCheckWrapperProps {
  children: React.ReactNode;
}

/**
 * Server Component that checks if user profile is complete
 * Redirects to profile edit page if incomplete
 */
export async function ProfileCheckWrapper({
  children,
}: ProfileCheckWrapperProps) {
  const session = await auth();

  // Only check for non-superadmin users
  if (session && session.user.role !== "SUPERADMIN") {
    const profileStatus = await checkProfileCompletion(session.user.id);

    if (!profileStatus.isComplete) {
      redirect("/profile/me/edit?firstTime=true");
    }
  }

  return <>{children}</>;
}
