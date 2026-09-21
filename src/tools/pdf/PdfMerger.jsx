import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import SEO from '../../components/SEO'

function PdfMerger() {
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')
  const [isMerging, setIsMerging] = useState(false)
  const [mergedPdfUrl, setMergedPdfUrl] = useState('')

 function handleFileChange(event) {
  const selectedFiles = Array.from(event.target.files)

  if (selectedFiles.length === 0) return

  const invalidFile = selectedFiles.find(
    (file) => file.type !== 'application/pdf'
  )

  if (invalidFile) {
    setError('Please select PDF files only.')
    return
  }

  const tooLargeFile = selectedFiles.find(
    (file) => file.size > 20 * 1024 * 1024
  )

  if (tooLargeFile) {
    setError('Each PDF must be smaller than 20 MB.')
    return
  }

  setError('')

  setFiles((previousFiles) => [
    ...previousFiles,
    ...selectedFiles,
  ])

  setMergedPdfUrl('')

  // Allow selecting the same file again if needed
  event.target.value = ''
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

        const sourcePdf = await PDFDocument.load(
          arrayBuffer
        )

        const copiedPages =
          await mergedPdf.copyPages(
            sourcePdf,
            sourcePdf.getPageIndices()
          )

        copiedPages.forEach((page) => {
          mergedPdf.addPage(page)
        })
      }

      const mergedPdfBytes =
        await mergedPdf.save()

      const blob = new Blob(
        [mergedPdfBytes],
        {
          type: 'application/pdf',
        }
      )

      const pdfUrl =
        URL.createObjectURL(blob)

      setMergedPdfUrl(pdfUrl)

      console.log(
        `Merged ${files.length} PDF files successfully`
      )
    } catch (err) {
      console.error(
        'PDF merge error:',
        err
      )

      setError(
        'Could not merge the PDF files. Please try again.'
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

  return (
    <>
      <SEO
        title="PDF Merger | Pixora"
        description="Merge multiple PDF files into one PDF online with Pixora."
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">

          {/* Heading */}
          <h1 className="text-3xl font-bold text-[#1D4533] sm:text-4xl">
            PDF Merger
          </h1>

          <p className="mt-4 text-gray-600">
            Combine multiple PDF files into one PDF
            quickly and easily.
          </p>

          {/* Upload Box */}
          <div className="mt-8 rounded-2xl border-2 border-dashed border-[#1D4533] bg-white p-6 text-center sm:p-10">

            <label className="cursor-pointer">
              <span className="font-medium text-[#1D4533]">
                Choose PDF Files
              </span>

              <input
                type="file"
                accept="application/pdf,.pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <p className="mt-2 text-sm text-gray-500">
              Select two or more PDF files.
            </p>

            {/* Error */}
            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="mt-8 text-left">

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-semibold text-[#1D4533]">
                    Selected PDF Files
                  </h2>

                  <span className="text-sm text-gray-500">
                    {files.length}{' '}
                    {files.length === 1
                      ? 'file'
                      : 'files'}
                  </span>
                </div>

                <div className="mt-4 space-y-3">

                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                    >
                      <span className="font-semibold text-[#1D4533]">
                        {index + 1}.
                      </span>

                      <div className="min-w-0">
                        <p className="break-words text-sm font-medium text-gray-700">
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ))}

                </div>

                {/* Merge Button */}
                {!mergedPdfUrl && (
                  <button
                    type="button"
                    onClick={mergePdfs}
                    disabled={
                      isMerging ||
                      files.length < 2
                    }
                    className="mt-6 w-full rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isMerging
                      ? 'Merging PDFs...'
                      : 'Merge PDFs'}
                  </button>
                )}

              </div>
            )}

            {/* Loading */}
            {isMerging && (
              <p className="mt-5 text-sm font-medium text-[#1D4533]">
                Please wait while your PDF files are being merged...
              </p>
            )}

          </div>

          {/* Success / Download */}
          {mergedPdfUrl && (
            <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1D4533] text-2xl text-white">
                ✓
              </div>

              <h2 className="mt-4 text-2xl font-bold text-[#1D4533]">
                PDFs Merged Successfully
              </h2>

              <p className="mt-2 text-gray-600">
                Your {files.length} PDF files have been
                combined into one PDF.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">

                {/* Download */}
                <button
                  type="button"
                  onClick={downloadMergedPdf}
                  className="rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white transition hover:opacity-90"
                >
                  Download Merged PDF
                </button>

                {/* Reset */}
                <button
                  type="button"
                  onClick={resetMerger}
                  className="rounded-lg border border-[#1D4533] px-6 py-3 font-medium text-[#1D4533] transition hover:bg-gray-50"
                >
                  Merge Another Set
                </button>

              </div>

            </section>
          )}

        </div>
      </section>
    </>
  )
}

export default PdfMerger