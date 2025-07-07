import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { headers } from "next/headers";
import { toast } from "sonner";

async function prepareHeaders() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  return cookieHeader && { cookie: cookieHeader };
}

export const authClient = createAuthClient({
  // Domain Configurations
  baseURL: "https://gamezonetech.lk",

  plugins: [adminClient()],
  fetchOptions: {
    // Pass Headers
    headers: {
      ...(await prepareHeaders())
    },

    onError: (ctx) => {
      console.log("errorCtx", ctx);
      // Only call toast on client-side
      if (typeof window !== "undefined") {
        toast.error(ctx.error.message || "Authentication error");
      }
    }
  }
});
