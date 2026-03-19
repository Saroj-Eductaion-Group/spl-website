import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, basename } from 'path'
import { existsSync } from 'fs'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true })

    // path.basename strips any directory traversal attempts like ../../etc/passwd
    const safeName = basename(file.name.replace(/\s/g, '_')).replace(/[^a-zA-Z0-9._-]/g, '')
    const filename = `${Date.now()}_${safeName}`
    const filepath = join(uploadsDir, filename)

    await writeFile(filepath, buffer)

    return NextResponse.json({ success: true, url: `/uploads/${filename}`, filename })
  } catch (error) {
    console.error('Upload error')
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
