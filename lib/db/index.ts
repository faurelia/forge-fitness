import { drizzle } from "drizzle-orm/neon-http";
import { authRelations } from "./schema/auth";
import { relations } from "./schema/relations";

export const db = drizzle(process.env.DATABASE_URL!, {
  relations: { ...relations, ...authRelations },
});
