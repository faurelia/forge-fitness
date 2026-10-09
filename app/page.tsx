import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import UserData from "@/components/users/user-data";

export default function Home() {
  return (
    <main className="pt-10 w-6xl mx-auto">
      <h2 className="text-3xl pb-8">Users</h2>

      <Suspense fallback={<Skeleton />}>
        <UserData />
      </Suspense>
    </main>
  );
}
