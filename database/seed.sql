-- EventSphere production schema. Run this once in the Supabase SQL editor.
-- Authentication is owned by Supabase Auth; do not insert passwords or demo users here.
-- After creating your first Auth user, promote it once in the SQL editor:
-- update public.profiles set role = 'admin' where email = 'your-admin@example.com';

create extension if not exists "uuid-ossp";

create type public.app_role as enum ('admin', 'manager', 'staff', 'customer');
create type public.booking_status as enum ('pending', 'approved', 'in_planning', 'confirmed', 'completed', 'cancelled', 'rejected');
create type public.task_status as enum ('todo', 'in_progress', 'blocked', 'completed');
create type public.task_priority as enum ('low', 'medium', 'high', 'urgent');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  first_name text not null,
  last_name text not null,
  role public.app_role not null default 'customer',
  phone text,
  activation_code_hash text,
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.venues (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  location text not null,
  city text,
  capacity integer not null check (capacity > 0),
  price_per_head numeric(12,2) not null check (price_per_head >= 0),
  description text,
  amenities jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  rating numeric(3,2) not null default 0 check (rating between 0 and 5),
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references public.profiles(id),
  venue_id uuid not null references public.venues(id),
  manager_id uuid references public.profiles(id),
  event_date date not null,
  guest_count integer not null check (guest_count > 0),
  decoration_theme text,
  catering_option text,
  entertainment_service text,
  special_requests text,
  total_price numeric(12,2) not null check (total_price >= 0),
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  assigned_to uuid references public.profiles(id),
  created_by uuid not null references public.profiles(id),
  title text not null,
  description text,
  phase text not null default 'planning',
  status public.task_status not null default 'todo',
  priority public.task_priority not null default 'medium',
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_role(required_role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = required_role)
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.venues enable row level security;
alter table public.bookings enable row level security;
alter table public.tasks enable row level security;

create policy "profiles readable by signed in users" on public.profiles for select to authenticated using (true);
create policy "users update own non-role profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));
create policy "admins manage profiles" on public.profiles for all to authenticated using (public.is_role('admin')) with check (public.is_role('admin'));
create policy "venues are public" on public.venues for select using (true);
create policy "admins manage venues" on public.venues for all to authenticated using (public.is_role('admin')) with check (public.is_role('admin'));
create policy "customers create their bookings" on public.bookings for insert to authenticated with check (customer_id = auth.uid());
create policy "customers see own bookings" on public.bookings for select to authenticated using (customer_id = auth.uid() or manager_id = auth.uid() or public.is_role('admin'));
create policy "admins update bookings" on public.bookings for update to authenticated using (public.is_role('admin')) with check (public.is_role('admin'));
create policy "managers update assigned bookings" on public.bookings for update to authenticated using (manager_id = auth.uid()) with check (manager_id = auth.uid());
create policy "staff see assigned task bookings" on public.bookings for select to authenticated using (exists (select 1 from public.tasks t where t.booking_id = id and t.assigned_to = auth.uid()));
create policy "task visibility follows assignment" on public.tasks for select to authenticated using (assigned_to = auth.uid() or created_by = auth.uid() or public.is_role('admin'));
create policy "managers create tasks for their events" on public.tasks for insert to authenticated with check (created_by = auth.uid() and exists (select 1 from public.bookings b where b.id = booking_id and b.manager_id = auth.uid()));
create policy "managers update their event tasks" on public.tasks for update to authenticated using (exists (select 1 from public.bookings b where b.id = booking_id and b.manager_id = auth.uid())) with check (exists (select 1 from public.bookings b where b.id = booking_id and b.manager_id = auth.uid()));
create policy "staff update own task status" on public.tasks for update to authenticated using (assigned_to = auth.uid()) with check (assigned_to = auth.uid());
create policy "admins manage tasks" on public.tasks for all to authenticated using (public.is_role('admin')) with check (public.is_role('admin'));

create index bookings_customer_id_idx on public.bookings(customer_id);
create index bookings_manager_id_idx on public.bookings(manager_id);
create index tasks_booking_id_idx on public.tasks(booking_id);
create index tasks_assigned_to_idx on public.tasks(assigned_to);
