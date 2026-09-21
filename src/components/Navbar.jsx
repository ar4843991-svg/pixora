import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiImage, FiInfo, FiShield } from 'react-icons/fi'

function Navbar() {
  return (
    <nav className="border-b border-[#F9D2BA] bg-[#F7EAE0]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Link
            to="/"
            className="flex items-center gap-2.5 text-2xl font-bold text-[#1D4533]"
          >
            <motion.span
              whileHover={{ rotate: -5, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1D4533] text-white"
            >
              <FiImage size={21} />
            </motion.span>

            <span>Pixora</span>
          </Link>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="flex items-center gap-5 sm:gap-8"
        >
          <Link
            to="/"
            className="group flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-[#1D4533]"
          >
            <FiImage
              size={17}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            <span>Tools</span>
          </Link>

          <Link
            to="/about"
            className="group flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-[#1D4533]"
          >
            <FiInfo
              size={17}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            <span>About</span>
          </Link>

          <Link
            to="/privacy"
            className="group flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-[#1D4533]"
          >
            <FiShield
              size={17}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            <span>Privacy</span>
          </Link>
        </motion.div>
      </div>
    </nav>
  )
}

export default Navbar