import SEO from '../components/SEO'
function About() {
  return (
    <>
     <SEO
  title="About Pixora | Free Online Image Tools"
  description="Learn about Pixora, a free online platform for simple image compression, resizing and conversion tools."
/>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-[#1D4533]">
            About Pixora
          </h1>

          <p className="mt-6 leading-7 text-gray-600">
            Pixora is a free online platform that provides simple
            tools for working with images.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Our goal is to make common image tasks such as
            compression, resizing and format conversion quick,
            simple and accessible.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Pixora is designed with a focus on simplicity,
            performance and privacy.
          </p>
        </div>
      </section>
    </>
  )
}

export default About