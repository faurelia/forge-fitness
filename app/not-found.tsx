"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-64 flex items-center justify-center text-center">
      <div className="leading-loose">
        <span className="text-6xl py-8 block">⚠️</span>
        <h2 className="text-2xl font-medium">Page Not Found </h2>
        <p className="text-muted-foreground py-2">
          We couldn&apos;t find the page you are looking for
        </p>
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Back to home page
        </Link>
      </div>
    </div>
  );
}
