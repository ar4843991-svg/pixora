import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import { motion } from 'framer-motion'
import {
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiImage,
  FiRefreshCw,
} from 'react-icons/fi'

import SEO from '../../components/SEO'

function JpgToPdf() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isConverting, setIsConverting] = useState(false)

  function processFile(selectedFile) {
    if (!selectedFile) return

    if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
      setError('Please select a JPG or PNG image.')
      setFile(null)
      setPreview(null)
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10 MB.')
      setFile(null)
      setPreview(null)
      return
    }

    setError('')
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }

  function handleFileChange(event) {
    processFile(event.target.files[0])
    event.target.value = ''
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)

    const droppedFile = event.dataTransfer.files[0]

    if (!droppedFile) return

    processFile(droppedFile)
  }

  async function handleConvert() {
    if (!file) return

    try {
      setIsConverting(true)
      setError('')

      const imageUrl = URL.createObjectURL(file)
      const image = new Image()

      image.src = imageUrl

      await new Promise((resolve, reject) => {
        image.onload = resolve
        image.onerror = reject
      })

      const imageWidth = image.naturalWidth
      const imageHeight = image.naturalHeight

      const pdf = new jsPDF({
        orientation:
          imageWidth > imageHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imageWidth, imageHeight],
      })

      pdf.addImage(
        image,
        file.type === 'image/png' ? 'PNG' : 'JPEG',
        0,
        0,
        imageWidth,
        imageHeight
      )

      pdf.save('pixora-image.pdf')

      URL.revokeObjectURL(imageUrl)
    } catch (error) {
      console.error('JPG to PDF conversion failed:', error)
      setError('Something went wrong while creating the PDF.')
    } finally {
      setIsConverting(false)
    }
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <>
      <SEO
        title="JPG to PDF Converter Online | Pixora"
        description="Convert JPG and PNG images to PDF online for free with Pixora. Create a PDF from an image directly in your browser."
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
              <FiFileText size={27} />
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#1D4533] sm:text-5xl">
              JPG to PDF Converter
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Convert JPG and PNG images into PDF files quickly with a
              simple browser-based tool.
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
            {/* Upload Area */}
            <div
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`rounded-2xl border-2 border-dashed p-6 text-center transition sm:p-10 ${
                isDragging
                  ? 'border-[#5E3122] bg-[#F9D2BA]/40'
                  : 'border-[#1D4533]/40 bg-gray-50 hover:border-[#1D4533]'
              }`}
            >
              {!preview ? (
                <>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EAE0] text-[#1D4533]">
                    <FiImage size={27} />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-[#1D4533]">
                    Choose an image
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    JPG or PNG up to 10 MB
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Or drag and drop your image here
                  </p>

                  <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#1D4533] px-5 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:opacity-90">
                    <FiImage size={18} />
                    Choose Image

                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <img
                    src={preview}
                    alt="Selected image preview"
                    className="mx-auto max-h-80 max-w-full rounded-xl object-contain shadow-sm"
                  />

                  <div className="mt-5 rounded-xl bg-[#F7EAE0] p-4 text-left">
                    <div className="flex items-start gap-3">
                      <FiImage
                        className="mt-0.5 shrink-0 text-[#1D4533]"
                        size={20}
                      />

                      <div className="min-w-0">
                        <p className="break-all text-sm font-medium text-[#1D4533]">
                          {file?.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          File size:{' '}
                          {file
                            ? (file.size / 1024).toFixed(2)
                            : '0.00'}{' '}
                          KB
                        </p>
                      </div>
                    </div>
                  </div>

                  <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#1D4533] px-5 py-3 font-medium text-[#1D4533] transition hover:-translate-y-0.5 hover:bg-[#F7EAE0]">
                    <FiRefreshCw size={18} />
                    Choose Another Image

                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </motion.div>
              )}
            </div>

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

            {/* Convert Button */}
            {file && (
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
                      Creating PDF...
                    </>
                  ) : (
                    <>
                      <FiFileText size={18} />
                      Convert to PDF
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Success */}
            {!isConverting && file && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-500"
              >
                <FiCheckCircle
                  className="text-[#1D4533]"
                  size={17}
                />
                <span>
                  Your image will be placed on a PDF page using its
                  original dimensions.
                </span>
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
              Convert JPG to PDF Online for Free
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora JPG to PDF Converter lets you turn JPG and PNG
              images into PDF documents directly in your browser. The
              tool is designed for quick everyday file conversion
              without requiring desktop software.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-[#1D4533]">
              How to Convert an Image to PDF
            </h2>

            <div className="mt-5 space-y-3">
              {[
                'Choose a JPG or PNG image.',
                'You can also drag and drop your image into the upload area.',
                'Preview your selected image.',
                'Click Convert to PDF.',
                'Download the generated PDF file.',
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
              JPG and PNG to PDF
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Converting an image to PDF can make it easier to share,
              print or include an image in a document workflow. Pixora
              supports both JPG and PNG images for this conversion.
            </p>
          </motion.div>

          {/* Related PDF Tools */}
          <div className="mt-14 border-t border-[#F9D2BA] pt-10">
            <h2 className="text-2xl font-bold text-[#1D4533]">
              Related PDF Tools
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">

              <Link
                to="/tools/pdf-to-jpg"
                className="group rounded-xl border border-[#F9D2BA] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="font-semibold text-[#1D4533]">
                  PDF to JPG
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Convert PDF pages into JPG images.
                </p>

                <FiRefreshCw
                  size={18}
                  className="mt-4 text-[#1D4533] transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/tools/pdf-to-png"
                className="group rounded-xl border border-[#F9D2BA] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="font-semibold text-[#1D4533]">
                  PDF to PNG
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Convert PDF pages into PNG images.
                </p>

                <FiRefreshCw
                  size={18}
                  className="mt-4 text-[#1D4533] transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/tools/pdf-merger"
                className="group rounded-xl border border-[#F9D2BA] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="font-semibold text-[#1D4533]">
                  PDF Merger
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Merge multiple PDF files into one document.
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

export default JpgToPdf