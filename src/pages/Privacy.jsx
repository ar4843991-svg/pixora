import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowLeft,
  FiCheckCircle,
  FiInfo,
  FiLock,
  FiShield,
} from 'react-icons/fi'

import SEO from '../components/SEO'

function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy | Pixora"
        description="Read the Pixora privacy policy to learn how files, website information and browser-based tools are handled."
      />

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1D4533] text-white shadow-sm">
              <FiShield size={27} />
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#1D4533] sm:text-5xl">
              Privacy Policy
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600">
              Pixora is designed with privacy and straightforward
              file processing in mind.
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Last updated: 2026
            </p>
          </motion.div>

          {/* Main Policy */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.1,
              ease: 'easeOut',
            }}
            className="mt-10 rounded-2xl border border-[#F9D2BA] bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          >
            {/* Introduction */}
            <div className="flex items-start gap-3 rounded-xl bg-[#F7EAE0] p-5">
              <FiLock
                className="mt-0.5 shrink-0 text-[#1D4533]"
                size={20}
              />

              <p className="text-sm leading-6 text-gray-700">
                Pixora aims to provide simple browser-based tools while
                limiting unnecessary handling of your files and
                information.
              </p>
            </div>

            {/* File Processing */}
            <section className="mt-10">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-[#1D4533]">
                <FiCheckCircle size={21} />
                File Processing
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Many Pixora tools are designed to process files
                directly in your browser. When a tool performs
                processing locally, the selected file can be handled
                on your device without needing to be uploaded to a
                Pixora server.
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                File handling can vary depending on the specific
                Pixora tool and its implementation. If future tools
                require server-side processing, this policy may be
                updated to explain the relevant data handling.
              </p>
            </section>

            {/* Information We May Collect */}
            <section className="mt-10">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-[#1D4533]">
                <FiInfo size={21} />
                Website Information
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Pixora may use standard website technologies to
                operate, maintain and improve the website. Depending
                on the services enabled on the site, this may include
                basic technical or usage information such as browser
                type, device information or general usage statistics.
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                If analytics, advertising or other third-party
                services are introduced, the privacy policy may be
                updated to describe how those services are used.
              </p>
            </section>

            {/* Cookies */}
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-[#1D4533]">
                Cookies and Similar Technologies
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Pixora may use cookies or similar browser technologies
                when they are necessary for website functionality,
                analytics or future services. The specific technologies
                used may change as the website develops.
              </p>
            </section>

            {/* Third Party Services */}
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-[#1D4533]">
                Third-Party Services
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Pixora may use third-party services for functions such
                as hosting, analytics, security, performance monitoring
                or other website features. These services may process
                limited technical information according to their own
                privacy policies.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-[#1D4533]">
                Children's Privacy
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Pixora is intended to provide general-purpose online
                file tools. We do not intentionally request sensitive
                personal information from users through the basic
                file-processing tools.
              </p>
            </section>

            {/* Security */}
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-[#1D4533]">
                Security
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Pixora takes reasonable steps to maintain a secure and
                reliable website. However, no website or internet
                transmission can be guaranteed to be completely
                secure.
              </p>
            </section>

            {/* Updates */}
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-[#1D4533]">
                Policy Updates
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                This privacy policy may be updated as Pixora adds new
                tools, features, analytics, advertising or other
                services. Changes will be reflected on this page.
              </p>
            </section>

            {/* Contact / Navigation */}
            <div className="mt-10 rounded-xl border border-[#F9D2BA] bg-[#F7EAE0]/60 p-5">
              <p className="text-sm leading-6 text-gray-600">
                For more information about Pixora and its available
                tools, visit the About page or explore the available
                tools below.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1D4533] px-5 py-2.5 text-sm font-medium text-[#1D4533] transition hover:bg-white"
                >
                  <FiArrowLeft size={16} />
                  About Pixora
                </Link>

                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-lg bg-[#1D4533] px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  Explore Tools
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Privacy