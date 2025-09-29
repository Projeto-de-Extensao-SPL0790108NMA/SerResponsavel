alter table projects
    add column if not exists cover_image_url text,
    add column if not exists cover_image_path text;
