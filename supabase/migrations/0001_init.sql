-- ============================================================
-- LS HOME — schéma initial
-- À exécuter dans l'éditeur SQL du projet Supabase.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Profils agents (miroir de auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  role       text not null default 'agent' check (role in ('agent', 'admin')),
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Agents LS HOME autorisés à gérer les biens.';

-- Création automatique du profil à l'inscription d'un utilisateur.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'agent')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 2. Biens
-- ------------------------------------------------------------
create table if not exists public.properties (
  id          text primary key,
  title       text not null,
  type        text not null check (type in (
                'Villa', 'Appartement', 'Penthouse', 'Maison',
                'Local commercial', 'Entrepôt', 'Hotel', 'Garage', 'Autre'
              )),
  price_rent  integer not null default 0 check (price_rent >= 0),
  price_buy   integer not null default 0 check (price_buy  >= 0),
  habitants   integer not null default 0 check (habitants  >= 0),
  capacity    integer not null default 0 check (capacity   >= 0),
  featured    boolean not null default false,
  published   boolean not null default false,
  description text    not null default '',
  images      text[]  not null default '{}',
  sort_order  integer not null default 0,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on column public.properties.id is 'Slug unique, ex. villa-vinewood-01.';
comment on column public.properties.images is 'URLs des photos ; la première est la photo principale.';
comment on column public.properties.published is 'false = brouillon, invisible sur le site public.';

create index if not exists properties_published_idx on public.properties (published);
create index if not exists properties_featured_idx  on public.properties (featured) where published;
create index if not exists properties_order_idx     on public.properties (sort_order, created_at desc);

-- updated_at automatique
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_touch_updated_at on public.properties;
create trigger properties_touch_updated_at
  before update on public.properties
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- 3. Row Level Security
-- ------------------------------------------------------------
alter table public.properties enable row level security;
alter table public.profiles   enable row level security;

-- Helper : l'utilisateur courant est-il administrateur ?
-- security definer pour éviter la récursion RLS sur profiles.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- --- properties -------------------------------------------------
-- Le public (clé anon, non authentifié) ne voit que les biens publiés.
drop policy if exists "Biens publiés visibles par tous" on public.properties;
create policy "Biens publiés visibles par tous"
  on public.properties for select
  to anon
  using (published = true);

-- Un agent connecté voit tout, y compris les brouillons.
drop policy if exists "Agents : lecture complète" on public.properties;
create policy "Agents : lecture complète"
  on public.properties for select
  to authenticated
  using (true);

drop policy if exists "Agents : création" on public.properties;
create policy "Agents : création"
  on public.properties for insert
  to authenticated
  with check (true);

drop policy if exists "Agents : modification" on public.properties;
create policy "Agents : modification"
  on public.properties for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Agents : suppression" on public.properties;
create policy "Agents : suppression"
  on public.properties for delete
  to authenticated
  using (true);

-- --- profiles ---------------------------------------------------
drop policy if exists "Agents : lecture des profils" on public.profiles;
create policy "Agents : lecture des profils"
  on public.profiles for select
  to authenticated
  using (true);

-- Seuls les administrateurs modifient les profils (dont les rôles).
-- Un agent ne peut donc pas s'auto-promouvoir.
drop policy if exists "Admin : gestion des profils" on public.profiles;
create policy "Admin : gestion des profils"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- 4. Stockage des photos
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists "Photos : lecture publique" on storage.objects;
create policy "Photos : lecture publique"
  on storage.objects for select
  to public
  using (bucket_id = 'property-images');

drop policy if exists "Photos : envoi par les agents" on storage.objects;
create policy "Photos : envoi par les agents"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images');

drop policy if exists "Photos : remplacement par les agents" on storage.objects;
create policy "Photos : remplacement par les agents"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'property-images');

drop policy if exists "Photos : suppression par les agents" on storage.objects;
create policy "Photos : suppression par les agents"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-images');
