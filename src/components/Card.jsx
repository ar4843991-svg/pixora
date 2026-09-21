import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

function Card({ title, description, slug, icon: Icon, action }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="h-full"
    >
      <Link
        to={`/tools/${slug}`}
        className="group flex h-full flex-col rounded-2xl border border-[#F9D2BA] bg-white p-5 shadow-sm transition duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1D4533] focus:ring-offset-2"
      >
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7EAE0] text-[#1D4533]">
            {Icon && <Icon size={22} strokeWidth={2} />}
          </div>

          <FiArrowRight
            size={19}
            className="text-[#1D4533] transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>

        {/* Title */}
        <h3 className="mt-5 text-lg font-semibold text-[#1D4533]">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
          {description}
        </p>

        {/* Action */}
        <div className="mt-5 text-sm font-semibold text-[#1D4533]">
          {action}
        </div>
      </Link>
    </motion.div>
  )
}

export default Card