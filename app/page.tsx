import { Suspense } from "react";
import UserData from "@/components/users/user-data";
import UserSkeleton from "@/components/users/user-skeleton";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto pt-8">
      <h2 className="text-3xl pb-8">Users</h2>

      <Suspense fallback={<UserSkeleton />}>
        <UserData />
      </Suspense>
    </div>
  );
}
