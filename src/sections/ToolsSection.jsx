import { motion } from 'framer-motion'
import Card from '../components/Card'
import tools from '../Data/tools'

function ToolsSection() {
  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-[#5E3122]">
            Our Tools
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#1D4533] sm:text-4xl">
            Simple Tools for Images & PDFs
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Compress, resize and convert your images, or work with PDF files
            using simple online tools.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.slug}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.45,
                    ease: 'easeOut',
                  },
                },
              }}
            >
              <Card
                title={tool.title}
                description={tool.description}
                slug={tool.slug}
                icon={tool.icon}
                action={tool.action}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

export default ToolsSection