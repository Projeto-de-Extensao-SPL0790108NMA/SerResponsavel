alter table profiles
    drop constraint if exists admin_requires_organization;

alter table profiles
    add constraint admin_requires_organization
        check (role <> 'admin' or organization_id is not null)
        not valid;
