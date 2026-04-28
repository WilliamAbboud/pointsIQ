"use client";

import { useState, useTransition } from "react";
import { addProgramAction } from "./actions";
import {
  CATEGORY_LABEL,
  ProgramDefinition,
} from "@/lib/programs/catalog";

interface Props {
  availablePrograms: ProgramDefinition[];
}

export default function AddProgramForm({ availablePrograms }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addProgramAction(formData);
      if (!result.ok) {
        setError(result.error);
      } else {
        // Clear form fields by resetting via key strategy: handled by re-render
      }
    });
  }

  if (availablePrograms.length === 0) {
    return (
      <p className="text-[14px] text-slate-500">
        You&apos;ve added every supported program. More are coming soon.
      </p>
    );
  }

  // Group by category for display
  const grouped = availablePrograms.reduce<
    Record<string, ProgramDefinition[]>
  >((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return (
    <form
      action={onSubmit}
      className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr_1fr_auto] gap-3 items-end"
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-slate-600">Program</span>
        <select
          name="program_code"
          required
          defaultValue=""
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-[14px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
        >
          <option value="" disabled>
            Pick one...
          </option>
          {Object.keys(grouped).map((cat) => (
            <optgroup
              key={cat}
              label={CATEGORY_LABEL[cat as keyof typeof CATEGORY_LABEL]}
            >
              {grouped[cat].map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-slate-600">
          Balance (points)
        </span>
        <input
          name="balance"
          type="text"
          inputMode="numeric"
          pattern="[0-9,]*"
          required
          placeholder="125,000"
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-[14px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-slate-600">
          Expires on (optional)
        </span>
        <input
          name="expires_on"
          type="date"
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-[14px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full font-bold text-white px-5 py-2.5 disabled:opacity-60 self-end h-[42px]"
        style={{ background: "var(--brand-indigo)" }}
      >
        {pending ? "Adding..." : "Add"}
      </button>

      {error && (
        <div className="sm:col-span-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[13px] px-3 py-2">
          {error}
        </div>
      )}
    </form>
  );
}
