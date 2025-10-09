drop function if exists public.get_projects_with_feedback(text);

create function public.get_projects_with_feedback(status_filter text default 'all')
  returns table (
    project jsonb,
    organization jsonb,
    rating_summary jsonb,
    comment_summary jsonb
  )
  language sql
  stable
  set search_path = public
as $$
  with params as (
    select lower(coalesce(status_filter, 'all')) as status_value
  )
  select
    to_jsonb(p.*) as project,
    to_jsonb(o.*) as organization,
    to_jsonb(prs.*) as rating_summary,
    to_jsonb(pcs.*) as comment_summary
  from public.projects p
  cross join params
  left join public.organizations o on o.id = p.organization_id
  left join public.project_rating_summaries prs on prs.project_id = p.id
  left join public.project_comment_summaries pcs on pcs.project_id = p.id
  where case
    when params.status_value = 'all' then true
    else p.status = params.status_value::public.current_status
  end
  order by p.created_at desc;
$$;

grant execute on function public.get_projects_with_feedback(text) to anon, authenticated;
