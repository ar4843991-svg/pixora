import { motion } from 'framer-motion'
import { FiShield, FiZap, FiGift } from 'react-icons/fi'

function BenefitsSection() {
  const benefits = [
    {
      icon: FiShield,
      title: 'Privacy Focused',
      description:
        'Many Pixora tools process files directly in your browser, helping keep your files private.',
    },
    {
      icon: FiZap,
      title: 'Fast & Simple',
      description:
        'Use lightweight online tools designed to make common image and PDF tasks quick and easy.',
    },
    {
      icon: FiGift,
      title: 'Free to Use',
      description:
        'Access useful image and PDF tools online without installing complicated software.',
    },
  ]

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <motion.div
                key={benefit.title}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      ease: 'easeOut',
                    },
                  },
                }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-[#F9D2BA] bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7EAE0] text-[#1D4533]">
                  <Icon size={24} strokeWidth={2} />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-[#1D4533]">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default BenefitsSection