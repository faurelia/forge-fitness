"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { revalidatePath } from "next/cache";
import { userSchema } from "../validations/user";

export async function createUser(input: unknown) {
  const result = userSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: "Invalid user data",
    };
  }

  const [user] = await db.insert(usersTable).values(result.data).returning();

  if (!user) {
    return { success: false, message: "Failed to create user" };
  }

  revalidatePath("/");

  return { success: true, message: "User added" };
}

export async function updateUser(id: number, input: unknown) {
  const result = userSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: "Invalid user data",
    };
  }

  const [user] = await db
    .update(usersTable)
    .set(result.data)
    .where(eq(usersTable.id, +id))
    .returning();

  if (!user) {
    return { success: false, message: "Failed to update user" };
  }

  revalidatePath("/");

  return { success: true, message: "User updated" };
}

export async function getUsers() {
  return await db.select().from(usersTable);
}
