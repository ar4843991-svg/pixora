function BenefitsSection() {
  const benefits = [
    {
      icon: '🔒',
      title: 'Privacy Focused',
      description:
        'Your images can be processed directly in your browser.',
    },
    {
      icon: '⚡',
      title: 'Fast Processing',
      description:
        'Simple image tools designed for quick and easy results.',
    },
    {
      icon: '🆓',
      title: 'Free to Use',
      description:
        'Use Pixora tools without complicated setup or software.',
    },
  ]

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-[#F9D2BA] bg-white p-6 text-center shadow-sm"
            >
              <div className="text-3xl">
                {benefit.icon}
              </div>

              <h3 className="mt-4 text-lg font-semibold text-[#1D4533]">
                {benefit.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection