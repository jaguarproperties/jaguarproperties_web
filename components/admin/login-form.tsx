"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  return (
    <form
      className="w-full max-w-md rounded-[32px] border border-white/15 bg-zinc-950/70 p-8 text-white shadow-[0_25px_80px_-32px_rgba(0,0,0,0.7)] backdrop-blur-xl"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        const formData = new FormData(event.currentTarget);
        const identifier = String(formData.get("identifier") ?? "").trim();
        const password = String(formData.get("password") ?? "").trim();

        startTransition(async () => {
          try {
            const result = await signIn("credentials", {
              identifier,
              password,
              redirect: false
            });

            if (result?.error || !result?.ok) {
              console.warn("[Admin Login] Sign-in failed.", {
                identifier,
                error: result?.error ?? "Unknown login error",
                status: result?.status ?? null,
                url: result?.url ?? null
              });
              setError("Login failed. Check the browser console and Vercel logs.");
              return;
            }

            router.push("/admin");
            router.refresh();
          } catch (error) {
            console.error("[Admin Login] Unexpected sign-in error.", {
              identifier,
              error
            });
            setError("Login failed. Check the browser console and Vercel logs.");
          }
        });
      }}
    >
      <p className="text-xs uppercase tracking-[0.35em] text-primary">Secure Access</p>
      <h1 className="mt-4 font-display text-5xl text-white">Admin Login</h1>
      <p className="mt-4 text-sm text-zinc-300">
        Enter your secure admin user ID or email and password to sign in.
      </p>
      <div className="mt-8 space-y-4">
        <Input
          name="identifier"
          type="text"
          placeholder="User ID or email"
          className="border-white/15 bg-white/10 text-white placeholder:text-zinc-400"
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          className="border-white/15 bg-white/10 text-white placeholder:text-zinc-400"
          required
        />
      </div>
      <Button type="submit" className="mt-6 w-full" size="lg" disabled={pending}>
        {pending ? "Signing in..." : "Sign In"}
      </Button>
      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
    </form>
  );
}
