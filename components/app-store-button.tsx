import Image from 'next/image'

export function AppStoreButton() {
  return (
    <a
      href="https://apps.apple.com/app/matlosen"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Last ned Matlosen på App Store (åpnes i ny fane)"
      className="inline-block focus-visible:opacity-80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
    >
      <Image
        src="/app-store-badge.svg"
        alt="Last ned Matlosen på App Store"
        width={180}
        height={60}
        className="hover:opacity-80 transition-opacity duration-default"
      />
    </a>
  )
}
