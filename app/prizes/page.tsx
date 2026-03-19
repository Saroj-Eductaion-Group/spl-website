import { Trophy, GraduationCap, Award, Star } from 'lucide-react'

export default function Prizes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="page-hero-title">Prize Money & Scholarships</h1>
          <p className="page-hero-sub">Rewards for Excellence in Cricket and Academics</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <div className="card mb-8 text-center bg-gradient-to-r from-gold-400 to-gold-600 text-white">
            <Trophy className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Championship Prize</h2>
            <div className="text-6xl font-bold mb-4">₹11,00,000</div>
            <p className="text-xl">Winner Prize Money</p>
            <p className="mt-4 text-gold-100">The ultimate reward for SPL champions</p>
          </div>

          <div className="card mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-primary-600">Prize Distribution</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gold-50 rounded-lg">
                <Trophy className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gold-600 mb-2">1st Place</h3>
                <div className="text-3xl font-bold text-gold-600 mb-2">₹11,00,000</div>
                <p className="text-gray-600">Championship Trophy + Cash Prize</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <Award className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">2nd Place</h3>
                <div className="text-3xl font-bold text-gray-600 mb-2">₹5,00,000</div>
                <p className="text-gray-600">Runner-up Trophy + Cash Prize</p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <Star className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-orange-600 mb-2">3rd Place</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">₹2,00,000</div>
                <p className="text-gray-600">Third Place Trophy + Cash Prize</p>
              </div>
            </div>
          </div>

          <div className="card mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gold-600">Individual Awards</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Best Batsman', amount: '₹50,000', bg: '#fefce8', color: '#a16207' },
                { title: 'Best Bowler', amount: '₹50,000', bg: '#eff6ff', color: '#1d4ed8' },
                { title: 'Best All-Rounder', amount: '₹50,000', bg: '#f0fdf4', color: '#15803d' },
                { title: 'Player of Tournament', amount: '₹1,00,000', bg: '#faf5ff', color: '#7e22ce' },
              ].map(a => (
                <div key={a.title} className="text-center p-4 rounded-lg" style={{ background: a.bg }}>
                  <h3 className="font-semibold mb-2" style={{ color: a.color }}>{a.title}</h3>
                  <p className="text-2xl font-bold" style={{ color: a.color }}>{a.amount}</p>
                  <p className="text-sm text-gray-600">+ Trophy</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card mb-8">
            <div className="flex items-center mb-6">
              <GraduationCap className="w-8 h-8 text-primary-500 mr-3" />
              <h2 className="text-2xl font-semibold text-primary-600">50% Scholarship Program</h2>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Every player who participates in SPL becomes eligible for a 50% scholarship
                at Saroj International University, regardless of their team's performance.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-primary-600">Scholarship Benefits</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• 50% reduction in tuition fees</li>
                    <li>• Applicable to all undergraduate programs</li>
                    <li>• Valid for entire course duration</li>
                    <li>• Additional sports quota benefits</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-primary-600">Eligibility Conditions</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Complete SPL tournament participation</li>
                    <li>• Meet university admission criteria</li>
                    <li>• Maintain academic standards</li>
                    <li>• No disciplinary issues during tournament</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-6 text-primary-600">How to Apply for Scholarship</h2>
            <div className="space-y-4">
              {[
                ['Complete Tournament', 'Participate in SPL matches as per tournament schedule'],
                ['Receive Certificate', 'Get SPL participation certificate after tournament completion'],
                ['University Application', 'Apply to Saroj International University with SPL certificate'],
                ['Scholarship Approval', 'Receive 50% scholarship upon admission confirmation'],
              ].map(([title, desc], i) => (
                <div key={title} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{i + 1}</div>
                  <div>
                    <h3 className="font-semibold mb-1">{title}</h3>
                    <p className="text-gray-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
