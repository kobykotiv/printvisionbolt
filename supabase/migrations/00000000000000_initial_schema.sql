-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Set up realtime
create schema if not exists realtime;

-- Create enum types
create type user_role as enum ('user', 'vendor', 'admin');
create type product_status as enum ('draft', 'published', 'archived');
create type order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- Create users table with Supabase auth integration
create table public.users (
  id uuid references auth.users primary key,
  email text not null unique,
  role user_role not null default 'user',
  metadata jsonb,
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

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

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