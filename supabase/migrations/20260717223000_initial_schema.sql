create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create type public.order_status as enum ('pending', 'confirmed', 'preparing', 'shipped', 'completed', 'cancelled');
create type public.payment_status as enum ('pending', 'authorized', 'paid', 'failed', 'refunded', 'cancelled');
create type public.lead_kind as enum ('newsletter', 'contact', 'organization', 'event_interest', 'event_registration');

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  sku text not null unique,
  title text not null,
  short_description text not null default '',
  description text not null default '',
  recommendation text not null default '',
  price_cents integer not null check (price_cents >= 0),
  compare_at_price_cents integer check (compare_at_price_cents is null or compare_at_price_cents >= price_cents),
  stock integer not null default 0 check (stock >= 0),
  age_range text not null,
  is_recommended boolean not null default false,
  is_published boolean not null default false,
  images text[] not null default '{}',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  event_type text not null default 'Taller',
  audience text not null,
  modality text not null,
  duration text not null,
  description text not null,
  price_cents integer check (price_cents is null or price_cents >= 0),
  capacity integer check (capacity is null or capacity > 0),
  reserved_count integer not null default 0 check (reserved_count >= 0),
  starts_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (capacity is null or reserved_count <= capacity)
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  category text not null,
  content jsonb not null default '[]',
  cover_image text,
  reading_minutes integer not null default 5 check (reading_minutes > 0),
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shipping_methods (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null default '',
  price_cents integer not null default 0 check (price_cents >= 0),
  is_active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence public.order_number_seq start 1001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('KTVT-' || nextval('public.order_number_seq')::text),
  status public.order_status not null default 'pending',
  payment_status public.payment_status not null default 'pending',
  payment_method text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null default '{}',
  shipping_method_id uuid references public.shipping_methods(id) on delete set null,
  subtotal_cents integer not null check (subtotal_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  sku text not null,
  title text not null,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  total_cents integer generated always as (quantity * unit_price_cents) stored
);

create table public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  provider_reference text,
  status public.payment_status not null default 'pending',
  checkout_url text,
  amount_cents integer not null check (amount_cents >= 0),
  raw_response jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_reference)
);

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  external_id text not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, external_id)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  kind public.lead_kind not null,
  name text,
  email text,
  phone text,
  event_slug text,
  organization text,
  organization_size text,
  interest text,
  message text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);

create index products_public_filters_idx on public.products (is_published, age_range, category_id, price_cents);
create index products_recommended_idx on public.products (is_recommended) where is_published;
create index products_stock_idx on public.products (stock) where is_published;
create index events_public_idx on public.events (is_published, starts_at);
create index articles_public_idx on public.articles (is_published, published_at desc);
create index orders_created_idx on public.orders (created_at desc);
create index orders_email_idx on public.orders (lower(customer_email));
create index leads_kind_created_idx on public.leads (kind, created_at desc);
create index payment_attempts_order_idx on public.payment_attempts (order_id);

create or replace function private.is_admin(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(select 1 from public.admins where admins.user_id = is_admin.user_id);
$$;
revoke all on function private.is_admin(uuid) from public;
grant execute on function private.is_admin(uuid) to authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_touch_updated_at before update on public.products
for each row execute function public.touch_updated_at();
create trigger events_touch_updated_at before update on public.events
for each row execute function public.touch_updated_at();
create trigger articles_touch_updated_at before update on public.articles
for each row execute function public.touch_updated_at();
create trigger shipping_methods_touch_updated_at before update on public.shipping_methods
for each row execute function public.touch_updated_at();
create trigger orders_touch_updated_at before update on public.orders
for each row execute function public.touch_updated_at();
create trigger payment_attempts_touch_updated_at before update on public.payment_attempts
for each row execute function public.touch_updated_at();

create or replace function public.create_guest_order(
  customer jsonb,
  shipping_address jsonb,
  payment_method text,
  shipping_method uuid,
  lines jsonb,
  notes text default null
)
returns public.orders
language plpgsql
set search_path = ''
as $$
declare
  new_order public.orders;
  line jsonb;
  product_row public.products;
  line_quantity integer;
  subtotal integer := 0;
  shipping_price integer := 0;
begin
  if jsonb_array_length(lines) = 0 then
    raise exception 'El pedido no contiene productos';
  end if;

  if shipping_method is not null then
    select price_cents into shipping_price
    from public.shipping_methods
    where id = shipping_method and is_active;
    if not found then raise exception 'Método de envío no disponible'; end if;
  end if;

  for line in select * from jsonb_array_elements(lines)
  loop
    line_quantity := greatest(1, (line->>'quantity')::integer);
    select * into product_row
    from public.products
    where id = (line->>'product_id')::uuid and is_published
    for update;
    if not found then raise exception 'Producto no disponible'; end if;
    if product_row.stock < line_quantity then
      raise exception 'Inventario insuficiente para %', product_row.title;
    end if;
    subtotal := subtotal + (product_row.price_cents * line_quantity);
  end loop;

  insert into public.orders (
    payment_method, customer_name, customer_email, customer_phone,
    shipping_address, shipping_method_id, subtotal_cents, shipping_cents, total_cents, notes
  ) values (
    payment_method,
    trim(customer->>'name'),
    lower(trim(customer->>'email')),
    trim(customer->>'phone'),
    shipping_address,
    shipping_method,
    subtotal,
    coalesce(shipping_price, 0),
    subtotal + coalesce(shipping_price, 0),
    notes
  ) returning * into new_order;

  for line in select * from jsonb_array_elements(lines)
  loop
    line_quantity := greatest(1, (line->>'quantity')::integer);
    select * into product_row from public.products where id = (line->>'product_id')::uuid for update;
    insert into public.order_items (order_id, product_id, sku, title, quantity, unit_price_cents)
    values (new_order.id, product_row.id, product_row.sku, product_row.title, line_quantity, product_row.price_cents);
    update public.products set stock = stock - line_quantity where id = product_row.id;
  end loop;

  return new_order;
end;
$$;
revoke all on function public.create_guest_order(jsonb, jsonb, text, uuid, jsonb, text) from public, anon, authenticated;
grant execute on function public.create_guest_order(jsonb, jsonb, text, uuid, jsonb, text) to service_role;

create or replace function public.cancel_order_and_release_inventory(order_id uuid)
returns public.orders
language plpgsql
set search_path = ''
as $$
declare
  current_order public.orders;
  item public.order_items;
begin
  select * into current_order from public.orders where id = order_id for update;
  if not found then raise exception 'Pedido no encontrado'; end if;
  if current_order.payment_status = 'paid' then raise exception 'No se puede cancelar un pedido pagado'; end if;
  if current_order.status <> 'cancelled' then
    for item in select * from public.order_items where order_items.order_id = cancel_order_and_release_inventory.order_id
    loop
      update public.products set stock = stock + item.quantity where id = item.product_id;
    end loop;
    update public.orders
      set status = 'cancelled', payment_status = 'cancelled'
      where id = cancel_order_and_release_inventory.order_id
      returning * into current_order;
  end if;
  return current_order;
end;
$$;
revoke all on function public.cancel_order_and_release_inventory(uuid) from public, anon, authenticated;
grant execute on function public.cancel_order_and_release_inventory(uuid) to service_role;

alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.events enable row level security;
alter table public.articles enable row level security;
alter table public.shipping_methods enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_attempts enable row level security;
alter table public.webhook_events enable row level security;
alter table public.leads enable row level security;
alter table public.site_settings enable row level security;

create policy "Public reads categories" on public.categories for select to anon, authenticated using (true);
create policy "Public reads published products" on public.products for select to anon, authenticated using (is_published);
create policy "Public reads published events" on public.events for select to anon, authenticated using (is_published);
create policy "Public reads published articles" on public.articles for select to anon, authenticated using (is_published);
create policy "Public reads active shipping" on public.shipping_methods for select to anon, authenticated using (is_active);
create policy "Public reads public settings" on public.site_settings for select to anon, authenticated using (is_public);
create policy "Admins read own role" on public.admins for select to authenticated using (user_id = (select auth.uid()));

create policy "Admins manage categories" on public.categories for all to authenticated
using ((select private.is_admin((select auth.uid()))))
with check ((select private.is_admin((select auth.uid()))));
create policy "Admins manage products" on public.products for all to authenticated
using ((select private.is_admin((select auth.uid()))))
with check ((select private.is_admin((select auth.uid()))));
create policy "Admins manage events" on public.events for all to authenticated
using ((select private.is_admin((select auth.uid()))))
with check ((select private.is_admin((select auth.uid()))));
create policy "Admins manage articles" on public.articles for all to authenticated
using ((select private.is_admin((select auth.uid()))))
with check ((select private.is_admin((select auth.uid()))));
create policy "Admins manage shipping" on public.shipping_methods for all to authenticated
using ((select private.is_admin((select auth.uid()))))
with check ((select private.is_admin((select auth.uid()))));
create policy "Admins manage orders" on public.orders for all to authenticated
using ((select private.is_admin((select auth.uid()))))
with check ((select private.is_admin((select auth.uid()))));
create policy "Admins manage order items" on public.order_items for all to authenticated
using ((select private.is_admin((select auth.uid()))))
with check ((select private.is_admin((select auth.uid()))));
create policy "Admins manage payment attempts" on public.payment_attempts for all to authenticated
using ((select private.is_admin((select auth.uid()))))
with check ((select private.is_admin((select auth.uid()))));
create policy "Admins read leads" on public.leads for select to authenticated
using ((select private.is_admin((select auth.uid()))));
create policy "Admins manage settings" on public.site_settings for all to authenticated
using ((select private.is_admin((select auth.uid()))))
with check ((select private.is_admin((select auth.uid()))));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalog', 'catalog', true, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public reads catalog images" on storage.objects for select to anon, authenticated
using (bucket_id = 'catalog');
create policy "Admins insert catalog images" on storage.objects for insert to authenticated
with check (bucket_id = 'catalog' and (select private.is_admin((select auth.uid()))));
create policy "Admins update catalog images" on storage.objects for update to authenticated
using (bucket_id = 'catalog' and (select private.is_admin((select auth.uid()))))
with check (bucket_id = 'catalog' and (select private.is_admin((select auth.uid()))));
create policy "Admins delete catalog images" on storage.objects for delete to authenticated
using (bucket_id = 'catalog' and (select private.is_admin((select auth.uid()))));

insert into public.shipping_methods (code, name, description, price_cents, is_active, sort_order)
values
  ('pending-logistics', 'Entrega por confirmar', 'Te contactaremos para confirmar cobertura, fecha y costo de entrega.', 0, true, 1),
  ('local', 'Entrega local', 'Opción preparada para activarse cuando se defina la cobertura.', 0, false, 2),
  ('national', 'Envío nacional', 'Opción preparada para activarse cuando se definan las tarifas.', 0, false, 3)
on conflict (code) do nothing;

insert into public.site_settings (key, value, is_public)
values
  ('shipping_notice', '"La logística final está en definición. Confirmaremos cobertura, fecha y costo antes de preparar tu pedido."'::jsonb, true),
  ('seasonal_campaign', '{"eyebrow":"Temporada · Regreso a clases","enabled":true}'::jsonb, true)
on conflict (key) do nothing;
