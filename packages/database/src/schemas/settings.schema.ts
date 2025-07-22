import { sql } from "drizzle-orm";
import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";

export const settings = pgTable("settings", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  primaryPhone: text("primary_phone"),
  secondaryPhone: text("secondary_phone"),

  email: text("email"),

  businessAddress: text("business_address"),

  socials: jsonb("socials"),

  ...timestamps
});
