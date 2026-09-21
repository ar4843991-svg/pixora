import { useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import JSZip from 'jszip'
import SEO from '../../components/SEO'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

function PdfToPng() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [images, setImages] = useState([])
  const [isConverting, setIsConverting] = useState(false)
  const [pageCount, setPageCount] = useState(0)

  function downloadImage(imageUrl, pageNumber) {
    const link = document.createElement('a')

    link.href = imageUrl
    link.download = `page-${pageNumber}.png`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function downloadAllAsZip() {
    if (images.length === 0) return

    try {
      const zip = new JSZip()

      images.forEach((image) => {
        const base64Data = image.imageUrl.split(',')[1]

        zip.file(
          `page-${image.pageNumber}.png`,
          base64Data,
          { base64: true }
        )
      })

      const zipBlob = await zip.generateAsync({
        type: 'blob',
      })

      const zipUrl = URL.createObjectURL(zipBlob)

      const link = document.createElement('a')
      link.href = zipUrl
      link.download = 'pixora-pdf-to-png.zip'

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

  async function convertAllPages(loadedPdf) {
    setIsConverting(true)
    setError('')
    setImages([])

    try {
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
          throw new Error(
            'Could not create canvas context.'
          )
        }

        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({
          canvasContext: context,
          viewport,
        }).promise

        const imageUrl = canvas.toDataURL(
          'image/png'
        )

        renderedImages.push({
          pageNumber,
          imageUrl,
        })
      }

      setImages(renderedImages)

      console.log(
        `Converted ${renderedImages.length} pages to PNG`
      )
    } catch (err) {
      console.error(
        'Error converting PDF:',
        err
      )

      setError(
        'Could not convert the PDF pages to PNG.'
      )

      setImages([])
    } finally {
      setIsConverting(false)
    }
  }

  async function loadPdf() {
    if (!file) {
      setError('Please select a PDF first.')
      return
    }

    setIsConverting(true)
    setError('')
    setImages([])

    try {
      const arrayBuffer = await file.arrayBuffer()

      const loadedPdf = await pdfjsLib
        .getDocument({
          data: arrayBuffer,
        })
        .promise

      setPageCount(loadedPdf.numPages)

      console.log(
        'PDF pages:',
        loadedPdf.numPages
      )

      await convertAllPages(loadedPdf)
    } catch (err) {
      console.error(
        'Error loading PDF:',
        err
      )

      setError(
        'Could not load this PDF. Please try another PDF.'
      )

      setPageCount(0)
      setImages([])
      setIsConverting(false)
    }
  }

  function handleFileChange(event) {
    const selectedFile =
      event.target.files[0]

    if (!selectedFile) return

    if (
      selectedFile.type !==
      'application/pdf'
    ) {
      setError(
        'Please select a PDF file.'
      )

      setFile(null)
      setPageCount(0)
      setImages([])

      return
    }

    if (
      selectedFile.size >
      20 * 1024 * 1024
    ) {
      setError(
        'PDF must be smaller than 20 MB.'
      )

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

  return (
    <>
      <SEO
        title="PDF to PNG Converter | Pixora"
        description="Convert PDF pages to PNG images online with Pixora."
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">

          {/* Heading */}
          <h1 className="text-3xl font-bold text-[#1D4533] sm:text-4xl">
            PDF to PNG Converter
          </h1>

          <p className="mt-4 text-gray-600">
            Convert your PDF pages into PNG
            images quickly and easily.
          </p>

          {/* Upload Box */}
          <div className="mt-8 rounded-2xl border-2 border-dashed border-[#1D4533] bg-white p-10 text-center">

            <label className="cursor-pointer">
              <span className="font-medium text-[#1D4533]">
                Choose a PDF
              </span>

              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Selected File */}
            {file && (
              <p className="mt-4 text-sm text-gray-600">
                Selected:{' '}
                <strong>
                  {file.name}
                </strong>
              </p>
            )}

            {/* Error */}
            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            {/* Load Button */}
            {file &&
              !isConverting &&
              images.length === 0 && (
                <button
                  type="button"
                  onClick={loadPdf}
                  className="mt-6 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white transition hover:opacity-90"
                >
                  Load PDF
                </button>
              )}

            {/* Loading */}
            {isConverting && (
              <p className="mt-6 text-sm font-medium text-[#1D4533]">
                Converting PDF pages to PNG...
              </p>
            )}

            {/* Page Count */}
            {pageCount > 0 &&
              !isConverting && (
                <p className="mt-6 text-sm text-gray-600">
                  PDF loaded successfully —{' '}
                  <strong>
                    {pageCount}
                  </strong>{' '}
                  {pageCount === 1
                    ? 'page'
                    : 'pages'}{' '}
                  converted.
                </p>
              )}
          </div>

          {/* Converted Pages */}
          {images.length > 0 && (
            <section className="mt-10">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <h2 className="text-2xl font-bold text-[#1D4533]">
                  Converted PNG Pages
                </h2>

                <div className="flex flex-col gap-3 sm:flex-row">

                  {/* Download All */}
                  <button
                    type="button"
                    onClick={downloadAllAsZip}
                    className="rounded-lg bg-[#1D4533] px-5 py-2.5 font-medium text-white transition hover:opacity-90"
                  >
                    Download All PNGs
                  </button>

                  {/* Reset */}
                  <button
                    type="button"
                    onClick={resetConverter}
                    className="rounded-lg border border-[#1D4533] px-5 py-2.5 font-medium text-[#1D4533] transition hover:bg-gray-50"
                  >
                    Convert Another PDF
                  </button>

                </div>
              </div>

              {/* Images */}
              <div className="mt-6 space-y-8">

                {images.map((image) => (
                  <div
                    key={image.pageNumber}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >

                    <h3 className="mb-4 text-lg font-semibold text-[#1D4533]">
                      Page {image.pageNumber}
                    </h3>

                    {/* PNG Preview */}
                    <img
                      src={image.imageUrl}
                      alt={`PDF page ${image.pageNumber}`}
                      className="mx-auto h-auto w-full rounded-lg"
                    />

                    {/* Individual Download */}
                    <button
                      type="button"
                      onClick={() =>
                        downloadImage(
                          image.imageUrl,
                          image.pageNumber
                        )
                      }
                      className="mt-4 rounded-lg bg-[#1D4533] px-5 py-2.5 font-medium text-white transition hover:opacity-90"
                    >
                      Download PNG
                    </button>

                  </div>
                ))}

              </div>
            </section>
          )}

        </div>
      </section>
    </>
  )
}

export default PdfToPng