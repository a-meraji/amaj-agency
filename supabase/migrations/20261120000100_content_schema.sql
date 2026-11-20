create schema content_private;
revoke all on schema content_private from public;
grant usage on schema content_private to authenticated;

create table content_private.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create function content_private.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from content_private.admins where user_id = (select auth.uid())
  );
$$;
revoke all on function content_private.is_admin() from public;
grant execute on function content_private.is_admin() to authenticated;

create function public.is_content_admin()
returns boolean
language sql stable security invoker
set search_path = ''
as $$ select content_private.is_admin(); $$;
revoke all on function public.is_content_admin() from public, anon;
grant execute on function public.is_content_admin() to authenticated;

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (length(slug) <= 100 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (length(btrim(title)) between 1 and 200),
  excerpt text not null check (length(btrim(excerpt)) between 1 and 600),
  body text not null default '' check (length(body) <= 100000),
  category text not null check (category in ('product', 'engineering', 'design', 'ai', 'growth')),
  image_path text not null check (image_path ~ '^(/images|media)/[a-zA-Z0-9/_-]+\.[a-zA-Z0-9]+$'),
  publish_date date not null default current_date,
  read_minutes integer not null default 5 check (read_minutes between 1 and 180),
  is_featured boolean not null default false,
  is_published boolean not null default false
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (length(slug) <= 100 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (length(btrim(name)) between 1 and 150),
  description text not null check (length(btrim(description)) between 1 and 2000),
  url text not null check (length(url) <= 2048 and url ~ '^https?://[^[:space:]]+$'),
  image_path text not null check (image_path ~ '^(/images|media)/[a-zA-Z0-9/_-]+\.[a-zA-Z0-9]+$'),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_published boolean not null default false
);

create table public.staff (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (length(slug) <= 100 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (length(btrim(name)) between 1 and 150),
  role text not null check (length(btrim(role)) between 1 and 120),
  bio text not null check (length(btrim(bio)) between 1 and 3000),
  image_path text not null check (image_path ~ '^(/images|media)/[a-zA-Z0-9/_-]+\.[a-zA-Z0-9]+$'),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_published boolean not null default false
);

create table public.contact_links (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (length(slug) <= 100 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  label text not null check (length(btrim(label)) between 1 and 80),
  kind text not null check (kind in ('email', 'linkedin', 'whatsapp', 'telegram', 'website', 'phone')),
  url text not null check (length(url) <= 2048 and url ~ '^(https?://|mailto:|tel:)[^[:space:]]+$'),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_published boolean not null default false
);

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  contact_eyebrow text not null check (length(btrim(contact_eyebrow)) between 1 and 80),
  contact_heading text not null check (length(btrim(contact_heading)) between 1 and 120),
  contact_heading_accent text not null check (length(btrim(contact_heading_accent)) between 1 and 120),
  contact_intro text not null check (length(btrim(contact_intro)) between 1 and 600),
  footer_tagline text not null check (length(btrim(footer_tagline)) between 1 and 160)
);

do $$
declare
  table_name text;
begin
  foreach table_name in array array['articles', 'projects', 'staff', 'contact_links', 'site_settings']
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on table public.%I from public, anon, authenticated', table_name);
    execute format('grant select on table public.%I to anon, authenticated', table_name);
    if table_name = 'site_settings' then
      execute format('grant insert, update on table public.%I to authenticated', table_name);
      execute format('create policy read_public_content on public.%I for select to anon, authenticated using (true)', table_name);
    else
      execute format('grant insert, update, delete on table public.%I to authenticated', table_name);
      execute format('create policy read_public_content on public.%I for select to anon, authenticated using (is_published)', table_name);
    end if;
    execute format(
      'create policy manage_content on public.%I for all to authenticated using ((select content_private.is_admin())) with check ((select content_private.is_admin()))',
      table_name
    );
  end loop;
end;
$$;
