import Image from 'next/image'

export function AppStoreButton() {
  return (
    <a
      href="https://apps.apple.com/app/matlosen"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      <Image
        src="/app-store-badge.svg"
        alt="Last ned Matlosen på App Store"
        width={180}
        height={60}
        className="hover:opacity-80 transition-opacity"
      />
    </a>
  )
}
