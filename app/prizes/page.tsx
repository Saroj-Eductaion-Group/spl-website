import Link from 'next/link'

const prizes = [
  { place: '1st', label: 'Champion', amount: '₹11,00,000', icon: '🥇', color: '#ffd700' },
  { place: '2nd', label: 'Runner-Up', amount: '₹5,00,000', icon: '🥈', color: '#c4c6d0' },
  { place: '3rd', label: 'Third Place', amount: '₹2,00,000', icon: '🥉', color: '#cd7f32' },
]

const individual = [
  { title: 'Best Batsman', amount: '₹50,000' },
  { title: 'Best Bowler', amount: '₹50,000' },
  { title: 'Best All-Rounder', amount: '₹50,000' },
  { title: 'Player of Tournament', amount: '₹1,00,000' },
]

const scholarshipSteps = [
  { step: '01', title: 'Complete Tournament', desc: 'Participate in SPL matches as per tournament schedule' },
  { step: '02', title: 'Receive Certificate', desc: 'Get SPL participation certificate after tournament completion' },
  { step: '03', title: 'University Application', desc: 'Apply to Saroj International University with SPL certificate' },
  { step: '04', title: 'Scholarship Approved', desc: 'Receive 50% scholarship upon admission confirmation' },
]

export default function Prizes() {
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] pt-20">

      {/* Hero */}
      <section className="spl-hero border-b border-[#ffd700]/15">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <p className="text-[#ffd700] font-headline font-bold text-xs tracking-[0.3em] uppercase mb-4">Rewards</p>
          <h1 className="font-headline font-black text-5xl md:text-7xl italic uppercase tracking-tighter leading-[0.9] mb-6 text-white">
            PRIZE MONEY <br /><span className="text-[#ffd700]">& SCHOLARSHIPS</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">Rewards for excellence in cricket and academics</p>
        </div>
      </section>

      {/* Champion Prize */}
      <section className="py-20 px-6 bg-[#131318] border-b border-[#444650]/15">
        <div className="max-w-screen-xl mx-auto text-center">
          <div className="text-8xl mb-6">🏆</div>
          <p className="text-[#ffd700] font-headline font-bold text-xs tracking-[0.3em] uppercase mb-4">Championship Prize</p>
          <div className="text-8xl md:text-[10rem] font-headline font-black text-[#ffd700] leading-none tracking-tighter">₹11L</div>
          <p className="text-2xl font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mt-4">Winner Prize Money</p>
        </div>
      </section>

      {/* Prize Distribution */}
      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-[#ffd700] mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-10">Prize Distribution</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {prizes.map(p => (
              <div key={p.place} className="bg-[#131318] border border-[#444650]/20 p-8 text-center hover:border-[#ffd700]/40 transition-colors">
                <div className="text-5xl mb-4">{p.icon}</div>
                <div className="text-xs font-headline font-bold uppercase tracking-widest mb-2" style={{ color: p.color }}>{p.place} Place</div>
                <h3 className="font-headline font-black text-xl uppercase mb-4" style={{ color: p.color }}>{p.label}</h3>
                <div className="text-4xl font-headline font-black" style={{ color: p.color }}>{p.amount}</div>
                <p className="text-[#c4c6d0] text-xs mt-2">+ Trophy</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Awards */}
      <section className="py-16 px-6 bg-[#131318] border-y border-[#444650]/15">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-[#ffd700] mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-10">Individual Awards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {individual.map(a => (
              <div key={a.title} className="bg-[#0b0b0f] border border-[#444650]/20 p-6 text-center hover:border-[#ffd700]/40 transition-colors">
                <h3 className="font-headline font-bold uppercase tracking-tight text-[#c4c6d0] mb-3 text-sm">{a.title}</h3>
                <div className="text-3xl font-headline font-black text-[#ffd700]">{a.amount}</div>
                <p className="text-[#c4c6d0] text-xs mt-1">+ Trophy</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarship */}
      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-[#ffd700] mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-4">50% Scholarship Program</h2>
          <p className="text-[#c4c6d0] max-w-2xl mb-12">
            Every player who participates in SPL becomes eligible for a 50% scholarship at Saroj International University, regardless of their team's performance.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[#131318] border border-[#444650]/20 p-8">
              <h3 className="font-headline font-bold uppercase tracking-tight text-[#ffd700] mb-6">What You Get</h3>
              <ul className="space-y-3 text-[#c4c6d0] text-sm">
                {['50% reduction in tuition fees', 'Applicable to all undergraduate programs', 'Valid for entire course duration', 'Additional sports quota benefits'].map(i => (
                  <li key={i} className="flex items-center gap-3 border-b border-[#444650]/10 pb-3">
                    <span className="w-1.5 h-1.5 bg-[#ffd700] rounded-full flex-shrink-0" />{i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#131318] border border-[#444650]/20 p-8">
              <h3 className="font-headline font-bold uppercase tracking-tight text-[#ffd700] mb-6">Eligibility Conditions</h3>
              <ul className="space-y-3 text-[#c4c6d0] text-sm">
                {['Complete SPL tournament participation', 'Meet university admission criteria', 'Maintain academic standards', 'No disciplinary issues during tournament'].map(i => (
                  <li key={i} className="flex items-center gap-3 border-b border-[#444650]/10 pb-3">
                    <span className="w-1.5 h-1.5 bg-[#444650] rounded-full flex-shrink-0" />{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-4 gap-6">
            {scholarshipSteps.map(s => (
              <div key={s.step} className="bg-[#131318] border border-[#444650]/20 p-6">
                <div className="text-4xl font-headline font-black text-[#ffd700]/20 mb-3">{s.step}</div>
                <h3 className="font-headline font-bold uppercase tracking-tight mb-2 text-sm">{s.title}</h3>
                <p className="text-[#c4c6d0] text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#002366] border-t border-[#ffd700]/20 text-center">
        <h2 className="font-headline font-black text-4xl italic uppercase tracking-tighter mb-6 text-white">
          Compete for <span className="text-[#ffd700]">Glory</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register?type=team" className="bg-[#ffd700] text-[#002366] px-8 py-3 font-headline font-black uppercase tracking-tight hover:brightness-110 transition-all">
            Register Team — ₹11,000
          </Link>
          <Link href="/register?type=individual" className="border-2 border-[#ffd700] text-[#ffd700] px-8 py-3 font-headline font-black uppercase tracking-tight hover:bg-[#ffd700] hover:text-[#002366] transition-all">
            Register Individual — ₹1,000
          </Link>
        </div>
      </section>
    </div>
  )
}
