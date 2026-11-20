insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media', 'site-media', true, 26214400,
  array['image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp',
        'application/pdf', 'video/mp4', 'video/webm']
);

create table public.media_assets (
  path text primary key check (
    path ~ '^media/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(avif|gif|jpg|png|webp|pdf|mp4|webm)$'
  ),
  label text not null check (length(btrim(label)) between 1 and 180),
  mime_type text not null check (
    mime_type in ('image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp',
                  'application/pdf', 'video/mp4', 'video/webm')
  ),
  size_bytes integer not null check (size_bytes between 1 and 26214400),
  state text not null default 'pending' check (state in ('pending', 'ready', 'deleting')),
  created_at timestamptz not null default now(),
  upload_expires_at timestamptz not null default (now() + interval '2 hours 5 minutes'),
  ready_path text generated always as (
    case when state = 'ready' and mime_type like 'image/%' then path end
  ) stored unique
);

alter table public.media_assets enable row level security;
revoke all on table public.media_assets from public, anon, authenticated;
grant select, delete on table public.media_assets to authenticated;
grant insert (path, label, mime_type, size_bytes), update (label, state) on table public.media_assets to authenticated;

create policy admin_read_media on public.media_assets for select
to authenticated using ((select content_private.is_admin()));

create policy admin_reserve_media on public.media_assets for insert
to authenticated with check (state = 'pending' and (select content_private.is_admin()));

create policy admin_edit_media on public.media_assets for update
to authenticated using ((select content_private.is_admin()))
with check ((select content_private.is_admin()));

create policy admin_remove_media on public.media_assets for delete
to authenticated using (
  state = 'deleting'
  and upload_expires_at <= now()
  and (select content_private.is_admin())
);

create function content_private.check_media_state()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (old.state = 'ready' and new.state = 'pending')
    or (old.state = 'deleting' and new.state <> 'deleting') then
    raise exception 'Invalid media state transition';
  end if;
  return new;
end;
$$;

create trigger check_media_state
before update of state on public.media_assets
for each row execute function content_private.check_media_state();

do $$
declare
  table_name text;
begin
  foreach table_name in array array['articles', 'projects', 'staff']
  loop
    execute format(
      'alter table public.%I add column media_path_ref text generated always as
        (case when image_path like ''media/%%'' then image_path end) stored
        references public.media_assets (ready_path)',
      table_name
    );
    execute format('create index on public.%I (media_path_ref) where media_path_ref is not null', table_name);
  end loop;
end;
$$;

create policy admin_prepare_site_media on storage.objects for insert
to authenticated with check (
  bucket_id = 'site-media'
  and (select content_private.is_admin())
  and exists (
    select 1 from public.media_assets
    where path = name and state = 'pending' and upload_expires_at > now()
  )
);

create policy admin_inspect_site_media on storage.objects for select
to authenticated using (bucket_id = 'site-media' and (select content_private.is_admin()));

create policy admin_delete_site_media on storage.objects for delete
to authenticated using (
  bucket_id = 'site-media'
  and (select content_private.is_admin())
  and exists (select 1 from public.media_assets where path = name and state = 'deleting')
);
