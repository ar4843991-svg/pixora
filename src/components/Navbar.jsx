import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiImage,
  FiInfo,
  FiShield,
  FiGrid,
} from 'react-icons/fi'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }

    return location.pathname === path
  }

  const navItems = [
    {
      label: 'Tools',
      path: '/tools',
      icon: FiGrid,
    },
    {
      label: 'About',
      path: '/about',
      icon: FiInfo,
    },
    {
      label: 'Privacy',
      path: '/privacy',
      icon: FiShield,
    },
  ]

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
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: 'easeOut',
          }}
          className="flex items-center gap-2 sm:gap-3"
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-white text-[#1D4533] shadow-sm'
                    : 'text-gray-700 hover:bg-white/60 hover:text-[#1D4533]'
                }`}
              >
                <Icon
                  size={17}
                  className="transition-transform duration-200 group-hover:scale-110"
                />

                <span className="hidden sm:inline">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </motion.div>
      </div>
    </nav>
  )
}

export default Navbar