"use client";

import { useState, useTransition } from "react";
import { signUpAction } from "@/lib/auth/actions";

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signUpAction(formData);
      if (result && !result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-slate-700">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-[15px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-slate-700">
          Password{" "}
          <span className="font-normal text-slate-400">(8+ characters)</span>
        </span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-[15px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </label>
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-[13px] px-3 py-2">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full font-bold text-white px-6 py-3 disabled:opacity-60"
        style={{ background: "var(--brand-indigo)" }}
      >
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
