import { Loader } from "@/components/general/loader";
import { auth } from "@/lib/auth";
import { Dumbbell } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loader />}>
      <GuestOnly>{children}</GuestOnly>
    </Suspense>
  );
}

export async function GuestOnly({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) redirect("/admin/dashboard");
  return (
    <main>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Dumbbell className="size-4" />
            </div>
            Forge Fitness
          </Link>

          {children}
        </div>
      </div>
    </main>
  );
}
