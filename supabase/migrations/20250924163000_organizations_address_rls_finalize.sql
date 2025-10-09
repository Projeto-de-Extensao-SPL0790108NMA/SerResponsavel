alter table public.organizations
  add column if not exists cep text,
  add column if not exists address_street text,
  add column if not exists address_number text,
  add column if not exists address_complement text,
  add column if not exists address_neighborhood text,
  add column if not exists address_city text,
  add column if not exists address_state text;

alter table public.organizations enable row level security;

drop policy if exists "Organizations are viewable by everyone" on public.organizations;
create policy "Organizations are viewable by everyone" on public.organizations
  for select
  using (true);

drop policy if exists "Organizations editable by privileged roles" on public.organizations;
create policy "Organizations editable by privileged roles" on public.organizations
  for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role <> 'member'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role <> 'member'
    )
  );

drop policy if exists "Organizations deletable by privileged roles" on public.organizations;
create policy "Organizations deletable by privileged roles" on public.organizations
  for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role <> 'member'
    )
  );
