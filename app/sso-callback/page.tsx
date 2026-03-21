'use client'

import { useEffect } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk()
  const router = useRouter()

  useEffect(() => {
    handleRedirectCallback({
      signInFallbackRedirectUrl: '/register',
      signUpFallbackRedirectUrl: '/register',
    }).catch(() => router.replace('/sign-in'))
  }, [handleRedirectCallback, router])

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
      <span className="w-10 h-10 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
    </div>
  )
}
