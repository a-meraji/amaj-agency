alter table public.testimonials
  add constraint testimonials_image_path_prefix_check
  check (image_path like '/images/%' or image_path like 'media/%');
