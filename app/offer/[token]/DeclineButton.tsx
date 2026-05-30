'use client'

import {declineOffer, type OfferActionState} from '@/app/offer/[token]/actions'
import {useActionState} from 'react'

export default function DeclineButton({token}: {token: string}) {
  const [state, action, pending] = useActionState<OfferActionState, FormData>(declineOffer, null)
  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="token" value={token} />
      <button type="submit" className="btn btn-ghost btn-lg" disabled={pending}>
        {pending ? 'Declining…' : 'Decline'}
      </button>
      {state?.error && <p className="text-error text-sm">{state.error}</p>}
    </form>
  )
}
