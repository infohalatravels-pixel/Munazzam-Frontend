"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { validateSession } from "@/lib/auth/api";
import { isAuthenticated } from "@/lib/auth/session";

type AuthRedirectProps = {
  redirectIfAuthenticated?: string;
  redirectIfGuest?: string;
  validateSessionOnLoad?: boolean;
  children?: React.ReactNode;
};

export function AuthRedirect({
  redirectIfAuthenticated,
  redirectIfGuest,
  validateSessionOnLoad = false,
  children,
}: AuthRedirectProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      const hasToken = isAuthenticated();

      if (redirectIfAuthenticated && hasToken) {
        if (validateSessionOnLoad) {
          const user = await validateSession();
          if (!active) return;

          if (user) {
            router.replace(redirectIfAuthenticated);
            return;
          }
        } else {
          router.replace(redirectIfAuthenticated);
          return;
        }
      }

      if (redirectIfGuest) {
        if (!hasToken) {
          router.replace(redirectIfGuest);
          return;
        }

        if (validateSessionOnLoad) {
          const user = await validateSession();
          if (!active) return;

          if (!user) {
            router.replace(redirectIfGuest);
            return;
          }
        }
      }

      if (active) {
        setReady(true);
      }
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, [router, redirectIfAuthenticated, redirectIfGuest, validateSessionOnLoad]);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return children ?? null;
}
