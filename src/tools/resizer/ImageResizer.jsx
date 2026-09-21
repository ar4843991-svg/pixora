import { useEffect, useState } from 'react'
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

function ImageResizer() {
  const [file, setFile] = useState(null)
  const [imageDimensions, setImageDimensions] = useState(null)
  const [width, setWidth] = useState('')
  const [resizedFile, setResizedFile] = useState(null)
  const [isResizing, setIsResizing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!file) {
      setImageDimensions(null)
      setWidth('')
      setResizedFile(null)
      setError('')
      return
    }

    const image = new Image()
    const imageUrl = URL.createObjectURL(file)

    image.src = imageUrl

    image.onload = () => {
      setImageDimensions({
        width: image.naturalWidth,
        height: image.naturalHeight,
      })

      setWidth(String(image.naturalWidth))
      setError('')

      URL.revokeObjectURL(imageUrl)
    }

    image.onerror = () => {
      setError('Unable to read this image. Please try another image.')
      URL.revokeObjectURL(imageUrl)
    }

    return () => {
      URL.revokeObjectURL(imageUrl)
    }
  }, [file])

  const calculatedHeight =
    imageDimensions && width && Number(width) > 0
      ? Math.round(
          Number(width) *
            (imageDimensions.height / imageDimensions.width)
        )
      : ''

  async function resizeImage() {
    if (!file || !width || !calculatedHeight) {
      setError('Please enter a valid width.')
      return
    }

    if (Number(width) < 1) {
      setError('Width must be at least 1 pixel.')
      return
    }

    try {
      setIsResizing(true)
      setResizedFile(null)
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

      canvas.width = Number(width)
      canvas.height = calculatedHeight

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      ctx.drawImage(
        image,
        0,
        0,
        Number(width),
        calculatedHeight
      )

      const outputType = file.type || 'image/jpeg'

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, outputType, 0.9)
      })

      URL.revokeObjectURL(imageUrl)

      if (!blob) {
        throw new Error('Resize failed')
      }

      setResizedFile(blob)
    } catch (error) {
      console.error('Resize failed:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsResizing(false)
    }
  }

  function handleDownload() {
    if (!resizedFile) return

    const downloadUrl = URL.createObjectURL(resizedFile)
    const link = document.createElement('a')

    const extensionMap = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    }

    const extension = extensionMap[file?.type] || 'jpg'

    link.href = downloadUrl
    link.download = `pixora-resized-image.${extension}`
    link.click()

    URL.revokeObjectURL(downloadUrl)
  }

  function handleWidthChange(event) {
    setWidth(event.target.value)
    setResizedFile(null)
    setError('')
  }

  return (
    <>
      <SEO
        title="Free Image Resizer Online | Pixora"
        description="Resize JPG, PNG and WebP images online for free with Pixora. Change image dimensions while keeping the correct proportions."
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
              Image Resizer
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Resize JPG, PNG and WebP images online while keeping their
              original proportions.
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
              accept="image/jpeg,image/png,image/webp"
              label="Choose JPG, PNG or WebP image"
              allowedTypes={[
                'image/jpeg',
                'image/png',
                'image/webp',
              ]}
              onFileSelect={(selectedFile) => {
                setFile(selectedFile)
                setResizedFile(null)
                setError('')
              }}
            />

            {/* Image Settings */}
            {imageDimensions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                {/* Original Image Info */}
                <div className="rounded-xl bg-[#F7EAE0] p-4">
                  <div className="flex items-start gap-3">
                    <FiImage
                      className="mt-0.5 shrink-0 text-[#1D4533]"
                      size={20}
                    />

                    <div>
                      <p className="break-all text-sm font-medium text-[#1D4533]">
                        {file?.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        Original dimensions:{' '}
                        <span className="font-medium text-[#1D4533]">
                          {imageDimensions.width} ×{' '}
                          {imageDimensions.height}px
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Width */}
                <div className="mt-7">
                  <label
                    htmlFor="image-width"
                    className="block text-sm font-medium text-[#1D4533]"
                  >
                    New Width
                  </label>

                  <input
                    id="image-width"
                    type="number"
                    min="1"
                    value={width}
                    onChange={handleWidthChange}
                    placeholder="Enter width in pixels"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533]/10"
                  />
                </div>

                {/* Height Preview */}
                <div className="mt-4 rounded-xl border border-[#F9D2BA] bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-600">
                      New dimensions
                    </span>

                    <span className="font-semibold text-[#1D4533]">
                      {calculatedHeight
                        ? `${Number(width)} × ${calculatedHeight}px`
                        : '—'}
                    </span>
                  </div>
                </div>

                {/* Resize Button */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={resizeImage}
                    disabled={isResizing}
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isResizing ? (
                      <>
                        <FiRefreshCw
                          className="animate-spin"
                          size={18}
                        />
                        Resizing...
                      </>
                    ) : (
                      <>
                        <FiRefreshCw size={18} />
                        Resize Image
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
            {resizedFile && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl border border-[#F9D2BA] bg-[#F7EAE0] p-5 text-center"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1D4533]">
                  <FiCheckCircle size={23} />
                </div>

                <p className="mt-4 text-lg font-semibold text-[#1D4533]">
                  Image resized successfully
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  New size:{' '}
                  {(resizedFile.size / 1024).toFixed(2)} KB
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  New dimensions:{' '}
                  {Number(width)} × {calculatedHeight}px
                </p>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#5E3122] px-5 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  <FiDownload size={18} />
                  Download Resized Image
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
              Resize Images Online for Free
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora Image Resizer lets you change the dimensions of
              JPG, PNG and WebP images directly in your browser. The
              tool automatically calculates the height based on the
              original image proportions.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-[#1D4533]">
              How to Resize an Image
            </h2>

            <div className="mt-5 space-y-3">
              {[
                'Choose a JPG, PNG or WebP image.',
                'Enter the new width in pixels.',
                'Pixora automatically calculates the proportional height.',
                'Click Resize Image to create the resized image.',
                'Download the resized image to your device.',
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
              Resize JPG, PNG and WebP Images
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Whether you need a smaller image for a website, social
              media, document or upload form, Pixora makes it easy to
              change image dimensions without installing desktop
              software.
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

export default ImageResizer