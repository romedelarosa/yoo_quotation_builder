create table if not exists public.service_templates (
  id text primary key,
  name text not null,
  category text not null,
  regular_price integer not null default 0 check (regular_price >= 0),
  package_type text not null,
  inclusions text[] not null default '{}',
  conditional_items text[] not null default '{}',
  standard_notes text[] not null default '{}',
  disclaimer text not null default '',
  payment_method_notes text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_templates_active_sort_idx
  on public.service_templates (is_active, sort_order, name);

create or replace function public.set_service_templates_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists service_templates_updated_at on public.service_templates;

create trigger service_templates_updated_at
before update on public.service_templates
for each row
execute function public.set_service_templates_updated_at();

alter table public.service_templates enable row level security;
