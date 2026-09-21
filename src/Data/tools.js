import {
  FiMinimize2,
  FiMaximize2,
  FiRefreshCw,
  FiGlobe,
  FiFileText,
  FiImage,
  FiLayers,
} from 'react-icons/fi'

const tools = [
  {
    title: 'Image Compressor',
    slug: 'image-compressor',
    description: 'Reduce image file size while keeping good quality.',
    icon: FiMinimize2,
    action: 'Compress Image',
  },

  {
    title: 'Image Resizer',
    slug: 'image-resizer',
    description: 'Resize your images quickly and easily.',
    icon: FiMaximize2,
    action: 'Resize Image',
  },

  {
    title: 'JPG to PNG',
    slug: 'jpg-to-png',
    description: 'Convert JPG images to PNG format.',
    icon: FiRefreshCw,
    action: 'Convert Image',
  },

  {
    title: 'WebP Converter',
    slug: 'webp-converter',
    description: 'Convert your images to WebP format.',
    icon: FiGlobe,
    action: 'Convert to WebP',
  },

  {
    title: 'JPG to PDF',
    slug: 'jpg-to-pdf',
    description: 'Convert JPG and PNG images to PDF format.',
    icon: FiFileText,
    action: 'Convert to PDF',
  },

  {
    title: 'PDF to JPG',
    slug: 'pdf-to-jpg',
    description: 'Convert PDF pages into JPG images.',
    icon: FiImage,
    action: 'Convert to JPG',
  },

  {
    title: 'PDF to PNG',
    slug: 'pdf-to-png',
    description: 'Convert PDF pages into PNG images.',
    icon: FiImage,
    action: 'Convert to PNG',
  },

  {
    title: 'PDF Merger',
    slug: 'pdf-merger',
    description: 'Merge multiple PDF files into one PDF.',
    icon: FiLayers,
    action: 'Merge PDFs',
  },
]

export default tools