import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary-600 mb-2">SPL — Saroj Premier League</h1>
        <p className="text-gray-500 mb-8">Create an account to register for the tournament</p>
        <SignUp
          appearance={{
            elements: { phoneInput: 'hidden', phoneInputBox: 'hidden' }
          }}
        />
      </div>
    </div>
  )
}
