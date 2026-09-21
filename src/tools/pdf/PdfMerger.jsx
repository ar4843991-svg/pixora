import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PDFDocument } from 'pdf-lib'
import {
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiLayers,
  FiRefreshCw,
  FiTrash2,
  FiUploadCloud,
} from 'react-icons/fi'

import SEO from '../../components/SEO'

function PdfMerger() {
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')
  const [isMerging, setIsMerging] = useState(false)
  const [mergedPdfUrl, setMergedPdfUrl] = useState('')

  useEffect(() => {
    return () => {
      if (mergedPdfUrl) {
        URL.revokeObjectURL(mergedPdfUrl)
      }
    }
  }, [mergedPdfUrl])

  function validateFiles(selectedFiles) {
    const invalidFile = selectedFiles.find(
      (file) =>
        file.type !== 'application/pdf' &&
        !file.name.toLowerCase().endsWith('.pdf')
    )

    if (invalidFile) {
      return 'Please select PDF files only.'
    }

    const tooLargeFile = selectedFiles.find(
      (file) => file.size > 20 * 1024 * 1024
    )

    if (tooLargeFile) {
      return 'Each PDF must be smaller than 20 MB.'
    }

    return ''
  }

  function addFiles(selectedFiles) {
    if (selectedFiles.length === 0) return

    const validationError = validateFiles(selectedFiles)

    if (validationError) {
      setError(validationError)
      return
    }

    setError('')

    setFiles((previousFiles) => [
      ...previousFiles,
      ...selectedFiles,
    ])

    setMergedPdfUrl('')
  }

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files)

    addFiles(selectedFiles)

    event.target.value = ''
  }

  function handleDrop(event) {
    event.preventDefault()

    const droppedFiles = Array.from(event.dataTransfer.files)

    addFiles(droppedFiles)
  }

  function handleDragOver(event) {
    event.preventDefault()
  }

  function removeFile(indexToRemove) {
    setFiles((previousFiles) =>
      previousFiles.filter(
        (_, index) => index !== indexToRemove
      )
    )

    setMergedPdfUrl('')
    setError('')
  }

  async function mergePdfs() {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.')
      return
    }

    setIsMerging(true)
    setError('')
    setMergedPdfUrl('')

    try {
      const mergedPdf = await PDFDocument.create()

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()

        const sourcePdf = await PDFDocument.load(arrayBuffer)

        const copiedPages = await mergedPdf.copyPages(
          sourcePdf,
          sourcePdf.getPageIndices()
        )

        copiedPages.forEach((page) => {
          mergedPdf.addPage(page)
        })
      }

      const mergedPdfBytes = await mergedPdf.save()

      const blob = new Blob([mergedPdfBytes], {
        type: 'application/pdf',
      })

      const pdfUrl = URL.createObjectURL(blob)

      setMergedPdfUrl(pdfUrl)
    } catch (err) {
      console.error('PDF merge error:', err)

      setError(
        'Could not merge the PDF files. Please make sure the files are valid PDFs and try again.'
      )
    } finally {
      setIsMerging(false)
    }
  }

  function downloadMergedPdf() {
    if (!mergedPdfUrl) return

    const link = document.createElement('a')

    link.href = mergedPdfUrl
    link.download = 'pixora-merged.pdf'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function resetMerger() {
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl)
    }

    setFiles([])
    setError('')
    setIsMerging(false)
    setMergedPdfUrl('')
  }

  const totalSize = files.reduce(
    (total, file) => total + file.size,
    0
  )

  return (
    <>
      <SEO
        title="PDF Merger Online | Merge PDF Files Free | Pixora"
        description="Merge multiple PDF files into one PDF online for free with Pixora. Combine PDF documents directly in your browser without installing software."
      />

      <section className="px-4 py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1D4533] text-white shadow-sm">
              <FiLayers size={27} />
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#1D4533] sm:text-4xl">
              Merge PDF Files Online
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Combine multiple PDF files into one document quickly and
              easily — directly in your browser.
            </p>
          </motion.div>

          {/* Main Tool */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
            className="mt-10 rounded-2xl border border-[#F9D2BA] bg-white p-5 shadow-sm sm:p-8"
          >
            {/* Upload Area */}
            {!mergedPdfUrl && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="rounded-2xl border-2 border-dashed border-[#1D4533]/30 bg-[#F7EAE0]/50 p-7 text-center transition-colors duration-200 hover:border-[#1D4533]/60 sm:p-10"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#1D4533] shadow-sm">
                  <FiUploadCloud size={28} />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-[#1D4533]">
                  Upload your PDF files
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Drag and drop your files here, or choose them from
                  your device.
                </p>

                <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:opacity-90">
                  <FiUploadCloud size={18} />
                  Choose PDF Files

                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <p className="mt-4 text-xs text-gray-500">
                  PDF files only · Maximum 20 MB per file
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                {error}
              </motion.div>
            )}

            {/* Selected Files */}
            {files.length > 0 && !mergedPdfUrl && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1D4533]">
                      Selected PDF Files
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Files will be merged in the order shown below.
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-[#F7EAE0] px-3 py-1 text-sm font-medium text-[#1D4533]">
                    {files.length}{' '}
                    {files.length === 1 ? 'file' : 'files'}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {files.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${index}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#1D4533] shadow-sm">
                        <FiFileText size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-medium text-gray-700">
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>

                      <span className="hidden shrink-0 text-sm font-semibold text-[#1D4533] sm:block">
                        #{index + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove ${file.name}`}
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-5 flex flex-col gap-2 rounded-xl bg-[#F7EAE0] px-4 py-3 text-sm text-gray-700 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Total size:{' '}
                    <strong className="text-[#1D4533]">
                      {(totalSize / (1024 * 1024)).toFixed(2)} MB
                    </strong>
                  </span>

                  <span>
                    {files.length < 2
                      ? 'Add at least one more PDF'
                      : 'Ready to merge'}
                  </span>
                </div>

                {/* Merge Button */}
                <motion.button
                  type="button"
                  onClick={mergePdfs}
                  disabled={isMerging || files.length < 2}
                  whileHover={
                    !isMerging && files.length >= 2
                      ? { y: -2 }
                      : {}
                  }
                  whileTap={
                    !isMerging && files.length >= 2
                      ? { scale: 0.98 }
                      : {}
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3.5 font-medium text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isMerging ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <FiRefreshCw size={18} />
                      </motion.span>

                      Merging PDFs...
                    </>
                  ) : (
                    <>
                      <FiLayers size={18} />
                      Merge {files.length >= 2 ? `${files.length} PDFs` : 'PDFs'}
                    </>
                  )}
                </motion.button>

                {isMerging && (
                  <p className="mt-4 text-center text-sm text-gray-500">
                    Please wait while your PDF files are being merged.
                  </p>
                )}
              </motion.div>
            )}

            {/* Success */}
            {mergedPdfUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="py-4 text-center sm:py-6"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1D4533] text-white shadow-sm">
                  <FiCheckCircle size={30} />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-[#1D4533]">
                  PDFs Merged Successfully
                </h2>

                <p className="mx-auto mt-2 max-w-lg leading-7 text-gray-600">
                  Your {files.length} PDF files have been combined into
                  one document.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <motion.button
                    type="button"
                    onClick={downloadMergedPdf}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white shadow-sm transition hover:opacity-90"
                  >
                    <FiDownload size={18} />
                    Download Merged PDF
                  </motion.button>

                  <button
                    type="button"
                    onClick={resetMerger}
                    className="flex items-center justify-center gap-2 rounded-lg border border-[#1D4533] px-6 py-3 font-medium text-[#1D4533] transition hover:bg-gray-50"
                  >
                    <FiRefreshCw size={18} />
                    Merge Another Set
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* SEO Content */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="mt-12 rounded-2xl border border-[#F9D2BA] bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-2xl font-bold text-[#1D4533]">
              Merge PDF Files Online
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora's PDF merger lets you combine multiple PDF documents
              into a single file directly in your browser. Upload your
              PDFs, review the file order and merge them into one document
              without installing additional software.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-[#1D4533]">
              How to Merge PDFs
            </h3>

            <ol className="mt-4 space-y-3 text-gray-600">
              <li>
                <span className="font-semibold text-[#1D4533]">1.</span>{' '}
                Select two or more PDF files.
              </li>
              <li>
                <span className="font-semibold text-[#1D4533]">2.</span>{' '}
                Review the files you selected.
              </li>
              <li>
                <span className="font-semibold text-[#1D4533]">3.</span>{' '}
                Click the merge button to combine them.
              </li>
              <li>
                <span className="font-semibold text-[#1D4533]">4.</span>{' '}
                Download your merged PDF.
              </li>
            </ol>

            <h3 className="mt-8 text-xl font-semibold text-[#1D4533]">
              Why Use Pixora PDF Merger?
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl bg-[#F7EAE0] p-4">
                <FiCheckCircle
                  className="mt-0.5 shrink-0 text-[#1D4533]"
                  size={18}
                />
                <p className="text-sm leading-6 text-gray-700">
                  Combine multiple PDF files into one document.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#F7EAE0] p-4">
                <FiCheckCircle
                  className="mt-0.5 shrink-0 text-[#1D4533]"
                  size={18}
                />
                <p className="text-sm leading-6 text-gray-700">
                  Review your selected files before merging.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#F7EAE0] p-4">
                <FiCheckCircle
                  className="mt-0.5 shrink-0 text-[#1D4533]"
                  size={18}
                />
                <p className="text-sm leading-6 text-gray-700">
                  Remove individual files before processing.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#F7EAE0] p-4">
                <FiCheckCircle
                  className="mt-0.5 shrink-0 text-[#1D4533]"
                  size={18}
                />
                <p className="text-sm leading-6 text-gray-700">
                  Works directly in your browser.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Related Tools */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1D4533]">
                More PDF Tools
              </h2>

              <p className="mt-2 text-gray-600">
                Try more useful PDF tools from Pixora.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Link
                to="/tools/jpg-to-pdf"
                className="rounded-xl border border-[#F9D2BA] bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <FiFileText
                  className="mx-auto text-[#1D4533]"
                  size={24}
                />

                <h3 className="mt-3 font-semibold text-[#1D4533]">
                  JPG to PDF
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Convert images into PDF files.
                </p>
              </Link>

              <Link
                to="/tools/pdf-to-jpg"
                className="rounded-xl border border-[#F9D2BA] bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <FiFileText
                  className="mx-auto text-[#1D4533]"
                  size={24}
                />

                <h3 className="mt-3 font-semibold text-[#1D4533]">
                  PDF to JPG
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Convert PDF pages to JPG images.
                </p>
              </Link>

              <Link
                to="/tools/pdf-to-png"
                className="rounded-xl border border-[#F9D2BA] bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <FiFileText
                  className="mx-auto text-[#1D4533]"
                  size={24}
                />

                <h3 className="mt-3 font-semibold text-[#1D4533]">
                  PDF to PNG
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Convert PDF pages to PNG images.
                </p>
              </Link>
            </div>
          </motion.section>
        </div>
      </section>
    </>
  )
}

export default PdfMerger