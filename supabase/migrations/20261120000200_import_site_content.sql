-- Import the website content at the time of the CMS migration.
-- Article bodies were unavailable in the original site.

insert into public.articles (slug, title, excerpt, category, image_path, publish_date, read_minutes, is_featured, is_published)
values
  ('product-thinking', 'From Ideas to Impact: Our Product Thinking Playbook', 'A practical look at how we turn ideas into focused, high-impact products — from discovery and validation to delivery and iteration.', 'product', '/images/blog/featured.webp', '2025-01-26', 8, true, true),
  ('engineering-scale', 'Engineering for Scale: Lessons from the Real World', 'Key practices and mindset shifts that help us build reliable, scalable systems as we grow.', 'engineering', '/images/blog/engineering.webp', '2025-01-20', 6, false, true),
  ('better-ux', 'A Practical Guide to Better UX', 'Simple, high-impact UX principles we apply to create clear, useful, and delightful experiences.', 'design', '/images/blog/ux.webp', '2025-01-15', 5, false, true),
  ('sustainable-growth', 'Growth: Sustainable Tactics That Work', 'A look at the growth strategies that have helped us attract, engage, and retain the right users.', 'growth', '/images/blog/growth.webp', '2025-01-10', 6, false, true),
  ('ai-agents-production', 'Autonomous AI Agents in Enterprise Workflows', 'Architecting multi-agent LLM systems with verifiable validation layers and human-in-the-loop telemetry.', 'ai', '/images/blog/ai.webp', '2025-01-05', 7, false, true),
  ('resilient-frontend', 'Next.js & Turbopack: Building Ultra-Fast Frontends', 'Tactical patterns for lightning-fast server components, aggressive asset caching, and zero layout shift.', 'engineering', '/images/blog/frontend.webp', '2024-12-28', 4, false, true)
on conflict (slug) do nothing;


insert into public.projects (slug, name, description, url, image_path, sort_order, is_published)
values
  ('mimmo', 'Mimmo Academy', 'Comprehensive platform for Italian language
learning and certification.', 'https://mimmoacademy.com/', '/images/work/mimmo-academy.png', 0, true),
  ('bluerehab', 'Blue Rehab', 'Advanced clinical physical therapy
and patient recovery system.', 'https://bluerehab.ir/', '/images/work/bluerehab-home.png', 1, true),
  ('rahino', 'Rahino', 'Interactive platform for personal development,
guided journeys, and digital learning.', 'https://botaava.ir/', '/images/work/rahino.png', 2, true),
  ('audiolog', 'Audiolog', 'Cloud clinical audiology assessment
and patient management platform.', 'https://app.audiolog.ir/plans', '/images/work/audiolog.png', 3, true)
on conflict (slug) do nothing;


insert into public.staff (slug, name, role, bio, image_path, sort_order, is_published)
values
  ('amin', 'Amin Meraji', 'CEO & Founder', 'Leads the company vision, builds the core system architecture, and drives the technical growth of the company. A dedicated technology strategist and systems architect committed to delivering high-impact digital solutions and scaling robust engineering teams.', '/images/team/amin.png', 0, true),
  ('sepehr', 'Sepehr Maarefi', 'Web Developer', 'Specializes in building robust, performant web applications with intuitive user interfaces and scalable architecture. Focused on writing elegant, maintainable code and leveraging modern web frameworks to craft seamless digital experiences that drive measurable results.', '/images/team/sepehr.png', 1, true),
  ('pm', 'Parsa Taziki', 'Project Manager', 'Orchestrates end-to-end product delivery, streamlines cross-functional workflows, and ensures every milestone meets the highest standards of quality. Dedicated to agile execution, transparent communication, and transforming complex project scopes into on-time, high-impact results.', '/images/team/parsa.png', 2, true),
  ('mobin', 'Mobin Tahmasebi', 'Web Developer', 'Architects modern, high-performance web applications with a relentless focus on clean code, responsive user experiences, and cutting-edge front-end technologies. Dedicated to transforming complex designs into fluid, accessible, and scalable digital interfaces.', '/images/team/mobin.png', 3, true)
on conflict (slug) do nothing;


insert into public.contact_links (slug, kind, label, url, sort_order, is_published)
values
  ('email', 'email', 'Email', 'mailto:hello@amaj.agency', 0, true),
  ('linkedin', 'linkedin', 'LinkedIn', 'https://linkedin.com/company/amaj-agency', 1, true),
  ('whatsapp', 'whatsapp', 'WhatsApp', 'https://wa.me/989120000000', 2, true),
  ('telegram', 'telegram', 'Telegram', 'https://t.me/amajagency', 3, true)
on conflict (slug) do nothing;


insert into public.site_settings (id, contact_eyebrow, contact_heading, contact_heading_accent, contact_intro, footer_tagline)
values
  (1, 'Get in touch', 'Let''s Build Something', 'Great Together', 'Have a project in mind, an idea to explore, or want to collaborate? Connect with us through any channel below.', 'Engineering Purposeful Digital Solutions.')
on conflict (id) do nothing;
