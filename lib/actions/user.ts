"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { revalidatePath } from "next/cache";

export async function createUser(
  prevState: { success: boolean; message: string },
  formData: FormData,
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const jobTitle = formData.get("jobTitle") as string;

  const [user] = await db
    .insert(usersTable)
    .values({ name, email, jobTitle })
    .returning();

  if (!user) {
    return { success: false, message: "Failed to create user" };
  }

  revalidatePath("/");

  return { success: true, message: "User added" };
}

export async function updateUser(
  prevState: { success: boolean; message: string },
  formData: FormData,
) {
  const id = formData.get("id");
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const jobTitle = formData.get("jobTitle") as string;

  const [user] = await db
    .update(usersTable)
    .set({ name, email, jobTitle })
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
