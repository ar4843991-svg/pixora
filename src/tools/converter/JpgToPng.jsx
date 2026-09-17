import { useState } from 'react'
import ImageUploader from '../../components/ImageUploader'
import SEO from '../../components/SEO'
import { Link } from 'react-router-dom'



function JpgToPng() {
  const [file, setFile] = useState(null)
  const [convertedFile, setConvertedFile] = useState(null)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState('')

  async function convertToPng() {
    if (!file) return

    try {
      setIsConverting(true)
      setConvertedFile(null)
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

      canvas.width = image.width
      canvas.height = image.height

      ctx.drawImage(image, 0, 0)

      const pngBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png')
      })

      URL.revokeObjectURL(imageUrl)

      if (!pngBlob) {
        throw new Error('Conversion failed')
      }

      setConvertedFile(pngBlob)
    } catch (error) {
      console.error('Conversion failed:', error)
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
    link.download = 'pixora-converted.png'

    link.click()

    URL.revokeObjectURL(downloadUrl)
  }

  return (
    <>
      <SEO
  title="JPG to PNG Converter Online | Pixora"
  description="Convert JPG images to PNG online for free with Pixora. Fast, simple and easy JPG to PNG conversion."
/>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-[#1D4533]">
            JPG to PNG Converter
          </h1>

          <p className="mt-4 text-gray-600">
            Convert your JPG images to PNG format quickly and easily.
          </p>

          <div className="mb-10 mt-10 text-left">
            <h2 className="text-2xl font-bold text-[#1D4533]">
              Convert JPG to PNG Online for Free
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora JPG to PNG Converter lets you convert JPG images
              to PNG format directly in your browser.
            </p>

            <p className="mt-3 leading-7 text-gray-600">
              Choose a JPG image, convert it to PNG, and download the
              converted file to your device.
            </p>
          </div>

          <div>
            <ImageUploader
              accept="image/jpeg"
              label="Choose a JPG image"
              allowedTypes={['image/jpeg']}
              onFileSelect={(selectedFile) => {
                setFile(selectedFile)
                setConvertedFile(null)
                setError('')
              }}
            />

            {file && (
              <div className="mt-4 text-sm text-gray-600">
                <p>Selected: {file.name}</p>

                <p className="mt-1">
                  Original size:{' '}
                  {(file.size / 1024).toFixed(2)} KB
                </p>

                <button
                  type="button"
                  onClick={convertToPng}
                  disabled={isConverting}
                  className="mt-5 rounded-lg bg-[#1D4533] px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isConverting
                    ? 'Converting...'
                    : 'Convert to PNG'}
                </button>
              </div>
            )}

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            {convertedFile && (
              <div className="mt-6 rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-600">
                  PNG size:{' '}
                  {(convertedFile.size / 1024).toFixed(2)} KB
                </p>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-4 rounded-lg bg-[#5E3122] px-5 py-3 font-medium text-white transition hover:opacity-90"
                >
                  Download PNG
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-16 border-t border-[#F9D2BA] pt-10 text-left">
  <h2 className="text-2xl font-bold text-[#1D4533]">
    Related Image Tools
  </h2>

  <div className="mt-5 grid gap-4 sm:grid-cols-3">
    <Link
      to="/tools/image-compressor"
      className="rounded-xl border border-[#F9D2BA] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
    >
      <h3 className="font-semibold text-[#1D4533]">
        Image Compressor
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        Reduce image file size while keeping good quality.
      </p>
    </Link>

    <Link
      to="/tools/image-resizer"
      className="rounded-xl border border-[#F9D2BA] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
    >
      <h3 className="font-semibold text-[#1D4533]">
        Image Resizer
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        Resize your image dimensions quickly.
      </p>
    </Link>

    <Link
      to="/tools/webp-converter"
      className="rounded-xl border border-[#F9D2BA] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
    >
      <h3 className="font-semibold text-[#1D4533]">
        WebP Converter
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        Convert JPG and PNG images to WebP.
      </p>
    </Link>
  </div>
</div>
      </section>
    </>
  )
}

export default JpgToPng