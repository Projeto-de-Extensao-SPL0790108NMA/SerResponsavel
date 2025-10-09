DO $$
BEGIN
  IF to_regclass('public.projects') IS NULL OR to_regclass('public.organizations') IS NULL THEN
    RAISE NOTICE 'Skipping refresh_get_projects_with_feedback: prerequisite tables not available.';
    RETURN;
  END IF;

  EXECUTE '
    CREATE OR REPLACE FUNCTION public.get_projects_with_feedback(status_filter text DEFAULT ''all'')
      RETURNS TABLE (
        project jsonb,
        organization jsonb,
        rating_summary jsonb,
        comment_summary jsonb
      )
      LANGUAGE sql
      STABLE
      SET search_path = public
    AS $function$
      WITH params AS (
        SELECT lower(coalesce(status_filter, ''all'')) AS status_value
      )
      SELECT
        to_jsonb(p.*) AS project,
        to_jsonb(o.*) AS organization,
        to_jsonb(prs.*) AS rating_summary,
        to_jsonb(pcs.*) AS comment_summary
      FROM public.projects p
      CROSS JOIN params
      LEFT JOIN public.organizations o ON o.id = p.organization_id
      LEFT JOIN public.project_rating_summaries prs ON prs.project_id = p.id
      LEFT JOIN public.project_comment_summaries pcs ON pcs.project_id = p.id
      WHERE CASE
        WHEN params.status_value = ''all'' THEN TRUE
        ELSE p.status = params.status_value::public.current_status
      END
      ORDER BY p.created_at DESC;
    $function$;
  ';

  EXECUTE 'GRANT EXECUTE ON FUNCTION public.get_projects_with_feedback(text) TO anon, authenticated';
END;
$$;
