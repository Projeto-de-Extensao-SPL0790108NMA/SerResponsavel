create or replace view public.project_rating_summaries as
select
  p.id as project_id,
  coalesce(avg(r.rating), 0)::numeric(4,2) as average,
  coalesce(count(r.*), 0)::int as total,
  jsonb_build_object(
    '1', coalesce(count(*) filter (where r.rating = 1), 0),
    '2', coalesce(count(*) filter (where r.rating = 2), 0),
    '3', coalesce(count(*) filter (where r.rating = 3), 0),
    '4', coalesce(count(*) filter (where r.rating = 4), 0),
    '5', coalesce(count(*) filter (where r.rating = 5), 0)
  ) as rating_counts,
  coalesce(
    (
      select jsonb_object_agg(sub.reaction, sub.cnt)
      from (
        select reaction, count(*) as cnt
        from public.project_ratings pr
        where pr.project_id = p.id and pr.reaction is not null
        group by reaction
      ) sub
    ), '{}'::jsonb
  ) as reaction_counts
from public.projects p
left join public.project_ratings r on r.project_id = p.id
group by p.id;

comment on view public.project_rating_summaries is 'Aggregated rating metrics per project';
