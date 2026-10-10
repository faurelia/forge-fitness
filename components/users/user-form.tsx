"use client";

import { createUser, updateUser } from "@/lib/actions/user";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { User } from "@/lib/db/schema/auth";
import { useForm } from "react-hook-form";
import { UserFormValues, userSchema } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../ui/toast";

type UserFormProps = {
  user: User | null;
  onSuccess?: () => void;
  onCancel: () => void;
};

export default function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  async function onSubmit(data: UserFormValues) {
    const result = user
      ? await updateUser(user.id, data)
      : await createUser(data);

    if (!result.success) {
      setError("root", {
        message: result.message,
      });
      return;
    }

    toast.add({
      type: "success",
      description: user ? "User has been updated." : "User has been created.",
    });

    reset();
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          <FieldError
            errors={errors.name ? [{ message: errors.name.message }] : []}
          />
        </Field>
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          <FieldError
            errors={errors.email ? [{ message: errors.email.message }] : []}
          />
        </Field>

        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : user ? "Update User" : "Create User"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
