"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/global/navBar";

export default function NavWrapper() {
  const pathname = usePathname();
  
  const hiddenRoutes = ["/signup", "/login", "/onboarding"];

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return <Nav />;
}