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
} from 'react-icons/fi'

import ToolPageSEO from '../../components/ToolPageSEO'

function ImageResizer() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [resizedUrl, setResizedUrl] = useState('')
  const [resizedSize, setResizedSize] = useState(0)

  const [originalWidth, setOriginalWidth] = useState(0)
  const [originalHeight, setOriginalHeight] = useState(0)

  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')

  const [lockAspectRatio, setLockAspectRatio] = useState(true)
  const [quality, setQuality] = useState(0.9)

  const [isResizing, setIsResizing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      if (resizedUrl) {
        URL.revokeObjectURL(resizedUrl)
      }
    }
  }, [previewUrl, resizedUrl])

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

    if (resizedUrl) {
      URL.revokeObjectURL(resizedUrl)
    }

    const imageUrl = URL.createObjectURL(selectedFile)
    const image = new Image()

    image.onload = () => {
      setOriginalWidth(image.naturalWidth)
      setOriginalHeight(image.naturalHeight)

      setWidth(String(image.naturalWidth))
      setHeight(String(image.naturalHeight))
    }

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl)
      setError('Could not read this image. Please try another file.')
    }

    image.src = imageUrl

    setFile(selectedFile)
    setPreviewUrl(imageUrl)
    setResizedUrl('')
    setResizedSize(0)
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

  function handleWidthChange(event) {
    const value = event.target.value

    setWidth(value)

    if (
      lockAspectRatio &&
      originalWidth > 0 &&
      originalHeight > 0 &&
      value !== ''
    ) {
      const nextWidth = Number(value)

      if (Number.isFinite(nextWidth) && nextWidth > 0) {
        const nextHeight = Math.round(
          (nextWidth / originalWidth) * originalHeight
        )

        setHeight(String(nextHeight))
      }
    }
  }

  function handleHeightChange(event) {
    const value = event.target.value

    setHeight(value)

    if (
      lockAspectRatio &&
      originalWidth > 0 &&
      originalHeight > 0 &&
      value !== ''
    ) {
      const nextHeight = Number(value)

      if (Number.isFinite(nextHeight) && nextHeight > 0) {
        const nextWidth = Math.round(
          (nextHeight / originalHeight) * originalWidth
        )

        setWidth(String(nextWidth))
      }
    }
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

  async function resizeImage() {
    if (!file || !previewUrl) {
      setError('Please select an image first.')
      return
    }

    const targetWidth = Number(width)
    const targetHeight = Number(height)

    if (
      !Number.isFinite(targetWidth) ||
      !Number.isFinite(targetHeight) ||
      targetWidth <= 0 ||
      targetHeight <= 0
    ) {
      setError('Please enter valid width and height values.')
      return
    }

    if (targetWidth > 8000 || targetHeight > 8000) {
      setError('Maximum image dimensions are 8000 × 8000 pixels.')
      return
    }

    setIsResizing(true)
    setError('')

    if (resizedUrl) {
      URL.revokeObjectURL(resizedUrl)
    }

    setResizedUrl('')
    setResizedSize(0)

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

      canvas.width = targetWidth
      canvas.height = targetHeight

      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = 'high'

      context.drawImage(
        image,
        0,
        0,
        targetWidth,
        targetHeight
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
        throw new Error('Could not create resized image.')
      }

      const resultUrl = URL.createObjectURL(blob)

      setResizedUrl(resultUrl)
      setResizedSize(blob.size)
    } catch (err) {
      console.error('Image resize error:', err)

      setError(
        'Could not resize this image. Please try another image file.'
      )
    } finally {
      setIsResizing(false)
    }
  }

  function downloadResizedImage() {
    if (!resizedUrl || !file) return

    const link = document.createElement('a')

    link.href = resizedUrl
    link.download = `pixora-resized.${getOutputExtension()}`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function removeFile() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    if (resizedUrl) {
      URL.revokeObjectURL(resizedUrl)
    }

    setFile(null)
    setPreviewUrl('')
    setResizedUrl('')
    setResizedSize(0)

    setOriginalWidth(0)
    setOriginalHeight(0)

    setWidth('')
    setHeight('')

    setError('')
  }

  function resetResizer() {
    removeFile()

    setLockAspectRatio(true)
    setQuality(0.9)
    setIsResizing(false)
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

  const dimensionChanged =
    Number(width) !== originalWidth ||
    Number(height) !== originalHeight

  return (
    <>
      <ToolPageSEO
        title="Image Resizer"
        description="Resize JPG, PNG and WebP images online for free with Pixora. Change image dimensions quickly, keep the aspect ratio and download resized images directly in your browser."
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
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1D4533] transition hover:gap-3"
            >
              <FiArrowRight
                size={15}
                className="rotate-180"
              />

              Back to all tools
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
              <FiImage size={27} />
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#1D4533] sm:text-4xl">
              Resize Images Online
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Resize JPG, PNG and WebP images to custom dimensions
              directly in your browser. Keep the aspect ratio when
              needed and download your resized image instantly.
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
            {/* Upload Area */}
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
                  Drag and drop an image here, or choose it from
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
                role="alert"
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                {error}
              </motion.div>
            )}

            {/* Selected Image */}
            {file && !resizedUrl && (
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
                      Set the dimensions you want for your resized image.
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
                          Original: {originalWidth} × {originalHeight}px
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

                {/* Dimensions */}
                <div className="mt-6 rounded-xl bg-[#F7EAE0] p-4 sm:p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-[#1D4533]">
                        Image Dimensions
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        Enter the desired width and height in pixels.
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-[#1D4533] shadow-sm">
                      Original {originalWidth} × {originalHeight}px
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="image-width"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Width (px)
                      </label>

                      <input
                        id="image-width"
                        type="number"
                        min="1"
                        max="8000"
                        value={width}
                        onChange={handleWidthChange}
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533]/10"
                        placeholder="Width"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="image-height"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Height (px)
                      </label>

                      <input
                        id="image-height"
                        type="number"
                        min="1"
                        max="8000"
                        value={height}
                        onChange={handleHeightChange}
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533]/10"
                        placeholder="Height"
                      />
                    </div>
                  </div>

                  <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={lockAspectRatio}
                      onChange={(event) =>
                        setLockAspectRatio(event.target.checked)
                      }
                      className="h-4 w-4 accent-[#1D4533]"
                    />

                    <span>
                      Lock aspect ratio
                    </span>
                  </label>
                </div>

                {/* Quality */}
                <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-[#1D4533]">
                        Output Quality
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Used for JPG and WebP output.
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-[#F7EAE0] px-3 py-1 text-sm font-semibold text-[#1D4533]">
                      {Math.round(quality * 100)}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(event) =>
                      setQuality(Number(event.target.value))
                    }
                    className="mt-5 w-full accent-[#1D4533]"
                    aria-label="Output quality"
                  />

                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>Smaller file</span>
                    <span>Higher quality</span>
                  </div>
                </div>

                {/* Resize Button */}
                <motion.button
                  type="button"
                  onClick={resizeImage}
                  disabled={isResizing || !dimensionChanged}
                  whileHover={
                    !isResizing && dimensionChanged
                      ? { y: -2 }
                      : {}
                  }
                  whileTap={
                    !isResizing && dimensionChanged
                      ? { scale: 0.98 }
                      : {}
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3.5 font-medium text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isResizing ? (
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

                      Resizing Image...
                    </>
                  ) : (
                    <>
                      <FiImage size={18} />
                      Resize Image
                    </>
                  )}
                </motion.button>

                {isResizing && (
                  <p className="mt-4 text-center text-sm text-gray-500">
                    Please wait while your image is being resized.
                  </p>
                )}

                {!dimensionChanged && (
                  <p className="mt-4 text-center text-xs text-gray-500">
                    Change the dimensions to enable resizing.
                  </p>
                )}
              </motion.div>
            )}

            {/* Success */}
            {resizedUrl && (
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
                  Image Resized Successfully
                </h2>

                <p className="mx-auto mt-2 max-w-lg leading-7 text-gray-600">
                  Your resized image is ready to download.
                </p>

                {/* Result Stats */}
                <div className="mx-auto mt-7 grid max-w-xl gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-[#F7EAE0] p-4">
                    <p className="text-xs text-gray-500">
                      Original
                    </p>

                    <p className="mt-1 font-semibold text-[#1D4533]">
                      {originalWidth} × {originalHeight}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F7EAE0] p-4">
                    <p className="text-xs text-gray-500">
                      New Size
                    </p>

                    <p className="mt-1 font-semibold text-[#1D4533]">
                      {width} × {height}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F7EAE0] p-4">
                    <p className="text-xs text-gray-500">
                      File Size
                    </p>

                    <p className="mt-1 font-semibold text-[#1D4533]">
                      {formatFileSize(resizedSize)}
                    </p>
                  </div>
                </div>

                {/* Result Preview */}
                <div className="mt-7 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex min-h-56 items-center justify-center p-4 sm:min-h-72">
                    <img
                      src={resizedUrl}
                      alt="Resized image preview"
                      className="max-h-72 max-w-full rounded-lg object-contain"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <motion.button
                    type="button"
                    onClick={downloadResizedImage}
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white shadow-sm transition hover:opacity-90"
                  >
                    <FiDownload size={18} />
                    Download Resized Image
                  </motion.button>

                  <button
                    type="button"
                    onClick={resetResizer}
                    className="flex items-center justify-center gap-2 rounded-lg border border-[#1D4533] px-6 py-3 font-medium text-[#1D4533] transition hover:bg-gray-50"
                  >
                    <FiRefreshCw size={18} />
                    Resize Another Image
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
              Free Image Resizer Online
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora's free image resizer lets you change the width
              and height of JPG, PNG and WebP images online. You can
              enter custom pixel dimensions, keep the original aspect
              ratio and adjust output quality for supported formats.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              The resizing process happens directly in your browser.
              This makes it convenient when you need to prepare an
              image for a website, document, profile picture, upload
              form or another digital use.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-[#1D4533]">
              How to Resize an Image Online
            </h3>

            <ol className="mt-4 space-y-3 text-gray-600">
              <li>
                <span className="font-semibold text-[#1D4533]">
                  1.
                </span>{' '}
                Upload a JPG, PNG or WebP image.
              </li>

              <li>
                <span className="font-semibold text-[#1D4533]">
                  2.
                </span>{' '}
                Enter the desired width and height in pixels.
              </li>

              <li>
                <span className="font-semibold text-[#1D4533]">
                  3.
                </span>{' '}
                Keep Lock aspect ratio enabled for proportional
                resizing.
              </li>

              <li>
                <span className="font-semibold text-[#1D4533]">
                  4.
                </span>{' '}
                Adjust output quality when using JPG or WebP.
              </li>

              <li>
                <span className="font-semibold text-[#1D4533]">
                  5.
                </span>{' '}
                Click Resize Image and download the result.
              </li>
            </ol>

            <h3 className="mt-8 text-xl font-semibold text-[#1D4533]">
              Why Resize an Image?
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                'Create custom image dimensions for websites and uploads.',
                'Prepare images for documents, forms and digital projects.',
                'Keep image proportions with the aspect ratio lock.',
                'Resize JPG, PNG and WebP files in one browser-based tool.',
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
              JPG, PNG and WebP Image Resizing
            </h3>

            <p className="mt-4 leading-7 text-gray-600">
              Pixora supports common image formats including JPG,
              PNG and WebP. JPG and WebP output can use adjustable
              quality settings, while PNG output keeps its PNG
              format during resizing.
            </p>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#F9D2BA] bg-[#F7EAE0]/60 p-4">
              <FiInfo
                className="mt-0.5 shrink-0 text-[#1D4533]"
                size={18}
              />

              <p className="text-sm leading-6 text-gray-700">
                Resizing changes an image's pixel dimensions. The
                final file size may also change depending on the
                image format, dimensions and selected quality.
              </p>
            </div>
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
                    'Can I resize JPG, PNG and WebP images?',
                  answer:
                    'Yes. Pixora supports JPG, PNG and WebP images up to 20 MB per file.',
                },
                {
                  question:
                    'Can I enter custom image dimensions?',
                  answer:
                    'Yes. You can enter your preferred width and height in pixels, up to 8000 × 8000 pixels.',
                },
                {
                  question:
                    'Does the image resizer keep the aspect ratio?',
                  answer:
                    'Yes. Lock aspect ratio is enabled by default and automatically adjusts the other dimension when you change the width or height.',
                },
                {
                  question:
                    'Can I resize an image without changing its format?',
                  answer:
                    'Yes. JPG, PNG and WebP images keep their respective output formats when resized.',
                },
                {
                  question:
                    'Can I resize images on my phone?',
                  answer:
                    'Yes. The Pixora image resizer works in modern mobile and desktop browsers.',
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
                Related Image Tools
              </h2>

              <p className="mt-2 text-gray-600">
                Explore more free image tools from Pixora.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">

                {/* Image Compressor */}
                <Link
                  to="/tools/image-compressor"
                  className="group rounded-xl border border-[#F9D2BA] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <FiImage
                    className="text-[#1D4533]"
                    size={23}
                  />

                  <h3 className="mt-3 font-semibold text-[#1D4533]">
                    Image Compressor
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Reduce image file size while keeping useful quality.
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1D4533]">
                    Open Tool

                    <FiArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>

                {/* JPG to PNG */}
                <Link
                  to="/tools/jpg-to-png"
                  className="group rounded-xl border border-[#F9D2BA] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <FiImage
                    className="text-[#1D4533]"
                    size={23}
                  />

                  <h3 className="mt-3 font-semibold text-[#1D4533]">
                    JPG to PNG
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Convert JPG images to PNG format online.
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1D4533]">
                    Open Tool

                    <FiArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>

                {/* WebP Converter */}
                <Link
                  to="/tools/webp-converter"
                  className="group rounded-xl border border-[#F9D2BA] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <FiImage
                    className="text-[#1D4533]"
                    size={23}
                  />

                  <h3 className="mt-3 font-semibold text-[#1D4533]">
                    WebP Converter
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Convert images to the WebP format online.
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
              Need another image or PDF tool?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/80">
              Explore Pixora's collection of free browser-based
              image and PDF tools.
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

export default ImageResizer