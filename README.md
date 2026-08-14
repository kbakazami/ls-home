# LS HOME

Site vitrine de l'agence immobiliere fictive **LS HOME** (univers GTA RP, Los Santos),
avec une administration integree pour gerer le catalogue de biens.

- **Framework** : Next.js 16 (App Router) + TypeScript strict
- **Styles** : Tailwind CSS v4
- **Donnees** : Supabase (Postgres + Auth + Storage)
- **Deploiement** : Vercel

---

## Installation

```bash
npm install
```

Copier `.env.example` en `.env.local` et renseigner les valeurs (voir ci-dessous), puis :

```bash
npm run dev
```

---

## Configuration Supabase

1. Creer un projet sur [supabase.com](https://supabase.com).
2. Ouvrir **SQL Editor** et executer les migrations de `supabase/migrations/` **dans l'ordre** :
   - `0001_init.sql` — tables `properties` et `profiles`, politiques RLS, bucket `property-images`
   - `0002_property_types.sql` — table `property_types`, categories gerables depuis l'administration
   - `0003_optional_prices.sql` — prix optionnels : un bien peut n'etre qu'a la location ou qu'a la vente
3. Dans **Settings → API**, recuperer :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - cle `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - cle `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (secrete, serveur uniquement)
4. Creer le premier administrateur dans **Authentication → Users → Add user**
   (cocher *Auto Confirm User*). Puis dans **SQL Editor** :

   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'votre@email.com');
   ```

   Cet administrateur pourra ensuite creer les autres comptes depuis `/admin/agents`.

5. Se connecter sur `/login` et creer les biens depuis `/admin/biens`.

---

## Variables d'environnement

| Variable | Role |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cle publique, bridee par la RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Cle privilegiee — gestion des comptes et scripts. **Jamais cote client** |

Ces trois premieres variables doivent aussi etre declarees dans Vercel
(*Settings → Environment Variables*).

---

## Administration

Accessible sur `/admin`, protegee par compte (`proxy.ts` redirige vers `/login`).

| Page | Role |
|---|---|
| `/admin` | Tableau de bord : nombre de biens publies, brouillons, en vedette |
| `/admin/biens` | Liste, recherche, filtres, bascules publie / en vedette |
| `/admin/biens/nouveau` | Creation d'un bien |
| `/admin/biens/[id]` | Edition et suppression |
| `/admin/categories` | Types de biens : ajout, renommage, ordre, suppression |
| `/admin/agents` | Gestion des comptes — reserve aux administrateurs |

**Ajouter un bien** : `/admin/biens/nouveau` → remplir le formulaire, glisser-deposer
les photos (envoyees sur Supabase Storage), cocher *Publier sur le site*, enregistrer.
Le bien apparait immediatement sur `/properties`, sans redeploiement.

Un bien laisse en brouillon reste invisible du public — pratique pour preparer une
annonce, ou pour retirer un bien vendu sans le supprimer.

**Location seule ou vente seule** : dans le formulaire, decocher *Disponible a l'achat*
(ou *a la location*) desactive le champ de prix correspondant. Le site affiche alors
« Non disponible » a la place du montant. Un bien doit rester disponible par au moins
un des deux canaux — la base le verifie.

**Categories** : `/admin/categories` gere la liste des types proposes dans le formulaire.
Renommer une categorie met a jour tous les biens qui l'utilisent (cle etrangere en
`on update cascade`) ; une categorie encore rattachee a un bien ne peut pas etre
supprimee (`on delete restrict`). Le catalogue public derive ses filtres des biens
publies : une categorie sans bien publie n'y apparait pas.

**Roles** : un `agent` gere les biens ; un `admin` gere en plus les comptes.

---

## Commandes

```bash
npm run dev       # Serveur de developpement
npm run build     # Build de production
npm run lint      # ESLint
```

La source de verite est Supabase, alimentee par l'administration. Il n'y a plus aucun
script d'import : l'ancienne synchro Google Sheet et le script de bascule initiale ont
ete retires une fois la migration faite.

---

## Structure

```
app/
  (public)/        Site vitrine (accueil, catalogue, contact) — Header + Footer
  admin/           Administration + server actions
  login/           Connexion agents
components/
  admin/           PropertyForm, ImageUploader, PropertyRow, NewAgentForm...
  layout/          Header, Footer
  sections/        Sections de pages
  ui/              PropertyCard, PropertyModal, FadeInOnScroll
lib/
  supabase/        Clients navigateur / serveur / service_role
  properties.ts    Lecture des biens
  property-types.ts Lecture des categories
  auth.ts          requireAgent / requireAdmin
  format.ts        formatPrice, slugify
supabase/migrations/  Schema SQL
types/property.ts  Schemas Zod + types
proxy.ts           Rafraichissement de session et protection de /admin
```
