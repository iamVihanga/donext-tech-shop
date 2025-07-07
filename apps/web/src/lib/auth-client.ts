import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

export const authClient = createAuthClient({
  // Domain Configurations
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "https://gamezonetech.lk",

  plugins: [adminClient()],
  fetchOptions: {
    onError: (ctx) => {
      console.log("errorCtx", ctx);
      toast.error(ctx.error.message);
    }
  }
});
