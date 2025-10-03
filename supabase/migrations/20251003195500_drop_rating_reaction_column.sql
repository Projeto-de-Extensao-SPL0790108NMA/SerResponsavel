-- Drop legacy reaction column after the view has been updated in previous migration
alter table if exists public.project_ratings
  drop column if exists reaction;
