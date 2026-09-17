import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'

import ImageCompressor from './tools/compressor/ImageCompressor'
import ImageResizer from './tools/resizer/ImageResizer'
import JpgToPng from './tools/converter/JpgToPng'
import WebpConverter from './tools/converter/WebpConverter'
import Footer from './components/Footer'
import NotFound from './pages/NotFound'
import About from './pages/About'
import Privacy from './pages/Privacy'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F7EAE0]">
        <Navbar />

        <main>
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={<Home />}
            />

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

            <Route path="*" element={<NotFound />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App