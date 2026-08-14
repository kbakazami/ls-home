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
2. Ouvrir **SQL Editor**, coller le contenu de `supabase/migrations/0001_init.sql` et l'executer.
   Cela cree les tables `properties` et `profiles`, les politiques RLS et le bucket
   de stockage `property-images`.
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

5. Importer les biens existants de `data/properties.json` :

   ```bash
   npm run migrate
   ```

---

## Variables d'environnement

| Variable | Role |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cle publique, bridee par la RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Cle privilegiee — gestion des comptes et scripts. **Jamais cote client** |
| `GOOGLE_SHEET_ID` | Optionnel, uniquement pour l'import de secours `npm run sync` |

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
| `/admin/agents` | Gestion des comptes — reserve aux administrateurs |

**Ajouter un bien** : `/admin/biens/nouveau` → remplir le formulaire, glisser-deposer
les photos (envoyees sur Supabase Storage), cocher *Publier sur le site*, enregistrer.
Le bien apparait immediatement sur `/properties`, sans redeploiement.

Un bien laisse en brouillon reste invisible du public — pratique pour preparer une
annonce, ou pour retirer un bien vendu sans le supprimer.

**Roles** : un `agent` gere les biens ; un `admin` gere en plus les comptes.

---

## Commandes

```bash
npm run dev       # Serveur de developpement
npm run build     # Build de production
npm run lint      # ESLint
npm run migrate   # Import unique data/properties.json → Supabase
npm run sync      # Import de secours Google Sheet → Supabase (voir ci-dessous)
```

### A propos de `npm run sync`

La source de verite est desormais **Supabase**, alimentee par l'administration.
`scripts/sync.ts` est conserve comme filet de secours pour un import en masse depuis
un Google Sheet : il fait un *upsert* sur l'identifiant, ecrase donc les biens
existants portant le meme `id`, et ne supprime jamais rien. A n'utiliser qu'en
connaissance de cause.

`data/properties.json` est gele : c'est la sauvegarde de l'ancien systeme, plus
aucune page ne le lit.

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
  auth.ts          requireAgent / requireAdmin
  format.ts        formatPrice, slugify
scripts/           migrate-to-supabase.ts, sync.ts
supabase/migrations/  Schema SQL
types/property.ts  Schemas Zod + types
proxy.ts           Rafraichissement de session et protection de /admin
```
