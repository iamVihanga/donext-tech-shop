/* eslint-disable @typescript-eslint/no-unused-vars */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin, openAPI } from "better-auth/plugins";

import { db } from "@api/db";
import env from "@api/env";
import * as schema from "@repo/database/schemas";

export const auth = betterAuth({
  // Cross-Domain Features
  trustedOrigins: [
    env.CLIENT_APP_URL,
    "https://gamezonetech.lk",
    "https://www.gamezonetech.lk"
  ],
  baseURL: env.BETTER_AUTH_URL,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema
  }),

  // Email Authentication
  emailAndPassword: {
    enabled: true,

    sendResetPassword: async ({ user, url, token }, request) => {
      // TODO: Implement email sending logic
      console.log({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`
      });
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // TODO: Implement email sending logic
      console.log({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`
      });
    }
  },

  socialProviders: {
    // facebook: {
    // },
  },
  plugins: [adminPlugin(), openAPI()],
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: ".gamezonetech.lk"
    },
    defaultCookieAttributes: {
      sameSite: "lax",
      httpOnly: true,
      secure: true
    }
  }
});

export type Session = typeof auth.$Infer.Session;
