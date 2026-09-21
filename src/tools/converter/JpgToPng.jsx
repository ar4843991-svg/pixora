import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiCheckCircle,
  FiDownload,
  FiImage,
  FiRefreshCw,
} from 'react-icons/fi'

import ImageUploader from '../../components/ImageUploader'
import SEO from '../../components/SEO'

function JpgToPng() {
  const [file, setFile] = useState(null)
  const [convertedFile, setConvertedFile] = useState(null)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState('')

  async function convertToPng() {
    if (!file) return

    try {
      setIsConverting(true)
      setConvertedFile(null)
      setError('')

      const image = new Image()
      const imageUrl = URL.createObjectURL(file)

      image.src = imageUrl

      await new Promise((resolve, reject) => {
        image.onload = resolve
        image.onerror = reject
      })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        URL.revokeObjectURL(imageUrl)
        throw new Error('Canvas is not supported')
      }

      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight

      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      )

      const pngBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png')
      })

      URL.revokeObjectURL(imageUrl)

      if (!pngBlob) {
        throw new Error('Conversion failed')
      }

      setConvertedFile(pngBlob)
    } catch (error) {
      console.error('Conversion failed:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsConverting(false)
    }
  }

  function handleDownload() {
    if (!convertedFile) return

    const downloadUrl = URL.createObjectURL(convertedFile)
    const link = document.createElement('a')

    link.href = downloadUrl
    link.download = 'pixora-converted.png'
    link.click()

    URL.revokeObjectURL(downloadUrl)
  }

  return (
    <>
      <SEO
        title="JPG to PNG Converter Online | Pixora"
        description="Convert JPG images to PNG online for free with Pixora. Fast, simple and browser-based JPG to PNG conversion."
      />

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EAE0] text-[#1D4533]">
              <FiImage size={27} />
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#1D4533] sm:text-5xl">
              JPG to PNG Converter
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Convert JPG images to PNG format online with a simple
              browser-based tool.
            </p>
          </motion.div>

          {/* Tool */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.15,
              ease: 'easeOut',
            }}
            className="mt-10 rounded-2xl border border-[#F9D2BA] bg-white p-5 shadow-sm sm:p-8"
          >
            <ImageUploader
              accept="image/jpeg"
              label="Choose a JPG image"
              allowedTypes={['image/jpeg']}
              onFileSelect={(selectedFile) => {
                setFile(selectedFile)
                setConvertedFile(null)
                setError('')
              }}
            />

            {/* Selected File */}
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className="rounded-xl bg-[#F7EAE0] p-4">
                  <div className="flex items-start gap-3">
                    <FiImage
                      className="mt-0.5 shrink-0 text-[#1D4533]"
                      size={20}
                    />

                    <div className="min-w-0">
                      <p className="break-all text-sm font-medium text-[#1D4533]">
                        {file.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        Original size:{' '}
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Convert Button */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={convertToPng}
                    disabled={isConverting}
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isConverting ? (
                      <>
                        <FiRefreshCw
                          className="animate-spin"
                          size={18}
                        />
                        Converting...
                      </>
                    ) : (
                      <>
                        <FiRefreshCw size={18} />
                        Convert to PNG
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600"
              >
                {error}
              </motion.p>
            )}

            {/* Result */}
            {convertedFile && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl border border-[#F9D2BA] bg-[#F7EAE0] p-5 text-center"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1D4533]">
                  <FiCheckCircle size={23} />
                </div>

                <p className="mt-4 text-lg font-semibold text-[#1D4533]">
                  Conversion complete
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  PNG size:{' '}
                  {(convertedFile.size / 1024).toFixed(2)} KB
                </p>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#5E3122] px-5 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  <FiDownload size={18} />
                  Download PNG
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* SEO Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="mt-14"
          >
            <h2 className="text-2xl font-bold text-[#1D4533] sm:text-3xl">
              Convert JPG to PNG Online for Free
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora JPG to PNG Converter lets you convert JPG images
              into PNG files directly in your browser. The conversion
              keeps the original image dimensions while changing the
              output format to PNG.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-[#1D4533]">
              How to Convert JPG to PNG
            </h2>

            <div className="mt-5 space-y-3">
              {[
                'Choose a JPG image from your device.',
                'Click Convert to PNG.',
                'Wait for the browser-based conversion to finish.',
                'Download your converted PNG image.',
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F7EAE0] text-sm font-semibold text-[#1D4533]">
                    {index + 1}
                  </span>

                  <p className="pt-0.5 text-gray-600">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="mt-8 text-2xl font-bold text-[#1D4533]">
              JPG and PNG Image Formats
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              JPG is commonly used for photographs and other images
              where smaller file sizes are useful. PNG is another
              popular image format that can preserve lossless image
              data and transparency. Pixora makes it easy to convert
              a JPG image into PNG format when you need a PNG file.
            </p>
          </motion.div>

          {/* Related Tools */}
          <div className="mt-14 border-t border-[#F9D2BA] pt-10">
            <h2 className="text-2xl font-bold text-[#1D4533]">
              Related Image Tools
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">

              <Link
                to="/tools/image-compressor"
                className="group rounded-xl border border-[#F9D2BA] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="font-semibold text-[#1D4533]">
                  Image Compressor
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Reduce image file size while keeping good quality.
                </p>

                <FiRefreshCw
                  size={18}
                  className="mt-4 text-[#1D4533] transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/tools/image-resizer"
                className="group rounded-xl border border-[#F9D2BA] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="font-semibold text-[#1D4533]">
                  Image Resizer
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Resize your image dimensions quickly.
                </p>

                <FiRefreshCw
                  size={18}
                  className="mt-4 text-[#1D4533] transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/tools/webp-converter"
                className="group rounded-xl border border-[#F9D2BA] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="font-semibold text-[#1D4533]">
                  WebP Converter
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Convert images to WebP format.
                </p>

                <FiRefreshCw
                  size={18}
                  className="mt-4 text-[#1D4533] transition-transform group-hover:translate-x-1"
                />
              </Link>

            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default JpgToPng