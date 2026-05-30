import Image from 'next/image'

export default function Logo({className}: {className?: string}) {
  return (
    <Image
      src="/logo.png"
      alt="Tickets for Teachers"
      width={677}
      height={369}
      preload
      className={className}
    />
  )
}
