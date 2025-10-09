alter table if exists public.organizations enable row level security;

drop policy if exists "Organizations are viewable by everyone" on public.organizations;
drop policy if exists "Organizations editable by privileged roles" on public.organizations;
drop policy if exists "Organizations deletable by privileged roles" on public.organizations;

-- Allow anyone to read organizations
create policy "Organizations are viewable by everyone" on public.organizations
  for select
  using (true);

-- Allow updates only for non-member roles
create policy "Organizations editable by privileged roles" on public.organizations
  for update
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role <> 'member'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role <> 'member'
    )
  );

-- Allow deletes only for non-member roles
create policy "Organizations deletable by privileged roles" on public.organizations
  for delete
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role <> 'member'
    )
  );
