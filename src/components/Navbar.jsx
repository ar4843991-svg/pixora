import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="border-b border-[#F9D2BA] bg-[#F7EAE0]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-[#1D4533]"
        >
          Pixora
        </Link>

        <div className="flex items-center gap-5">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 transition hover:text-[#1D4533]"
          >
            Tools
          </Link>

          <Link
  to="/about"
  className="text-sm font-medium text-gray-700 transition hover:text-[#1D4533]"
>
  About
</Link>

         <Link
  to="/privacy"
  className="text-sm font-medium text-gray-700 transition hover:text-[#1D4533]"
>
  Privacy
</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar