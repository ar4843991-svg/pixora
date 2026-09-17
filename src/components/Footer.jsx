import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="mt-16 border-t border-[#F9D2BA] bg-[#5E3122]">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/"
              className="text-xl font-bold text-[#F7EAE0]"
            >
              Pixora
            </Link>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#F9D2BA]">
              Free online tools for compressing, resizing and
              converting images.
            </p>
          </div>

          <div className="flex gap-5 text-sm">
            <a
              href="#"
              className="text-[#F7EAE0] transition hover:text-[#F9D2BA]"
            >
              About
            </a>

            <a
              href="#"
              className="text-[#F7EAE0] transition hover:text-[#F9D2BA]"
            >
              Privacy
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-[#F9D2BA]/30 pt-6 text-sm text-[#F9D2BA]">
          © 2026 Pixora. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer