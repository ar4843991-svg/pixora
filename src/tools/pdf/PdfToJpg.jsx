import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import JSZip from 'jszip'
import { motion } from 'framer-motion'
import {
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiImage,
  FiRefreshCw,
  FiUpload,
} from 'react-icons/fi'

import SEO from '../../components/SEO'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

function PdfToJpg() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [images, setImages] = useState([])
  const [isConverting, setIsConverting] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  function handleFile(selectedFile) {
    if (!selectedFile) return

    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file.')
      setFile(null)
      setPageCount(0)
      setImages([])
      return
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('PDF must be smaller than 20 MB.')
      setFile(null)
      setPageCount(0)
      setImages([])
      return
    }

    setError('')
    setFile(selectedFile)
    setPageCount(0)
    setImages([])
  }

  function handleFileChange(event) {
    handleFile(event.target.files[0])
    event.target.value = ''
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)

    handleFile(event.dataTransfer.files[0])
  }

  async function convertAllPages(loadedPdf) {
    const renderedImages = []

    for (
      let pageNumber = 1;
      pageNumber <= loadedPdf.numPages;
      pageNumber++
    ) {
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

      const imageUrl = canvas.toDataURL(
        'image/jpeg',
        0.9
      )

      renderedImages.push({
        pageNumber,
        imageUrl,
      })
    }

    return renderedImages
  }

  async function loadPdf() {
    if (!file) {
      setError('Please select a PDF first.')
      return
    }

    try {
      setIsConverting(true)
      setError('')
      setImages([])

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
      setImages([])
    } finally {
      setIsConverting(false)
    }
  }

  function downloadImage(imageUrl, pageNumber) {
    const link = document.createElement('a')

    link.href = imageUrl
    link.download = `page-${pageNumber}.jpg`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function downloadAllAsZip() {
    if (images.length === 0) return

    try {
      const zip = new JSZip()

      images.forEach((image) => {
        const base64Data =
          image.imageUrl.split(',')[1]

        zip.file(
          `page-${image.pageNumber}.jpg`,
          base64Data,
          { base64: true }
        )
      })

      const zipBlob = await zip.generateAsync({
        type: 'blob',
      })

      const zipUrl =
        URL.createObjectURL(zipBlob)

      const link = document.createElement('a')

      link.href = zipUrl
      link.download = 'pixora-pdf-to-jpg.zip'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(zipUrl)
    } catch (err) {
      console.error('ZIP download error:', err)
      setError('Could not create the ZIP file.')
    }
  }

  function resetConverter() {
    setFile(null)
    setError('')
    setImages([])
    setPageCount(0)
    setIsConverting(false)
  }

  return (
    <>
      <SEO
        title="PDF to JPG Converter Online | Pixora"
        description="Convert PDF pages to JPG images online for free with Pixora. Download individual JPG pages or all converted pages as a ZIP file."
      />

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
            }}
            className="text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EAE0] text-[#1D4533]">
              <FiImage size={27} />
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#1D4533] sm:text-5xl">
              PDF to JPG Converter
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Convert PDF pages into JPG images directly in your
              browser. Download individual pages or all images
              together as a ZIP file.
            </p>
          </motion.div>

          {/* Upload Tool */}
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
              {!file ? (
                <>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EAE0] text-[#1D4533]">
                    <FiFileText size={27} />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-[#1D4533]">
                    Choose a PDF file
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    PDF up to 20 MB
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Or drag and drop your PDF here
                  </p>

                  <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#1D4533] px-5 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:opacity-90">
                    <FiUpload size={18} />
                    Choose PDF

                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EAE0] text-[#1D4533]">
                    <FiFileText size={27} />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-[#1D4533]">
                    PDF selected
                  </h2>

                  <div className="mx-auto mt-4 max-w-md rounded-xl bg-[#F7EAE0] p-4 text-left">
                    <p className="break-all text-sm font-medium text-[#1D4533]">
                      {file.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#1D4533] px-5 py-3 font-medium text-[#1D4533] transition hover:-translate-y-0.5 hover:bg-[#F7EAE0]">
                    <FiRefreshCw size={18} />
                    Choose Another PDF

                    <input
                      type="file"
                      accept="application/pdf,.pdf"
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
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-5 rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600"
              >
                {error}
              </motion.p>
            )}

            {/* Convert Button */}
            {file && images.length === 0 && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={loadPdf}
                  disabled={isConverting}
                  className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isConverting ? (
                    <>
                      <FiRefreshCw
                        className="animate-spin"
                        size={18}
                      />
                      Converting PDF...
                    </>
                  ) : (
                    <>
                      <FiImage size={18} />
                      Convert to JPG
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Loading */}
            {isConverting && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-5 text-center text-sm text-gray-500"
              >
                Converting each PDF page into a JPG image. Please
                keep this tab open.
              </motion.div>
            )}

            {/* Success */}
            {pageCount > 0 &&
              images.length > 0 &&
              !isConverting && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-5 flex items-center justify-center gap-2 text-sm text-[#1D4533]"
                >
                  <FiCheckCircle size={17} />

                  <span>
                    Successfully converted {pageCount}{' '}
                    {pageCount === 1 ? 'page' : 'pages'}.
                  </span>
                </motion.div>
              )}
          </motion.div>

          {/* Converted Pages */}
          {images.length > 0 && (
            <motion.section
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="mt-12"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-[#5E3122]">
                    Conversion Complete
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-[#1D4533] sm:text-3xl">
                    Converted JPG Pages
                  </h2>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={downloadAllAsZip}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-5 py-2.5 font-medium text-white transition hover:-translate-y-0.5 hover:opacity-90"
                  >
                    <FiDownload size={18} />
                    Download All JPGs
                  </button>

                  <button
                    type="button"
                    onClick={resetConverter}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1D4533] px-5 py-2.5 font-medium text-[#1D4533] transition hover:-translate-y-0.5 hover:bg-[#F7EAE0]"
                  >
                    <FiRefreshCw size={18} />
                    Convert Another
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {images.map((image) => (
                  <motion.div
                    key={image.pageNumber}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay:
                        Math.min(
                          image.pageNumber - 1,
                          6
                        ) * 0.05,
                    }}
                    className="overflow-hidden rounded-2xl border border-[#F9D2BA] bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-[#1D4533]">
                        Page {image.pageNumber}
                      </h3>

                      <FiImage
                        className="text-[#1D4533]"
                        size={18}
                      />
                    </div>

                    <div className="mt-4 overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={image.imageUrl}
                        alt={`PDF page ${image.pageNumber} converted to JPG`}
                        className="h-auto w-full"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        downloadImage(
                          image.imageUrl,
                          image.pageNumber
                        )
                      }
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#5E3122] px-5 py-2.5 font-medium text-white transition hover:-translate-y-0.5 hover:opacity-90"
                    >
                      <FiDownload size={18} />
                      Download JPG
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* SEO Content */}
          <motion.div
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
            className="mt-14"
          >
            <h2 className="text-2xl font-bold text-[#1D4533] sm:text-3xl">
              Convert PDF to JPG Online for Free
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora PDF to JPG Converter lets you turn PDF pages
              into JPG images directly in your browser. Each page is
              rendered as an individual JPG image that you can
              download separately or together as a ZIP file.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-[#1D4533]">
              How to Convert PDF to JPG
            </h2>

            <div className="mt-5 space-y-3">
              {[
                'Choose a PDF file up to 20 MB.',
                'Click Convert to JPG.',
                'Wait while Pixora converts each PDF page.',
                'Preview the converted JPG pages.',
                'Download individual images or all pages as a ZIP file.',
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
              Why Convert PDF Pages to JPG?
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              JPG images can be useful when you need to share an
              individual PDF page as an image, upload a page to a
              service that accepts image files, or reuse visual
              content from a document.
            </p>
          </motion.div>

          {/* Related Tools */}
          <div className="mt-14 border-t border-[#F9D2BA] pt-10">
            <h2 className="text-2xl font-bold text-[#1D4533]">
              Related PDF Tools
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
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
                to="/tools/jpg-to-pdf"
                className="group rounded-xl border border-[#F9D2BA] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="font-semibold text-[#1D4533]">
                  JPG to PDF
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Convert JPG and PNG images into PDF files.
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

export default PdfToJpg