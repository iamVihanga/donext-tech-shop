import { authClient } from "@/lib/auth-client";
import AdminLayout from "@/modules/layouts/admin-layout";
import { headers } from "next/headers";

export default async function AccountPageLayout({
  dashboard,
  auth
}: {
  dashboard?: React.ReactNode;
  auth?: React.ReactNode;
}) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  const session = await authClient.getSession({
    fetchOptions: {
      headers: {
        ...(cookieHeader && { cookie: cookieHeader })
      }
    }
  });

  return (
    <AdminLayout>
      {session.data && !session.error ? dashboard : auth}
    </AdminLayout>
  );
}
