'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
// import type { ActionResult, Profile } from '@/types'

const PAGE_SIZE = 10

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string            // uuid — FK to auth.users.id
          phone: string         // text NOT NULL
          name: string | null   // text
          email: string | null  // text
          photo_url: string | null // text
          dob: string | null    // date (ISO string "YYYY-MM-DD")
          gender: string | null // text
          is_admin: boolean     // bool NOT NULL default false
          created_at: string    // timestamptz (ISO string)
        }
        Insert: {
          id: string
          phone: string
          name?: string | null
          email?: string | null
          photo_url?: string | null
          dob?: string | null
          gender?: string | null
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          phone?: string
          name?: string | null
          email?: string | null
          photo_url?: string | null
          dob?: string | null
          gender?: string | null
          is_admin?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            referencedRelation: 'users'  // auth.users
            referencedColumns: ['id']
          }
        ]
      }
    }
}
}

export type Profile   = Database['public']['Tables']['profiles']['Row']
export type PaginatedUsers = {
  users: Profile[]
  totalCount: number
  totalPages: number
  currentPage: number
}

export async function getPaginatedUsers(page: number = 1): Promise<PaginatedUsers> {
  const supabase = await createClient()

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('is_admin', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)

  const totalCount = count ?? 0

  return {
    users: data ?? [],
    totalCount,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    currentPage: page,
  }
}

export async function toggleAdminStatus(
  targetUserId: string,
  makeAdmin: boolean
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated' }

  if (targetUserId === user.id && !makeAdmin) {
    return { success: false, error: "You can't remove your own admin access." }
  }

  // RLS policy "admins update any profile" will reject this if caller isn't admin
  const { error } = await supabase
    .from('profiles')
    .update({ is_admin: makeAdmin })
    .eq('id', targetUserId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/users')
  return { success: true, data: undefined }
}