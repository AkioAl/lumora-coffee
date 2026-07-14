import { ReactNode } from 'react'

interface CTAButtonProps {
  children: ReactNode
  variant?: 'primary' | 'outline'
  href?: string
  onClick?: () => void
}

export default function CTAButton({ children, variant = 'primary', href, onClick }: CTAButtonProps) {
  const baseClasses = 'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200'
  const variantClasses = variant === 'primary'
    ? 'bg-brand-tosca text-white hover:bg-brand-toscaLight'
    : 'border border-brand-border text-brand-white hover:border-brand-tosca hover:text-brand-tosca'

  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${variantClasses}`}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {children}
    </button>
  )
}
