"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProgramByCode } from "@/lib/programs/catalog";

export type AddProgramResult = { ok: true } | { ok: false; error: string };

export async function addProgramAction(
  formData: FormData,
): Promise<AddProgramResult> {
  const programCode = String(formData.get("program_code") ?? "");
  const balanceRaw = String(formData.get("balance") ?? "");
  const expiresOn = String(formData.get("expires_on") ?? "").trim();

  if (!programCode) {
    return { ok: false, error: "Pick a program." };
  }
  if (!getProgramByCode(programCode)) {
    return { ok: false, error: "Unknown program." };
  }

  const balance = parseInt(balanceRaw.replace(/,/g, ""), 10);
  if (!Number.isFinite(balance) || balance < 0) {
    return { ok: false, error: "Balance must be a non-negative number." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("user_programs").insert({
    user_id: user.id,
    program_code: programCode,
    balance,
    expires_on: expiresOn || null,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteProgramAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("user_programs").delete().eq("id", id);
  revalidatePath("/dashboard");
}
