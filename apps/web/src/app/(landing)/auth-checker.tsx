"use client";

import { authClient } from "@/lib/auth-client";

export function AuthChecker() {
  const session = authClient.useSession();

  return <div>{JSON.stringify(session, null, 2)}</div>;
}
