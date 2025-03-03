-- Create subscription tier enum
create type subscription_tier as enum ('free', 'creator', 'pro', 'enterprise');

-- Add subscription tier to users table
alter table public.users 
add column subscription_tier subscription_tier not null default 'free';

-- Create index for faster tier lookups
create index idx_users_tier on public.users(subscription_tier);

-- Update RLS policies for tier-based access

-- Analytics policies
create policy "Free tier analytics access"
  on public.analytics for select
  using (
    auth.uid() = user_id 
    and subscription_tier = 'free'
    and report_type = 'basic'
  );

create policy "Creator tier analytics access"
  on public.analytics for select
  using (
    auth.uid() = user_id 
    and subscription_tier in ('creator', 'pro', 'enterprise')
    and report_type in ('basic', 'enhanced')
  );

create policy "Pro tier analytics access"
  on public.analytics for select
  using (
    auth.uid() = user_id 
    and subscription_tier in ('pro', 'enterprise')
    and report_type in ('basic', 'enhanced', 'advanced')
  );

create policy "Enterprise tier analytics access"
  on public.analytics for select
  using (
    auth.uid() = user_id 
    and subscription_tier = 'enterprise'
  );

-- Product management policies
create policy "Free tier product limits"
  on public.products for all
  using (
    auth.uid() = vendor_id
    and (
      select count(*) from public.products 
      where vendor_id = auth.uid()
    ) <= 10
  );

create policy "Creator tier product limits"
  on public.products for all
  using (
    auth.uid() = vendor_id
    and subscription_tier in ('creator', 'pro', 'enterprise')
    and (
      select count(*) from public.products 
      where vendor_id = auth.uid()
    ) <= 100
  );

create policy "Pro tier product limits"
  on public.products for all
  using (
    auth.uid() = vendor_id
    and subscription_tier in ('pro', 'enterprise')
    and (
      select count(*) from public.products 
      where vendor_id = auth.uid()
    ) <= 1000
  );

create policy "Enterprise tier unlimited products"
  on public.products for all
  using (
    auth.uid() = vendor_id
    and subscription_tier = 'enterprise'
  );