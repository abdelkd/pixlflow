import { handle } from "@hono/node-server/vercel";
import { Hono } from "hono";

import sharp from 'sharp'
import { isValidUserID, supabase } from "./supabase";
import { parseOptions } from "./utils";

export const runtime = 'nodejs'

const app = new Hono().basePath('/api')
const filenameRegex = /^(?!.*\.\.)[a-zA-Z0-9._-]+\.(?:jpg|png|avif|webp)$/

app.post('/image/:uploadId', async (c) => {
  const uploadId = c.req.param('uploadId')
  if (!isValidUserID(uploadId)) {
    return c.json({
      message: 'Invalid Upload ID'
    }, 400)
  }

  const files = await c.req.parseBody()
  if (typeof files['file'] === "string") {
    return c.json({
      message: 'Invalid file'
    }, 400)
  }

  let file: File = files['file']

  if (!filenameRegex.test(file.name)) {
    return c.json({
      message: 'Invalid filename'
    }, 400)
  }

  const fileData = await file.arrayBuffer()
  const fileType = file.name.split('.')[1]

  const result = await supabase.storage
    .from('assets')
    .upload(`${crypto.randomUUID()}.${fileType}`, fileData)

  if (result.error) {
    return c.json({
      message: 'Cannnot upload file'
    }, 500)
  }
  
  return c.json({
    filename: result.data.path
  })
})

app.get('/image/:options/:filename', async (c) => {
  const optionsString = c.req.param('options')
  const filename = c.req.param('filename')

  const options = parseOptions(optionsString);

  if (!filenameRegex.test(filename)) {

    return c.json({
      message: 'Invalid filename'
    }, 400)
  }

  const result = supabase.storage
    .from('assets')
    .getPublicUrl(filename)

  const publicUrl = result.data.publicUrl

  const res = await fetch(publicUrl)
  if (!res.ok) {
    return c.json({
      message: 'File does not exist'
    }, 404)
  }

  const fileBody = await res.arrayBuffer()
  const modifiedImageBuffer = await sharp(fileBody)
    .jpeg({ quality: options.quality })
    .resize(options.width, options.height)
    .toBuffer()
  
  c.header("Content-Type", "image/jpeg")
  return c.body(modifiedImageBuffer.buffer)
})

app.get('/hello', async (c) => {
  return c.json({
    message: 'Hello'
  })
})

export const GET = handle(app)
export const POST = handle(app)
