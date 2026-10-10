import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Email is not valid"),
  password: z.string().trim().min(8, "Password is too short"),
});

export type UserFormValues = z.infer<typeof userSchema>;
