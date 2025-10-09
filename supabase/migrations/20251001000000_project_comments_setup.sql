DO $$
BEGIN
  IF to_regclass('public.projects') IS NULL OR to_regclass('public.profiles') IS NULL THEN
    RAISE NOTICE 'Skipping project_comments setup: prerequisites not available.';
    RETURN;
  END IF;

  IF to_regclass('public.project_comments') IS NULL THEN
    EXECUTE '
      CREATE TABLE public.project_comments (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at timestamptz DEFAULT now() NOT NULL,
          updated_at timestamptz DEFAULT now() NOT NULL,
          project_id bigint NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
          profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
          client_fingerprint text NOT NULL,
          author_name text,
          content text NOT NULL,
          committed boolean NOT NULL DEFAULT false
      );
    ';

    EXECUTE '
      CREATE INDEX idx_project_comments_project_id
        ON public.project_comments (project_id);
    ';

    EXECUTE '
      CREATE INDEX idx_project_comments_created_at
        ON public.project_comments (created_at DESC);
    ';

    EXECUTE '
      CREATE INDEX idx_project_comments_fingerprint
        ON public.project_comments (client_fingerprint);
    ';
  END IF;

  IF to_regproc('public.set_current_timestamp_updated_at') IS NOT NULL THEN
    EXECUTE '
      DROP TRIGGER IF EXISTS set_project_comments_updated_at ON public.project_comments;
    ';

    EXECUTE '
      CREATE TRIGGER set_project_comments_updated_at
        BEFORE UPDATE ON public.project_comments
        FOR EACH ROW
      EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
    ';
  END IF;

  EXECUTE '
    ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
  ';

  EXECUTE '
    DROP POLICY IF EXISTS "Public read project comments" ON public.project_comments;
    CREATE POLICY "Public read project comments" ON public.project_comments
      FOR SELECT USING (true);
  ';

  EXECUTE '
    DROP POLICY IF EXISTS "Allow insert project comments" ON public.project_comments;
    CREATE POLICY "Allow insert project comments" ON public.project_comments
      FOR INSERT WITH CHECK (true);
  ';

  EXECUTE '
    CREATE OR REPLACE VIEW public.project_comment_summaries AS
    SELECT
      c.project_id,
      COUNT(c.*)::int AS total,
      MAX(c.created_at) AS latest_comment_at
    FROM public.project_comments c
    GROUP BY c.project_id;
  ';

  EXECUTE '
    COMMENT ON VIEW public.project_comment_summaries IS ''Aggregated comment metrics per project'';
  ';
END;
$$;
