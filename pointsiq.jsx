import { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis
} from "recharts";

// ─────────────────────────────────────────────
// MOCK DATA — replace with live API calls
// ─────────────────────────────────────────────
const PROGRAMS = [
  {
    id: "amex",
    name: "Amex Membership Rewards",
    shortName: "Amex MR",
    category: "credit_card",
    icon: "💳",
    color: "#006FCF",
    points: 87500,
    cpp: 2.0,
    expiryDate: null,
    expiryNote: "Never expire while card is active",
    transferPartners: ["Delta SkyMiles", "Air France/KLM", "British Airways", "Marriott Bonvoy", "Singapore Airlines"],
    status: "active",
    accountLast4: "1008",
  },
  {
    id: "chase",
    name: "Chase Ultimate Rewards",
    shortName: "Chase UR",
    category: "credit_card",
    icon: "💳",
    color: "#117ACA",
    points: 124300,
    cpp: 1.9,
    expiryDate: null,
    expiryNote: "Never expire while card is active",
    transferPartners: ["United MileagePlus", "Hyatt", "Southwest", "British Airways", "Air France/KLM"],
    status: "active",
    accountLast4: "4246",
  },
  {
    id: "delta",
    name: "Delta SkyMiles",
    shortName: "Delta",
    category: "airline",
    icon: "✈️",
    color: "#E01933",
    points: 45200,
    cpp: 1.2,
    expiryDate: null,
    expiryNote: "Miles never expire",
    transferPartners: ["Amex MR", "Marriott Bonvoy"],
    status: "active",
    accountLast4: null,
  },
  {
    id: "united",
    name: "United MileagePlus",
    shortName: "United",
    category: "airline",
    icon: "✈️",
    color: "#005DAA",
    points: 32100,
    cpp: 1.4,
    expiryDate: "2026-06-15",
    expiryNote: "Expires Jun 15, 2026",
    transferPartners: ["Chase UR", "Capital One", "Marriott Bonvoy"],
    status: "expiring_soon",
    accountLast4: null,
  },
  {
    id: "marriott",
    name: "Marriott Bonvoy",
    shortName: "Bonvoy",
    category: "hotel",
    icon: "🏨",
    color: "#B8272D",
    points: 215000,
    cpp: 0.8,
    expiryDate: "2026-04-01",
    expiryNote: "Expires Apr 1, 2026 — Urgent",
    transferPartners: ["Amex MR", "Chase UR", "40+ airline partners"],
    status: "critical",
    accountLast4: null,
  },
  {
    id: "hilton",
    name: "Hilton Honors",
    shortName: "Hilton",
    category: "hotel",
    icon: "🏨",
    color: "#1A3C6B",
    points: 98750,
    cpp: 0.6,
    expiryDate: null,
    expiryNote: "Expire after 12 months of inactivity",
    transferPartners: ["Amex MR"],
    status: "active",
    accountLast4: null,
  },
];

const REDEMPTIONS = [
  {
    title: "Business Class to Europe",
    description: "Chase UR → British Airways → Book Finnair biz class. Exceptional sweet spot.",
    program: "Chase Ultimate Rewards",
    programId: "chase",
    points: 50000,
    cashValue: 4500,
    rating: "exceptional",
    cpp: 9.0,
    tip: "Best booked 11 months out.",
  },
  {
    title: "Marriott Cat. 4 Hotel — 5 Nights",
    description: "5th night free on Bonvoy award stays. Act fast — points expiring.",
    program: "Marriott Bonvoy",
    programId: "marriott",
    points: 160000,
    cashValue: 1600,
    rating: "good",
    cpp: 1.0,
    tip: "Use before Apr 1 to avoid expiry.",
  },
  {
    title: "United Polaris Business to Japan",
    description: "Saver award on United transatlantic. Burn expiring miles at peak value.",
    program: "United MileagePlus",
    programId: "united",
    points: 32100,
    cashValue: 4200,
    rating: "exceptional",
    cpp: 13.1,
    tip: "⚠️ Miles expire Jun 15 — book soon.",
  },
  {
    title: "Delta Premium Select to Asia",
    description: "Off-peak SkyMiles award to Tokyo or Seoul.",
    program: "Delta SkyMiles",
    programId: "delta",
    points: 38000,
    cashValue: 800,
    rating: "average",
    cpp: 2.1,
    tip: "Search off-peak dates for availability.",
  },
  {
    title: "Amex → Singapore Suites Transfer",
    description: "Transfer Amex MR to Singapore Airlines KrisFlyer for First Class redemptions.",
    program: "Amex Membership Rewards",
    programId: "amex",
    points: 77000,
    cashValue: 9000,
    rating: "exceptional",
    cpp: 11.7,
    tip: "Rare availability — set alerts.",
  },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const fmt$ = (n) =>
  "$" + Math.round(n).toLocaleString("en-US");

const fmtPts = (n) => n.toLocaleString("en-US");

const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
};

const CATEGORY_META = {
  credit_card: { label: "Credit Cards", color: "#6366F1" },
  airline: { label: "Airlines", color: "#0EA5E9" },
  hotel: { label: "Hotels", color: "#F59E0B" },
};

const STATUS_STYLE = {
  critical: { badge: "bg-red-100 text-red-700 border border-red-300", label: "URGENT" },
  expiring_soon: { badge: "bg-amber-100 text-amber-700 border border-amber-300", label: "EXPIRING" },
  active: { badge: "bg-emerald-100 text-emerald-700 border border-emerald-300", label: "Active" },
};

const RATING_STYLE = {
  exceptional: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  good: "bg-blue-50 text-blue-700 border border-blue-200",
  average: "bg-amber-50 text-amber-700 border border-amber-200",
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function PointsIQ() {
  const [tab, setTab] = useState("dashboard");
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");

  const totalUSD = PROGRAMS.reduce((s, p) => s + (p.points * p.cpp) / 100, 0);
  const totalPts = PROGRAMS.reduce((s, p) => s + p.points, 0);
  const atRisk = PROGRAMS.filter((p) => p.status !== "active");
  const atRiskUSD = atRisk.reduce((s, p) => s + (p.points * p.cpp) / 100, 0);

  const pieData = PROGRAMS.map((p) => ({
    name: p.shortName,
    value: Math.round((p.points * p.cpp) / 100),
    color: p.color,
  }));

  const categoryTotals = Object.entries(CATEGORY_META).map(([key, meta]) => ({
    name: meta.label,
    value: PROGRAMS.filter((p) => p.category === key).reduce(
      (s, p) => s + Math.round((p.points * p.cpp) / 100),
      0
    ),
    color: meta.color,
  }));

  const barData = PROGRAMS.map((p) => ({
    name: p.shortName,
    Value: Math.round((p.points * p.cpp) / 100),
    color: p.color,
  }));

  const filteredPrograms =
    filter === "all" ? PROGRAMS : PROGRAMS.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* ── NAV HEADER ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c2340 100%)",
        }}
        className="text-white"
      >
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* Brand Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-xl font-bold">
                ✈
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">PointsIQ</h1>
                <p className="text-blue-300 text-xs">Loyalty Portfolio Consolidator</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/20 text-sm text-blue-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" style={{ animation: "pulse 2s infinite" }}></span>
              Live sync · 6 programs
            </div>
          </div>

          {/* Alert Banner */}
          {atRisk.length > 0 && (
            <div className="bg-red-500/20 border border-red-400/40 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚨</span>
                <div>
                  <p className="font-semibold text-red-200 text-sm mb-1">
                    {fmt$(atRiskUSD)} worth of points are at risk of expiring
                  </p>
                  {atRisk.map((p) => {
                    const d = daysUntil(p.expiryDate);
                    return (
                      <p key={p.id} className="text-sm text-red-100">
                        • <strong>{p.name}</strong>: {fmtPts(p.points)} pts
                        {d !== null ? ` — expires in ${d} days` : ""}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
              <p className="text-blue-300 text-xs uppercase tracking-widest mb-2">Total Portfolio Value</p>
              <p className="text-4xl font-extrabold">{fmt$(totalUSD)}</p>
              <p className="text-blue-300 text-sm mt-1">{fmtPts(totalPts)} combined points</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
              <p className="text-blue-300 text-xs uppercase tracking-widest mb-2">Programs Tracked</p>
              <p className="text-4xl font-extrabold">{PROGRAMS.length}</p>
              <p className="text-blue-300 text-sm mt-1">Banks · Airlines · Hotels</p>
            </div>
            <div className="bg-red-400/20 backdrop-blur rounded-2xl p-5 border border-red-400/30">
              <p className="text-red-300 text-xs uppercase tracking-widest mb-2">⚠ At Risk</p>
              <p className="text-4xl font-extrabold text-red-200">{fmt$(atRiskUSD)}</p>
              <p className="text-red-300 text-sm mt-1">{atRisk.length} programs expiring soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 flex gap-0">
          {[
            { id: "dashboard", icon: "📊", label: "Dashboard" },
            { id: "optimizer", icon: "🎯", label: "Optimizer" },
            { id: "expiration", icon: "⏰", label: "Expiration" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                tab === t.id
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* ══════════════ DASHBOARD TAB ══════════════ */}
        {tab === "dashboard" && (
          <div>
            {/* Charts Row */}
            <div className="grid grid-cols-5 gap-6 mb-8">

              {/* Donut */}
              <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-700 text-sm mb-4">Portfolio Mix</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} dataKey="value" paddingAngle={2}>
                      {pieData.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => fmt$(v)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-3">
                  {categoryTotals.map((c) => (
                    <div key={c.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="text-slate-500">{c.name}</span>
                      </div>
                      <span className="font-semibold text-slate-800">{fmt$(c.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar Chart */}
              <div className="col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-700 text-sm mb-4">Value by Program</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} angle={-15} textAnchor="end" />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: "#94a3b8" }} width={40} />
                    <Tooltip formatter={(v) => fmt$(v)} />
                    <Bar dataKey="Value" radius={[6, 6, 0, 0]}>
                      {barData.map((d, i) => (
                        <Cell key={i} fill={PROGRAMS[i].color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-sm text-slate-500 mr-1">Filter:</span>
              {[
                { id: "all", label: "All" },
                { id: "credit_card", label: "💳 Credit Cards" },
                { id: "airline", label: "✈️ Airlines" },
                { id: "hotel", label: "🏨 Hotels" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    filter === f.id
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Program Cards */}
            <div className="grid grid-cols-2 gap-4">
              {filteredPrograms.map((p) => {
                const usd = Math.round((p.points * p.cpp) / 100);
                const days = daysUntil(p.expiryDate);
                const s = STATUS_STYLE[p.status];
                const isOpen = expanded === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => setExpanded(isOpen ? null : p.id)}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all"
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                          style={{ backgroundColor: p.color + "18" }}
                        >
                          {p.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm leading-tight">{p.name}</p>
                          <p className="text-slate-400 text-xs capitalize mt-0.5">
                            {CATEGORY_META[p.category].label}
                            {p.accountLast4 ? ` · ···${p.accountLast4}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.badge}`}>
                        {s.label}
                      </span>
                    </div>

                    {/* Value Row */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-extrabold text-slate-900">{fmt$(usd)}</p>
                        <p className="text-sm text-slate-400 mt-0.5">
                          {fmtPts(p.points)} pts · {p.cpp}¢/pt
                        </p>
                      </div>
                      <div className="text-right">
                        {days !== null && (
                          <p className={`text-sm font-bold ${days < 30 ? "text-red-600" : "text-amber-600"}`}>
                            ⏰ {days}d left
                          </p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">Synced today</p>
                        <span className="text-xs text-indigo-500 mt-1 inline-block">
                          {isOpen ? "▲ collapse" : "▼ details"}
                        </span>
                      </div>
                    </div>

                    {/* Expanded */}
                    {isOpen && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                          Transfer Partners
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {p.transferPartners.map((tp) => (
                            <span key={tp} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
                              {tp}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-400">{p.expiryNote}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════ OPTIMIZER TAB ══════════════ */}
        {tab === "optimizer" && (
          <div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 mb-6">
              <h3 className="font-semibold text-indigo-900 mb-1">🎯 Top Redemption Opportunities</h3>
              <p className="text-indigo-700 text-sm">
                Ranked by cents-per-point value achieved. Standard award availability assumed.
              </p>
            </div>

            <div className="space-y-4">
              {[...REDEMPTIONS].sort((a, b) => b.cpp - a.cpp).map((r, i) => {
                const prog = PROGRAMS.find((p) => p.id === r.programId);
                const canAfford = prog && prog.points >= r.points;

                return (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4">

                      {/* Left */}
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <span className="text-lg font-bold text-slate-800">{r.title}</span>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${RATING_STYLE[r.rating]}`}>
                            {r.rating.toUpperCase()}
                          </span>
                          {canAfford ? (
                            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                              ✓ You have enough
                            </span>
                          ) : (
                            <span className="text-xs bg-slate-50 text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full font-medium">
                              Need more points
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-sm mb-3 leading-relaxed">{r.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="text-slate-500">
                            <span
                              className="inline-block w-2 h-2 rounded-full mr-1.5"
                              style={{ backgroundColor: PROGRAMS.find((p) => p.id === r.programId)?.color || "#888" }}
                            />
                            {r.program}
                          </span>
                          <span className="text-slate-500">🎫 {fmtPts(r.points)} pts required</span>
                        </div>
                        <p className="text-xs text-amber-600 mt-2 font-medium">{r.tip}</p>
                      </div>

                      {/* Right */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-3xl font-extrabold text-emerald-600">{fmt$(r.cashValue)}</p>
                        <p className="text-xs text-slate-400 mb-2">cash equivalent</p>
                        <div className="bg-indigo-600 text-white text-sm font-extrabold px-4 py-1.5 rounded-full text-center">
                          {r.cpp}¢/pt
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* API Integration Note */}
            <div className="mt-8 bg-slate-800 text-slate-300 rounded-2xl p-6 text-sm">
              <h4 className="text-white font-semibold mb-2">⚙️ API Integration Architecture</h4>
              <p className="mb-2">In production, PointsIQ integrates via:</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Chase / Amex", method: "OAuth 2.0 + Open Banking APIs" },
                  { label: "Delta / United", method: "Loyalty REST APIs + Screen scraper fallback" },
                  { label: "Marriott / Hilton", method: "Partner APIs + Headless browser scraping" },
                  { label: "Sync Frequency", method: "Every 6 hours (configurable)" },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-700/50 rounded-xl p-3">
                    <p className="text-white text-xs font-semibold">{item.label}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{item.method}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ EXPIRATION TAB ══════════════ */}
        {tab === "expiration" && (
          <div>
            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 mb-6">
              <h3 className="font-semibold text-slate-800 mb-1">⏰ Expiration Tracker</h3>
              <p className="text-slate-500 text-sm">Programs sorted by urgency. Take action on red items first.</p>
            </div>

            <div className="space-y-4">
              {[...PROGRAMS]
                .sort((a, b) => {
                  const da = daysUntil(a.expiryDate);
                  const db = daysUntil(b.expiryDate);
                  if (da === null && db === null) return 0;
                  if (da === null) return 1;
                  if (db === null) return -1;
                  return da - db;
                })
                .map((p) => {
                  const days = daysUntil(p.expiryDate);
                  const usd = Math.round((p.points * p.cpp) / 100);

                  let urgency, barColor, bgBorder, textColor, label;
                  if (days !== null && days < 30) {
                    urgency = "critical"; barColor = "#ef4444";
                    bgBorder = "bg-red-50 border-red-200"; textColor = "text-red-700"; label = "🔴 CRITICAL";
                  } else if (days !== null && days < 90) {
                    urgency = "soon"; barColor = "#f59e0b";
                    bgBorder = "bg-amber-50 border-amber-200"; textColor = "text-amber-700"; label = "🟡 EXPIRING SOON";
                  } else if (days !== null) {
                    urgency = "ok"; barColor = "#22c55e";
                    bgBorder = "bg-emerald-50 border-emerald-200"; textColor = "text-emerald-700"; label = "🟢 OK";
                  } else {
                    urgency = "none"; barColor = "#94a3b8";
                    bgBorder = "bg-white border-slate-200"; textColor = "text-slate-500"; label = "⚪ No expiry";
                  }

                  const pct = days !== null ? Math.max(4, Math.min(100, Math.round((1 - days / 365) * 100))) : 0;

                  return (
                    <div key={p.id} className={`rounded-2xl p-5 border ${bgBorder} shadow-sm`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{p.icon}</span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-slate-800">{p.name}</p>
                              <span className={`text-xs font-bold ${textColor}`}>{label}</span>
                            </div>
                            <p className="text-sm text-slate-500">{p.expiryNote}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-extrabold text-slate-900">{fmt$(usd)}</p>
                          <p className="text-xs text-slate-400">{fmtPts(p.points)} pts</p>
                          {days !== null && (
                            <p className={`text-sm font-extrabold ${textColor}`}>{days} days left</p>
                          )}
                        </div>
                      </div>

                      {days !== null && (
                        <div className="mt-2">
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, backgroundColor: barColor }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>Today</span>
                            <span>{new Date(p.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </div>
                        </div>
                      )}

                      {urgency === "critical" && (
                        <div className="mt-3 bg-red-100 border border-red-200 rounded-xl p-3">
                          <p className="text-red-700 text-sm font-medium">
                            💡 Action: Transfer to an airline partner or book a hotel stay to reset the expiry clock.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div className="border-t border-slate-200 pt-6 flex items-center justify-between text-xs text-slate-400">
          <span>PointsIQ · MVP Demo · Data is illustrative</span>
          <span>Last full sync: Mar 9, 2026 · 08:00 AM</span>
        </div>
      </div>

    </div>
  );
}
