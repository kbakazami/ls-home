-- ============================================================
-- LS HOME — un bien peut n'etre disponible qu'a la location,
-- ou qu'a la vente.
--
-- Le prix devient nullable : NULL signifie « non disponible ».
-- A executer apres 0002_property_types.sql.
-- ============================================================

alter table public.properties
  alter column price_rent drop not null,
  alter column price_rent drop default,
  alter column price_buy  drop not null,
  alter column price_buy  drop default;

-- Un prix de 0 n'a jamais eu de sens : c'est ainsi que l'indisponibilite
-- etait exprimee faute de mieux. On la rend explicite.
update public.properties set price_rent = null where price_rent = 0;
update public.properties set price_buy  = null where price_buy  = 0;

-- Les contraintes existantes acceptent deja NULL (une comparaison avec NULL
-- vaut NULL, ce que Postgres traite comme satisfaite), mais on les reecrit
-- pour interdire explicitement un prix affiche a zero.
alter table public.properties drop constraint if exists properties_price_rent_check;
alter table public.properties drop constraint if exists properties_price_buy_check;

alter table public.properties
  add constraint properties_price_rent_check check (price_rent is null or price_rent > 0),
  add constraint properties_price_buy_check  check (price_buy  is null or price_buy  > 0);

-- Un bien doit rester joignable par au moins un des deux canaux.
alter table public.properties drop constraint if exists properties_price_any_check;
alter table public.properties
  add constraint properties_price_any_check
  check (price_rent is not null or price_buy is not null);

comment on column public.properties.price_rent is
  'Loyer mensuel en $. NULL = non disponible a la location.';
comment on column public.properties.price_buy is
  'Prix d''achat en $. NULL = non disponible a l''achat.';
