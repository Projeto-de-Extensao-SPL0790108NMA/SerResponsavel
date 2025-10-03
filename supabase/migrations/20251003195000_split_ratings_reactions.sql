alter table if exists public.project_ratings
  add column if not exists committed boolean default false not null;

create table if not exists public.project_reactions
(
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    project_id bigint not null references public.projects(id) on delete cascade,
    client_fingerprint text not null,
    reaction text not null,
    committed boolean not null default false,
    constraint project_reactions_unique unique (project_id, client_fingerprint)
);

create index if not exists idx_project_reactions_project_id
  on public.project_reactions (project_id);

create index if not exists idx_project_reactions_fingerprint
  on public.project_reactions (client_fingerprint);

create trigger set_project_reactions_updated_at
  before update
  on public.project_reactions
  for each row
execute procedure public.set_current_timestamp_updated_at();

insert into public.project_reactions (project_id, client_fingerprint, reaction, committed)
select project_id, client_fingerprint, reaction, committed
from public.project_ratings
where reaction is not null
on conflict (project_id, client_fingerprint)
  do update set
    reaction = excluded.reaction,
    committed = excluded.committed,
    updated_at = now();

create or replace view public.project_rating_summaries as
select
  p.id as project_id,
  coalesce(avg(pr.rating), 0)::numeric(4,2) as average,
  coalesce(count(pr.*), 0)::int as total,
  jsonb_build_object(
    '1', coalesce(count(pr.*) filter (where pr.rating = 1), 0),
    '2', coalesce(count(pr.*) filter (where pr.rating = 2), 0),
    '3', coalesce(count(pr.*) filter (where pr.rating = 3), 0),
    '4', coalesce(count(pr.*) filter (where pr.rating = 4), 0),
    '5', coalesce(count(pr.*) filter (where pr.rating = 5), 0)
  ) as rating_counts,
  coalesce(
    (
      select jsonb_object_agg(sub.reaction, sub.cnt)
      from (
        select reaction, count(*) as cnt
        from public.project_reactions rr
        where rr.project_id = p.id
        group by reaction
      ) sub
    ), '{}'::jsonb
  ) as reaction_counts
from public.projects p
left join public.project_ratings pr on pr.project_id = p.id
group by p.id;

comment on view public.project_rating_summaries is 'Aggregated rating metrics per project';
