import Link from 'next/link'
import Image from 'next/image'
import { XCircle, RefreshCw, Phone, Mail, ArrowLeft } from 'lucide-react'

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">

          {/* Top error banner */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-10 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-2">Payment Failed</h1>
            <p className="text-red-100 text-sm">Your payment could not be processed</p>
          </div>

          <div className="px-8 py-8 space-y-5">

            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <p className="text-sm text-red-700 font-semibold mb-2">What may have gone wrong:</p>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Payment was cancelled or timed out</li>
                <li>• Insufficient funds or card declined</li>
                <li>• Network issue during transaction</li>
                <li>• Bank security check failed</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-sm text-blue-700 font-semibold mb-1">Your registration data is safe</p>
              <p className="text-sm text-blue-600">
                Your registration details have been saved. You can retry the payment or contact support for assistance.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Link href="/register" className="flex items-center justify-center gap-2 btn-primary py-3.5">
                <RefreshCw className="w-4 h-4" /> Try Again
              </Link>
              <Link href="/contact" className="flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                <Phone className="w-4 h-4" /> Contact Support
              </Link>
              <Link href="/" className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors py-2">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
            </div>

            <div className="border-t border-gray-100 pt-5 flex flex-col gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>support@splcricket.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>+91 XXXXX XXXXX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Image src="/Hero.png" alt="SPL" width={70} height={44} className="object-contain mx-auto opacity-50" />
          <p className="text-xs text-gray-400 mt-2">© 2025 Saroj Premier League</p>
        </div>
      </div>
    </div>
  )
}
