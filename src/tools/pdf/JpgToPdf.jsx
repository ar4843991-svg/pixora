import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import { motion } from 'framer-motion'
import {
  FiArrowRight,
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiImage,
  FiInfo,
  FiRefreshCw,
  FiTrash2,
  FiUploadCloud,
  FiZap,
} from 'react-icons/fi'

import ToolPageSEO from '../../components/ToolPageSEO'

function JpgToPdf() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function validateFile(selectedFile) {
    if (!selectedFile) {
      return 'Please select an image file.'
    }

    const isSupportedType = [
      'image/jpeg',
      'image/png',
    ].includes(selectedFile.type)

    const isSupportedExtension =
      /\.(jpe?g|png)$/i.test(selectedFile.name)

    if (!isSupportedType && !isSupportedExtension) {
      return 'Please select a JPG or PNG image.'
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      return 'Image must be smaller than 10 MB.'
    }

    return ''
  }

  function handleFile(selectedFile) {
    if (!selectedFile) return

    const validationError = validateFile(selectedFile)

    if (validationError) {
      setError(validationError)
      setFile(null)
      setIsSuccess(false)
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const imageUrl = URL.createObjectURL(selectedFile)

    setFile(selectedFile)
    setPreviewUrl(imageUrl)
    setError('')
    setIsSuccess(false)
  }

  function handleFileChange(event) {
    handleFile(event.target.files?.[0])
    event.target.value = ''
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)

    handleFile(event.dataTransfer.files?.[0])
  }

  function handleDragOver(event) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(event) {
    event.preventDefault()
    setIsDragging(false)
  }

  async function convertToPdf() {
    if (!file || !previewUrl) {
      setError('Please select an image first.')
      return
    }

    try {
      setIsConverting(true)
      setError('')
      setIsSuccess(false)

      const image = new Image()
      image.src = previewUrl

      await new Promise((resolve, reject) => {
        image.onload = resolve
        image.onerror = reject
      })

      const imageWidth = image.naturalWidth
      const imageHeight = image.naturalHeight

      if (!imageWidth || !imageHeight) {
        throw new Error('Invalid image dimensions.')
      }

      const orientation =
        imageWidth >= imageHeight
          ? 'landscape'
          : 'portrait'

      const pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: [imageWidth, imageHeight],
        compress: true,
      })

      pdf.addImage(
        image,
        file.type === 'image/png'
          ? 'PNG'
          : 'JPEG',
        0,
        0,
        imageWidth,
        imageHeight
      )

      pdf.save('pixora-image.pdf')

      setIsSuccess(true)
    } catch (err) {
      console.error('JPG to PDF conversion error:', err)

      setError(
        'Could not convert this image to PDF. Please try another image.'
      )
    } finally {
      setIsConverting(false)
    }
  }

  function removeFile() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setFile(null)
    setPreviewUrl('')
    setError('')
    setIsSuccess(false)
  }

  function resetConverter() {
    removeFile()
    setIsDragging(false)
    setIsConverting(false)
  }

  return (
    <>
      <ToolPageSEO
        title="JPG to PDF Converter Online"
        description="Convert JPG and PNG images to PDF online for free with Pixora. Create a PDF from your image directly in your browser without uploading your file."
      />

      <section className="px-4 py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-4xl">

          {/* Breadcrumb */}
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1D4533] transition hover:gap-3"
          >
            <FiArrowRight
              className="rotate-180"
              size={16}
            />

            Back to all tools
          </Link>

          {/* Header */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
              ease: 'easeOut',
            }}
            className="mt-8 text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F9D2BA] text-[#1D4533]">
              <FiFileText size={27} />
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#1D4533] sm:text-5xl">
              JPG to PDF Converter
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Convert JPG and PNG images into a PDF file directly
              in your browser. Simple, fast and easy to use.
            </p>
          </motion.div>

          {/* Tool Card */}
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
              delay: 0.1,
              ease: 'easeOut',
            }}
            className="mt-10 rounded-2xl border border-[#F9D2BA] bg-white p-5 shadow-sm sm:p-8"
          >
            {/* Upload */}
            {!file && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`rounded-2xl border-2 border-dashed p-7 text-center transition-all duration-200 sm:p-10 ${
                  isDragging
                    ? 'border-[#1D4533] bg-[#F7EAE0]'
                    : 'border-[#1D4533]/30 bg-[#F7EAE0]/50 hover:border-[#1D4533]/60'
                }`}
              >
                <motion.div
                  animate={
                    isDragging
                      ? {
                          scale: 1.08,
                          y: -3,
                        }
                      : {
                          scale: 1,
                          y: 0,
                        }
                  }
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#1D4533] shadow-sm"
                >
                  <FiUploadCloud size={28} />
                </motion.div>

                <h2 className="mt-5 text-xl font-semibold text-[#1D4533]">
                  Upload your image
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Drag and drop a JPG or PNG image here, or choose
                  one from your device.
                </p>

                <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:opacity-90">
                  <FiUploadCloud size={18} />

                  Choose Image

                  <input
                    type="file"
                    accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <p className="mt-4 text-xs text-gray-500">
                  JPG or PNG · Maximum 10 MB
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                role="alert"
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                {error}
              </motion.div>
            )}

            {/* Selected Image */}
            {file && !isSuccess && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1D4533]">
                      Selected Image
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Your image will be placed into a PDF using its
                      original dimensions.
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-[#F7EAE0] px-3 py-1 text-sm font-medium text-[#1D4533]">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>

                {/* Preview */}
                <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex min-h-56 items-center justify-center p-4 sm:min-h-72">
                    <img
                      src={previewUrl}
                      alt={`Preview of ${file.name}`}
                      className="max-h-80 max-w-full rounded-lg object-contain shadow-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-3 border-t border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7EAE0] text-[#1D4533]">
                        <FiImage size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="break-words text-sm font-medium text-gray-700">
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Ready for PDF conversion
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      disabled={isConverting}
                      className="flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
                      aria-label="Remove selected image"
                    >
                      <FiTrash2 size={17} />
                    </button>
                  </div>
                </div>

                {/* Convert */}
                <motion.button
                  type="button"
                  onClick={convertToPdf}
                  disabled={isConverting}
                  whileHover={
                    !isConverting
                      ? {
                          y: -2,
                        }
                      : {}
                  }
                  whileTap={
                    !isConverting
                      ? {
                          scale: 0.98,
                        }
                      : {}
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3.5 font-medium text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isConverting ? (
                    <>
                      <motion.span
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <FiRefreshCw size={18} />
                      </motion.span>

                      Creating PDF...
                    </>
                  ) : (
                    <>
                      <FiFileText size={18} />
                      Convert to PDF
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* Success */}
            {isSuccess && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="py-5 text-center sm:py-7"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1D4533] text-white shadow-sm">
                  <FiCheckCircle size={30} />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-[#1D4533]">
                  PDF Created Successfully
                </h2>

                <p className="mx-auto mt-3 max-w-lg leading-7 text-gray-600">
                  Your image has been converted into a PDF and the
                  download should start automatically.
                </p>

                <div className="mx-auto mt-6 flex max-w-xl items-start gap-3 rounded-xl border border-[#F9D2BA] bg-[#F7EAE0] p-4 text-left">
                  <FiCheckCircle
                    className="mt-0.5 shrink-0 text-[#1D4533]"
                    size={19}
                  />

                  <p className="text-sm leading-6 text-gray-700">
                    The PDF was generated directly in your browser.
                    No separate upload step is required.
                  </p>
                </div>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={convertToPdf}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90"
                  >
                    <FiDownload size={18} />
                    Download PDF Again
                  </button>

                  <button
                    type="button"
                    onClick={resetConverter}
                    className="flex items-center justify-center gap-2 rounded-lg border border-[#1D4533] px-6 py-3 font-medium text-[#1D4533] transition hover:bg-gray-50"
                  >
                    <FiRefreshCw size={18} />
                    Convert Another Image
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Benefits */}
          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mt-12 grid gap-4 sm:grid-cols-3"
          >
            {[
              {
                icon: FiZap,
                title: 'Fast Conversion',
                text: 'Turn a JPG or PNG image into a PDF with a simple browser-based workflow.',
              },
              {
                icon: FiImage,
                title: 'JPG & PNG Support',
                text: 'Convert common JPG and PNG image files into PDF documents.',
              },
              {
                icon: FiInfo,
                title: 'Simple Workflow',
                text: 'Upload your image, convert it and download the generated PDF.',
              },
            ].map((benefit) => {
              const Icon = benefit.icon

              return (
                <div
                  key={benefit.title}
                  className="rounded-xl border border-[#F9D2BA] bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7EAE0] text-[#1D4533]">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-4 font-semibold text-[#1D4533]">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {benefit.text}
                  </p>
                </div>
              )
            })}
          </motion.section>

          {/* SEO Content */}
          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mt-12 rounded-2xl border border-[#F9D2BA] bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-2xl font-bold text-[#1D4533]">
              Convert JPG to PDF Online for Free
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora's free JPG to PDF converter lets you turn JPG
              and PNG images into PDF documents online. The tool is
              designed for quick conversions when you need an image
              in a standard PDF format.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              The conversion takes place directly in your browser.
              Your selected image is processed locally to create the
              PDF, making the workflow simple without requiring a
              separate file upload service.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-[#1D4533]">
              How to Convert JPG to PDF
            </h3>

            <ol className="mt-4 space-y-3 text-gray-600">
              <li>
                <span className="font-semibold text-[#1D4533]">
                  1.
                </span>{' '}
                Upload a JPG or PNG image.
              </li>

              <li>
                <span className="font-semibold text-[#1D4533]">
                  2.
                </span>{' '}
                Preview the selected image.
              </li>

              <li>
                <span className="font-semibold text-[#1D4533]">
                  3.
                </span>{' '}
                Click Convert to PDF.
              </li>

              <li>
                <span className="font-semibold text-[#1D4533]">
                  4.
                </span>{' '}
                Pixora creates a PDF using the image dimensions.
              </li>

              <li>
                <span className="font-semibold text-[#1D4533]">
                  5.
                </span>{' '}
                Download the generated PDF.
              </li>
            </ol>

            <h3 className="mt-8 text-xl font-semibold text-[#1D4533]">
              JPG and PNG to PDF
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                'Convert JPG images into PDF documents.',
                'Convert PNG images into PDF documents.',
                'Keep the image proportions when creating the PDF.',
                'Process images directly in your browser.',
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-start gap-3 rounded-xl bg-[#F7EAE0] p-4"
                >
                  <FiCheckCircle
                    className="mt-0.5 shrink-0 text-[#1D4533]"
                    size={18}
                  />

                  <p className="text-sm leading-6 text-gray-700">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#F9D2BA] bg-[#F7EAE0]/60 p-4">
              <FiInfo
                className="mt-0.5 shrink-0 text-[#1D4533]"
                size={18}
              />

              <p className="text-sm leading-6 text-gray-700">
                This tool currently converts one image into one PDF
                at a time. For combining multiple PDFs, use Pixora's
                PDF Merger.
              </p>
            </div>
          </motion.section>

          {/* FAQ */}
          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-[#1D4533] sm:text-3xl">
              Frequently Asked Questions
            </h2>

            <div className="mt-5 space-y-3">
              {[
                {
                  question:
                    'Can I convert JPG to PDF for free?',
                  answer:
"Yes. Pixora's JPG to PDF converter is free to use and works directly in your browser.",                },
                {
                  question:
                    'Can I convert PNG to PDF?',
                  answer:
                    'Yes. The tool supports both JPG and PNG image files.',
                },
                {
                  question:
                    'How large can my image be?',
                  answer:
                    'The current JPG to PDF converter accepts image files up to 10 MB.',
                },
                {
                  question:
                    'Will my image proportions be preserved?',
                  answer:
                    'Yes. The PDF page is created using the original image dimensions and orientation.',
                },
                {
                  question:
                    'Does JPG to PDF work on mobile devices?',
                  answer:
                    'Yes. The converter is designed to work in modern mobile and desktop browsers.',
                },
              ].map((item) => (
                <details
                  key={item.question}
                  className="group rounded-xl border border-[#F9D2BA] bg-white p-5"
                >
                  <summary className="cursor-pointer list-none pr-6 font-semibold text-[#1D4533]">
                    <div className="flex items-center justify-between gap-4">
                      <span>{item.question}</span>

                      <FiArrowRight
                        size={18}
                        className="shrink-0 rotate-90 transition-transform group-open:-rotate-90"
                      />
                    </div>
                  </summary>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </motion.section>

          {/* Related Tools */}
          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mt-12"
          >
            <div className="border-t border-[#F9D2BA] pt-10">
              <h2 className="text-2xl font-bold text-[#1D4533]">
                Related PDF Tools
              </h2>

              <p className="mt-2 text-gray-600">
                Explore more free image and PDF tools from Pixora.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">

                <Link
                  to="/tools/pdf-to-jpg"
                  className="group rounded-xl border border-[#F9D2BA] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <FiImage
                    className="text-[#1D4533]"
                    size={23}
                  />

                  <h3 className="mt-3 font-semibold text-[#1D4533]">
                    PDF to JPG
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Convert PDF pages into JPG images online.
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1D4533]">
                    Open Tool

                    <FiArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>

                <Link
                  to="/tools/pdf-to-png"
                  className="group rounded-xl border border-[#F9D2BA] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <FiImage
                    className="text-[#1D4533]"
                    size={23}
                  />

                  <h3 className="mt-3 font-semibold text-[#1D4533]">
                    PDF to PNG
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Convert PDF pages into PNG images online.
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1D4533]">
                    Open Tool

                    <FiArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>

                <Link
                  to="/tools/pdf-merger"
                  className="group rounded-xl border border-[#F9D2BA] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <FiFileText
                    className="text-[#1D4533]"
                    size={23}
                  />

                  <h3 className="mt-3 font-semibold text-[#1D4533]">
                    PDF Merger
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Merge multiple PDF files into one document.
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1D4533]">
                    Open Tool

                    <FiArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>

              </div>
            </div>
          </motion.section>

          {/* Final CTA */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.45,
            }}
            className="mt-12 rounded-2xl bg-[#1D4533] px-6 py-8 text-center sm:px-10"
          >
            <h2 className="text-2xl font-bold text-white">
              Need another Pixora tool?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/80">
              Explore Pixora's free collection of image and PDF
              tools for everyday file tasks.
            </p>

            <Link
              to="/tools"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#F9D2BA] px-5 py-3 font-semibold text-[#1D4533] transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Explore All Tools

              <FiArrowRight size={18} />
            </Link>
          </motion.div>

        </div>
      </section>
    </>
  )
}

export default JpgToPdf