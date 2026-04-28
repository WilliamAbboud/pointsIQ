-- Kaivion database schema
-- Run this in the Supabase SQL Editor: Dashboard > SQL Editor > New query
-- Paste the entire file and click "Run".

-- =============================================================================
-- 1. user_programs: a user's holdings in each loyalty program
-- =============================================================================

create table if not exists public.user_programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  program_code text not null,
  balance bigint not null check (balance >= 0),
  expires_on date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A user can only have one row per program
create unique index if not exists user_programs_user_program_idx
  on public.user_programs (user_id, program_code);

-- Quick lookups for "show me everything for this user"
create index if not exists user_programs_user_idx
  on public.user_programs (user_id);

-- =============================================================================
-- 2. Row Level Security: user A cannot see user B's data
-- =============================================================================

alter table public.user_programs enable row level security;

-- Users can read only their own rows
create policy "Users read own programs"
  on public.user_programs for select
  using (auth.uid() = user_id);

-- Users can insert rows tagged with their own user_id
create policy "Users insert own programs"
  on public.user_programs for insert
  with check (auth.uid() = user_id);

-- Users can update only their own rows
create policy "Users update own programs"
  on public.user_programs for update
  using (auth.uid() = user_id);

-- Users can delete only their own rows
create policy "Users delete own programs"
  on public.user_programs for delete
  using (auth.uid() = user_id);

-- =============================================================================
-- 3. updated_at auto-touch trigger
-- =============================================================================

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_programs_touch_updated_at on public.user_programs;
create trigger user_programs_touch_updated_at
  before update on public.user_programs
  for each row execute procedure public.touch_updated_at();
