-- noinspection SqlResolve
do
$$
    begin
        if not exists (select 1 from pg_type where typname = 'user_role') then
            create type user_role as enum ('admin', 'member', 'supervisor');
        end if;
    end
$$;

create table if not exists public.profiles
(
    id              uuid references auth.users on delete cascade not null,
    created_at      timestamptz default now()                    not null,
    username        text unique                                  not null,
    full_name       text                                         not null,
    bio             text        default null,
    mode            text        default 'dark'                   not null,
    avatar_url      text        default null,
    role            user_role   default 'member'                 not null,

    primary key (id)
);
