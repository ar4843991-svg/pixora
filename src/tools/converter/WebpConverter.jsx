import { useState } from 'react'
import ImageUploader from '../../components/ImageUploader'
import SEO from '../../components/SEO'
import { Link } from 'react-router-dom'



function WebpConverter() {
  const [file, setFile] = useState(null)
  const [convertedFile, setConvertedFile] = useState(null)
  const [isConverting, setIsConverting] = useState(false)
  const [quality, setQuality] = useState(0.8)
  const [error, setError] = useState('')

  async function convertToWebp(file, quality) {
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

    const webpBlob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/webp', quality)
    })

    URL.revokeObjectURL(imageUrl)

    return webpBlob
  }

  async function handleConvert() {
    if (!file) return

    try {
      setIsConverting(true)
      setConvertedFile(null)
      setError('')

      const webpBlob = await convertToWebp(file, quality)

      if (!webpBlob) {
        throw new Error('Conversion failed')
      }

      setConvertedFile(webpBlob)
    } catch (error) {
      console.error('WebP conversion failed:', error)
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
    link.download = 'pixora-converted.webp'

    link.click()

    URL.revokeObjectURL(downloadUrl)
  }

  const savedPercentage =
    file && convertedFile
      ? Math.max(
          0,
          ((file.size - convertedFile.size) / file.size) * 100
        )
      : 0

  return (
    <>
     <SEO
  title="WebP Converter Online | Pixora"
  description="Convert JPG and PNG images to WebP online for free with Pixora. Choose your quality and download your WebP image."
/>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-[#1D4533]">
            WebP Converter
          </h1>

          <p className="mt-4 text-gray-600">
            Convert your JPG and PNG images to WebP format quickly
            and easily.
          </p>

          <div className="mb-10 mt-10 text-left">
            <h2 className="text-2xl font-bold text-[#1D4533]">
              Convert Images to WebP Online for Free
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora WebP Converter lets you convert JPG and PNG
              images to WebP format directly in your browser.
            </p>

            <p className="mt-3 leading-7 text-gray-600">
              Choose your preferred quality, convert the image, and
              download the WebP file to your device.
            </p>
          </div>

          <div>
            <ImageUploader
              accept="image/jpeg,image/png"
              label="Choose JPG or PNG image"
              allowedTypes={[
                'image/jpeg',
                'image/png',
              ]}
              onFileSelect={(selectedFile) => {
                setFile(selectedFile)
                setConvertedFile(null)
                setError('')
              }}
            />

            {file && (
              <>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Selected: {file.name}</p>

                  <p className="mt-1">
                    Original size:{' '}
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>

                <div className="mt-6">
                  <p className="mb-3 font-medium text-[#1D4533]">
                    WebP Quality
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setQuality(0.9)
                        setConvertedFile(null)
                        setError('')
                      }}
                      className={`rounded-lg px-4 py-2 font-medium transition ${
                        quality === 0.9
                          ? 'bg-[#1D4533] text-white'
                          : 'border border-[#1D4533] text-[#1D4533]'
                      }`}
                    >
                      High
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setQuality(0.8)
                        setConvertedFile(null)
                        setError('')
                      }}
                      className={`rounded-lg px-4 py-2 font-medium transition ${
                        quality === 0.8
                          ? 'bg-[#1D4533] text-white'
                          : 'border border-[#1D4533] text-[#1D4533]'
                      }`}
                    >
                      Medium
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setQuality(0.6)
                        setConvertedFile(null)
                        setError('')
                      }}
                      className={`rounded-lg px-4 py-2 font-medium transition ${
                        quality === 0.6
                          ? 'bg-[#1D4533] text-white'
                          : 'border border-[#1D4533] text-[#1D4533]'
                      }`}
                    >
                      Low
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="mt-6 rounded-lg bg-[#1D4533] px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isConverting
                    ? 'Converting...'
                    : 'Convert to WebP'}
                </button>
              </>
            )}

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            {convertedFile && (
              <div className="mt-6 rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-600">
                  WebP size:{' '}
                  {(convertedFile.size / 1024).toFixed(2)} KB
                </p>

                <p className="mt-2 font-semibold text-[#1D4533]">
                  Saved: {savedPercentage.toFixed(1)}%
                </p>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-4 rounded-lg bg-[#5E3122] px-5 py-3 font-medium text-white transition hover:opacity-90"
                >
                  Download WebP
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
      to="/tools/jpg-to-png"
      className="rounded-xl border border-[#F9D2BA] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
    >
      <h3 className="font-semibold text-[#1D4533]">
        JPG to PNG
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        Convert JPG images to PNG format.
      </p>
    </Link>
  </div>
</div>
      </section>
    </>
  )
}

export default WebpConverter