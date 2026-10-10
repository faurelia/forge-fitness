"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { findBreadcrumbs, navItems } from "@/lib/data/nav";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export function AppBreadcrumbs() {
  const pathname = usePathname();

  const items = findBreadcrumbs(navItems, pathname);
  if (!items) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={item.url}>
              {isLast ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href={item.url} />}>
                    {item.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}

              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
