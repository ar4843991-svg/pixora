import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowLeft,
  FiArrowRight,
  FiFileText,
  FiHome,
  FiImage,
  FiSearch,
} from 'react-icons/fi'

import SEO from '../components/SEO'

function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found | Pixora"
        description="The page you are looking for could not be found on Pixora. Explore Pixora's free online image and PDF tools."
      />

      <section className="flex min-h-[65vh] items-center px-4 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center"
          >
            {/* 404 Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.45,
                delay: 0.1,
                ease: 'easeOut',
              }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5E3122] text-white shadow-sm"
            >
              <FiSearch size={28} />
            </motion.div>

            {/* 404 */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="mt-6 text-7xl font-bold tracking-tight text-[#5E3122] sm:text-8xl"
            >
              404
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="mt-3 text-3xl font-bold text-[#1D4533] sm:text-4xl"
            >
              Page Not Found
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="mx-auto mt-4 max-w-lg text-base leading-7 text-gray-600"
            >
              The page you are looking for does not exist or may have
              been moved. You can return to Pixora or explore one of
              our online tools.
            </motion.p>

            {/* Main Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                to="/"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
              >
                <FiHome size={18} />
                Back to Home
                <FiArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/tools/image-compressor"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#1D4533] bg-white px-6 py-3 font-medium text-[#1D4533] transition duration-200 hover:-translate-y-0.5 hover:bg-gray-50 sm:w-auto"
              >
                <FiImage size={18} />
                Explore Tools
              </Link>
            </motion.div>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.4,
              ease: 'easeOut',
            }}
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            <Link
              to="/tools/image-compressor"
              className="group rounded-2xl border border-[#F9D2BA] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
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

              <h2 className="mt-4 font-semibold text-[#1D4533]">
                Image Tools
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Compress, resize and convert common image files.
              </p>
            </Link>

            <Link
              to="/tools/pdf-merger"
              className="group rounded-2xl border border-[#F9D2BA] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
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

              <h2 className="mt-4 font-semibold text-[#1D4533]">
                PDF Tools
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Convert PDF files and merge multiple documents.
              </p>
            </Link>
          </motion.div>

          {/* Small Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D4533] hover:underline"
            >
              <FiArrowLeft size={16} />
              Return to Pixora
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default NotFound