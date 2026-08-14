-- ============================================================
-- LS HOME — coloris disponibles et capacite exprimee en plage
--
-- A executer apres 0003_optional_prices.sql.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Coloris
-- ------------------------------------------------------------
alter table public.properties
  add column if not exists coloris text not null default '';

comment on column public.properties.coloris is
  'Coloris disponibles, texte libre. Ex. « Beige, Vert, Bleu ». Vide = non renseigne.';

-- ------------------------------------------------------------
-- 2. Capacite : une borne unique devient une plage
-- ------------------------------------------------------------
-- L'ancienne colonne `capacity` devient la borne haute ; la borne basse est
-- initialisee a la meme valeur, ce qui preserve l'affichage existant
-- (les deux bornes egales s'affichent comme une valeur unique).
alter table public.properties
  rename column capacity to capacity_max;

alter table public.properties
  add column if not exists capacity_min integer;

update public.properties
  set capacity_min = capacity_max
  where capacity_min is null;

alter table public.properties
  alter column capacity_min set not null,
  alter column capacity_min set default 0;

alter table public.properties drop constraint if exists properties_capacity_check;
alter table public.properties drop constraint if exists properties_capacity_max_check;
alter table public.properties drop constraint if exists properties_capacity_range_check;

alter table public.properties
  add constraint properties_capacity_min_check check (capacity_min >= 0),
  add constraint properties_capacity_max_check check (capacity_max >= 0),
  add constraint properties_capacity_range_check check (capacity_min <= capacity_max);

comment on column public.properties.capacity_min is
  'Borne basse de la capacite de stockage, en kg.';
comment on column public.properties.capacity_max is
  'Borne haute de la capacite de stockage, en kg. Egale a capacity_min si fixe.';
