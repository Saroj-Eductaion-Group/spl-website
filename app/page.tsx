'use client'

import Link from 'next/link'
import { Trophy, Users, Calendar, MapPin, ArrowRight, CheckCircle, GraduationCap, Star } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import AnimatedCounter from '@/components/AnimatedCounter'
import Reveal from '@/components/Reveal'
import Image from 'next/image'
import SponsorStrip from '@/components/SponsorStrip'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const statsRef = useRef(null)
  const cardsRef = useRef(null)
  const featuresRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.5,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      infinite: false,
    })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24" style={{background: 'linear-gradient(135deg, #1e3270 0%, #1d4ed8 50%, #1e3270 100%)'}}>
        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(218,167,55,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(218,167,55,0.1) 0%, transparent 50%)'}} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full -translate-y-1/2 translate-x-1/4" style={{background: 'rgba(218,167,55,0.08)'}} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full translate-y-1/2 -translate-x-1/4" style={{background: 'rgba(218,167,55,0.08)'}} />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-8"
            >
              <Image src="/Hero.png" alt="SPL Logo" width={220} height={120} className="object-contain" />
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              Saroj Premier League
              <span className="block text-gold-400">Under-19</span>
            </motion.h1>

            <motion.p
              className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Uttar Pradesh's most prestigious U19 cricket tournament for Class 12 students.
              Compete, earn scholarships, and make your mark.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/register" className="inline-flex items-center bg-gold-500 hover:bg-gold-400 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg shadow-gold-500/30 hover:shadow-xl hover:-translate-y-0.5">
                Register Now <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/about" className="inline-flex items-center border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:border-white hover:bg-white/10 transition-all">
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section ref={statsRef} className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '₹11L', label: 'Winner Prize' },
              { value: '50%', label: 'Scholarship' },
              { value: '30', label: 'Days Tournament' },
              { value: '1000+', label: 'Participants' },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-400 mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-sm font-medium uppercase tracking-wide">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Registration Cards ── */}
      <section ref={cardsRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Path</h2>
              <p className="text-gray-500 text-lg">Two ways to join the championship</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Reveal direction="left" delay={0.1}>
              <div className="border-2 border-primary-200 rounded-2xl p-8 hover:border-primary-400 hover:shadow-xl transition-all group">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-100 p-3 rounded-xl mr-4 group-hover:bg-primary-200 transition-colors">
                    <Users className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Team Registration</h3>
                    <p className="text-gray-500 text-sm">Already have a squad</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Up to 15 players', 'Coach & Manager details', 'Direct tournament entry', 'District-level competition'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500">Registration Fee</span>
                    <span className="text-3xl font-bold text-gray-900">₹11,000</span>
                  </div>
                  <Link href="/register?type=team" className="block w-full bg-primary-600 text-white text-center py-3.5 rounded-xl font-bold hover:bg-primary-700 transition-colors">
                    Register Team
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.2}>
              <div className="border-2 border-gold-200 rounded-2xl p-8 hover:border-gold-400 hover:shadow-xl transition-all group">
                <div className="flex items-center mb-6">
                  <div className="bg-gold-100 p-3 rounded-xl mr-4 group-hover:bg-gold-200 transition-colors">
                    <Trophy className="w-7 h-7 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Individual Registration</h3>
                    <p className="text-gray-500 text-sm">No team? No problem</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Individual player profile', 'District-wise team formation', 'SPL committee assigns team', 'Equal opportunity for all'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500">Registration Fee</span>
                    <span className="text-3xl font-bold text-gray-900">₹1,000</span>
                  </div>
                  <Link href="/register?type=individual" className="block w-full bg-gold-500 text-white text-center py-3.5 rounded-xl font-bold hover:bg-gold-600 transition-colors">
                    Register Individual
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Why SPL ── */}
      <section ref={featuresRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Why Choose SPL?</h2>
              <p className="text-gray-500 text-lg">More than just a tournament</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Trophy, color: 'primary', title: 'Professional Standards', desc: 'International-level organization with professional umpires and world-class facilities.' },
              { icon: GraduationCap, color: 'gold', title: '50% Scholarship', desc: 'Every participant gets 50% scholarship at Saroj International University — regardless of performance.' },
              { icon: Star, color: 'green', title: 'Talent Recognition', desc: 'Scouts from major cricket academies and state teams attend to identify promising talent.' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                  <div className={`w-16 h-16 bg-${f.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                    <f.icon className={`w-8 h-8 text-${f.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tournament Highlights ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Reveal>
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Tournament Highlights</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Trophy, color: 'text-gold-500', title: '₹11,00,000', sub: 'Winner Prize Money' },
              { icon: GraduationCap, color: 'text-primary-500', title: '50% Scholarship', sub: 'For All Players' },
              { icon: Calendar, color: 'text-primary-500', title: '1 Month', sub: 'Tournament Duration' },
              { icon: MapPin, color: 'text-gold-500', title: 'Ekana Stadium', sub: 'Grand Final Venue' },
            ].map((h, i) => (
              <Reveal key={h.title} delay={i * 0.1}>
                <div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
                  <h.icon className={`w-10 h-10 ${h.color} mx-auto mb-3`} />
                  <h3 className="font-bold text-gray-900 mb-1">{h.title}</h3>
                  <p className="text-gray-500 text-sm">{h.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container mx-auto px-4 text-center">
          <Reveal>
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Begin Your Journey?</h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Join hundreds of talented cricketers in Uttar Pradesh's most prestigious tournament.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition-colors shadow-lg">
                Start Registration
              </Link>
              <Link href="/tournament-format" className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-primary-600 transition-all">
                View Tournament Details
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Sponsors ── */}
      <SponsorStrip />

      {/* ── Quick Links ── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Reveal>
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Quick Links</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { href: '/tournament-format', title: 'Tournament Format', desc: 'District → Zonal → State → Ekana Final' },
              { href: '/eligibility', title: 'Eligibility & Rules', desc: 'Under-19, Class 12, UP residents only' },
              { href: '/schedule', title: 'District Schedule', desc: 'View district-wise match fixtures' },
            ].map(l => (
              <Reveal key={l.href}>
                <Link href={l.href} className="block bg-white rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{l.title}</h3>
                  <p className="text-gray-500 text-sm">{l.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
