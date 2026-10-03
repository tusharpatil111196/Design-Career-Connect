create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role text not null default 'student' check (role in ('admin', 'student')),
  phone text not null default '',
  location text not null default '',
  qualification text not null default '',
  experience text not null default '',
  skills text not null default '',
  resume_url text not null default '',
  about text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text not null default '',
  contact_name text not null default '',
  email text not null default '',
  phone text not null default '',
  status text not null default 'Active' check (status in ('Active', 'Paused')),
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete restrict,
  title text not null,
  location text not null default '',
  employment_type text not null default 'Full-time',
  salary text not null default '',
  category text not null default '',
  description text not null default '',
  status text not null default 'Open' check (status in ('Open', 'Paused', 'Closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  job_id uuid not null references public.jobs (id) on delete cascade,
  status text not null default 'New' check (status in ('New', 'In review', 'Interview', 'Offer', 'Rejected')),
  applied_at timestamptz not null default now(),
  unique (student_id, job_id)
);

create table if not exists public.application_admin_notes (
  application_id uuid primary key references public.applications (id) on delete cascade,
  note text not null default '',
  updated_at timestamptz not null default now()
);

create index if not exists jobs_client_id_idx on public.jobs (client_id);
create index if not exists jobs_status_idx on public.jobs (status);
create index if not exists applications_student_id_idx on public.applications (student_id);
create index if not exists applications_job_id_idx on public.applications (job_id);
create index if not exists applications_status_idx on public.applications (status);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.application_admin_notes enable row level security;

revoke all on public.profiles, public.clients, public.jobs, public.applications, public.application_admin_notes from anon;
grant select on public.profiles to authenticated;
revoke insert, update, delete on public.profiles from authenticated;
grant update (full_name, phone, location, qualification, experience, skills, resume_url, about)
  on public.profiles to authenticated;
grant select, insert, update, delete on public.clients, public.jobs to authenticated;
grant select, insert, update, delete on public.applications, public.application_admin_notes to authenticated;

drop policy if exists "Profiles visible to owner and admins" on public.profiles;
create policy "Profiles visible to owner and admins"
on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Students update own profile fields" on public.profiles;
create policy "Students update own profile fields"
on public.profiles for update to authenticated
using (id = (select auth.uid()) or (select public.is_admin()))
with check (id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Admins manage clients" on public.clients;
create policy "Admins manage clients"
on public.clients for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Signed-in users read open jobs; admins read all" on public.jobs;
create policy "Signed-in users read open jobs; admins read all"
on public.jobs for select to authenticated
using (status = 'Open' or (select public.is_admin()));

drop policy if exists "Admins manage jobs" on public.jobs;
create policy "Admins manage jobs"
on public.jobs for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Candidates read own applications; admins read all" on public.applications;
create policy "Candidates read own applications; admins read all"
on public.applications for select to authenticated
using (student_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Candidates apply to open jobs" on public.applications;
create policy "Candidates apply to open jobs"
on public.applications for insert to authenticated
with check (
  student_id = (select auth.uid())
  and status = 'New'
  and exists (
    select 1 from public.jobs
    where jobs.id = applications.job_id and jobs.status = 'Open'
  )
);

drop policy if exists "Admins manage applications" on public.applications;
create policy "Admins manage applications"
on public.applications for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Admins manage application notes" on public.application_admin_notes;
create policy "Admins manage application notes"
on public.application_admin_notes for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

drop policy if exists "Users read own resumes; admins read all" on storage.objects;
create policy "Users read own resumes; admins read all"
on storage.objects for select to authenticated
using (
  bucket_id = 'resumes'
  and (name like ((select auth.uid())::text || '/%') or (select public.is_admin()))
);

drop policy if exists "Users upload own resumes" on storage.objects;
create policy "Users upload own resumes"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'resumes'
  and name like ((select auth.uid())::text || '/%')
);

drop policy if exists "Users update own resumes" on storage.objects;
create policy "Users update own resumes"
on storage.objects for update to authenticated
using (
  bucket_id = 'resumes'
  and (name like ((select auth.uid())::text || '/%') or (select public.is_admin()))
)
with check (
  bucket_id = 'resumes'
  and (name like ((select auth.uid())::text || '/%') or (select public.is_admin()))
);

drop policy if exists "Users delete own resumes; admins delete all" on storage.objects;
create policy "Users delete own resumes; admins delete all"
on storage.objects for delete to authenticated
using (
  bucket_id = 'resumes'
  and (name like ((select auth.uid())::text || '/%') or (select public.is_admin()))
);
