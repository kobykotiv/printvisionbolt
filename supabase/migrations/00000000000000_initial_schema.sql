-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Set up realtime
create schema if not exists realtime;

-- Create enum types
create type user_role as enum ('user', 'vendor', 'admin');
create type product_status as enum ('draft', 'published', 'archived');
create type order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
create type payment_status as enum ('pending', 'completed', 'failed');

-- Create users table with Supabase auth integration
create table public.users (
  id uuid references auth.users primary key,
  email text not null unique,
  role user_role not null default 'user',
  stripe_customer_id text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user profiles table
create table public.user_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  display_name text not null,
  bio text,
  profile_image text,
  social_links jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create categories table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  parent_id uuid references public.categories(id),
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create products table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  price decimal(10,2) not null check (price >= 0),
  vendor_id uuid references public.users(id) not null,
  status product_status not null default 'draft',
  metadata jsonb,
  images text[] not null default array[]::text[],
  stock integer not null default 0 check (stock >= 0),
  category_id uuid references public.categories(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user products table
create table public.user_products (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  title text not null,
  description text not null,
  price decimal(10,2) not null check (price >= 0),
  images text[] not null default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  status order_status not null default 'pending',
  total decimal(10,2) not null check (total >= 0),
  shipping_address jsonb not null,
  billing_address jsonb not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscriptions table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  stripe_subscription_id text not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create payments table
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  order_id uuid references public.orders(id),
  amount decimal(10,2) not null check (amount >= 0),
  status payment_status not null default 'pending',
  stripe_payment_intent_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order items table
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) not null,
  product_id uuid references public.products(id) not null,
  quantity integer not null check (quantity > 0),
  price decimal(10,2) not null check (price >= 0),
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create encryption and decryption functions
create or replace function encrypt_api_key(api_key text)
returns bytea as $$
begin
  return pgp_sym_encrypt(api_key, current_setting('app.encryption_key'));
end;
$$ language plpgsql;

create or replace function decrypt_api_key(encrypted_api_key bytea)
returns text as $$
begin
  return pgp_sym_decrypt(encrypted_api_key, current_setting('app.encryption_key'));
end;
$$ language plpgsql;

-- Create print providers table with encrypted api_key
create table public.print_providers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  api_key bytea not null,
  api_endpoint text not null,
  preferences jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create store print providers table
create table public.store_print_providers (
  store_id uuid references public.stores(id) not null,
  provider_id uuid references public.print_providers(id) not null,
  is_default boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (store_id, provider_id)
);

-- Create indexes
create index idx_products_vendor on public.products(vendor_id);
create index idx_products_category on public.products(category_id);
create index idx_products_status on public.products(status);
create index idx_orders_user on public.orders(user_id);
create index idx_orders_status on public.orders(status);
create index idx_order_items_order on public.order_items(order_id);
create index idx_order_items_product on public.order_items(product_id);
create index idx_categories_parent on public.categories(parent_id);
create index idx_categories_slug on public.categories(slug);
create index idx_store_print_providers_store on public.store_print_providers(store_id);
create index idx_store_print_providers_provider on public.store_print_providers(provider_id);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.print_providers enable row level security;
alter table public.store_print_providers enable row level security;

-- Create RLS policies
-- Users table policies
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Products table policies
create policy "Anyone can view published products"
  on public.products for select
  using (status = 'published');

create policy "Vendors can manage own products"
  on public.products for all
  using (auth.uid() = vendor_id);

-- Categories table policies
create policy "Categories are viewable by all"
  on public.categories for select
  using (true);

create policy "Only admins can manage categories"
  on public.categories for all
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );

-- Orders table policies
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can create own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Order items table policies
create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Print providers table policies
create policy "Admins can manage print providers"
  on public.print_providers for all
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );

-- Store print providers table policies
create policy "Store owners can manage their store's print providers"
  on public.store_print_providers for all
  using (
    exists (
      select 1 from public.stores
      where stores.id = store_print_providers.store_id
      and stores.owner_id = auth.uid()
    )
  );

-- Create function for updating timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at timestamps
create trigger handle_users_updated_at
  before update on public.users
  for each row
  execute function public.handle_updated_at();

create trigger handle_products_updated_at
  before update on public.products
  for each row
  execute function public.handle_updated_at();

create trigger handle_categories_updated_at
  before update on public.categories
  for each row
  execute function public.handle_updated_at();

create trigger handle_orders_updated_at
  before update on public.orders
  for each row
  execute function public.handle_updated_at();

create trigger handle_print_providers_updated_at
  before update on public.print_providers
  for each row
  execute function public.handle_updated_at();

create trigger handle_store_print_providers_updated_at
  before update on public.store_print_providers
  for each row
  execute function public.handle_updated_at();

-- Create storage bucket for product images
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true);

-- Set up storage policy for product images
create policy "Anyone can view product images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

create policy "Authenticated users can upload product images"
  on storage.objects for insert
  with check ( 
    bucket_id = 'product-images' 
    and auth.role() = 'authenticated'
  );

-- Set up realtime

-- Enable realtime for relevant tables
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_items;
alter publication supabase_realtime add table public.categories;

-- Create realtime notification function
create or replace function notify_realtime()
returns trigger as $$
begin
  perform pg_notify(
    'supabase_realtime',
    json_build_object(
      'table', TG_TABLE_NAME,
      'type', TG_OP,
      'record', case 
        when TG_OP = 'DELETE' then old
        else new
      end
    )::text
  );
  return null;
end;
$$ language plpgsql;

-- Add realtime triggers
create trigger products_realtime
  after insert or update or delete on public.products
  for each row execute function notify_realtime();

create trigger orders_realtime
  after insert or update or delete on public.orders
  for each row execute function notify_realtime();

create trigger order_items_realtime
  after insert or update or delete on public.order_items
  for each row execute function notify_realtime();

create trigger categories_realtime
  after insert or update or delete on public.categories
  for each row execute function notify_realtime();