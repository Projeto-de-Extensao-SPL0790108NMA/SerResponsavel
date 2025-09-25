-- noinspection SqlResolve
create table if not exists public.profiles
(
    id         uuid references auth.users on delete cascade not null,
    created_at timestamptz default now()                    not null,
    username   text unique                                  not null,
    full_name  text                                         not null,
    bio        text        default null,
    mode       text        default 'dark'                   not null,
    avatar_url text        default null,

    primary key (id)
);
