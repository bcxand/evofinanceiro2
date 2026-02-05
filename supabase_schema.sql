-- ⚠️ WARNING: THIS WILL WIPE ALL DASHBOARD DATA TO START FRESH ⚠️
-- Use DROP TABLE IF EXISTS to avoid errors if tables don't exist yet
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.recurring_bills CASCADE;
DROP TABLE IF EXISTS public.debts CASCADE;
DROP TABLE IF EXISTS public.goals CASCADE;
DROP TABLE IF EXISTS public.credit_cards CASCADE;
DROP TABLE IF EXISTS public.family_members CASCADE;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. FAMILY MEMBERS TABLE
create table if not exists public.family_members (
  "id" uuid primary key default uuid_generate_v4(),
  "user_id" uuid references auth.users(id) default auth.uid(),
  "name" text not null,
  "role" text not null,
  "color" text,
  "avatarUrl" text,
  "salary" numeric default 0,
  "payDay" integer default 5,
  "email" text,
  "phone" text,
  "accessCode" text,
  "isAccessActive" boolean default false,
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- 2. CREDIT CARDS TABLE
create table if not exists public.credit_cards (
  "id" uuid primary key default uuid_generate_v4(),
  "user_id" uuid references auth.users(id) default auth.uid(),
  "name" text not null,
  "limit" numeric default 0,
  "used" numeric default 0,
  "dueDate" text not null,
  "lastDigits" text,
  "ownerId" uuid references public.family_members("id") on delete set null,
  "color" text,
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- 3. TRANSACTIONS TABLE
create table if not exists public.transactions (
  "id" uuid primary key default uuid_generate_v4(),
  "user_id" uuid references auth.users(id) default auth.uid(),
  "description" text not null,
  "amount" numeric not null,
  "type" text not null check (type in ('EXPENSE', 'INCOME', 'TRANSFER')),
  "expenseCategory" text check ("expenseCategory" in ('FIXED', 'VARIABLE')),
  "category" text not null,
  "date" date not null,
  "paymentMethod" text,
  "creditCardId" uuid references public.credit_cards("id") on delete set null,
  "familyMemberId" uuid references public.family_members("id") on delete set null,
  "details" text,
  "isRecurring" boolean default false,
  "relatedEntityId" text,
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- 4. RECURRING BILLS TABLE
create table if not exists public.recurring_bills (
  "id" uuid primary key default uuid_generate_v4(),
  "user_id" uuid references auth.users(id) default auth.uid(),
  "description" text not null,
  "amount" numeric not null,
  "category" text,
  "dueDay" integer not null,
  "isAutoPaid" boolean default false,
  "familyMemberId" uuid references public.family_members("id") on delete set null,
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- 5. DEBTS TABLE
create table if not exists public.debts (
  "id" uuid primary key default uuid_generate_v4(),
  "user_id" uuid references auth.users(id) default auth.uid(),
  "name" text not null,
  "totalValue" numeric not null,
  "currentValue" numeric not null,
  "interestRate" numeric default 0,
  "dueDate" date,
  "creditor" text,
  "status" text default 'active',
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- 6. GOALS TABLE
create table if not exists public.goals (
  "id" uuid primary key default uuid_generate_v4(),
  "user_id" uuid references auth.users(id) default auth.uid(),
  "name" text not null,
  "targetAmount" numeric not null,
  "currentAmount" numeric default 0,
  "deadline" date,
  "color" text,
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- STORAGE BUCKET SETUP (For Avatars)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- ROW LEVEL SECURITY (RLS) SETUP
alter table public.family_members enable row level security;
alter table public.credit_cards enable row level security;
alter table public.transactions enable row level security;
alter table public.recurring_bills enable row level security;
alter table public.debts enable row level security;
alter table public.goals enable row level security;

-- DROP OLD POLICIES
drop policy if exists "Users can view their own family members" on public.family_members;
drop policy if exists "Users can insert their own family members" on public.family_members;
drop policy if exists "Users can update their own family members" on public.family_members;
drop policy if exists "Users can delete their own family members" on public.family_members;

drop policy if exists "Users can view their own cards" on public.credit_cards;
drop policy if exists "Users can insert their own cards" on public.credit_cards;
drop policy if exists "Users can update their own cards" on public.credit_cards;
drop policy if exists "Users can delete their own cards" on public.credit_cards;

drop policy if exists "Users can view their own transactions" on public.transactions;
drop policy if exists "Users can insert their own transactions" on public.transactions;
drop policy if exists "Users can update their own transactions" on public.transactions;
drop policy if exists "Users can delete their own transactions" on public.transactions;

drop policy if exists "Users can view their own bills" on public.recurring_bills;
drop policy if exists "Users can insert their own bills" on public.recurring_bills;
drop policy if exists "Users can update their own bills" on public.recurring_bills;
drop policy if exists "Users can delete their own bills" on public.recurring_bills;

drop policy if exists "Users can view their own debts" on public.debts;
drop policy if exists "Users can insert their own debts" on public.debts;
drop policy if exists "Users can update their own debts" on public.debts;
drop policy if exists "Users can delete their own debts" on public.debts;

drop policy if exists "Users can view their own goals" on public.goals;
drop policy if exists "Users can insert their own goals" on public.goals;
drop policy if exists "Users can update their own goals" on public.goals;
drop policy if exists "Users can delete their own goals" on public.goals;

drop policy if exists "Avatar Public Access" on storage.objects;
drop policy if exists "Avatar Upload Access" on storage.objects;

-- RE-CREATE TABLE POLICIES
create policy "Users can view their own family members" on public.family_members for select using (auth.uid() = user_id);
create policy "Users can insert their own family members" on public.family_members for insert with check (auth.uid() = user_id);
create policy "Users can update their own family members" on public.family_members for update using (auth.uid() = user_id);
create policy "Users can delete their own family members" on public.family_members for delete using (auth.uid() = user_id);

create policy "Users can view their own cards" on public.credit_cards for select using (auth.uid() = user_id);
create policy "Users can insert their own cards" on public.credit_cards for insert with check (auth.uid() = user_id);
create policy "Users can update their own cards" on public.credit_cards for update using (auth.uid() = user_id);
create policy "Users can delete their own cards" on public.credit_cards for delete using (auth.uid() = user_id);

create policy "Users can view their own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "Users can insert their own transactions" on public.transactions for insert with check (auth.uid() = user_id);
create policy "Users can update their own transactions" on public.transactions for update using (auth.uid() = user_id);
create policy "Users can delete their own transactions" on public.transactions for delete using (auth.uid() = user_id);

create policy "Users can view their own bills" on public.recurring_bills for select using (auth.uid() = user_id);
create policy "Users can insert their own bills" on public.recurring_bills for insert with check (auth.uid() = user_id);
create policy "Users can update their own bills" on public.recurring_bills for update using (auth.uid() = user_id);
create policy "Users can delete their own bills" on public.recurring_bills for delete using (auth.uid() = user_id);

create policy "Users can view their own debts" on public.debts for select using (auth.uid() = user_id);
create policy "Users can insert their own debts" on public.debts for insert with check (auth.uid() = user_id);
create policy "Users can update their own debts" on public.debts for update using (auth.uid() = user_id);
create policy "Users can delete their own debts" on public.debts for delete using (auth.uid() = user_id);

create policy "Users can view their own goals" on public.goals for select using (auth.uid() = user_id);
create policy "Users can insert their own goals" on public.goals for insert with check (auth.uid() = user_id);
create policy "Users can update their own goals" on public.goals for update using (auth.uid() = user_id);
create policy "Users can delete their own goals" on public.goals for delete using (auth.uid() = user_id);

-- STORAGE POLICIES
create policy "Avatar Public Access"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Avatar Upload Access"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- AUTOMATIC USER_ID TRIGGER
create or replace function public.handle_new_row() 
returns trigger as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists set_user_id_family_members on public.family_members;
drop trigger if exists set_user_id_credit_cards on public.credit_cards;
drop trigger if exists set_user_id_transactions on public.transactions;
drop trigger if exists set_user_id_recurring_bills on public.recurring_bills;
drop trigger if exists set_user_id_debts on public.debts;
drop trigger if exists set_user_id_goals on public.goals;

create trigger set_user_id_family_members before insert on public.family_members for each row execute procedure public.handle_new_row();
create trigger set_user_id_credit_cards before insert on public.credit_cards for each row execute procedure public.handle_new_row();
create trigger set_user_id_transactions before insert on public.transactions for each row execute procedure public.handle_new_row();
create trigger set_user_id_recurring_bills before insert on public.recurring_bills for each row execute procedure public.handle_new_row();
create trigger set_user_id_debts before insert on public.debts for each row execute procedure public.handle_new_row();
create trigger set_user_id_goals before insert on public.goals for each row execute procedure public.handle_new_row();

-- 🔥 BYPASS EMAIL VERIFICATION TRIGGER 🔥
create or replace function public.auto_confirm_users() 
returns trigger as $$
begin
  new.email_confirmed_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_confirm on auth.users;

create trigger on_auth_user_confirm
  before insert on auth.users
  for each row execute procedure public.auto_confirm_users();