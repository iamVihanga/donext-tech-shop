import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

import { getHeaders } from "./headers";

export const authClient = createAuthClient({
  // Domain Configurations
  baseURL: "https://gamezonetech.lk",

  plugins: [adminClient()],
  fetchOptions: {
    // Pass Headers
    headers: {
      ...(await getHeaders())
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
