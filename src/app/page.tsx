'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'react-qr-code'

function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [shareUrl, setShareUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploading(true)
      
      const formData = new FormData()
      formData.append('file', selectedFile)

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        const data = await response.json()
        setShareUrl(data.url)
      } catch (error) {
        console.error('Upload failed:', error)
      } finally {
        setUploading(false)
      }
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      handleFileSelect({ target: { files: [droppedFile] } } as any)
    }
  }

  const resetShare = () => {
    setShareUrl('')
    setFile(null)
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Quick<span className="text-blue-600">Share</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Share files instantly with anyone, anywhere. No sign-up required. 
            Just drag & drop your file and get a shareable link.
          </p>

          <motion.div
            className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              className="w-full h-48 border-2 border-dashed border-blue-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 transition-colors duration-200"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className="w-12 h-12 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V8" />
              </svg>
              <span className="text-gray-600">
                {file ? file.name : 'Click to upload or drag and drop'}
              </span>
            </div>

            {uploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    className="bg-blue-600 h-2.5 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Share Popup */}
      <AnimatePresence>
        {shareUrl && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-6 max-w-md w-full relative border border-white/20"
            >
              <button
                onClick={resetShare}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Your file is ready to share!
                </h3>
                
                <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
                  <QRCode value={shareUrl} size={160} className="mx-auto mb-4" />
                  <p className="text-sm text-gray-500">Scan to download</p>
                </div>

                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg mb-4 shadow-sm">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="w-full p-2 bg-white border border-gray-200 rounded text-blue-600 font-medium text-sm"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 ${copied ? 'bg-green-500' : 'bg-blue-600'} text-white rounded hover:opacity-90 active:opacity-100 transition-opacity flex items-center gap-2`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full py-3 px-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white transition-colors text-center shadow-sm"
                >
                  Open Download Page
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Simple Footer
function Footer() {
  return (
    <footer className="py-4 text-center text-sm text-gray-500">
      Made with ❤️ by QuickShare
    </footer>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <FileUpload />
      <Footer />
    </main>
  )
}