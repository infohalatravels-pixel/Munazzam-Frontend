"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateSession } from "@/lib/auth/api";
import { isAuthenticated } from "@/lib/auth/session";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    async function redirect() {
      if (!isAuthenticated()) {
        router.replace("/login");
        return;
      }

      const user = await validateSession();
      router.replace(user ? "/dashboard" : "/login");
    }

    redirect();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-surface">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
