import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCheckCircle, FiFileText } from 'react-icons/fi'

function Hero() {
  return (
    <section className="px-4 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 rounded-full border border-[#1D4533]/20 bg-white/70 px-4 py-2 text-sm font-medium text-[#1D4533] shadow-sm"
        >
          <FiCheckCircle size={16} />
          <span>Simple. Fast. Private.</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-[#1D4533] sm:text-5xl md:text-6xl"
        >
          Free Online Image & PDF Tools
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg"
        >
          Compress, resize and convert images, or work with PDF files
          quickly and easily — directly in your browser.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/tools/image-compressor"
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-7 py-3.5 font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
          >
            <span>Start Using Tools</span>

            <FiArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/tools/pdf-merger"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#1D4533] bg-white px-7 py-3.5 font-medium text-[#1D4533] transition hover:-translate-y-0.5 hover:bg-gray-50 sm:w-auto"
          >
            <FiFileText size={18} />
            <span>Explore PDF Tools</span>
          </Link>
        </motion.div>

        {/* Trust Points */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-600"
        >
          <span className="flex items-center gap-1.5">
            <FiCheckCircle className="text-[#1D4533]" size={16} />
            Free to use
          </span>

          <span className="flex items-center gap-1.5">
            <FiCheckCircle className="text-[#1D4533]" size={16} />
            Easy to use
          </span>

          <span className="flex items-center gap-1.5">
            <FiCheckCircle className="text-[#1D4533]" size={16} />
            Browser-based tools
          </span>
        </motion.div>

      </div>
    </section>
  )
}

export default Hero