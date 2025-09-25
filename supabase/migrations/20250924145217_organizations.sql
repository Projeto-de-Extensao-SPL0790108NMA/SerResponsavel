create table if not exists public.organizations
(
    id         uuid primary key default gen_random_uuid(),
    created_at timestamptz default now()                    not null,
    name       text unique                                  not null,
    bio        text        default null,
    logo_url   text        default null
);

alter table profiles
    add column if not exists organization_id uuid
    references public.organizations(id) on delete set null;

create index if not exists idx_profiles_organization_id
    on public.profiles (organization_id);

alter table projects
    add column if not exists organization_id uuid
    references public.organizations(id) on delete set null;

create index if not exists idx_projects_organization_id
    on public.projects (organization_id);
