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
  FiShield,
  FiZap,
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
        description="Use Pixora's free online image and PDF tools to compress, resize and convert images, convert PDFs and merge PDF files quickly in your browser."
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
              Free browser-based tools to compress, resize and convert images,
              create PDFs, convert PDF pages and merge PDF files quickly and
              easily.
            </p>
          </motion.div>

          {/* Quick Benefits */}
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              {
                icon: FiZap,
                title: 'Fast & Simple',
                text: 'Complete everyday file tasks directly in your browser.',
              },
              {
                icon: FiShield,
                title: 'Browser Based',
                text: 'Your files can be processed directly in your browser.',
              },
              {
                icon: FiLayers,
                title: 'Multiple Tools',
                text: 'Image and PDF utilities available in one place.',
              },
            ].map((item, index) => {
              const Icon = item.icon

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                  className="rounded-2xl border border-[#F9D2BA] bg-white p-5 text-center shadow-sm"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EAE0] text-[#1D4533]">
                    <Icon size={19} />
                  </div>

                  <h3 className="mt-3 text-sm font-semibold text-[#1D4533]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-600">
                    {item.text}
                  </p>
                </motion.div>
              )
            })}
          </div>

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
                    Compress, resize and convert common image formats online.
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

          {/* Image Internal Links */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mt-7 rounded-2xl border border-[#F9D2BA] bg-white p-5 shadow-sm"
          >
            <p className="text-sm leading-6 text-gray-600">
              Need smaller image files? Try the{' '}
              <Link
                to="/tools/image-compressor"
                className="font-semibold text-[#1D4533] underline decoration-[#F9D2BA] underline-offset-4"
              >
                Image Compressor
              </Link>
              . Need different dimensions? Use the{' '}
              <Link
                to="/tools/image-resizer"
                className="font-semibold text-[#1D4533] underline decoration-[#F9D2BA] underline-offset-4"
              >
                Image Resizer
              </Link>
              . You can also convert images with{' '}
              <Link
                to="/tools/jpg-to-png"
                className="font-semibold text-[#1D4533] underline decoration-[#F9D2BA] underline-offset-4"
              >
                JPG to PNG
              </Link>{' '}
              or the{' '}
              <Link
                to="/tools/webp-converter"
                className="font-semibold text-[#1D4533] underline decoration-[#F9D2BA] underline-offset-4"
              >
                WebP Converter
              </Link>
              .
            </p>
          </motion.div>

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
                    Convert images and PDF pages or combine multiple PDFs.
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

          {/* PDF Internal Links */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mt-7 rounded-2xl border border-[#F9D2BA] bg-white p-5 shadow-sm"
          >
            <p className="text-sm leading-6 text-gray-600">
              Turn images into documents with{' '}
              <Link
                to="/tools/jpg-to-pdf"
                className="font-semibold text-[#1D4533] underline decoration-[#F9D2BA] underline-offset-4"
              >
                JPG to PDF
              </Link>
              . Convert PDF pages with{' '}
              <Link
                to="/tools/pdf-to-jpg"
                className="font-semibold text-[#1D4533] underline decoration-[#F9D2BA] underline-offset-4"
              >
                PDF to JPG
              </Link>{' '}
              or{' '}
              <Link
                to="/tools/pdf-to-png"
                className="font-semibold text-[#1D4533] underline decoration-[#F9D2BA] underline-offset-4"
              >
                PDF to PNG
              </Link>
              . Need to combine documents? Use the{' '}
              <Link
                to="/tools/pdf-merger"
                className="font-semibold text-[#1D4533] underline decoration-[#F9D2BA] underline-offset-4"
              >
                PDF Merger
              </Link>
              .
            </p>
          </motion.div>

          {/* SEO Content */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 rounded-2xl border border-[#F9D2BA] bg-white p-7 shadow-sm sm:mt-20 sm:p-9"
          >
            <h2 className="text-2xl font-bold text-[#1D4533]">
              Free image and PDF tools online
            </h2>

            <div className="mt-5 space-y-5 text-sm leading-7 text-gray-600 sm:text-base">
              <p>
                Pixora provides a collection of free online image and PDF
                tools for common file tasks. You can compress images, resize
                them, convert between formats, create PDFs from images and
                convert PDF pages into image files.
              </p>

              <p>
                These browser-based tools are designed to keep everyday file
                workflows simple. Instead of installing separate software,
                you can choose the tool you need and work with your files
                directly from the Pixora website.
              </p>

              <p>
                Whether you need to reduce an image file size, change image
                dimensions, convert JPG or WebP files, create a PDF or combine
                multiple PDF documents, Pixora brings these utilities together
                in one easy-to-use place.
              </p>
            </div>
          </motion.section>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 rounded-2xl border border-[#F9D2BA] bg-white p-7 text-center shadow-sm sm:mt-20 sm:p-10"
          >
            <h2 className="text-2xl font-bold text-[#1D4533]">
              Choose a tool and get started
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              Pick an image or PDF tool above and complete your file task
              directly in your browser.
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