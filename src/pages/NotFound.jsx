import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <SEO
  title="Page Not Found | Pixora"
  description="The page you are looking for could not be found on Pixora."
/>
      <div className="text-center">
        <p className="text-6xl font-bold text-[#5E3122]">
          404
        </p>

        <h1 className="mt-4 text-3xl font-bold text-[#1D4533]">
          Page Not Found
        </h1>

        <p className="mt-4 text-gray-600">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-[#1D4533] px-5 py-3 font-medium text-white transition hover:opacity-90"
        >
          Back to Home
        </Link>
      </div>
    </section>
  )
}

export default NotFound