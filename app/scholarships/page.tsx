import { GraduationCap, CheckCircle, BookOpen, Award, Users, Star } from 'lucide-react'
import Link from 'next/link'

export default function Scholarships() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="page-hero-title">Scholarship Program</h1>
          <p className="page-hero-sub">50% Scholarship for Every SPL Participant</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          {/* Hero Banner */}
          <div className="card mb-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
            <div className="text-7xl font-bold mb-2">50%</div>
            <h2 className="text-2xl font-bold mb-3">Scholarship on Tuition Fees</h2>
            <p className="text-primary-100 text-lg">
              Every player who participates in SPL U19 is eligible for a 50% scholarship
              at <strong>Saroj International University</strong>
            </p>
            <p className="text-primary-200 text-sm mt-3">
              Regardless of your team's performance — just participate and you qualify.
            </p>
          </div>

          {/* Key Facts */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center">
              <Users className="w-10 h-10 text-primary-500 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-1">All Players</h3>
              <p className="text-gray-600 text-sm">Every registered player — team or individual — is eligible</p>
            </div>
            <div className="card text-center">
              <Award className="w-10 h-10 text-gold-500 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-1">50% Off Tuition</h3>
              <p className="text-gray-600 text-sm">Half the tuition fee waived for the entire course duration</p>
            </div>
            <div className="card text-center">
              <BookOpen className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-1">All UG Programs</h3>
              <p className="text-gray-600 text-sm">Applicable to all undergraduate programs at Saroj International University</p>
            </div>
          </div>

          {/* Scholarship Details */}
          <div className="card mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-primary-600">Scholarship Details</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-primary-600">What You Get</h3>
                <ul className="space-y-3">
                  {[
                    '50% reduction in tuition fees',
                    'Applicable to all undergraduate programs',
                    'Valid for entire course duration',
                    'Additional sports quota benefits',
                    'Priority admission consideration',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-primary-600">Eligibility Conditions</h3>
                <ul className="space-y-3">
                  {[
                    'Must be a registered SPL U19 participant',
                    'Complete tournament participation',
                    'Meet university admission criteria',
                    'Maintain academic standards',
                    'No disciplinary issues during tournament',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Scholarship Acknowledgement — from document Section G */}
          <div className="card mb-8 bg-primary-50 border border-primary-200">
            <h2 className="text-xl font-semibold mb-4 text-primary-700">Scholarship Acknowledgement</h2>
            <p className="text-gray-700 mb-3">By participating in SPL, every player acknowledges that:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <Star className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                Participation in SPL makes them eligible for 50% scholarship
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                Scholarship is applicable at Saroj International University
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                Admission is subject to university norms and eligibility criteria
              </li>
            </ul>
          </div>

          {/* How to Apply */}
          <div className="card mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-primary-600">How to Claim Your Scholarship</h2>
            <div className="space-y-5">
              {[
                { step: 1, title: 'Register & Participate', desc: 'Register for SPL U19 and participate in tournament matches as per schedule.' },
                { step: 2, title: 'Receive Participation Certificate', desc: 'Get your official SPL participation certificate after tournament completion.' },
                { step: 3, title: 'Apply to Saroj International University', desc: 'Submit your application to Saroj International University along with your SPL certificate.' },
                { step: 4, title: 'Scholarship Approved', desc: 'Receive 50% scholarship on tuition fees upon admission confirmation.' },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About Saroj International University */}
          <div className="card mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary-600">About Saroj International University</h2>
            <p className="text-gray-700 mb-4">
              Saroj International University is the academic partner of SPL, committed to nurturing
              young talent both on and off the cricket field. The university offers a wide range of
              undergraduate programs and provides a world-class learning environment.
            </p>
            <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
              <p className="text-gold-800 font-medium text-sm">
                🎓 This scholarship is exclusively for SPL U19 participants — one more reason to register and play!
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="card text-center bg-gradient-to-r from-primary-50 to-gold-50">
            <h2 className="text-2xl font-bold mb-3 text-primary-600">Ready to Play & Earn Your Scholarship?</h2>
            <p className="text-gray-600 mb-6">Register for SPL U19 today and secure your 50% scholarship at Saroj International University.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?type=team" className="btn-primary px-8 py-3">Register as Team</Link>
              <Link href="/register?type=individual" className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">Register as Individual</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
