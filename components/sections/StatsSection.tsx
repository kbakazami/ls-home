const stats = [
  { value: '150+', label: 'Biens vendus' },
  { value: '12', label: 'Quartiers couverts' },
  { value: '98%', label: 'Clients satisfaits' },
]

export default function StatsSection() {
  return (
    <section className="bg-dark py-20">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-12 text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Notre expertise
        </p>
        <div className="grid gap-10 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-5xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="mt-3 text-sm uppercase tracking-widest text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
