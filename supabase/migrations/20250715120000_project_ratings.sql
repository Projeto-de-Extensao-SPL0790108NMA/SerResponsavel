create or replace function public.set_current_timestamp_updated_at()
    returns trigger
    language plpgsql
as
$$
begin
    new.updated_at = now();
    return new;
end;
$$;

create table if not exists public.project_ratings
(
    id                 uuid primary key default gen_random_uuid(),
    created_at         timestamptz    default now() not null,
    updated_at         timestamptz    default now() not null,
    project_id         bigint                       not null references public.projects (id) on delete cascade,
    client_fingerprint uuid                         not null,
    rating             smallint                     not null,
    reaction           text                         default null,
    constraint project_ratings_rating_check check (rating between 1 and 5),
    constraint project_ratings_unique_client_per_project unique (project_id, client_fingerprint)
);

create index if not exists idx_project_ratings_project_id
    on public.project_ratings (project_id);

create trigger set_project_ratings_updated_at
    before update
    on public.project_ratings
    for each row
execute procedure public.set_current_timestamp_updated_at();
