'use client'

import {acceptOffer, type OfferActionState} from '@/app/offer/[token]/actions'
import {useActionState} from 'react'

export default function AcceptButton({token}: {token: string}) {
  const [state, action, pending] = useActionState<OfferActionState, FormData>(acceptOffer, null)
  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="token" value={token} />
      <button type="submit" className="btn btn-success btn-lg" disabled={pending}>
        {pending ? 'Claiming…' : 'Accept'}
      </button>
      {state?.error && <p className="text-error text-sm">{state.error}</p>}
    </form>
  )
}
