import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { ProfileView } from "@/components/profile-view";
export const dynamic = "force-dynamic";
export const metadata = { title: "আমার প্রোফাইল" };
export default async function ProfilePage() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) redirect("/signin?reason=protected");
  return <ProfileView user={{ name: session.user.name, email: session.user.email }} />;
}
