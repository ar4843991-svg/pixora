
import { Link } from 'react-router-dom'


function Hero() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#5E3122]">
          Simple. Fast. Private.
        </p>
        <Link
  to="/tools/image-compressor"
  className="mt-8 inline-block rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white transition hover:opacity-90"
>
  Start Compressing
</Link>

        <h1 className="mt-4 text-4xl font-bold leading-tight text-[#1D4533] sm:text-5xl md:text-6xl">
          Free Online Image Tools
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
          Compress, resize and convert your images quickly and easily.
        </p>
      </div>
    </section>
  )
}

export default Hero