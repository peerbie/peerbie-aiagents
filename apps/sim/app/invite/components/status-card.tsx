'use client'

import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BrandedButton } from '@/app/(auth)/components/branded-button'

interface InviteStatusCardProps {
  type: 'login' | 'loading' | 'error' | 'success' | 'invitation' | 'warning'
  title: string
  description: string | React.ReactNode
  icon?: 'userPlus' | 'mail' | 'users' | 'error' | 'success' | 'warning'
  actions?: Array<{
    label: string
    onClick: () => void
    disabled?: boolean
    loading?: boolean
  }>
  isExpiredError?: boolean
}

export function InviteStatusCard({
  type,
  title,
  description,
  icon: _icon,
  actions = [],
  isExpiredError = false,
}: InviteStatusCardProps) {
  const router = useRouter()
<<<<<<< HEAD
  const [buttonClass, setButtonClass] = useState('auth-button-gradient')
  const brandConfig = useBrandConfig()

  useEffect(() => {
    const checkCustomBrand = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      const brandAccent = computedStyle.getPropertyValue('--brand-accent-hex').trim()
      if (brandAccent && brandAccent !== '#1992fc') {
        setButtonClass('auth-button-custom')
      } else {
        setButtonClass('auth-button-gradient')
      }
    }
    checkCustomBrand()
    window.addEventListener('resize', checkCustomBrand)
    const observer = new MutationObserver(checkCustomBrand)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })
    return () => {
      window.removeEventListener('resize', checkCustomBrand)
      observer.disconnect()
    }
  }, [])
=======
>>>>>>> 0fff3329427ecc90bf629b9981320db7d044bb5b

  if (type === 'loading') {
    return (
      <>
        <div className='space-y-1 text-center'>
          <h1 className='font-[500] text-[#ECECEC] text-[32px] tracking-tight'>Loading</h1>
          <p className='font-[380] text-[#999] text-[16px]'>{description}</p>
        </div>
        <div className='mt-8 flex w-full items-center justify-center py-8'>
          <Loader2 className='h-8 w-8 animate-spin text-[#999]' />
        </div>
<<<<<<< HEAD

        <div
          className={`${inter.className} auth-text-muted fixed right-0 bottom-0 left-0 z-50 pb-8 text-center font-[340] text-[13px] leading-relaxed`}
        >
          Need help?{' '}
          <a
            href='mailto:help@peerbie.com'
            className='auth-link underline-offset-4 transition hover:underline'
          >
            Contact support
          </a>
        </div>
      </div>
=======
      </>
>>>>>>> 0fff3329427ecc90bf629b9981320db7d044bb5b
    )
  }

  return (
    <>
      <div className='space-y-1 text-center'>
        <h1 className='font-[500] text-[#ECECEC] text-[32px] tracking-tight'>{title}</h1>
        <p className='font-[380] text-[#999] text-[16px]'>{description}</p>
      </div>

      <div className='mt-8 w-full max-w-[410px] space-y-3'>
        {isExpiredError && (
          <BrandedButton onClick={() => router.push('/')} showArrow={false}>
            Request New Invitation
          </BrandedButton>
        )}

        {actions.map((action, index) => (
          <BrandedButton
            key={index}
            onClick={action.onClick}
            disabled={action.disabled || action.loading}
            loading={action.loading}
            loadingText={action.label}
            showArrow={false}
            className={
              index !== 0
                ? 'border-[#3d3d3d] bg-transparent text-[#ECECEC] hover:border-[#3d3d3d] hover:bg-[#2A2A2A]'
                : undefined
            }
          >
            {action.label}
          </BrandedButton>
        ))}
      </div>
    </>
  )
}
