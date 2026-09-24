import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import JSZip from 'jszip'
import { motion } from 'framer-motion'
import {
  FiArrowRight,
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiImage,
  FiRefreshCw,
  FiShield,
  FiUploadCloud,
  FiZap,
} from 'react-icons/fi'

import ToolPageSEO from '../../components/ToolPageSEO'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

function PdfToPng() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [images, setImages] = useState([])
  const [isConverting, setIsConverting] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  function handleFile(selectedFile) {
    if (!selectedFile) return

    const isPdf =
      selectedFile.type === 'application/pdf' ||
      /\.pdf$/i.test(selectedFile.name)

    if (!isPdf) {
      setError('Please select a PDF file.')
      setFile(null)
      setPageCount(0)
      setCurrentPage(0)
      setImages([])
      return
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('PDF must be smaller than 20 MB.')
      setFile(null)
      setPageCount(0)
      setCurrentPage(0)
      setImages([])
      return
    }

    setError('')
    setFile(selectedFile)
    setPageCount(0)
    setCurrentPage(0)
    setImages([])
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

  async function convertAllPages(loadedPdf) {
    const renderedImages = []

    for (
      let pageNumber = 1;
      pageNumber <= loadedPdf.numPages;
      pageNumber++
    ) {
      setCurrentPage(pageNumber)

      const page = await loadedPdf.getPage(pageNumber)

      const viewport = page.getViewport({
        scale: 1.5,
      })

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (!context) {
        throw new Error('Could not create canvas context.')
      }

      canvas.width = viewport.width
      canvas.height = viewport.height

      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = 'high'

      await page.render({
        canvasContext: context,
        viewport,
      }).promise

      const imageUrl = canvas.toDataURL('image/png')

      renderedImages.push({
        pageNumber,
        imageUrl,
      })

      canvas.width = 0
      canvas.height = 0
    }

    return renderedImages
  }

  async function convertPdf() {
    if (!file) {
      setError('Please select a PDF first.')
      return
    }

    try {
      setIsConverting(true)
      setError('')
      setImages([])
      setPageCount(0)
      setCurrentPage(0)

      const arrayBuffer = await file.arrayBuffer()

      const loadedPdf = await pdfjsLib
        .getDocument({
          data: arrayBuffer,
        })
        .promise

      setPageCount(loadedPdf.numPages)

      const renderedImages =
        await convertAllPages(loadedPdf)

      setImages(renderedImages)
    } catch (err) {
      console.error('Error converting PDF:', err)

      setError(
        'Could not convert this PDF. Please try another PDF.'
      )

      setPageCount(0)
      setCurrentPage(0)
      setImages([])
    } finally {
      setIsConverting(false)
    }
  }

  function downloadImage(imageUrl, pageNumber) {
    const link = document.createElement('a')

    link.href = imageUrl
    link.download = `pixora-page-${pageNumber}.png`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function downloadAllAsZip() {
    if (images.length === 0) return

    try {
      setError('')

      const zip = new JSZip()

      images.forEach((image) => {
        const base64Data =
          image.imageUrl.split(',')[1]

        zip.file(
          `page-${image.pageNumber}.png`,
          base64Data,
          {
            base64: true,
          }
        )
      })

      const zipBlob = await zip.generateAsync({
        type: 'blob',
      })

      const zipUrl =
        URL.createObjectURL(zipBlob)

      const link = document.createElement('a')

      link.href = zipUrl
      link.download = 'pixora-pdf-to-png.zip'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(zipUrl)
    } catch (err) {
      console.error('ZIP download error:', err)

      setError(
        'Could not create the ZIP file. Please try again.'
      )
    }
  }

  function resetConverter() {
    setFile(null)
    setError('')
    setImages([])
    setPageCount(0)
    setCurrentPage(0)
    setIsConverting(false)
    setIsDragging(false)
  }

  return (
    <>
      <ToolPageSEO
        title="PDF to PNG Converter Online"
        description="Convert PDF pages to PNG images online for free with Pixora. Download individual PNG pages or all converted pages as a ZIP file directly in your browser."
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
              <FiImage size={27} />
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#1D4533] sm:text-5xl">
              PDF to PNG Converter
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Convert PDF pages into PNG images directly in your
              browser and download individual pages or all pages
              together as a ZIP file.
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
                  Upload your PDF
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Drag and drop a PDF here, or choose one from your
                  device.
                </p>

                <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:opacity-90">
                  <FiUploadCloud size={18} />

                  Choose PDF

                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <p className="mt-4 text-xs text-gray-500">
                  PDF files · Maximum 20 MB
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

            {/* Selected PDF */}
            {file && images.length === 0 && (
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
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F9D2BA] text-[#1D4533]">
                      <FiFileText size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="break-words font-semibold text-[#1D4533]">
                        {file.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={resetConverter}
                      disabled={isConverting}
                      className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-white hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Remove PDF"
                    >
                      <FiRefreshCw size={18} />
                    </button>
                  </div>
                </div>

                {/* Convert Button */}
                <motion.button
                  type="button"
                  onClick={convertPdf}
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

                      Converting...
                    </>
                  ) : (
                    <>
                      <FiImage size={18} />
                      Convert PDF to PNG
                    </>
                  )}
                </motion.button>

                {/* Progress */}
                {isConverting && pageCount > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                      <span>
                        Converting page {currentPage} of {pageCount}
                      </span>

                      <span>
                        {Math.round(
                          (currentPage / pageCount) * 100
                        )}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${Math.max(
                            5,
                            (currentPage / pageCount) * 100
                          )}%`,
                        }}
                        className="h-full rounded-full bg-[#1D4533]"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Results */}
            {images.length > 0 && (
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
                {/* Success */}
                <div className="rounded-xl bg-[#F7EAE0] p-5 text-center sm:p-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1D4533] text-white">
                    <FiCheckCircle size={27} />
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-[#1D4533]">
                    PDF Converted Successfully
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {images.length}{' '}
                    {images.length === 1 ? 'page' : 'pages'} converted
                    to PNG images.
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <motion.button
                    type="button"
                    onClick={downloadAllAsZip}
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-5 py-3 font-medium text-white shadow-sm transition hover:opacity-90"
                  >
                    <FiDownload size={18} />
                    Download All as ZIP
                  </motion.button>

                  <button
                    type="button"
                    onClick={resetConverter}
                    className="flex items-center justify-center gap-2 rounded-lg border border-[#1D4533] px-5 py-3 font-medium text-[#1D4533] transition hover:bg-gray-50"
                  >
                    <FiRefreshCw size={18} />
                    Convert Another PDF
                  </button>
                </div>

                {/* Converted Pages */}
                <div className="mt-8">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1D4533]">
                        Converted Pages
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Download any page individually or download
                        everything as a ZIP file.
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-[#F7EAE0] px-3 py-1 text-xs font-semibold text-[#1D4533]">
                      {images.length} PNG
                      {images.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    {images.map((image) => (
                      <motion.div
                        key={image.pageNumber}
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.35,
                          delay: Math.min(
                            image.pageNumber * 0.04,
                            0.35
                          ),
                        }}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                      >
                        <div className="flex min-h-64 items-center justify-center bg-gray-50 p-4">
                          <img
                            src={image.imageUrl}
                            alt={`Converted PDF page ${image.pageNumber}`}
                            className="max-h-72 max-w-full rounded-lg object-contain shadow-sm"
                            loading="lazy"
                          />
                        </div>

                        <div className="flex items-center justify-between gap-3 border-t border-gray-200 p-4">
                          <div>
                            <p className="font-semibold text-[#1D4533]">
                              Page {image.pageNumber}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              PNG image
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              downloadImage(
                                image.imageUrl,
                                image.pageNumber
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-[#F7EAE0] px-4 py-2 text-sm font-semibold text-[#1D4533] transition hover:bg-[#F9D2BA]"
                          >
                            <FiDownload size={16} />
                            Download
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
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
                text: 'Convert PDF pages into PNG images directly in your browser.',
              },
              {
                icon: FiShield,
                title: 'Browser Based',
                text: 'Your PDF is processed in the browser without requiring a file upload service.',
              },
              {
                icon: FiDownload,
                title: 'Easy Downloads',
                text: 'Download individual PNG pages or collect all pages in one ZIP file.',
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
              Convert PDF to PNG Online for Free
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora's free PDF to PNG converter turns PDF pages
              into separate PNG images. Each page is rendered as an
              individual PNG file that you can preview and download
              separately or collect together in a ZIP archive.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              PNG can be useful when you want a lossless image format
              for graphics, screenshots, documents, diagrams or
              other content where image quality and clear details
              matter.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-[#1D4533]">
              How to Convert PDF to PNG
            </h3>

            <ol className="mt-4 space-y-3 text-gray-600">
              <li>
                <span className="font-semibold text-[#1D4533]">
                  1.
                </span>{' '}
                Upload your PDF file.
              </li>

              <li>
                <span className="font-semibold text-[#1D4533]">
                  2.
                </span>{' '}
                Click Convert PDF to PNG.
              </li>

              <li>
                <span className="font-semibold text-[#1D4533]">
                  3.
                </span>{' '}
                Pixora processes each page into a PNG image.
              </li>

              <li>
                <span className="font-semibold text-[#1D4533]">
                  4.
                </span>{' '}
                Preview the converted pages.
              </li>

              <li>
                <span className="font-semibold text-[#1D4533]">
                  5.
                </span>{' '}
                Download individual PNG files or all pages as a ZIP.
              </li>
            </ol>

            <h3 className="mt-8 text-xl font-semibold text-[#1D4533]">
              Why Convert PDF Pages to PNG?
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                'Create image versions of PDF pages for digital projects.',
                'Keep a lossless PNG image format for converted pages.',
                'Use individual PDF pages as standard image files.',
                'Download multiple converted pages together as a ZIP.',
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

            <h3 className="mt-8 text-xl font-semibold text-[#1D4533]">
              Free PDF to PNG Image Converter
            </h3>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora provides simple browser-based tools for common
              image and PDF tasks. The PDF to PNG converter supports
              PDF files up to 20 MB and creates a separate PNG image
              for every page in the document.
            </p>
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
                    'Can I convert a multi-page PDF to PNG?',
                  answer:
                    'Yes. Pixora converts each page of the selected PDF into a separate PNG image.',
                },
                {
                  question:
                    'How large can my PDF file be?',
                  answer:
                    'The current Pixora PDF to PNG converter accepts PDF files up to 20 MB.',
                },
                {
                  question:
                    'Why use PNG instead of JPG?',
                  answer:
                    'PNG is a lossless image format and can be useful when preserving clear graphics, text and fine details is important.',
                },
                {
                  question:
                    'Can I download one PNG page at a time?',
                  answer:
                    'Yes. Each converted page has its own download button.',
                },
                {
                  question:
                    'Can I download all PNG pages together?',
                  answer:
                    'Yes. Use Download All as ZIP to collect every converted PNG page in one ZIP file.',
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
                Explore more free PDF and image tools from Pixora.
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
                  to="/tools/jpg-to-pdf"
                  className="group rounded-xl border border-[#F9D2BA] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <FiFileText
                    className="text-[#1D4533]"
                    size={23}
                  />

                  <h3 className="mt-3 font-semibold text-[#1D4533]">
                    JPG to PDF
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Convert JPG and PNG images into PDF files.
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

export default PdfToPng