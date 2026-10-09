import { pgTable } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", (table) => ({
  id: table.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: table.varchar().notNull(),
  email: table.varchar().notNull().unique(),
  jobTitle: table.varchar().notNull(),
}));

export type User = typeof usersTable.$inferSelect;
