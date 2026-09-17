import { useEffect, useRef, useState } from 'react'
import { validateImage } from '../utils/validateImage'

function ImageUploader({
  accept = 'image/*',
  label = 'Choose an image',
  onFileSelect,
  allowedTypes,
}) {
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  function handleFileChange(event) {
    const selectedFile = event.target.files[0]

    if (!selectedFile) return

    setError('')

    const validationError = validateImage(
      selectedFile,
      allowedTypes
    )

    if (validationError) {
      if (preview) {
        URL.revokeObjectURL(preview)
      }

      setPreview(null)
      setError(validationError)
      onFileSelect(null)

      if (inputRef.current) {
        inputRef.current.value = ''
      }

      return
    }

    if (preview) {
      URL.revokeObjectURL(preview)
    }

    const previewUrl = URL.createObjectURL(selectedFile)

    setPreview(previewUrl)
    onFileSelect(selectedFile)
  }

  function handleReset() {
    if (preview) {
      URL.revokeObjectURL(preview)
    }

    setPreview(null)
    setError('')
    onFileSelect(null)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <div className="rounded-2xl border-2 border-dashed border-[#1D4533] bg-white p-10">
      {!preview ? (
        <label className="cursor-pointer">
          <span className="text-lg font-medium text-[#1D4533]">
            {label}
          </span>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div>
          <img
            src={preview}
            alt="Selected image preview"
            className="mx-auto max-h-80 rounded-lg object-contain"
          />

          <button
            type="button"
            onClick={handleReset}
            className="mt-5 rounded-lg border border-[#1D4533] px-5 py-3 font-medium text-[#1D4533] transition hover:bg-[#F9D2BA]"
          >
            Choose Another Image
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default ImageUploader