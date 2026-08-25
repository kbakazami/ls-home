-- ============================================================
-- LS HOME — l'unite d'occupation depend de la categorie.
--
-- Une villa heberge des habitants, un garage des vehicules.
-- La donnee reste la meme (`properties.habitants` : un entier,
-- maximum d'unites accueillies) ; seul le libelle change.
-- Il est porte par la categorie pour rester gerable depuis
-- /admin/categories, sans type code en dur.
--
-- A executer apres 0004_coloris_capacity_range.sql.
-- ============================================================

alter table public.property_types
  add column if not exists occupancy_label text not null default 'habitant';

alter table public.property_types
  drop constraint if exists property_types_occupancy_label_check;

alter table public.property_types
  add constraint property_types_occupancy_label_check
  check (char_length(btrim(occupancy_label)) between 2 and 30);

-- Amorcage : les categories de stationnement existantes accueillent
-- des vehicules. Les autres gardent la valeur par defaut.
update public.property_types
  set occupancy_label = 'vehicule'
  where label ilike '%garage%'
     or label ilike '%parking%';

comment on column public.property_types.occupancy_label is
  'Unite d''occupation au singulier (« habitant », « vehicule »). Le pluriel est ajoute a l''affichage.';
