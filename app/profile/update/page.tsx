import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { UpdateProfileForm } from "@/components/update-profile-form";
export const dynamic = "force-dynamic";
export const metadata = { title: "তথ্য আপডেট" };
export default async function UpdateProfilePage() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) redirect("/signin?reason=protected");
  return <UpdateProfileForm initialName={session.user.name} />;
}
