import { getUsers } from "@/lib/actions/user";

import UserTable from "@/components/users/user-table";
import { sleep } from "@/lib/utils";

export default async function UserData() {
  await sleep(1000);

  const users = await getUsers();

  return <UserTable users={users} />;
}
