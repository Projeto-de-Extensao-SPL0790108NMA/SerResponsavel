create table if not exists public.project_comments
(
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    project_id bigint not null references public.projects(id) on delete cascade,
    profile_id uuid references public.profiles(id) on delete set null,
    client_fingerprint text not null,
    author_name text,
    content text not null,
    committed boolean not null default false
);

create index if not exists idx_project_comments_project_id
  on public.project_comments(project_id);

create index if not exists idx_project_comments_created_at
  on public.project_comments(created_at desc);

create index if not exists idx_project_comments_fingerprint
  on public.project_comments(client_fingerprint);

create trigger set_project_comments_updated_at
  before update
  on public.project_comments
  for each row
execute procedure public.set_current_timestamp_updated_at();

alter table public.project_comments enable row level security;

create policy "Public read project comments" on public.project_comments
  for select
  using (true);

create policy "Allow insert project comments" on public.project_comments
  for insert
  with check (true);

create or replace view public.project_comment_summaries as
select
  c.project_id,
  count(c.*)::int as total,
  max(c.created_at) as latest_comment_at
from public.project_comments c
group by c.project_id;

comment on view public.project_comment_summaries is 'Aggregated comment metrics per project';
