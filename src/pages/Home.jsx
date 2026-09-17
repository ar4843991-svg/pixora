import SEO from '../components/SEO'
import Hero from '../sections/Hero'
import ToolsSection from '../sections/ToolsSection'
import BenefitsSection from '../sections/BenefitsSection'


function Home() {
  return (
    <>
     <SEO
  title="Free Online Image Tools | Pixora"
  description="Pixora offers free online image tools to compress, resize and convert JPG, PNG and WebP images quickly and easily."
/>


      <Hero />
      <ToolsSection />
      <BenefitsSection/>
      <section className="px-4 py-16">
  <div className="mx-auto max-w-3xl">
    <h2 className="text-2xl font-bold text-[#1D4533]">
      Free Online Image Tools
    </h2>

    <p className="mt-4 leading-7 text-gray-600">
      Pixora provides free online tools for compressing, resizing and
      converting images. You can work with common image formats such
      as JPG, PNG and WebP directly in your browser.
    </p>

    <p className="mt-4 leading-7 text-gray-600">
      Whether you need to reduce image file size, change image
      dimensions or convert an image to another format, Pixora keeps
      the process simple and easy to use.
    </p>
  </div>
</section>
    </>
  )
}

export default Home