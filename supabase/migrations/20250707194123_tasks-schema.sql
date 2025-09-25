-- noinspection SqlResolve
create table if not exists public.tasks
(
    id            bigint primary key generated always as identity             not null,
    created_at    timestamptz                     default now()               not null,
    name          text                                                        not null,
    -- noinspection SqlResolve
    status        public.current_status           default 'in-progress'       not null,
    description   text                                                        not null,
    due_date      date                            default null,
    profile_id    uuid references public.profiles (id) on delete cascade      not null,
    project_id    bigint references public.projects (id) default null,
    collaborators text array                      default array []::varchar[] not null
);
