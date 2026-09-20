import { useEffect, useState } from 'react'
import { jsPDF } from 'jspdf'
import SEO from '../../components/SEO'

function JpgToPdf() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

function processFile(selectedFile) {
  if (!selectedFile) return

  if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
    setError('Please select a JPG or PNG image.')
    setFile(null)
    setPreview(null)
    return
  }

  if (selectedFile.size > 10 * 1024 * 1024) {
    setError('Image must be smaller than 10 MB.')
    setFile(null)
    setPreview(null)
    return
  }

  setError('')
  setFile(selectedFile)
  setPreview(URL.createObjectURL(selectedFile))
}

function handleFileChange(event) {
  processFile(event.target.files[0])
}

function handleDrop(event) {
  event.preventDefault()
  setIsDragging(false)

  processFile(event.dataTransfer.files[0])
}
  function handleDrop(event) {
  event.preventDefault()
  setIsDragging(false)

  const droppedFile = event.dataTransfer.files[0]

  if (!droppedFile) return

  handleFileChange({
    target: {
      files: [droppedFile],
    },
  })
}

  function handleConvert() {
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      const pdf = new jsPDF({
        orientation:
          image.width > image.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [image.width, image.height],
      })

      pdf.addImage(
        image,
        file.type === 'image/png' ? 'PNG' : 'JPEG',
        0,
        0,
        image.width,
        image.height
      )

      pdf.save('pixora-image.pdf')
      URL.revokeObjectURL(imageUrl)
    }

    image.src = imageUrl
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <>
      <SEO
        title="JPG to PDF Converter | Pixora"
        description="Convert JPG and PNG images to PDF online with Pixora."
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-[#1D4533] sm:text-4xl">
            JPG to PDF Converter
          </h1>

          <p className="mt-4 text-gray-600">
            Convert your JPG and PNG images into a PDF file quickly and easily.
          </p>

<div
  onDragOver={(event) => {
    event.preventDefault()
    setIsDragging(true)
  }}
  onDragLeave={() => setIsDragging(false)}
  onDrop={handleDrop}
  className={`mt-8 rounded-2xl border-2 border-dashed p-10 text-center transition ${
    isDragging
      ? 'border-[#5E3122] bg-[#F9D2BA]'
      : 'border-[#1D4533] bg-white'
  }`}
>            {!preview ? (
              <label className="cursor-pointer">
                <p className="mt-2 text-sm text-gray-500">
  or drag and drop your image here
</p>

                <input
                  type="file"
                  accept="image/jpeg,image/png"
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

                <p className="mt-4 text-sm text-gray-600">
                  Selected: {file?.name}
                </p>

                <label className="mt-5 inline-block cursor-pointer rounded-lg border border-[#1D4533] px-5 py-3 font-medium text-[#1D4533] transition hover:bg-[#F9D2BA]">
                  Choose Another Image

                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleConvert}
              disabled={!file}
              className="mt-6 rounded-lg bg-[#1D4533] px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Convert to PDF
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default JpgToPdf