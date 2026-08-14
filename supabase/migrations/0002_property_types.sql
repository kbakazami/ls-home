-- ============================================================
-- LS HOME — categories de biens gerables depuis l'administration
--
-- Remplace la contrainte `check` figee sur properties.type par une
-- table de reference. A executer apres 0001_init.sql.
-- ============================================================

create table if not exists public.property_types (
  id         text primary key,
  label      text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.property_types is
  'Categories de biens, gerables depuis /admin/categories.';
comment on column public.property_types.id is
  'Slug stable, ex. chambre-hotel. Ne change pas au renommage.';
comment on column public.property_types.label is
  'Libelle affiche. Reference par properties.type (mise a jour en cascade).';

-- Reprise de la liste qui etait codee en dur dans la contrainte `check`,
-- plus tout type deja present en base qui n'y figurerait pas.
insert into public.property_types (id, label, sort_order) values
  ('villa',            'Villa',            10),
  ('appartement',      'Appartement',      20),
  ('penthouse',        'Penthouse',        30),
  ('maison',           'Maison',           40),
  ('local-commercial', 'Local commercial', 50),
  ('entrepot',         'Entrepôt',         60),
  ('hotel',            'Hotel',            70),
  ('garage',           'Garage',           80),
  ('autre',            'Autre',            90)
on conflict (id) do nothing;

insert into public.property_types (id, label, sort_order)
select
  lower(regexp_replace(trim(p.type), '[^a-zA-Z0-9]+', '-', 'g')),
  trim(p.type),
  100
from (select distinct type from public.properties) p
on conflict do nothing;

-- Bascule de la contrainte `check` vers une cle etrangere.
alter table public.properties
  drop constraint if exists properties_type_check;

alter table public.properties
  drop constraint if exists properties_type_fkey;

alter table public.properties
  add constraint properties_type_fkey
  foreign key (type) references public.property_types (label)
  on update cascade    -- renommer une categorie renomme le type de ses biens
  on delete restrict;  -- interdit de supprimer une categorie encore utilisee

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.property_types enable row level security;

drop policy if exists "Categories visibles par tous" on public.property_types;
create policy "Categories visibles par tous"
  on public.property_types for select
  to anon, authenticated
  using (true);

drop policy if exists "Agents : creation de categorie" on public.property_types;
create policy "Agents : creation de categorie"
  on public.property_types for insert
  to authenticated
  with check (true);

drop policy if exists "Agents : modification de categorie" on public.property_types;
create policy "Agents : modification de categorie"
  on public.property_types for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Agents : suppression de categorie" on public.property_types;
create policy "Agents : suppression de categorie"
  on public.property_types for delete
  to authenticated
  using (true);
