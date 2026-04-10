import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — LS HOME',
  description:
    'Contactez LS HOME, votre agence immobiliere de prestige a Los Santos.',
}

const contactCards = [
  {
    label: 'Bureau',
    value: '45 Portola Drive, Rockford Hills',
    detail: 'Rockford Hills, Los Santos',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    label: 'Telephone',
    value: '555-0187',
    detail: 'Tous les jours',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
  },
]


export default function ContactPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Contact
          </p>
          <h1 className="font-display text-3xl font-bold text-dark sm:text-4xl">
            A votre service
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Notre equipe est a votre disposition pour organiser une visite,
            repondre a vos questions ou vous accompagner dans votre projet
            immobilier a Los Santos.
          </p>
        </div>

        {/* Contact cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 sm:max-w-2xl sm:mx-auto">
          {contactCards.map((item) => (
            <div
              key={item.label}
              className="border border-border bg-surface p-8 text-center transition-colors hover:border-primary/40"
            >
              <div className="mx-auto flex size-12 items-center justify-center border border-primary/30 text-primary">
                {item.icon}
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-primary">
                {item.label}
              </p>
              <p className="mt-3 text-lg font-semibold text-dark">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-muted">{item.detail}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 mx-auto max-w-2xl border border-border bg-surface p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Prendre rendez-vous
          </p>
          <p className="mt-4 text-muted">
            Pour toute demande de visite, estimation ou renseignement,
            contactez-nous directement par telephone.
            Un agent vous sera attribue sous 24 heures.
          </p>
          <div className="mt-8">
            <a
              href="tel:555-0187"
              className="inline-block bg-primary px-6 py-3 text-center text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark"
            >
              Appeler le 555-0187
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
