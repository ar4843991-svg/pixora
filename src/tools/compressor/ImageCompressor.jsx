import { useState } from 'react'
import ImageUploader from '../../components/ImageUploader'
import SEO from '../../components/SEO'
import { Link } from 'react-router-dom'

function ImageCompressor() {
  const [file, setFile] = useState(null)
  const [compressedFile, setCompressedFile] = useState(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [quality, setQuality] = useState(0.6)
  const [error, setError] = useState('')

async function compressImage(file, quality) {
  const image = new Image()
  const imageUrl = URL.createObjectURL(file)

  try {
    image.src = imageUrl

    await new Promise((resolve, reject) => {
      image.onload = resolve
      image.onerror = () => reject(new Error('Image could not be loaded'))
    })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas is not supported')
    }

    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight

    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    )

    const compressedBlob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality)
    })

    if (!compressedBlob) {
      throw new Error('Compression failed')
    }

    return compressedBlob
  } finally {
    URL.revokeObjectURL(imageUrl)
  }
}

  async function handleCompress() {
    if (!file) return

    try {
      setIsCompressing(true)
      setCompressedFile(null)
      setError('')

      const compressedBlob = await compressImage(file, quality)

      if (!compressedBlob) {
        throw new Error('Compression failed')
      }
if (compressedBlob.size >= file.size) {
  setCompressedFile(file)
  setError(
    'The compressed file was not smaller, so the original image is kept.'
  )
} else {
  setCompressedFile(compressedBlob)
}
    } catch (error) {
      console.error('Compression failed:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsCompressing(false)
    }
  }

  function handleDownload() {
    if (!compressedFile) return

    const downloadUrl = URL.createObjectURL(compressedFile)
    const link = document.createElement('a')

    link.href = downloadUrl
    link.download = 'pixora-compressed.jpg'

    link.click()

    URL.revokeObjectURL(downloadUrl)
  }

  const savedPercentage =
    file && compressedFile
      ? Math.max(
          0,
          ((file.size - compressedFile.size) / file.size) * 100
        )
      : 0

  return (
    <>
     <SEO
  title="Free Image Compressor Online | Pixora"
  description="Compress JPG, PNG and WebP images online for free with Pixora. Reduce image file size while keeping good quality."
/>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-[#1D4533]">
            Image Compressor
          </h1>

          <p className="mt-4 text-gray-600">
            Compress your images while keeping good quality.
          </p>

          <div className="mb-10 mt-10 text-left">
            <h2 className="text-2xl font-bold text-[#1D4533]">
              Compress Images Online for Free
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora Image Compressor helps you reduce the file size
              of JPG, PNG and WebP images quickly and easily.
            </p>

            <p className="mt-3 leading-7 text-gray-600">
              Choose an image, select your preferred compression
              quality, and download the compressed result directly
              to your device.
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
                setCompressedFile(null)
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
                    Compression Quality
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setQuality(0.8)
                        setCompressedFile(null)
                        setError('')
                      }}
                      className={`rounded-lg px-4 py-2 font-medium transition ${
                        quality === 0.8
                          ? 'bg-[#1D4533] text-white'
                          : 'border border-[#1D4533] text-[#1D4533]'
                      }`}
                    >
                      High
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setQuality(0.6)
                        setCompressedFile(null)
                        setError('')
                      }}
                      className={`rounded-lg px-4 py-2 font-medium transition ${
                        quality === 0.6
                          ? 'bg-[#1D4533] text-white'
                          : 'border border-[#1D4533] text-[#1D4533]'
                      }`}
                    >
                      Medium
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setQuality(0.4)
                        setCompressedFile(null)
                        setError('')
                      }}
                      className={`rounded-lg px-4 py-2 font-medium transition ${
                        quality === 0.4
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
                  onClick={handleCompress}
                  disabled={isCompressing}
                  className="mt-6 rounded-lg bg-[#1D4533] px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCompressing
                    ? 'Compressing...'
                    : 'Compress Image'}
                </button>
              </>
            )}

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            {compressedFile && (
              <div className="mt-6 rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-600">
                  Compressed size:{' '}
                  {(compressedFile.size / 1024).toFixed(2)} KB
                </p>

                <p className="mt-2 font-semibold text-[#1D4533]">
                  Saved: {savedPercentage.toFixed(1)}%
                </p>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-4 rounded-lg bg-[#5E3122] px-5 py-3 font-medium text-white transition hover:opacity-90"
                >
                  Download Compressed Image
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

export default ImageCompressor