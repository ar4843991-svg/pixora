import SEO from '../components/SEO'

function Privacy() {
  return (
    <>
      <SEO
  title="Privacy Policy | Pixora"
  description="Read the Pixora privacy policy and learn how image files and website information are handled."
/>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-[#1D4533]">
            Privacy Policy
          </h1>

          <p className="mt-6 leading-7 text-gray-600">
            Pixora is designed with privacy in mind. Where possible,
            image processing happens directly in your browser.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-[#1D4533]">
            Image Files
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            Our browser-based image tools can process files locally
            on your device. This means your images do not need to be
            uploaded to a server for these operations.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-[#1D4533]">
            Website Information
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            Pixora may use basic website technologies and analytics
            in the future to understand website usage and improve
            the service.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-[#1D4533]">
            Updates
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            This privacy policy may be updated when Pixora adds new
            features or services.
          </p>
        </div>
      </section>
    </>
  )
}

export default Privacy