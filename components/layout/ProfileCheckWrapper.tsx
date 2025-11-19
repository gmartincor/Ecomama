import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { checkProfileCompletion } from "@/lib/utils/profile-checker";

interface ProfileCheckWrapperProps {
  children: React.ReactNode;
  skipCheck?: boolean;
}

const PROFILE_EDIT_PATH = "/profile/me/edit";

export async function ProfileCheckWrapper({
  children,
  skipCheck = false,
}: ProfileCheckWrapperProps) {
  if (skipCheck) {
    return <>{children}</>;
  }

  const session = await auth();

  if (session && session.user.role !== "SUPERADMIN") {
    const profileStatus = await checkProfileCompletion(session.user.id);

    if (!profileStatus.isComplete) {
      redirect(`${PROFILE_EDIT_PATH}?firstTime=true`);
    }
  }

  return <>{children}</>;
}
