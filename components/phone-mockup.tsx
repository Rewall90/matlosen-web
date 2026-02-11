type PhoneMockupProps = {
  label: string
  variant?: 'light' | 'dark'
}

export function PhoneMockup({ label, variant = 'light' }: PhoneMockupProps) {
  const bgClass = variant === 'light' ? 'bg-surface' : 'bg-surface-elevated'

  return (
    <div className={`${bgClass} rounded-phone p-p-card max-w-phone mx-auto shadow-phone border border-border`}>
      <div className="bg-placeholder rounded-phone-screen aspect-[9/19] flex items-center justify-center">
        <span className="text-text-muted text-sm">{label}</span>
      </div>
    </div>
  )
}
