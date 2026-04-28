import Link from "next/link";
import BrandHeader from "@/components/BrandHeader";
import LoginForm from "./LoginForm";

export const metadata = { title: "Log in — Kaivion" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <BrandHeader showHomeLink />
      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
            <p className="text-[14px] text-slate-500 mt-1 mb-6">
              Log in to see your loyalty portfolio.
            </p>
            <LoginForm />
          </div>
          <p className="text-center text-[14px] text-slate-500 mt-6">
            New here?{" "}
            <Link
              href="/signup"
              className="font-semibold"
              style={{ color: "var(--brand-indigo-deep)" }}
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
