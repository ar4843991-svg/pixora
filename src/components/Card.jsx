import { Link } from 'react-router-dom'

function Card({ title, description, slug, icon, action }) {
  return (
    <Link
      to={`/tools/${slug}`}
      className="group flex h-full flex-col rounded-2xl border border-[#F9D2BA] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1D4533] focus:ring-offset-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F9D2BA] text-lg">
          {icon}
        </div>

        <span className="text-lg text-[#1D4533] transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#1D4533]">
        {title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
        {description}
      </p>

      <div className="mt-5 text-sm font-semibold text-[#1D4533]">
        {action}
      </div>
    </Link>
  )
}

export default Card