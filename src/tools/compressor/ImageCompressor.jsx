import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowRight,
  FiCheckCircle,
  FiDownload,
  FiImage,
  FiInfo,
  FiRefreshCw,
  FiTrash2,
  FiUploadCloud,
  FiZap,
} from 'react-icons/fi'

import ToolPageSEO from '../../components/ToolPageSEO'

function ImageCompressor() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [compressedUrl, setCompressedUrl] = useState('')
  const [compressedSize, setCompressedSize] = useState(0)
  const [quality, setQuality] = useState(0.8)
  const [isCompressing, setIsCompressing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      if (compressedUrl) {
        URL.revokeObjectURL(compressedUrl)
      }
    }
  }, [previewUrl, compressedUrl])

  function validateFile(selectedFile) {
    if (!selectedFile) {
      return 'Please select an image file.'
    }

    const supportedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    const supportedExtension =
      /\.(jpe?g|png|webp)$/i.test(selectedFile.name)

    if (
      !supportedTypes.includes(selectedFile.type) &&
      !supportedExtension
    ) {
      return 'Please select a JPG, PNG or WebP image.'
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      return 'Please select an image smaller than 20 MB.'
    }

    return ''
  }

  function selectFile(selectedFile) {
    if (!selectedFile) return

    const validationError = validateFile(selectedFile)

    if (validationError) {
      setError(validationError)
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl)
    }

    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    setCompressedUrl('')
    setCompressedSize(0)
    setError('')
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0]

    selectFile(selectedFile)

    event.target.value = ''
  }

  function handleDrop(event) {
    event.preventDefault()

    const droppedFile = event.dataTransfer.files?.[0]

    selectFile(droppedFile)
  }

  function handleDragOver(event) {
    event.preventDefault()
  }

  function removeFile() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl)
    }

    setFile(null)
    setPreviewUrl('')
    setCompressedUrl('')
    setCompressedSize(0)
    setError('')
  }

  function getOutputType() {
    if (!file) {
      return 'image/jpeg'
    }

    if (file.type === 'image/png') {
      return 'image/png'
    }

    if (file.type === 'image/webp') {
      return 'image/webp'
    }

    return 'image/jpeg'
  }

  function getOutputExtension() {
    const outputType = getOutputType()

    if (outputType === 'image/png') {
      return 'png'
    }

    if (outputType === 'image/webp') {
      return 'webp'
    }

    return 'jpg'
  }

  async function compressImage() {
    if (!file || !previewUrl) {
      setError('Please select an image first.')
      return
    }

    setIsCompressing(true)
    setError('')

    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl)
    }

    setCompressedUrl('')
    setCompressedSize(0)

    try {
      const image = new Image()

      image.src = previewUrl

      await new Promise((resolve, reject) => {
        image.onload = resolve
        image.onerror = reject
      })

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (!context) {
        throw new Error('Canvas is not supported.')
      }

      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight

      context.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      )

      const outputType = getOutputType()

      const blob = await new Promise((resolve) => {
        canvas.toBlob(
          resolve,
          outputType,
          outputType === 'image/png'
            ? undefined
            : quality
        )
      })

      if (!blob) {
        throw new Error('Could not create compressed image.')
      }

      const resultUrl = URL.createObjectURL(blob)

      setCompressedUrl(resultUrl)
      setCompressedSize(blob.size)
    } catch (err) {
      console.error('Image compression error:', err)

      setError(
        'Could not compress this image. Please try another image file.'
      )
    } finally {
      setIsCompressing(false)
    }
  }

  function downloadCompressedImage() {
    if (!compressedUrl || !file) return

    const link = document.createElement('a')

    link.href = compressedUrl
    link.download = `pixora-compressed.${getOutputExtension()}`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function resetCompressor() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl)
    }

    setFile(null)
    setPreviewUrl('')
    setCompressedUrl('')
    setCompressedSize(0)
    setQuality(0.8)
    setIsCompressing(false)
    setError('')
  }

  function formatFileSize(size) {
    if (!size) {
      return '0 KB'
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }

  const reductionPercentage =
    file && compressedSize > 0
      ? Math.max(
          0,
          Math.round(
            ((file.size - compressedSize) / file.size) * 100
          )
        )
      : 0

  return (
    <>
      <ToolPageSEO
        title="Image Compressor"
        description="Compress JPG, PNG and WebP images online for free with Pixora. Reduce image file size directly in your browser while keeping useful image quality."
      />

      <section className="px-4 py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-4xl">

          {/* Breadcrumb */}
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
            }}
            className="mb-6"
          >
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1D4533] hover:underline"
            >
              <FiArrowRight
                size={15}
                className="rotate-180"
              />

              All Tools
            </Link>
          </motion.div>

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
              duration: 0.5,
              ease: 'easeOut',
            }}
            className="text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1D4533] text-white shadow-sm">
              <FiZap size={27} />
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#1D4533] sm:text-4xl">
              Compress Images Online
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Reduce JPG, PNG and WebP file sizes quickly while
              keeping useful image quality.
            </p>
          </motion.div>

          {/* Main Tool */}
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
                className="rounded-2xl border-2 border-dashed border-[#1D4533]/30 bg-[#F7EAE0]/50 p-7 text-center transition-colors duration-200 hover:border-[#1D4533]/60 sm:p-10"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#1D4533] shadow-sm">
                  <FiUploadCloud size={28} />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-[#1D4533]">
                  Upload your image
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Drag and drop your image here, or choose it from
                  your device.
                </p>

                <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:opacity-90">
                  <FiUploadCloud size={18} />

                  Choose Image

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <p className="mt-4 text-xs text-gray-500">
                  JPG, PNG or WebP · Maximum 20 MB
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
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                {error}
              </motion.div>
            )}

            {/* Selected File */}
            {file && !compressedUrl && (
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
                      Adjust the quality and compress your image.
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-[#F7EAE0] px-3 py-1 text-sm font-medium text-[#1D4533]">
                    {formatFileSize(file.size)}
                  </span>
                </div>

                {/* Preview */}
                <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex min-h-56 items-center justify-center p-4 sm:min-h-72">
                    <img
                      src={previewUrl}
                      alt={`Preview of ${file.name}`}
                      className="max-h-72 max-w-full rounded-lg object-contain"
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
                          Original size: {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      className="flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600 sm:self-auto"
                      aria-label="Remove selected image"
                    >
                      <FiTrash2 size={17} />
                    </button>
                  </div>
                </div>

                {/* Quality */}
                <div className="mt-6 rounded-xl bg-[#F7EAE0] px-4 py-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-[#1D4533]">
                        Compression Quality
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        Higher quality keeps more image detail.
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1D4533] shadow-sm">
                      {Math.round(quality * 100)}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0.3"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(event) =>
                      setQuality(Number(event.target.value))
                    }
                    className="mt-5 w-full accent-[#1D4533]"
                    aria-label="Compression quality"
                  />

                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>Smaller file</span>
                    <span>Higher quality</span>
                  </div>
                </div>

                {/* Button */}
                <motion.button
                  type="button"
                  onClick={compressImage}
                  disabled={isCompressing}
                  whileHover={
                    !isCompressing
                      ? { y: -2 }
                      : {}
                  }
                  whileTap={
                    !isCompressing
                      ? { scale: 0.98 }
                      : {}
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3.5 font-medium text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCompressing ? (
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

                      Compressing Image...
                    </>
                  ) : (
                    <>
                      <FiZap size={18} />
                      Compress Image
                    </>
                  )}
                </motion.button>

                {isCompressing && (
                  <p className="mt-4 text-center text-sm text-gray-500">
                    Please wait while your image is being compressed.
                  </p>
                )}
              </motion.div>
            )}

            {/* Success */}
            {compressedUrl && (
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
                className="py-4 text-center sm:py-6"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1D4533] text-white shadow-sm">
                  <FiCheckCircle size={30} />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-[#1D4533]">
                  Image Compressed Successfully
                </h2>

                <p className="mx-auto mt-2 max-w-lg leading-7 text-gray-600">
                  Your compressed image is ready to download.
                </p>

                {/* Stats */}
                <div className="mx-auto mt-7 grid max-w-xl gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-[#F7EAE0] p-4">
                    <p className="text-xs text-gray-500">
                      Original
                    </p>

                    <p className="mt-1 font-semibold text-[#1D4533]">
                      {formatFileSize(file?.size)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F7EAE0] p-4">
                    <p className="text-xs text-gray-500">
                      Compressed
                    </p>

                    <p className="mt-1 font-semibold text-[#1D4533]">
                      {formatFileSize(compressedSize)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F7EAE0] p-4">
                    <p className="text-xs text-gray-500">
                      Reduction
                    </p>

                    <p className="mt-1 font-semibold text-[#1D4533]">
                      {reductionPercentage}%
                    </p>
                  </div>
                </div>

                {/* Result Preview */}
                <div className="mt-7 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex min-h-56 items-center justify-center p-4 sm:min-h-72">
                    <img
                      src={compressedUrl}
                      alt="Compressed image preview"
                      className="max-h-72 max-w-full rounded-lg object-contain"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <motion.button
                    type="button"
                    onClick={downloadCompressedImage}
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white shadow-sm transition hover:opacity-90"
                  >
                    <FiDownload size={18} />
                    Download Compressed Image
                  </motion.button>

                  <button
                    type="button"
                    onClick={resetCompressor}
                    className="flex items-center justify-center gap-2 rounded-lg border border-[#1D4533] px-6 py-3 font-medium text-[#1D4533] transition hover:bg-gray-50"
                  >
                    <FiRefreshCw size={18} />
                    Compress Another Image
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

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
              amount: 0.15,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mt-12 rounded-2xl border border-[#F9D2BA] bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-2xl font-bold text-[#1D4533]">
              Free Image Compressor Online
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora is a free online image compressor for reducing the
              file size of JPG, PNG and WebP images. Compressing an image
              can make it easier to upload, share and store while helping
              you keep the image at a useful quality level.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              Upload an image, adjust the compression quality and let
              Pixora process it directly in your browser. The tool shows
              the original and compressed file sizes so you can see how
              much the file size changed before downloading the result.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-[#1D4533]">
              How to Compress an Image
            </h3>

            <ol className="mt-4 space-y-3 text-gray-600">
              <li>
                <span className="font-semibold text-[#1D4533]">
                  1.
                </span>{' '}
                Select a JPG, PNG or WebP image.
              </li>

              <li>
                <span className="font-semibold text-[#1D4533]">
                  2.
                </span>{' '}
                Choose your preferred compression quality.
              </li>

              <li>
                <span className="font-semibold text-[#1D4533]">
                  3.
                </span>{' '}
                Click the compress button.
              </li>

              <li>
                <span className="font-semibold text-[#1D4533]">
                  4.
                </span>{' '}
                Review the result and download your compressed image.
              </li>
            </ol>

            <h3 className="mt-8 text-xl font-semibold text-[#1D4533]">
              Why Compress Images?
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl bg-[#F7EAE0] p-4">
                <FiCheckCircle
                  className="mt-0.5 shrink-0 text-[#1D4533]"
                  size={18}
                />

                <p className="text-sm leading-6 text-gray-700">
                  Reduce image file sizes for easier sharing and uploads.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#F7EAE0] p-4">
                <FiCheckCircle
                  className="mt-0.5 shrink-0 text-[#1D4533]"
                  size={18}
                />

                <p className="text-sm leading-6 text-gray-700">
                  Make large images easier to store and transfer.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#F7EAE0] p-4">
                <FiCheckCircle
                  className="mt-0.5 shrink-0 text-[#1D4533]"
                  size={18}
                />

                <p className="text-sm leading-6 text-gray-700">
                  Adjust compression quality before processing.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#F7EAE0] p-4">
                <FiCheckCircle
                  className="mt-0.5 shrink-0 text-[#1D4533]"
                  size={18}
                />

                <p className="text-sm leading-6 text-gray-700">
                  Process images directly in your browser.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#F9D2BA] bg-[#F7EAE0]/60 p-4">
              <FiInfo
                className="mt-0.5 shrink-0 text-[#1D4533]"
                size={18}
              />

              <p className="text-sm leading-6 text-gray-700">
                Compression results can vary depending on the image
                format, dimensions, quality setting and original file
                size.
              </p>
            </div>

            {/* FAQ */}
            <div className="mt-10 border-t border-[#F9D2BA] pt-8">
              <h3 className="text-xl font-semibold text-[#1D4533]">
                Frequently Asked Questions
              </h3>

              <div className="mt-5 space-y-4">
                <details className="rounded-xl bg-[#F7EAE0] p-4">
                  <summary className="cursor-pointer font-semibold text-[#1D4533]">
                    Can I compress JPG, PNG and WebP images?
                  </summary>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Yes. Pixora supports JPG, PNG and WebP image files
                    up to 20 MB.
                  </p>
                </details>

                <details className="rounded-xl bg-[#F7EAE0] p-4">
                  <summary className="cursor-pointer font-semibold text-[#1D4533]">
                    Does image compression reduce quality?
                  </summary>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Compression can reduce some image detail depending
                    on the selected quality level. You can adjust the
                    quality setting before processing the image.
                  </p>
                </details>

                <details className="rounded-xl bg-[#F7EAE0] p-4">
                  <summary className="cursor-pointer font-semibold text-[#1D4533]">
                    How large can my image be?
                  </summary>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    The current Pixora image compressor accepts images
                    up to 20 MB.
                  </p>
                </details>

                <details className="rounded-xl bg-[#F7EAE0] p-4">
                  <summary className="cursor-pointer font-semibold text-[#1D4533]">
                    Can I use the image compressor on my phone?
                  </summary>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Yes. The compressor interface is designed to work
                    in modern desktop and mobile browsers.
                  </p>
                </details>

                <details className="rounded-xl bg-[#F7EAE0] p-4">
                  <summary className="cursor-pointer font-semibold text-[#1D4533]">
                    What happens after compression?
                  </summary>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Pixora shows the compressed image and compares its
                    size with the original file. You can then download
                    the compressed result or compress another image.
                  </p>
                </details>
              </div>
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
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1D4533]">
                More Image Tools
              </h2>

              <p className="mt-2 text-gray-600">
                Continue working with more free image tools from Pixora.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              <Link
                to="/tools/image-resizer"
                className="group rounded-xl border border-[#F9D2BA] bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <FiImage
                  className="mx-auto text-[#1D4533]"
                  size={24}
                />

                <h3 className="mt-3 font-semibold text-[#1D4533]">
                  Image Resizer
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Resize images to your preferred dimensions.
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
                to="/tools/jpg-to-png"
                className="group rounded-xl border border-[#F9D2BA] bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <FiImage
                  className="mx-auto text-[#1D4533]"
                  size={24}
                />

                <h3 className="mt-3 font-semibold text-[#1D4533]">
                  JPG to PNG
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Convert JPG images to PNG format.
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
                to="/tools/webp-converter"
                className="group rounded-xl border border-[#F9D2BA] bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <FiImage
                  className="mx-auto text-[#1D4533]"
                  size={24}
                />

                <h3 className="mt-3 font-semibold text-[#1D4533]">
                  WebP Converter
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Convert images to the WebP format.
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
          </motion.section>

        </div>
      </section>
    </>
  )
}

export default ImageCompressor