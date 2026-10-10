import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
