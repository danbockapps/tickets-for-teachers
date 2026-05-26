import twilio from 'twilio'

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

function verifyUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/auth/verify?token=${token}`
}

export async function sendPhoneVerification(to: string, token: string) {
  const link = verifyUrl(token)
  await client.messages.create({
    body: `Verify your Tickets for Teachers phone number: ${link}`,
    messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
    to,
  })
}
