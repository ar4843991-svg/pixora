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

function WebpConverter() {
  const [file, setFile] = useState(null)
  const [convertedFile, setConvertedFile] = useState(null)
  const [isConverting, setIsConverting] = useState(false)
  const [quality, setQuality] = useState(0.8)
  const [error, setError] = useState('')

  async function convertToWebp(file, quality) {
    const image = new Image()
    const imageUrl = URL.createObjectURL(file)

    try {
      image.src = imageUrl

      await new Promise((resolve, reject) => {
        image.onload = resolve
        image.onerror = reject
      })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Canvas is not supported')
      }

      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      )

      const webpBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/webp', quality)
      })

      if (!webpBlob) {
        throw new Error('Conversion failed')
      }

      return webpBlob
    } finally {
      URL.revokeObjectURL(imageUrl)
    }
  }

  async function handleConvert() {
    if (!file) return

    try {
      setIsConverting(true)
      setConvertedFile(null)
      setError('')

      const webpBlob = await convertToWebp(file, quality)

      setConvertedFile(webpBlob)
    } catch (error) {
      console.error('WebP conversion failed:', error)
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
    link.download = 'pixora-converted.webp'
    link.click()

    URL.revokeObjectURL(downloadUrl)
  }

  function handleQualityChange(value) {
    setQuality(value)
    setConvertedFile(null)
    setError('')
  }

  const savedPercentage =
    file && convertedFile
      ? Math.max(
          0,
          ((file.size - convertedFile.size) / file.size) * 100
        )
      : 0

  const qualityOptions = [
    {
      label: 'High',
      value: 0.9,
      description: 'Better visual quality',
    },
    {
      label: 'Medium',
      value: 0.8,
      description: 'Balanced quality and size',
    },
    {
      label: 'Low',
      value: 0.6,
      description: 'Smaller file size',
    },
  ]

  return (
    <>
      <SEO
        title="WebP Converter Online | Pixora"
        description="Convert JPG and PNG images to WebP online for free with Pixora. Choose your preferred quality and download your WebP image."
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
              WebP Converter
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Convert JPG and PNG images to WebP online with adjustable
              quality and a simple browser-based workflow.
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
              accept="image/jpeg,image/png"
              label="Choose JPG or PNG image"
              allowedTypes={[
                'image/jpeg',
                'image/png',
              ]}
              onFileSelect={(selectedFile) => {
                setFile(selectedFile)
                setConvertedFile(null)
                setError('')
              }}
            />

            {file && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                {/* Selected File */}
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

                {/* Quality */}
                <div className="mt-7">
                  <p className="mb-3 text-center font-medium text-[#1D4533]">
                    WebP Quality
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {qualityOptions.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() =>
                          handleQualityChange(option.value)
                        }
                        className={`rounded-xl border p-4 text-left transition ${
                          quality === option.value
                            ? 'border-[#1D4533] bg-[#F7EAE0] text-[#1D4533]'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-[#1D4533]/40 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold">
                            {option.label}
                          </span>

                          {quality === option.value && (
                            <FiCheckCircle size={18} />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Convert Button */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleConvert}
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
                        Convert to WebP
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
                  WebP conversion complete
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  WebP size:{' '}
                  {(convertedFile.size / 1024).toFixed(2)} KB
                </p>

                <p className="mt-2 text-lg font-semibold text-[#1D4533]">
                  {savedPercentage > 0
                    ? `Saved: ${savedPercentage.toFixed(1)}%`
                    : 'File size was not reduced'}
                </p>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#5E3122] px-5 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  <FiDownload size={18} />
                  Download WebP
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
              Convert Images to WebP Online for Free
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora WebP Converter lets you convert JPG and PNG images
              into WebP format directly in your browser. You can choose
              a quality level to balance image quality and output file
              size.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-[#1D4533]">
              How to Convert an Image to WebP
            </h2>

            <div className="mt-5 space-y-3">
              {[
                'Choose a JPG or PNG image.',
                'Select High, Medium or Low WebP quality.',
                'Click Convert to WebP.',
                'Wait for the browser-based conversion to finish.',
                'Download your WebP image.',
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
              Why Convert Images to WebP?
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              WebP is a modern image format designed to provide efficient
              image compression while maintaining good visual quality.
              Smaller image files can be useful for websites, uploads,
              storage and sharing.
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
                to="/tools/jpg-to-png"
                className="group rounded-xl border border-[#F9D2BA] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="font-semibold text-[#1D4533]">
                  JPG to PNG
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Convert JPG images to PNG format.
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

export default WebpConverter