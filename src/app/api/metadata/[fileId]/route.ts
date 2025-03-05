import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const uploadsDir = path.join(process.cwd(), 'public/uploads')
    const metadataPath = path.join(uploadsDir, `${params.fileId}.json`)

    // Read metadata file
    const metadata = await fs.readFile(metadataPath, 'utf-8')
    return NextResponse.json(JSON.parse(metadata))
  } catch (error) {
    console.error('Error reading metadata:', error)
    return NextResponse.json(
      { error: 'Failed to fetch file metadata' },
      { status: 404 }
    )
  }
} 