import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Email is not valid"),
  jobTitle: z.string().min(1, "Job Title is required"),
});

export type UserFormValues = z.infer<typeof userSchema>;
