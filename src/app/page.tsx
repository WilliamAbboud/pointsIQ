import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="brand-gradient text-white px-6 py-6">
        <div className="max-w-[980px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-[20px]"
              style={{ background: "var(--brand-indigo)" }}
            >
              ✈
            </div>
            <div className="text-[18px] font-extrabold">PointsIQ</div>
          </div>
          <nav className="flex items-center gap-3 text-[14px]">
            <Link href="/login" className="text-blue-200 hover:text-white">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full px-4 py-2 font-semibold text-white"
              style={{ background: "var(--brand-indigo)" }}
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 brand-gradient text-white px-6 py-20">
        <div className="max-w-[760px] mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Your entire loyalty portfolio, finally worth what it should be.
          </h1>
          <p className="mt-6 text-lg text-blue-100">
            Track every mile, point, and balance across your credit cards, airlines, and hotels in one place. Catch expirations before they cost you. See the dollar value of what you actually own.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-full px-6 py-3 font-bold text-white"
              style={{ background: "var(--brand-indigo)" }}
            >
              Get started free
            </Link>
            <Link
              href="/login"
              className="rounded-full px-6 py-3 font-bold border border-white/30 hover:bg-white/10"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 px-6 py-6 text-[13px]">
        <div className="max-w-[980px] mx-auto flex items-center justify-between">
          <div>© 2026 PointsIQ</div>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-white">
              Log in
            </Link>
            <Link href="/signup" className="hover:text-white">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
