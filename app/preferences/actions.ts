'use server'

import {revalidatePath} from 'next/cache'
import {db} from '@/lib/db'
import {users} from '@/lib/schema'
import {eq} from 'drizzle-orm'
import {requireAuth} from '@/lib/auth'

export async function savePreferences(_prevState: unknown, formData: FormData) {
  const user = await requireAuth()
  const selected = formData.getAll('eventTypes') as string[]
  const adaAccessible = formData.get('adaAccessible') === 'on'

  await db
    .update(users)
    .set({eventPreferences: JSON.stringify(selected), adaAccessible})
    .where(eq(users.id, user.id))

  revalidatePath('/')
  return {success: true}
}
