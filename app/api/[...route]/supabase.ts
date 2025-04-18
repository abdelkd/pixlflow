import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const uuidSchema = z.string().uuid()

// Create a single supabase client for interacting with your database
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export const checkUserID = (id: string) => {
  const parsedId = uuidSchema.safeParse(id)
  return parsedId.success
}