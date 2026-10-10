"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema/auth";
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

  const [createdUser] = await db.insert(user).values(result.data).returning();

  if (!createdUser) {
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

  const [updatedUser] = await db
    .update(user)
    .set(result.data)
    .where(eq(user.id, +id))
    .returning();

  if (!updatedUser) {
    return { success: false, message: "Failed to update user" };
  }

  revalidatePath("/");

  return { success: true, message: "User updated" };
}

export async function getUsers() {
  return await db.select().from(user);
}
