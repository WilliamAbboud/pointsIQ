import Link from "next/link";
import BrandHeader from "@/components/BrandHeader";
import SignupForm from "./SignupForm";

export const metadata = { title: "Sign up — PointsIQ" };

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <BrandHeader showHomeLink />
      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Start tracking your portfolio
            </h1>
            <p className="text-[14px] text-slate-500 mt-1 mb-6">
              Free for the beta. No credit card required.
            </p>
            <SignupForm />
          </div>
          <p className="text-center text-[14px] text-slate-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold"
              style={{ color: "var(--brand-indigo-deep)" }}
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
