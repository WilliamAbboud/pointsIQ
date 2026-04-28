import Link from "next/link";

interface Props {
  showHomeLink?: boolean;
}

export default function BrandHeader({ showHomeLink = false }: Props) {
  return (
    <header className="brand-gradient text-white px-6 py-8">
      <div className="max-w-[980px] mx-auto">
        {showHomeLink && (
          <Link
            href="/"
            className="text-blue-300 text-[13px] hover:text-white inline-block mb-3"
          >
            ← Back to home
          </Link>
        )}
        <div className="flex items-center gap-3">
          <div
            className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[22px]"
            style={{ background: "var(--brand-indigo)" }}
          >
            ✈
          </div>
          <div>
            <div className="text-[20px] font-extrabold tracking-tight">PointsIQ</div>
            <div className="text-[12px] text-blue-300 mt-0.5">
              Your loyalty portfolio, finally worth what it should be
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
