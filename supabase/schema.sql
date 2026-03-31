create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.specs (
  id text primary key,
  title text not null,
  summary text,
  owner text,
  team text,
  category text,
  version text,
  status text not null default 'Draft' check (status in ('Draft', 'Review', 'Active', 'Archived')),
  tags text[] not null default '{}',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_specs_updated_at on public.specs;
create trigger set_specs_updated_at
  before update on public.specs
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.specs enable row level security;

create policy "users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "admins can read all profiles"
on public.profiles
for select
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "admins can update profiles"
on public.profiles
for update
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "viewers can read published specs"
on public.specs
for select
using (is_published = true);

create policy "admins can read all specs"
on public.specs
for select
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "admins can insert specs"
on public.specs
for insert
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "admins can update specs"
on public.specs
for update
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "admins can delete specs"
on public.specs
for delete
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

insert into public.specs (id, title, summary, owner, team, category, version, status, tags, is_published)
values
  (
    'OP-101',
    'Incident Response',
    'Defines severity levels, escalation paths, communication timelines, and postmortem requirements.',
    'Alex Chen',
    'SRE',
    'Reliability',
    'v2.3',
    'Active',
    array['pager', 'sev', 'on-call'],
    true
  ),
  (
    'OP-204',
    'Change Management',
    'Covers rollout approvals, maintenance windows, rollback criteria, and production change controls.',
    'Maya Patel',
    'Platform',
    'Governance',
    'v1.8',
    'Review',
    array['release', 'approvals', 'rollback'],
    false
  )
on conflict (id) do nothing;
