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

function ImageCompressor() {
  const [file, setFile] = useState(null)
  const [compressedFile, setCompressedFile] = useState(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [quality, setQuality] = useState(0.6)
  const [error, setError] = useState('')

  async function compressImage(file, quality) {
    const image = new Image()
    const imageUrl = URL.createObjectURL(file)

    try {
      image.src = imageUrl

      await new Promise((resolve, reject) => {
        image.onload = resolve
        image.onerror = () =>
          reject(new Error('Image could not be loaded'))
      })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
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

      const compressedBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', quality)
      })

      if (!compressedBlob) {
        throw new Error('Compression failed')
      }

      return compressedBlob
    } finally {
      URL.revokeObjectURL(imageUrl)
    }
  }

  async function handleCompress() {
    if (!file) return

    try {
      setIsCompressing(true)
      setCompressedFile(null)
      setError('')

      const compressedBlob = await compressImage(file, quality)

      if (compressedBlob.size >= file.size) {
        setCompressedFile(file)
        setError(
          'The compressed file was not smaller, so the original image is kept.'
        )
      } else {
        setCompressedFile(compressedBlob)
      }
    } catch (error) {
      console.error('Compression failed:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsCompressing(false)
    }
  }

  function handleDownload() {
    if (!compressedFile) return

    const downloadUrl = URL.createObjectURL(compressedFile)
    const link = document.createElement('a')

    link.href = downloadUrl
    link.download = 'pixora-compressed.jpg'
    link.click()

    URL.revokeObjectURL(downloadUrl)
  }

  function handleQualityChange(value) {
    setQuality(value)
    setCompressedFile(null)
    setError('')
  }

  const savedPercentage =
    file && compressedFile
      ? Math.max(
          0,
          ((file.size - compressedFile.size) / file.size) * 100
        )
      : 0

  return (
    <>
      <SEO
        title="Free Image Compressor Online | Pixora"
        description="Compress JPG, PNG and WebP images online for free with Pixora. Reduce image file size quickly with simple browser-based image compression."
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
              Image Compressor
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Compress JPG, PNG and WebP images online and reduce file size
              with a simple browser-based tool.
            </p>
          </motion.div>

          {/* Tool */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
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
                setCompressedFile(null)
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
                <div className="mt-7 text-center">
                  <p className="mb-3 font-medium text-[#1D4533]">
                    Compression Quality
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { label: 'High', value: 0.8 },
                      { label: 'Medium', value: 0.6 },
                      { label: 'Low', value: 0.4 },
                    ].map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() =>
                          handleQualityChange(option.value)
                        }
                        className={`rounded-lg px-4 py-2 font-medium transition ${
                          quality === option.value
                            ? 'bg-[#1D4533] text-white'
                            : 'border border-[#1D4533] text-[#1D4533] hover:bg-[#F7EAE0]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compress Button */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleCompress}
                    disabled={isCompressing}
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCompressing ? (
                      <>
                        <FiRefreshCw
                          className="animate-spin"
                          size={18}
                        />
                        Compressing...
                      </>
                    ) : (
                      <>
                        <FiRefreshCw size={18} />
                        Compress Image
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <p className="mt-5 rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            {/* Result */}
            {compressedFile && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl border border-[#F9D2BA] bg-[#F7EAE0] p-5 text-center"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1D4533]">
                  <FiCheckCircle size={23} />
                </div>

                <p className="mt-4 text-sm text-gray-600">
                  Compressed size:{' '}
                  {(compressedFile.size / 1024).toFixed(2)} KB
                </p>

                <p className="mt-2 text-lg font-semibold text-[#1D4533]">
                  Saved: {savedPercentage.toFixed(1)}%
                </p>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#5E3122] px-5 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  <FiDownload size={18} />
                  Download Compressed Image
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
              Compress Images Online for Free
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora Image Compressor helps reduce the file size of common
              image formats such as JPG, PNG and WebP. Smaller image files
              can be easier to store, share and upload.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-[#1D4533]">
              How to Compress an Image
            </h2>

            <div className="mt-5 space-y-3">
              {[
                'Choose a JPG, PNG or WebP image.',
                'Select the compression quality you want.',
                'Click Compress Image to process the file.',
                'Download the compressed result.',
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
          </motion.div>

          {/* Related Tools */}
          <div className="mt-14 border-t border-[#F9D2BA] pt-10">
            <h2 className="text-2xl font-bold text-[#1D4533]">
              Related Image Tools
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Link
                to="/tools/image-resizer"
                className="group rounded-xl border border-[#F9D2BA] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="font-semibold text-[#1D4533]">
                  Image Resizer
                </h3>

                <p className="mt-2 text-sm text-gray-600">
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

                <p className="mt-2 text-sm text-gray-600">
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

                <p className="mt-2 text-sm text-gray-600">
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

export default ImageCompressor