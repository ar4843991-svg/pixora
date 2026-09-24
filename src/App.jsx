import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Tools from './pages/Tools'
import About from './pages/About'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'

// Lazy-loaded tools
const ImageCompressor = lazy(
  () => import('./tools/compressor/ImageCompressor')
)

const ImageResizer = lazy(
  () => import('./tools/resizer/ImageResizer')
)

const JpgToPng = lazy(
  () => import('./tools/converter/JpgToPng')
)

const WebpConverter = lazy(
  () => import('./tools/converter/WebpConverter')
)

const JpgToPdf = lazy(
  () => import('./tools/pdf/JpgToPdf')
)

const PdfToJpg = lazy(
  () => import('./tools/pdf/PdfToJpg')
)

const PdfToPng = lazy(
  () => import('./tools/pdf/PdfToPng')
)

const PdfMerger = lazy(
  () => import('./tools/pdf/PdfMerger')
)

function ToolLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1D4533]/20 border-t-[#1D4533]" />

        <p className="text-sm font-medium text-[#5E3122]">
          Loading tool...
        </p>
      </motion.div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F7EAE0]">
        <Navbar />

        <main>
          <Suspense fallback={<ToolLoading />}>
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Image Tools */}
              <Route
                path="/tools/image-compressor"
                element={<ImageCompressor />}
              />

              <Route
                path="/tools/image-resizer"
                element={<ImageResizer />}
              />

              <Route
                path="/tools/jpg-to-png"
                element={<JpgToPng />}
              />

              <Route
                path="/tools/webp-converter"
                element={<WebpConverter />}
              />

              {/* PDF Tools */}
              <Route
                path="/tools/jpg-to-pdf"
                element={<JpgToPdf />}
              />

              <Route
                path="/tools/pdf-to-jpg"
                element={<PdfToJpg />}
              />

              <Route
                path="/tools/pdf-to-png"
                element={<PdfToPng />}
              />

              <Route
                path="/tools/pdf-merger"
                element={<PdfMerger />}
              />

              {/* 404 - Keep Last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App