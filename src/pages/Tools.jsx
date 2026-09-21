import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowRight,
  FiFileText,
  FiImage,
  FiMinimize2,
  FiMaximize2,
  FiRefreshCw,
  FiGlobe,
  FiLayers,
} from 'react-icons/fi'

import SEO from '../components/SEO'
import tools from '../Data/tools'

const iconMap = {
  'image-compressor': FiMinimize2,
  'image-resizer': FiMaximize2,
  'jpg-to-png': FiRefreshCw,
  'webp-converter': FiGlobe,
  'jpg-to-pdf': FiFileText,
  'pdf-to-jpg': FiImage,
  'pdf-to-png': FiImage,
  'pdf-merger': FiLayers,
}

function Tools() {
  const imageTools = tools.slice(0, 4)
  const pdfTools = tools.slice(4)

  const renderToolCard = (tool, index) => {
    const Icon = iconMap[tool.slug] || FiFileText

    return (
      <motion.div
        key={tool.slug}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: 0.4,
          delay: index * 0.05,
          ease: 'easeOut',
        }}
      >
        <Link
          to={`/tools/${tool.slug}`}
          className="group block h-full rounded-2xl border border-[#F9D2BA] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F7EAE0] text-[#1D4533]">
              <Icon size={23} />
            </div>

            <FiArrowRight
              size={19}
              className="mt-1 text-[#1D4533] transition-transform duration-200 group-hover:translate-x-1"
            />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-[#1D4533]">
            {tool.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {tool.description}
          </p>

          <div className="mt-5 text-sm font-semibold text-[#1D4533]">
            {tool.action}
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <>
      <SEO
        title="Free Online Image & PDF Tools | Pixora"
        description="Explore Pixora's free online image and PDF tools. Compress, resize and convert images, convert PDFs and merge PDF files quickly in your browser."
      />

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1D4533] text-white shadow-sm">
              <FiLayers size={25} />
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#1D4533] sm:text-4xl lg:text-5xl">
              Free Online Image & PDF Tools
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Simple, fast and easy-to-use online tools for compressing,
              resizing and converting your images and PDF files.
            </p>
          </motion.div>

          {/* Image Tools */}
          <section className="mt-14 sm:mt-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EAE0] text-[#1D4533]">
                  <FiImage size={20} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#1D4533]">
                    Image Tools
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Work with common image formats quickly in your browser.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {imageTools.map((tool, index) =>
                renderToolCard(tool, index)
              )}
            </div>
          </section>

          {/* PDF Tools */}
          <section className="mt-16 sm:mt-20">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EAE0] text-[#1D4533]">
                  <FiFileText size={20} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#1D4533]">
                    PDF Tools
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Convert and manage PDF files with simple browser-based
                    tools.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {pdfTools.map((tool, index) =>
                renderToolCard(tool, index + imageTools.length)
              )}
            </div>
          </section>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 rounded-2xl border border-[#F9D2BA] bg-white p-7 text-center shadow-sm sm:mt-20 sm:p-10"
          >
            <h2 className="text-2xl font-bold text-[#1D4533]">
              Simple tools, right in your browser
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              Pixora makes everyday image and PDF tasks easier without
              requiring complicated software.
            </p>

            <Link
              to="/"
              className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:opacity-90"
            >
              Back to Home
              <FiArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Tools