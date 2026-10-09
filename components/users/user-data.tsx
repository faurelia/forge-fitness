import { Plus } from "lucide-react";
import { createUser, getUsers } from "@/lib/actions/user";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import UserForm from "@/components/users/user-form";
import UserTable from "@/components/users/user-table";

export default async function UserData() {
  const users = await getUsers();

  return (
    <>
      <div className="flex justify-end pb-4">
        <Dialog>
          <DialogTrigger
            render={
              <Button variant="default">
                Add User <Plus />
              </Button>
            }
          ></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>
                Create a new user profile and assign their role details.
              </DialogDescription>
            </DialogHeader>
            <UserForm user={null} onSubmit={createUser} />
          </DialogContent>
        </Dialog>
      </div>

      <UserTable users={users} />
    </>
  );
}
