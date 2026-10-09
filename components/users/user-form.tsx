"use client";

import { createUser } from "@/lib/actions/user";
import { Button } from "../ui/button";
import { Field, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useActionState } from "react";
import { Spinner } from "../ui/spinner";
import { User } from "@/lib/db/schema";

type FormState = {
  success: boolean;
  message: string;
};

type UserFormProps = {
  user: User | null;
  onSubmit: (prevState: FormState, formData: FormData) => Promise<FormState>;
};

export default function UserForm({ user, onSubmit }: UserFormProps) {
  const [state, formAction, isPending] = useActionState(onSubmit, {
    success: false,
    message: "",
  });
  return (
    <form action={formAction}>
      {user && <input type="hidden" name="id" value={user.id} />}
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={user?.name} />
          </Field>
          <Field>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user?.email}
            />
          </Field>
        </div>
        <Field>
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input id="jobTitle" name="jobTitle" defaultValue={user?.jobTitle} />
        </Field>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            Submit
            {isPending && <Spinner data-icon="inline-end" />}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
