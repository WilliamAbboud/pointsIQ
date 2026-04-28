import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  PROGRAMS,
  ProgramCategory,
  getProgramByCode,
} from "@/lib/programs/catalog";
import { signOutAction } from "@/lib/auth/actions";
import AddProgramForm from "./AddProgramForm";
import DeleteProgramButton from "./DeleteProgramButton";

interface UserProgramRow {
  id: string;
  program_code: string;
  balance: number;
  expires_on: string | null;
}

function daysUntil(dateString: string | null): number | null {
  if (!dateString) return null;
  const target = new Date(dateString);
  const now = new Date();
  const diff = Math.ceil(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff;
}

function expiryBadgeClass(days: number | null): {
  bg: string;
  text: string;
  label: string;
} {
  if (days === null) {
    return { bg: "#d1fae5", text: "#065f46", label: "Active" };
  }
  if (days <= 30) return { bg: "#fee2e2", text: "#b91c1c", label: "Critical" };
  if (days <= 90) return { bg: "#fef3c7", text: "#b45309", label: "Soon" };
  return { bg: "#d1fae5", text: "#065f46", label: "Active" };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: rows } = await supabase
    .from("user_programs")
    .select("id, program_code, balance, expires_on")
    .order("created_at", { ascending: true });

  const userPrograms: UserProgramRow[] = rows ?? [];

  // Compute totals
  let totalUsd = 0;
  let totalPoints = 0;
  let expiringSoonUsd = 0;
  const byCategory: Record<ProgramCategory, number> = {
    credit_card: 0,
    airline: 0,
    hotel: 0,
  };

  for (const row of userPrograms) {
    const def = getProgramByCode(row.program_code);
    if (!def) continue;
    const usd = (row.balance * def.cpp) / 100;
    totalUsd += usd;
    totalPoints += row.balance;
    byCategory[def.category] += usd;
    const days = daysUntil(row.expires_on);
    if (days !== null && days <= 90) expiringSoonUsd += usd;
  }

  const heldCodes = new Set(userPrograms.map((p) => p.program_code));
  const availablePrograms = PROGRAMS.filter((p) => !heldCodes.has(p.code));

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="brand-gradient text-white px-6 py-8">
        <div className="max-w-[980px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[22px]"
                style={{ background: "var(--brand-indigo)" }}
              >
                ✈
              </div>
              <div>
                <div className="text-[20px] font-extrabold">Kaivion</div>
                <div className="text-[12px] text-blue-300 mt-0.5">
                  {user.email}
                </div>
              </div>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full px-4 py-2 text-[13px] bg-white/10 border border-white/20 hover:bg-white/15"
              >
                Log out
              </button>
            </form>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl p-5 border border-white/20 bg-white/10">
              <div className="text-[11px] text-blue-300 uppercase tracking-widest mb-2">
                Portfolio value
              </div>
              <div className="text-4xl font-black leading-none">
                ${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[13px] text-blue-300 mt-1">
                across {userPrograms.length}{" "}
                {userPrograms.length === 1 ? "program" : "programs"}
              </div>
            </div>
            <div className="rounded-2xl p-5 border border-white/20 bg-white/10">
              <div className="text-[11px] text-blue-300 uppercase tracking-widest mb-2">
                Total points
              </div>
              <div className="text-4xl font-black leading-none">
                {totalPoints.toLocaleString()}
              </div>
              <div className="text-[13px] text-blue-300 mt-1">
                raw balance
              </div>
            </div>
            <div
              className="rounded-2xl p-5 border"
              style={{
                background:
                  expiringSoonUsd > 0
                    ? "rgba(239,68,68,.18)"
                    : "rgba(255,255,255,.1)",
                borderColor:
                  expiringSoonUsd > 0
                    ? "rgba(252,165,165,.3)"
                    : "rgba(255,255,255,.2)",
              }}
            >
              <div
                className="text-[11px] uppercase tracking-widest mb-2"
                style={{
                  color: expiringSoonUsd > 0 ? "#fca5a5" : "#93c5fd",
                }}
              >
                Expiring soon
              </div>
              <div className="text-4xl font-black leading-none">
                ${expiringSoonUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div
                className="text-[13px] mt-1"
                style={{
                  color: expiringSoonUsd > 0 ? "#fca5a5" : "#93c5fd",
                }}
              >
                next 90 days
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-[980px] mx-auto">
          {/* Empty state */}
          {userPrograms.length === 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mb-8">
              <h2 className="font-bold text-indigo-900 mb-1">
                Add your first program to get started
              </h2>
              <p className="text-[14px] text-indigo-700">
                Pick a program from the dropdown below, type your current balance, and tag the expiration date if you know it. You can add as many as you have.
              </p>
            </div>
          )}

          {/* Add program form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
            <h2 className="text-[15px] font-bold text-slate-700 mb-4">
              Add a program
            </h2>
            <AddProgramForm availablePrograms={availablePrograms} />
          </div>

          {/* Category breakdown */}
          {userPrograms.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {(Object.keys(byCategory) as ProgramCategory[]).map((cat) => (
                <div
                  key={cat}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: CATEGORY_COLOR[cat] }}
                    />
                    <span className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">
                      {CATEGORY_LABEL[cat]}
                    </span>
                  </div>
                  <div className="text-3xl font-black text-slate-900">
                    ${byCategory[cat].toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Programs grid */}
          {userPrograms.length > 0 && (
            <div>
              <h2 className="text-[15px] font-bold text-slate-700 mb-4">
                Your programs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userPrograms.map((row) => {
                  const def = getProgramByCode(row.program_code);
                  if (!def) return null;
                  const usd = (row.balance * def.cpp) / 100;
                  const days = daysUntil(row.expires_on);
                  const badge = expiryBadgeClass(days);
                  return (
                    <div
                      key={row.id}
                      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-[15px]"
                            style={{ background: def.tileColor }}
                          >
                            {def.initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-[14px] leading-tight">
                              {def.name}
                            </div>
                            <div className="text-[12px] text-slate-400 mt-0.5">
                              {CATEGORY_LABEL[def.category]} · {def.cpp.toFixed(1)}¢/pt
                            </div>
                          </div>
                        </div>
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-xl"
                          style={{
                            background: badge.bg,
                            color: badge.text,
                          }}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-3xl font-black text-slate-900 leading-none">
                            ${usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </div>
                          <div className="text-[13px] text-slate-400 mt-1">
                            {row.balance.toLocaleString()} pts
                          </div>
                        </div>
                        <div className="text-right">
                          {days !== null ? (
                            <div
                              className="text-[13px] font-bold"
                              style={{
                                color:
                                  days <= 30
                                    ? "#dc2626"
                                    : days <= 90
                                    ? "#d97706"
                                    : "#64748b",
                              }}
                            >
                              {days} days
                            </div>
                          ) : (
                            <div className="text-[13px] text-slate-400">
                              No expiry
                            </div>
                          )}
                          <DeleteProgramButton id={row.id} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
