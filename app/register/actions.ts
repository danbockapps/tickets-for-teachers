'use server'

import {db} from '@/lib/db'
import {sendMagicLink, sendWorkEmailVerification} from '@/lib/email'
import {sendPhoneVerification} from '@/lib/sms'
import {users} from '@/lib/schema'
import {createMagicLinkToken, generateToken} from '@/lib/tokens'
import {eq, or} from 'drizzle-orm'
import {redirect} from 'next/navigation'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, '')
}

export async function register(_prevState: unknown, formData: FormData) {
  const firstName = (formData.get('firstName') as string)?.trim()
  const lastName = (formData.get('lastName') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const workEmail = (formData.get('workEmail') as string)?.trim().toLowerCase()
  const rawPhone = (formData.get('phone') as string)?.trim()

  if (!firstName || !lastName || !email || !workEmail || !rawPhone) {
    return {error: 'All fields are required.'}
  }

  if (!emailRegex.test(email)) {
    return {error: 'Please enter a valid personal email address.'}
  }

  if (!emailRegex.test(workEmail)) {
    return {error: 'Please enter a valid work email address.'}
  }

  if (email === workEmail) {
    return {error: 'Personal and work email addresses must be different.'}
  }

  const digits = normalizePhone(rawPhone)
  if (digits.length < 10) {
    return {error: 'Please enter a valid mobile phone number.'}
  }
  // Format as E.164 for Twilio (assume US if no country code)
  const phone = digits.length === 10 ? `+1${digits}` : `+${digits}`

  const existing = await db
    .select()
    .from(users)
    .where(or(eq(users.email, email), eq(users.workEmail, workEmail)))

  for (const row of existing) {
    if (row.email === email) {
      return {error: 'An account with this personal email already exists.'}
    }
    if (row.workEmail === workEmail) {
      return {error: 'An account with this work email already exists.'}
    }
  }

  const phoneExists = await db.select().from(users).where(eq(users.phone, phone))
  if (phoneExists.length > 0) {
    return {error: 'An account with this phone number already exists.'}
  }

  const eventTypes = formData.getAll('eventTypes') as string[]
  const adaAccessible = formData.get('adaAccessible') === 'on'
  const primaryWorksite = (formData.get('primaryWorksite') as string)?.trim() || null

  const id = generateToken()
  await db.insert(users).values({
    id,
    email,
    workEmail,
    phone,
    firstName,
    lastName,
    eventPreferences: JSON.stringify(eventTypes),
    adaAccessible,
    primaryWorksite,
  })

  const personalToken = await createMagicLinkToken(id, 'personal')
  const workToken = await createMagicLinkToken(id, 'work')
  const phoneToken = await createMagicLinkToken(id, 'phone')

  await Promise.all([
    sendMagicLink(email, personalToken),
    sendWorkEmailVerification(workEmail, workToken),
    sendPhoneVerification(phone, phoneToken),
  ])

  redirect('/check-email?emails=2')
}
