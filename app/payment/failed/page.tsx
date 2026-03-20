import Link from 'next/link'

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] flex flex-col items-center justify-center py-12 px-4 pt-24">
      <div className="max-w-md w-full">

        <div className="bg-[#131318] border border-[#444650]/20 overflow-hidden mb-6">

          {/* Top error banner */}
          <div className="bg-red-600 px-8 py-10 text-center">
            <div className="w-20 h-20 bg-white/20 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-white" style={{ fontSize: '48px' }}>cancel</span>
            </div>
            <h1 className="font-headline font-black text-2xl italic uppercase tracking-tighter text-white mb-2">Payment Failed</h1>
            <p className="text-red-100 text-sm">Your payment could not be processed</p>
          </div>

          <div className="px-8 py-8 space-y-5">

            <div className="bg-red-500/5 border border-red-500/20 p-5">
              <p className="text-sm text-red-400 font-headline font-bold uppercase tracking-tight mb-3">What may have gone wrong:</p>
              <ul className="text-sm text-[#c4c6d0] space-y-1.5">
                {['Payment was cancelled or timed out', 'Insufficient funds or card declined', 'Network issue during transaction', 'Bank security check failed'].map(r => (
                  <li key={r} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#002366]/30 border border-[#ffd700]/15 p-5">
              <p className="text-sm text-[#ffd700] font-headline font-bold uppercase tracking-tight mb-1">Your registration data is safe</p>
              <p className="text-sm text-[#c4c6d0]">
                Your registration details have been saved. You can retry the payment or contact support for assistance.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Link href="/register" className="flex items-center justify-center gap-2 bg-[#ffd700] text-[#002366] py-3.5 font-headline font-black uppercase tracking-tight hover:brightness-110 transition-all">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span> Try Again
              </Link>
              <Link href="/contact" className="flex items-center justify-center gap-2 py-3.5 border-2 border-[#ffd700] text-[#ffd700] font-headline font-black uppercase tracking-tight hover:bg-[#ffd700] hover:text-[#002366] transition-all">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>phone</span> Contact Support
              </Link>
              <Link href="/" className="flex items-center justify-center gap-2 text-sm text-[#c4c6d0]/50 hover:text-[#c4c6d0] transition-colors py-2 font-headline uppercase tracking-widest">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span> Back to Home
              </Link>
            </div>

            <div className="border-t border-[#444650]/20 pt-5 flex flex-col gap-2 text-sm text-[#c4c6d0]/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mail</span>
                <span>support@splcricket.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>phone</span>
                <span>+91 XXXXX XXXXX</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#c4c6d0]/30 font-body">© 2025 Saroj Premier League</p>
      </div>
    </div>
  )
}
