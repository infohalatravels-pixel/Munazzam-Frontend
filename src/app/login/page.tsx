import type { Metadata } from "next";
import { LoginBrandingAside } from "@/components/login/LoginBrandingAside";
import { LoginForm } from "@/components/login/LoginForm";
import { AuthRedirect } from "@/components/auth/AuthRedirect";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthRedirect redirectIfAuthenticated="/dashboard" validateSessionOnLoad>
      <div className="flex h-screen flex-col overflow-hidden bg-surface text-on-surface md:flex-row">
        <LoginBrandingAside />

        <main className="flex h-screen w-full flex-1 flex-col items-center justify-center overflow-y-auto bg-surface px-gutter py-xl md:w-1/2 lg:w-2/5 lg:px-3xl">
          <LoginForm />
        </main>
      </div>
    </AuthRedirect>
  );
}
