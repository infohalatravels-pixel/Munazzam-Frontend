"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { establishSession, getLoginErrorMessage, loginRequest } from "@/lib/auth/api";
import {
  clearRememberedEmail,
  getRememberedEmail,
  setRememberedEmail,
} from "@/lib/auth/remember";

const TEXT_LOGO = "/icons/Moanazzam-Text-Logo.png";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const rememberedEmail = getRememberedEmail();
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const session = await loginRequest({ email, password });
      await establishSession(session);

      if (rememberMe) {
        setRememberedEmail(email);
      } else {
        clearRememberedEmail();
      }

      router.replace("/dashboard");
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-w-0 max-w-[440px] shrink-0">
      <div className="animate-fade-up rounded-xl border border-outline-variant bg-surface-container-lowest p-xl shadow-lg">
        <div className="mb-xl w-full">
          <Image
            src={TEXT_LOGO}
            alt="Munazzam"
            width={220}
            height={56}
            className="mb-lg object-contain"
            style={{ width: "auto", height: "2.5rem" }}
            priority
          />
          <h2 className="mb-xs text-headline-lg text-on-surface">Welcome back</h2>
          <p className="text-body-md text-on-surface-variant">
            Sign in to your Munazzam account
          </p>
        </div>

        <form className="space-y-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
              {error}
            </div>
          )}

          <div className="animate-fade-up space-y-xs delay-100">
            <label
              htmlFor="email"
              className={`block text-label-sm ${
                focusedField === "email" ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@company.qa"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              disabled={loading}
              className="h-12 w-full rounded-lg border border-outline-variant bg-white px-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
            />
          </div>

          <div className="animate-fade-up space-y-xs delay-200">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className={`block text-label-sm ${
                  focusedField === "password"
                    ? "text-primary"
                    : "text-on-surface-variant"
                }`}
              >
                Password
              </label>
              <button
                type="button"
                className="text-label-sm text-primary transition-all hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              disabled={loading}
              className="h-12 w-full rounded-lg border border-outline-variant bg-white px-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
            />
          </div>

          <div className="animate-fade-up flex items-center space-x-sm delay-200">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <label
              htmlFor="remember"
              className="cursor-pointer text-body-sm text-on-surface-variant"
            >
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="animate-fade-up maroon-gradient flex h-12 w-full items-center justify-center rounded-lg text-label-md text-white shadow-md transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 delay-300"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>

      <footer className="animate-fade-up mt-2xl w-full text-center delay-400">
        <p className="w-full text-balance text-body-sm leading-relaxed text-on-surface-variant">
          Manage your workforce, visas and operations from one place.
        </p>
        <div className="mt-lg flex flex-wrap items-center justify-center gap-x-lg gap-y-sm text-label-sm text-outline">
          <button type="button" className="transition-colors hover:text-primary">
            Privacy Policy
          </button>
          <button type="button" className="transition-colors hover:text-primary">
            Terms of Service
          </button>
        </div>
      </footer>
    </div>
  );
}
