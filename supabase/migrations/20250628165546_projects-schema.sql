-- noinspection SqlResolve
do
$$
    begin
        if not exists (select 1 from pg_catalog.pg_type where typname = 'current_status') then
            create type public.current_status as enum ('in-progress', 'completed');
        end if;
    end
$$;

create table if not exists public.projects
(
    id              bigint primary key generated always as identity   not null,
    created_at      timestamptz           default now()               not null,
    name            text                                              not null,
    slug            text unique                                       not null,
    description     text                                              not null default '',
    cover_image_url text,
    cover_image_path text,
    status          public.current_status default 'in-progress'       not null,
    collaborators   text array            default array []::varchar[] not null
);

