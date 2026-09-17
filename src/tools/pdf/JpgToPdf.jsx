import { useState } from 'react'
import { jsPDF } from 'jspdf'
import SEO from '../../components/SEO'

function JpgToPdf() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  function handleFileChange(event) {
    const selectedFile = event.target.files[0]

    if (!selectedFile) return

    if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
      setError('Please select a JPG or PNG image.')
      setFile(null)
      return
    }

    setError('')
    setFile(selectedFile)
  }

  function handleConvert() {
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      const pdf = new jsPDF({
        orientation: image.width > image.height ? 'landscape' : 'portrait',
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

          <div className="mt-8 rounded-2xl border-2 border-dashed border-[#1D4533] bg-white p-10 text-center">
            <label className="cursor-pointer">
              <span className="font-medium text-[#1D4533]">
                Choose an image
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {file && (
              <p className="mt-4 text-sm text-gray-600">
                Selected: {file.name}
              </p>
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