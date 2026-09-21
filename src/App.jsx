import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import About from './pages/About'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'

import ImageCompressor from './tools/compressor/ImageCompressor'
import ImageResizer from './tools/resizer/ImageResizer'
import JpgToPng from './tools/converter/JpgToPng'
import WebpConverter from './tools/converter/WebpConverter'

import JpgToPdf from './tools/pdf/JpgToPdf'
import PdfToJpg from './tools/pdf/PdfToJpg'
import PdfToPng from './tools/pdf/PdfToPng'
import PdfMerger from './tools/pdf/PdfMerger'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F7EAE0]">
        <Navbar />

        <main>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
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
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App