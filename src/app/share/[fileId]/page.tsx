'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { promises as fs } from 'fs'
import path from 'path'

interface FileMetadata {
  originalName: string
  uploadedAt: string
}

export default function SharePage({ params }: { params: { fileId: string } }) {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')
  const [metadata, setMetadata] = useState<FileMetadata | null>(null)

  useEffect(() => {
    // Fetch metadata when component mounts
    fetch(`/api/metadata/${params.fileId}`)
      .then(res => res.json())
      .then(data => setMetadata(data))
      .catch(err => console.error('Failed to fetch metadata:', err))
  }, [params.fileId])

  const handleDownload = async () => {
    try {
      setDownloading(true)
      const extension = metadata?.originalName ? path.extname(metadata.originalName) : ''
      const response = await fetch(`/uploads/${params.fileId}${extension}`)
      
      if (!response.ok) {
        throw new Error('File not found')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = metadata?.originalName || params.fileId // Use original filename if available
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('Failed to download file')
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8 relative border border-white/20"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Download File
          </h1>
          {metadata && (
            <p className="text-gray-600 mb-6 break-all">
              {metadata.originalName}
            </p>
          )}

          {error ? (
            <p className="text-red-500 mb-4">{error}</p>
          ) : (
            <p className="text-gray-600 mb-6">
              Your file is ready to download
            </p>
          )}

          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`w-full py-3 px-6 ${
              downloading ? 'bg-blue-400' : 'bg-blue-600'
            } text-white rounded-lg hover:opacity-90 active:opacity-100 transition-opacity flex items-center justify-center gap-2`}
          >
            {downloading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download File
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
} 