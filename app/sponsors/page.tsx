'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Sponsor { id: string; name: string; tier: string; logoUrl?: string; website?: string }

const packages = [
  { tier: 'Title Sponsor', amount: '₹50L+', perks: ['Tournament naming rights', 'Maximum brand visibility', 'VIP hospitality', 'Media partnerships'] },
  { tier: 'Official Partner', amount: '₹20L+', perks: ['Category exclusivity', 'Stadium branding', 'Digital presence', 'Hospitality packages'] },
  { tier: 'Associate', amount: '₹5L+', perks: ['Logo placement', 'Website listing', 'Social media mentions', 'Networking opportunities'] },
]

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  useEffect(() => {
    fetch('/api/admin/sponsors').then(r => r.json())
      .then(data => { if (Array.isArray(data)) setSponsors(data.filter((s: Sponsor & { active: boolean }) => s.active)) })
  }, [])

  const title = sponsors.filter(s => s.tier === 'TITLE')
  const official = sponsors.filter(s => s.tier === 'OFFICIAL')
  const associate = sponsors.filter(s => s.tier === 'ASSOCIATE')

  const SponsorCard = ({ sponsor }: { sponsor: Sponsor }) => (
    <div className="bg-[#0b0b0f] border border-[#444650]/20 p-6 text-center hover:border-[#ffd700]/40 transition-colors">
      {sponsor.logoUrl
        ? <img src={sponsor.logoUrl} alt={sponsor.name} className="h-16 w-auto object-contain mx-auto mb-3" />
        : <div className="h-16 flex items-center justify-center mb-3"><span className="font-headline font-bold text-[#c4c6d0]">{sponsor.name}</span></div>}
      {sponsor.website && (
        <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#ffd700] font-headline hover:underline">Visit Website →</a>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] pt-20">

      {/* Hero */}
      <section className="spl-hero border-b border-[#ffd700]/15">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <p className="text-[#ffd700] font-headline font-bold text-xs tracking-[0.3em] uppercase mb-4">Partners</p>
          <h1 className="font-headline font-black text-5xl md:text-7xl italic uppercase tracking-tighter leading-[0.9] mb-6 text-white">
            OUR <br /><span className="text-[#ffd700]">SPONSORS</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">Partners supporting youth cricket excellence in Uttar Pradesh</p>
        </div>
      </section>

      {/* Title Sponsors */}
      <section className="py-16 px-6 bg-[#131318] border-b border-[#444650]/15">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <span className="text-[#ffd700] font-headline font-black text-xs tracking-[0.3em] uppercase">🏆 Title Sponsor</span>
            <div className="flex-1 h-px bg-[#444650]/20" />
          </div>
          {title.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6">
              {title.map(s => <SponsorCard key={s.id} sponsor={s} />)}
            </div>
          ) : (
            <div className="bg-[#0b0b0f] border border-[#ffd700]/20 p-10 text-center max-w-md mx-auto">
              <div className="font-headline font-black text-xl uppercase text-[#ffd700] mb-2">SAROJ INTERNATIONAL UNIVERSITY</div>
              <p className="text-[#c4c6d0] text-sm">Academic Partner & Title Sponsor</p>
            </div>
          )}
        </div>
      </section>

      {/* Official Partners */}
      {official.length > 0 && (
        <section className="py-16 px-6 border-b border-[#444650]/15">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <span className="text-[#c4c6d0] font-headline font-black text-xs tracking-[0.3em] uppercase">Official Partners</span>
              <div className="flex-1 h-px bg-[#444650]/20" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {official.map(s => <SponsorCard key={s.id} sponsor={s} />)}
            </div>
          </div>
        </section>
      )}

      {/* Associate Sponsors */}
      {associate.length > 0 && (
        <section className="py-16 px-6 bg-[#131318] border-b border-[#444650]/15">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <span className="text-[#c4c6d0] font-headline font-black text-xs tracking-[0.3em] uppercase">Associate Sponsors</span>
              <div className="flex-1 h-px bg-[#444650]/20" />
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {associate.map(s => <SponsorCard key={s.id} sponsor={s} />)}
            </div>
          </div>
        </section>
      )}

      {/* Packages */}
      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-[#ffd700] mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-10">Sponsorship Packages</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((p, i) => (
              <div key={p.tier} className={`bg-[#131318] border p-8 ${i === 0 ? 'border-[#ffd700]/40' : 'border-[#444650]/20'}`}>
                <h3 className={`font-headline font-black text-xl uppercase tracking-tighter mb-2 ${i === 0 ? 'text-[#ffd700]' : 'text-[#e4e1e9]'}`}>{p.tier}</h3>
                <div className={`text-4xl font-headline font-black mb-6 ${i === 0 ? 'text-[#ffd700]' : 'text-[#c4c6d0]'}`}>{p.amount}</div>
                <ul className="space-y-3">
                  {p.perks.map(perk => (
                    <li key={perk} className="flex items-center gap-3 text-[#c4c6d0] text-sm">
                      <span className="w-1.5 h-1.5 bg-[#ffd700] rounded-full flex-shrink-0" />{perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become Sponsor CTA */}
      <section className="py-20 px-6 bg-[#002366] border-t border-[#ffd700]/20 text-center">
        <h2 className="font-headline font-black text-4xl italic uppercase tracking-tighter mb-4 text-white">
          Become a <span className="text-[#ffd700]">Sponsor</span>
        </h2>
        <p className="text-white/70 mb-8 max-w-xl mx-auto">Join us in supporting youth cricket and building the future of sports in Uttar Pradesh</p>
        <div className="text-white/70 text-sm mb-6">
          <p>Email: <span className="text-[#ffd700]">info@splcricket.com</span></p>
          <p>Phone: <span className="text-[#ffd700]">+91 98765 43210</span></p>
        </div>
        <Link href="/contact" className="bg-[#ffd700] text-[#002366] px-10 py-4 font-headline font-black uppercase tracking-tight hover:brightness-110 transition-all inline-block">
          Contact Us
        </Link>
      </section>
    </div>
  )
}
