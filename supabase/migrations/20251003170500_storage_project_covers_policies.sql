-- Allow public read access to project cover images
drop policy if exists "Public read access to project covers" on storage.objects;
create policy "Public read access to project covers"
  on storage.objects for select
  using (
    bucket_id = 'project-covers'
  );

-- Allow authenticated users to upload images to the project-covers bucket
drop policy if exists "Authenticated upload to project covers" on storage.objects;
create policy "Authenticated upload to project covers"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'project-covers' and owner = auth.uid()
  );

-- Allow authenticated users to update metadata of their own objects in the bucket
drop policy if exists "Authenticated update own project covers" on storage.objects;
create policy "Authenticated update own project covers"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'project-covers' and owner = auth.uid()
  )
  with check (
    bucket_id = 'project-covers' and owner = auth.uid()
  );

-- Allow authenticated users to delete their own objects in the bucket
drop policy if exists "Authenticated delete own project covers" on storage.objects;
create policy "Authenticated delete own project covers"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'project-covers' and owner = auth.uid()
  );

drop policy if exists "Public read access to organization logos" on storage.objects;
create policy "Public read access to organization logos"
  on storage.objects for select
  using (
    bucket_id = 'organizations-logo'
  );

drop policy if exists "Authenticated upload to organization logos" on storage.objects;
create policy "Authenticated upload to organization logos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'organizations-logo' and owner = auth.uid()
  );

drop policy if exists "Authenticated update own organization logos" on storage.objects;
create policy "Authenticated update own organization logos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'organizations-logo' and owner = auth.uid()
  )
  with check (
    bucket_id = 'organizations-logo' and owner = auth.uid()
  );

drop policy if exists "Authenticated delete own organization logos" on storage.objects;
create policy "Authenticated delete own organization logos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'organizations-logo' and owner = auth.uid()
  );
