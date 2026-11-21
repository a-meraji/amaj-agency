create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (length(slug) <= 100 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (length(btrim(name)) between 1 and 150),
  role text not null check (length(btrim(role)) between 1 and 160),
  quote text not null check (length(btrim(quote)) between 1 and 1000),
  image_path text not null check (
    length(image_path) <= 512
    and image_path ~* '^(/images|media)/[a-z0-9_-]+(/[a-z0-9_-]+)*\.(avif|gif|jpe?g|png|webp)$'
  ),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_published boolean not null default false,
  media_path_ref text generated always as (
    case when image_path like 'media/%' then image_path end
  ) stored references public.media_assets (ready_path)
);

create index on public.testimonials (media_path_ref) where media_path_ref is not null;

alter table public.testimonials enable row level security;
revoke all on table public.testimonials from public, anon, authenticated;
grant select on table public.testimonials to anon, authenticated;
grant insert, update, delete on table public.testimonials to authenticated;

create policy public_read_testimonials on public.testimonials
for select to anon, authenticated using (is_published);

create policy admin_manage_testimonials on public.testimonials
for all to authenticated using ((select content_private.is_admin()))
with check ((select content_private.is_admin()));

insert into public.testimonials (slug, name, role, quote, image_path, sort_order, is_published)
values
  ('reza', 'Reza Jalali', 'Founder, Betarik',
   'Amaj brought clarity and structure to our product vision. The results exceeded our expectations.',
   '/images/testimonials/reza.webp', 0, true),
  ('muhammad', 'Muhammad Hashemi', 'Business Owner, Mimmo Academy',
   'Their team quickly understood our needs and delivered a high-quality, scalable solution.',
   '/images/testimonials/muhammad.webp', 1, true),
  ('mojtaba', 'Mojtaba Farei', 'Business Owner, DrWatch',
   'Professional, responsive, and truly committed to delivering real value.',
   '/images/testimonials/mojtaba.webp', 2, true),
  ('sara', 'Sara Kiani', 'Product Manager, Finly',
   'They turned a complex idea into a simple, user-friendly experience.',
   '/images/testimonials/sara.webp', 3, true);
