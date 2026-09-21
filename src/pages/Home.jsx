import SEO from '../components/SEO'
import Hero from '../sections/Hero'
import ToolsSection from '../sections/ToolsSection'
import BenefitsSection from '../sections/BenefitsSection'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'

function Home() {
  return (
    <>
      <SEO
        title="Free Online Image & PDF Tools | Pixora"
        description="Pixora provides free online tools to compress, resize and convert images and work with PDF files quickly and easily in your browser."
      />

      <Hero />

      <ToolsSection />

      <BenefitsSection />

      {/* SEO Content */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-[#F9D2BA] bg-white p-6 shadow-sm sm:p-8 lg:p-10">

            <h2 className="text-2xl font-bold text-[#1D4533] sm:text-3xl">
              Free Online Image & PDF Tools
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Pixora is a collection of simple online tools for working with
              common image and PDF files. Whether you need to compress an
              image, resize it, convert between formats or combine PDF files,
              Pixora helps you complete everyday file tasks directly from
              your browser.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-[#1D4533]">
              Image Tools
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Use Pixora to compress images, resize image dimensions and
              convert between popular formats such as JPG, PNG and WebP.
              These tools are designed to keep the process simple, with no
              complicated software required.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-[#1D4533]">
              PDF Tools
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Pixora also provides browser-based PDF tools for common file
              tasks. You can convert PDF pages to image formats, convert
              images to PDF and merge multiple PDF files into a single
              document.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl bg-[#F7EAE0] p-4">
                <FiCheckCircle
                  className="mt-0.5 shrink-0 text-[#1D4533]"
                  size={18}
                />

                <p className="text-sm leading-6 text-gray-700">
                  Simple browser-based file tools
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#F7EAE0] p-4">
                <FiCheckCircle
                  className="mt-0.5 shrink-0 text-[#1D4533]"
                  size={18}
                />

                <p className="text-sm leading-6 text-gray-700">
                  Support for common image and PDF tasks
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#F7EAE0] p-4">
                <FiCheckCircle
                  className="mt-0.5 shrink-0 text-[#1D4533]"
                  size={18}
                />

                <p className="text-sm leading-6 text-gray-700">
                  Designed for quick and straightforward workflows
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#F7EAE0] p-4">
                <FiCheckCircle
                  className="mt-0.5 shrink-0 text-[#1D4533]"
                  size={18}
                />

                <p className="text-sm leading-6 text-gray-700">
                  Accessible from desktop and mobile browsers
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/"
                className="group inline-flex items-center gap-2 font-semibold text-[#1D4533]"
              >
                Explore all Pixora tools
                <FiArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

export default Home