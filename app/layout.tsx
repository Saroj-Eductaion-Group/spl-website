import './globals.css'
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import Shell from '@/components/Shell'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'SPL — Saroj Premier League U19',
  description: 'Official website for Saroj Premier League Under-19 Cricket Tournament — Uttar Pradesh',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/register"
      signUpFallbackRedirectUrl="/register"
    >
      <html lang="en" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;900&family=Manrope:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        </head>
        <body>
          <Shell>{children}</Shell>
        </body>
      </html>
    </ClerkProvider>
  )
}
