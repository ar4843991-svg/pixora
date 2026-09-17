import { useEffect, useState } from 'react'
import ImageUploader from '../../components/ImageUploader'
import SEO from '../../components/SEO'
import { Link } from 'react-router-dom'

function ImageResizer() {
  const [file, setFile] = useState(null)
  const [imageDimensions, setImageDimensions] = useState(null)
  const [width, setWidth] = useState('')
  const [resizedFile, setResizedFile] = useState(null)
  const [isResizing, setIsResizing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!file) {
      setImageDimensions(null)
      setWidth('')
      setResizedFile(null)
      setError('')
      return
    }

    const image = new Image()
    const imageUrl = URL.createObjectURL(file)
    image.src = imageUrl

    image.onload = () => {
      setImageDimensions({
        width: image.width,
        height: image.height,
      })

      setWidth(image.width)
      setError('')
      URL.revokeObjectURL(imageUrl)
    }

    image.onerror = () => {
      setError('Unable to read this image. Please try another image.')
      URL.revokeObjectURL(imageUrl)
    }

    return () => {
      URL.revokeObjectURL(imageUrl)
    }
  }, [file])

  const calculatedHeight =
    imageDimensions && width
      ? Math.round(
          Number(width) *
            (imageDimensions.height / imageDimensions.width)
        )
      : ''

  async function resizeImage() {
    if (!file || !width || !calculatedHeight) return

    if (Number(width) < 1) {
      setError('Width must be at least 1 pixel.')
      return
    }

    try {
      setIsResizing(true)
      setResizedFile(null)
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

      canvas.width = Number(width)
      canvas.height = calculatedHeight

      ctx.drawImage(
        image,
        0,
        0,
        Number(width),
        calculatedHeight
      )

      const blob = await new Promise((resolve) => {
        canvas.toBlob(
          resolve,
          file.type || 'image/jpeg',
          0.9
        )
      })

      URL.revokeObjectURL(imageUrl)

      if (!blob) {
        throw new Error('Resize failed')
      }

      setResizedFile(blob)
    } catch (error) {
      console.error('Resize failed:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsResizing(false)
    }
  }

  function handleDownload() {
    if (!resizedFile) return

    const downloadUrl = URL.createObjectURL(resizedFile)
    const link = document.createElement('a')

    link.href = downloadUrl
    link.download = 'pixora-resized-image'

    link.click()

    URL.revokeObjectURL(downloadUrl)
  }

  return (
    <>
      <SEO
  title="Free Image Resizer Online | Pixora"
  description="Resize JPG, PNG and WebP images online for free with Pixora. Change image dimensions while keeping the correct proportions."
/>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-[#1D4533]">
            Image Resizer
          </h1>

          <p className="mt-4 text-gray-600">
            Resize your images quickly and easily.
          </p>

          <div className="mb-10 mt-10 text-left">
            <h2 className="text-2xl font-bold text-[#1D4533]">
              Resize Images Online for Free
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora Image Resizer lets you resize JPG, PNG and WebP
              images quickly while keeping their original proportions.
            </p>

            <p className="mt-3 leading-7 text-gray-600">
              Choose an image, enter your desired width, and Pixora
              automatically calculates the height for you.
            </p>
          </div>

          <div>
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
                setResizedFile(null)
                setError('')
              }}
            />

            {imageDimensions && (
              <div className="mt-6 rounded-lg bg-white p-5 text-left shadow-sm">
                <p className="text-sm text-gray-600">
                  Original size:{' '}
                  <span className="font-semibold text-[#1D4533]">
                    {imageDimensions.width} × {imageDimensions.height}px
                  </span>
                </p>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-[#1D4533]">
                    New Width
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={width}
                    onChange={(event) => {
                      setWidth(event.target.value)
                      setResizedFile(null)
                      setError('')
                    }}
                    placeholder="Enter width in pixels"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#1D4533]"
                  />
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    New Height:{' '}
                    <span className="font-semibold text-[#1D4533]">
                      {calculatedHeight || 0}px
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resizeImage}
                  disabled={isResizing}
                  className="mt-6 rounded-lg bg-[#1D4533] px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isResizing ? 'Resizing...' : 'Resize Image'}
                </button>
              </div>
            )}

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            {resizedFile && (
              <div className="mt-6 rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-600">
                  New size:{' '}
                  {(resizedFile.size / 1024).toFixed(2)} KB
                </p>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-4 rounded-lg bg-[#5E3122] px-5 py-3 font-medium text-white transition hover:opacity-90"
                >
                  Download Resized Image
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

export default ImageResizer