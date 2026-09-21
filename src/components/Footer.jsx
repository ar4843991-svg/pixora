import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowRight,
  FiFileText,
  FiImage,
  FiInfo,
  FiShield,
  FiGrid,
} from 'react-icons/fi'

function Footer() {
  const imageTools = [
    {
      name: 'Image Compressor',
      path: '/tools/image-compressor',
    },
    {
      name: 'Image Resizer',
      path: '/tools/image-resizer',
    },
    {
      name: 'JPG to PNG',
      path: '/tools/jpg-to-png',
    },
    {
      name: 'WebP Converter',
      path: '/tools/webp-converter',
    },
  ]

  const pdfTools = [
    {
      name: 'JPG to PDF',
      path: '/tools/jpg-to-pdf',
    },
    {
      name: 'PDF to JPG',
      path: '/tools/pdf-to-jpg',
    },
    {
      name: 'PDF to PNG',
      path: '/tools/pdf-to-png',
    },
    {
      name: 'PDF Merger',
      path: '/tools/pdf-merger',
    },
  ]

  return (
    <footer className="mt-16 border-t border-[#F9D2BA] bg-[#5E3122]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:py-14">

        {/* Footer Top */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5"
            >
              <motion.span
                whileHover={{ rotate: -5, scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EAE0] text-[#5E3122]"
              >
                <FiImage size={20} />
              </motion.span>

              <span className="text-2xl font-bold text-[#F7EAE0]">
                Pixora
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#F9D2BA]">
              Simple online tools for compressing, resizing and
              converting images, plus useful PDF tools for everyday
              file tasks.
            </p>

            <Link
              to="/tools"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#F7EAE0] transition-colors hover:text-[#F9D2BA]"
            >
              <FiGrid size={16} />

              Explore all tools

              <FiArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          {/* Image Tools */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <div className="flex items-center gap-2">
              <FiImage
                size={17}
                className="text-[#F9D2BA]"
              />

              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F7EAE0]">
                Image Tools
              </h2>
            </div>

            <div className="mt-4 space-y-2">
              {imageTools.map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="group flex items-center justify-between rounded-lg px-2 py-2 text-sm text-[#F9D2BA] transition-all duration-200 hover:bg-[#F7EAE0]/10 hover:text-[#F7EAE0]"
                >
                  <span>{tool.name}</span>

                  <FiArrowRight
                    size={15}
                    className="opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* PDF Tools */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div className="flex items-center gap-2">
              <FiFileText
                size={17}
                className="text-[#F9D2BA]"
              />

              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F7EAE0]">
                PDF Tools
              </h2>
            </div>

            <div className="mt-4 space-y-2">
              {pdfTools.map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="group flex items-center justify-between rounded-lg px-2 py-2 text-sm text-[#F9D2BA] transition-all duration-200 hover:bg-[#F7EAE0]/10 hover:text-[#F7EAE0]"
                >
                  <span>{tool.name}</span>

                  <FiArrowRight
                    size={15}
                    className="opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* About / Legal */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F7EAE0]">
              Pixora
            </h2>

            <div className="mt-4 space-y-2">
              <Link
                to="/tools"
                className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-[#F9D2BA] transition-all duration-200 hover:bg-[#F7EAE0]/10 hover:text-[#F7EAE0]"
              >
                <FiGrid size={16} />
                <span>All Tools</span>
              </Link>

              <Link
                to="/about"
                className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-[#F9D2BA] transition-all duration-200 hover:bg-[#F7EAE0]/10 hover:text-[#F7EAE0]"
              >
                <FiInfo size={16} />
                <span>About Pixora</span>
              </Link>

              <Link
                to="/privacy"
                className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-[#F9D2BA] transition-all duration-200 hover:bg-[#F7EAE0]/10 hover:text-[#F7EAE0]"
              >
                <FiShield size={16} />
                <span>Privacy Policy</span>
              </Link>
            </div>

            <div className="mt-6 rounded-xl border border-[#F9D2BA]/20 bg-black/10 p-4">
              <p className="text-xs leading-5 text-[#F9D2BA]">
                Pixora provides simple browser-based tools for
                common image and PDF tasks.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[#F9D2BA]/25 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#F9D2BA]">
            © 2026 Pixora. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#F9D2BA]">
            <span>Simple</span>
            <span>•</span>
            <span>Fast</span>
            <span>•</span>
            <span>Browser-based</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer