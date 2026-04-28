"use client";

import { useTransition } from "react";
import { deleteProgramAction } from "./actions";

export default function DeleteProgramButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Remove this program from your portfolio?")) return;
    startTransition(() => deleteProgramAction(id));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-[11px] text-slate-400 hover:text-red-600 mt-2 disabled:opacity-50"
    >
      {pending ? "Removing..." : "Remove"}
    </button>
  );
}
