import { createClient } from "@supabase/supabase-js";
import { z } from "zod";


export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export const isValidUserID = (id: string) => {
  return z.string().uuid().safeParse(id).success
}