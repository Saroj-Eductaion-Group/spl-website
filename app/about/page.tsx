import Link from 'next/link'

const stats = [
  { value: '₹11L', label: 'Winner Prize' },
  { value: '50%', label: 'Scholarship' },
  { value: '1 Month', label: 'Duration' },
  { value: 'Ekana', label: 'Grand Final' },
]

const features = [
  { icon: '🏆', title: '₹11,00,000 Prize', desc: 'Massive winner prize money for the champion team' },
  { icon: '🎓', title: '50% Scholarship', desc: 'All participating players eligible for university scholarship' },
  { icon: '📅', title: '1 Month Duration', desc: 'Comprehensive tournament spanning across the state' },
  { icon: '📍', title: 'Ekana Stadium Final', desc: "Grand finale at Lucknow's premier cricket venue" },
  { icon: '👥', title: 'Statewide Participation', desc: 'Teams from all districts of Uttar Pradesh' },
  { icon: '⭐', title: 'Professional Standards', desc: 'Tournament conducted with professional cricket standards' },
]

const reasons = [
  { title: 'Educational Benefits', desc: '50% scholarship opportunity at Saroj International University' },
  { title: 'Professional Exposure', desc: 'Play at professional venues with standard equipment' },
  { title: 'Skill Development', desc: 'Learn from experienced coaches and mentors' },
  { title: 'Network Building', desc: 'Connect with fellow cricketers and sports professionals' },
  { title: 'Recognition', desc: 'State-level recognition and media coverage' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] pt-20">

      {/* Hero */}
      <section className="spl-hero border-b border-[#ffd700]/15">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <p className="text-[#ffd700] font-headline font-bold text-xs tracking-[0.3em] uppercase mb-4">About SPL</p>
          <h1 className="font-headline font-black text-5xl md:text-7xl italic uppercase tracking-tighter leading-[0.9] mb-6 text-white">
            SAROJ <br /><span className="text-[#ffd700]">PREMIER LEAGUE</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            Uttar Pradesh's most prestigious Under-19 cricket tournament for Class 12 students, organized by Saroj Educational Group.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 bg-[#131318] border-b border-[#444650]/15">
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className="text-center border border-[#444650]/20 p-6">
              <div className="text-4xl font-headline font-black text-[#ffd700] mb-1">{s.value}</div>
              <div className="text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-[#ffd700] mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-8">Tournament Overview</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <p className="text-[#c4c6d0] leading-relaxed">
              The Saroj Premier League (SPL) is a prestigious Under-19 cricket tournament organized by Saroj Educational Group in partnership with Saroj International University. This statewide tournament is exclusively designed for Class 12 students across Uttar Pradesh, providing them with a platform to showcase their cricketing talent while pursuing their education.
            </p>
            <p className="text-[#c4c6d0] leading-relaxed">
              With a duration of one month, SPL features simultaneous district-level matches culminating in a grand finale at the iconic Ekana Cricket Stadium in Lucknow. The tournament bridges sports and academics, offering every participant a 50% scholarship regardless of performance.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-[#131318] border-y border-[#444650]/15">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-[#ffd700] mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-10">Key Highlights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-[#0b0b0f] border border-[#444650]/20 p-6 hover:border-[#ffd700]/40 transition-colors">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-headline font-black text-lg uppercase mb-2">{f.title}</h3>
                <p className="text-[#c4c6d0] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="border-l-4 border-[#ffd700] pl-8">
            <h2 className="font-headline font-black text-2xl uppercase tracking-tighter italic mb-4 text-[#ffd700]">Our Mission</h2>
            <p className="text-[#c4c6d0] leading-relaxed">
              To provide a premier platform for young cricketers in Uttar Pradesh to showcase their talent, develop their skills, and pursue their dreams while maintaining focus on their academic excellence.
            </p>
          </div>
          <div className="border-l-4 border-[#444650] pl-8">
            <h2 className="font-headline font-black text-2xl uppercase tracking-tighter italic mb-4">Our Vision</h2>
            <p className="text-[#c4c6d0] leading-relaxed">
              To become the most prestigious Under-19 cricket tournament in India, nurturing future cricket stars while promoting education and sportsmanship among the youth.
            </p>
          </div>
        </div>
      </section>

      {/* Why Participate */}
      <section className="py-16 px-6 bg-[#131318] border-y border-[#444650]/15">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-24 h-1 bg-[#ffd700] mb-4" />
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-10">Why Participate in SPL?</h2>
          <div className="space-y-4">
            {reasons.map((r, i) => (
              <div key={r.title} className="flex items-start gap-6 border-b border-[#444650]/15 pb-4">
                <span className="text-2xl font-headline font-black text-[#ffd700]/30 w-8 flex-shrink-0">0{i + 1}</span>
                <div>
                  <h3 className="font-headline font-bold uppercase tracking-tight mb-1">{r.title}</h3>
                  <p className="text-[#c4c6d0] text-sm">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#002366] border-t border-[#ffd700]/20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-headline font-black text-4xl italic uppercase tracking-tighter mb-6 text-white">
            Ready to <span className="text-[#ffd700]">Join?</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?type=team" className="bg-[#ffd700] text-[#002366] px-8 py-3 font-headline font-black uppercase tracking-tight hover:brightness-110 transition-all">
              Register Team
            </Link>
            <Link href="/register?type=individual" className="border-2 border-[#ffd700] text-[#ffd700] px-8 py-3 font-headline font-black uppercase tracking-tight hover:bg-[#ffd700] hover:text-[#002366] transition-all">
              Register Individual
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
