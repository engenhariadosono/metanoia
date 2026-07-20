-- ============================================================
-- METANOIA — Backend v1: Diário de reflexões (contas + memória)
-- Cole isto no Supabase → SQL Editor → Run.
-- Segue o checklist de segurança: RLS ligado, ownership por auth.uid(),
-- UPDATE com USING + WITH CHECK, roles explícitas.
-- ============================================================

create table if not exists public.reflections (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  challenge_id text not null,
  question     text,
  body         text not null,
  created_at   timestamptz not null default now()
);

-- Busca rápida: as reflexões de um usuário, mais recentes primeiro.
create index if not exists reflections_user_created_idx
  on public.reflections (user_id, created_at desc);

-- Expor ao Data API para o papel autenticado (RLS ainda filtra as linhas).
grant select, insert, update, delete on public.reflections to authenticated;

-- Row Level Security: cada pessoa só enxerga/edita o que é seu.
alter table public.reflections enable row level security;

create policy "reflexoes_select_dono" on public.reflections
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "reflexoes_insert_dono" on public.reflections
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "reflexoes_update_dono" on public.reflections
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "reflexoes_delete_dono" on public.reflections
  for delete to authenticated
  using ((select auth.uid()) = user_id);
