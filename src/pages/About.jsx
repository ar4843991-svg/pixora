import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowRight,
  FiCheckCircle,
  FiFileText,
  FiImage,
  FiShield,
  FiZap,
} from 'react-icons/fi'

import SEO from '../components/SEO'

function About() {
  const highlights = [
    {
      icon: FiZap,
      title: 'Simple & Fast',
      description:
        'Pixora is designed to make common image and PDF tasks quick and straightforward.',
    },
    {
      icon: FiShield,
      title: 'Privacy Focused',
      description:
        'Many Pixora tools process files directly in your browser instead of requiring a complicated workflow.',
    },
    {
      icon: FiImage,
      title: 'Useful File Tools',
      description:
        'Work with common image formats and PDF files using focused online tools.',
    },
  ]

  return (
    <>
      <SEO
        title="About Pixora | Free Online Image & PDF Tools"
        description="Learn about Pixora, a free online platform for simple image compression, resizing, conversion and PDF tools."
      />

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1D4533] text-white shadow-sm">
              <FiImage size={27} />
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#1D4533] sm:text-5xl">
              About Pixora
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Simple online tools for everyday image and PDF file
              tasks — designed to be easy to use from your browser.
            </p>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
            className="mt-10 rounded-2xl border border-[#F9D2BA] bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          >
            <h2 className="text-2xl font-bold text-[#1D4533]">
              What is Pixora?
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Pixora is a free online platform that provides simple
              tools for working with common image and PDF files. The
              goal is to make everyday file tasks easier without
              requiring complicated desktop software.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              Whether you need to compress an image, resize it,
              convert an image format, create a PDF or combine
              multiple PDF files, Pixora provides focused tools for
              these common tasks.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-[#1D4533]">
              Built for Simplicity
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora focuses on straightforward interfaces and
              practical tools. Each tool is designed around a
              specific file task so you can upload your file,
              complete the operation and get your result without
              unnecessary steps.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-[#1D4533]">
              Image & PDF Tools
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora currently includes tools for both images and
              PDF documents. Image tools cover tasks such as
              compression, resizing and format conversion, while
              PDF tools help with conversion and document merging.
            </p>

            {/* Highlights */}
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {highlights.map((item, index) => {
                const Icon = item.icon

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.08,
                    }}
                    className="rounded-xl bg-[#F7EAE0] p-5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#1D4533] shadow-sm">
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-4 font-semibold text-[#1D4533]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            {/* Privacy Note */}
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#F9D2BA] bg-[#F7EAE0]/60 p-5">
              <FiShield
                className="mt-0.5 shrink-0 text-[#1D4533]"
                size={20}
              />

              <div>
                <h3 className="font-semibold text-[#1D4533]">
                  Privacy Matters
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Pixora is designed with privacy in mind. Many of
                  our tools process files directly in your browser,
                  depending on the specific tool and browser
                  capabilities.
                </p>

                <Link
                  to="/privacy"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#1D4533] hover:underline"
                >
                  Read our Privacy Policy
                  <FiArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Explore Tools */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1D4533]">
                Explore Pixora Tools
              </h2>

              <p className="mt-2 text-gray-600">
                Choose a tool and get started.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                to="/tools/image-compressor"
                className="group rounded-2xl border border-[#F9D2BA] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7EAE0] text-[#1D4533]">
                    <FiImage size={22} />
                  </div>

                  <FiArrowRight
                    size={19}
                    className="text-[#1D4533] transition-transform duration-200 group-hover:translate-x-1"
                  />
                </div>

                <h3 className="mt-5 font-semibold text-[#1D4533]">
                  Image Tools
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Compress, resize and convert common image files.
                </p>
              </Link>

              <Link
                to="/tools/pdf-merger"
                className="group rounded-2xl border border-[#F9D2BA] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7EAE0] text-[#1D4533]">
                    <FiFileText size={22} />
                  </div>

                  <FiArrowRight
                    size={19}
                    className="text-[#1D4533] transition-transform duration-200 group-hover:translate-x-1"
                  />
                </div>

                <h3 className="mt-5 font-semibold text-[#1D4533]">
                  PDF Tools
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Convert PDF files and combine multiple documents.
                </p>
              </Link>
            </div>
          </motion.section>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10 text-center"
          >
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90"
            >
              <FiCheckCircle size={18} />
              Explore All Pixora Tools
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

export default About