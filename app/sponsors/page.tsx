'use client'

import { useEffect, useState } from 'react'
import { Award, Users, Star, Trophy, ExternalLink } from 'lucide-react'

interface Sponsor {
  id: string; name: string; tier: string; logoUrl?: string; website?: string
}

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  useEffect(() => {
    fetch('/api/admin/sponsors').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setSponsors(data.filter((s: Sponsor & { active: boolean }) => s.active))
    })
  }, [])

  const title = sponsors.filter(s => s.tier === 'TITLE')
  const official = sponsors.filter(s => s.tier === 'OFFICIAL')
  const associate = sponsors.filter(s => s.tier === 'ASSOCIATE')

  const SponsorCard = ({ sponsor, size = 'md' }: { sponsor: Sponsor; size?: 'lg' | 'md' | 'sm' }) => (
    <div className={`text-center p-${size === 'lg' ? '8' : size === 'md' ? '6' : '4'} border border-gray-200 rounded-lg hover:shadow-md transition-shadow`}>
      {sponsor.logoUrl ? (
        <img src={sponsor.logoUrl} alt={sponsor.name} className={`mx-auto mb-3 object-contain rounded ${size === 'lg' ? 'h-24 w-48' : size === 'md' ? 'h-16 w-32' : 'h-12 w-24'}`} />
      ) : (
        <div className={`mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center ${size === 'lg' ? 'h-24 w-48' : size === 'md' ? 'h-16 w-32' : 'h-12 w-24'}`}>
          <span className="text-gray-500 font-semibold text-sm text-center px-2">{sponsor.name}</span>
        </div>
      )}
      <h3 className={`font-semibold mb-1 ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>{sponsor.name}</h3>
      {sponsor.website && (
        <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 flex items-center justify-center gap-1 hover:underline">
          <ExternalLink className="w-3 h-3" /> Visit Website
        </a>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary-600 mb-4">Our Sponsors</h1>
            <p className="text-xl text-gray-600">Partners Supporting Youth Cricket Excellence</p>
          </div>

          {/* Title Sponsors */}
          <div className="card mb-8 text-center bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200">
            <div className="flex items-center justify-center mb-6">
              <Trophy className="w-8 h-8 text-yellow-600 mr-3" />
              <h2 className="text-2xl font-bold text-yellow-700">Title Sponsor</h2>
            </div>
            {title.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-6">
                {title.map(s => <SponsorCard key={s.id} sponsor={s} size="lg" />)}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg mx-auto max-w-md">
                <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-gray-500 font-semibold">SAROJ INTERNATIONAL UNIVERSITY</span>
                </div>
                <p className="text-gray-600 text-sm">Academic Partner & Title Sponsor</p>
              </div>
            )}
          </div>

          {/* Official Partners */}
          {official.length > 0 && (
            <div className="card mb-8">
              <div className="flex items-center mb-6">
                <Users className="w-8 h-8 text-primary-500 mr-3" />
                <h2 className="text-2xl font-semibold text-primary-600">Official Partners</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {official.map(s => <SponsorCard key={s.id} sponsor={s} size="md" />)}
              </div>
            </div>
          )}

          {/* Associate Sponsors */}
          {associate.length > 0 && (
            <div className="card mb-8">
              <div className="flex items-center mb-6">
                <Star className="w-8 h-8 text-gold-500 mr-3" />
                <h2 className="text-2xl font-semibold text-gold-600">Associate Sponsors</h2>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                {associate.map(s => <SponsorCard key={s.id} sponsor={s} size="sm" />)}
              </div>
            </div>
          )}

          {/* Sponsorship Packages */}
          <div className="card mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-primary-600">Sponsorship Packages</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-2 border-yellow-400 rounded-lg p-6 text-center">
                <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-yellow-600 mb-2">Title Sponsor</h3>
                <div className="text-3xl font-bold text-yellow-600 mb-4">₹50L+</div>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>• Tournament naming rights</li>
                  <li>• Maximum brand visibility</li>
                  <li>• VIP hospitality</li>
                  <li>• Media partnerships</li>
                </ul>
              </div>
              <div className="border-2 border-primary-400 rounded-lg p-6 text-center">
                <Trophy className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary-600 mb-2">Official Partner</h3>
                <div className="text-3xl font-bold text-primary-600 mb-4">₹20L+</div>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>• Category exclusivity</li>
                  <li>• Stadium branding</li>
                  <li>• Digital presence</li>
                  <li>• Hospitality packages</li>
                </ul>
              </div>
              <div className="border-2 border-green-400 rounded-lg p-6 text-center">
                <Star className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-600 mb-2">Associate</h3>
                <div className="text-3xl font-bold text-green-600 mb-4">₹5L+</div>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>• Logo placement</li>
                  <li>• Website listing</li>
                  <li>• Social media mentions</li>
                  <li>• Networking opportunities</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Become a Sponsor */}
          <div className="card text-center">
            <h2 className="text-2xl font-semibold mb-4 text-primary-600">Become a Sponsor</h2>
            <p className="text-gray-600 mb-6">Join us in supporting youth cricket and building the future of sports in Uttar Pradesh</p>
            <div className="bg-primary-50 p-6 rounded-lg max-w-md mx-auto">
              <h3 className="font-semibold mb-3">Sponsorship Inquiries</h3>
              <p className="text-sm text-gray-600 mb-2">Email: info@splcricket.com</p>
              <p className="text-sm text-gray-600 mb-4">Phone: +91 XXXXX XXXXX</p>
              <a href="/contact" className="btn-primary inline-block">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
