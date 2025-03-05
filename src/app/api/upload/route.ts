import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Create a unique ID for the file
    const fileId = uuidv4()
    const originalName = file.name
    const fileExtension = path.extname(originalName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (err) {
      // Directory might already exist, ignore error
    }

    // Store file metadata
    const metadata = {
      id: fileId,
      originalName,
      uploadedAt: new Date().toISOString()
    }

    // Save the file with the unique ID but preserve extension
    const fileName = `${fileId}${fileExtension}`
    await writeFile(join(uploadDir, fileName), buffer)
    
    // Save metadata
    await writeFile(
      join(uploadDir, `${fileId}.json`),
      JSON.stringify(metadata, null, 2)
    )
    
    // Generate the share URL
    const shareUrl = `${request.nextUrl.origin}/share/${fileId}`
    
    return NextResponse.json({ 
      url: shareUrl,
      fileId: fileId,
      fileName: originalName
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
} 