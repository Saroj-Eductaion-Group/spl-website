'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Shield, LogOut } from 'lucide-react'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/tournament-format', label: 'Tournament' },
  { href: '/eligibility', label: 'Rules' },
  { href: '/prizes', label: 'Prizes' },
  { href: '/scholarships', label: 'Scholarship' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/news', label: 'News' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [customRole, setCustomRole] = useState<'ADMIN' | 'COORDINATOR' | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Check custom auth (admin/coordinator) from localStorage
  // Check custom auth (admin/coordinator) from localStorage
  useEffect(() => {
    const checkCustomAuth = () => {
      const role = localStorage.getItem('userRole') as 'ADMIN' | 'COORDINATOR' | null;
      const token = localStorage.getItem('adminToken') || localStorage.getItem('coordinatorToken');
      console.log('Custom auth:', { role, token });
      if (token && (role === 'ADMIN' || role === 'COORDINATOR')) {
        setCustomRole(role);
      } else {
        setCustomRole(null);
      }
    };

    checkCustomAuth();
    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', checkCustomAuth);
    return () => window.removeEventListener('storage', checkCustomAuth);
  }, []); // <-- empty dependency so it runs only on mount and when storage changes

  // Logout for custom auth
  const handleCustomLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('coordinatorToken')
    localStorage.removeItem('userRole')
    setCustomRole(null)
    router.push('/')
  }

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const linkClass = scrolled
    ? 'text-gray-300 hover:text-white hover:bg-white/10'
    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'

  const activeLinkClass = scrolled ? 'text-primary-400' : 'text-primary-600'

  // Determine if we are in custom auth mode
  const isCustomAuth = customRole !== null
  // Determine if Clerk user is logged in
  const isClerkAuth = isLoaded && isSignedIn

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-gray-950/95 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className={`relative w-11 h-11 rounded-xl overflow-hidden transition-all duration-300 ring-2 ${scrolled ? 'ring-primary-500/40 group-hover:ring-primary-400' : 'ring-primary-300 group-hover:ring-primary-500'}`}>
                <Image src="/Hero.png" alt="SPL" fill className="object-cover" />
              </div>
              <div className="hidden sm:block leading-tight">
                <div className={`text-xl font-extrabold tracking-wide transition-colors duration-300 ${scrolled ? 'text-white' : 'text-gray-900'}`}>SPL</div>
                <div className="text-[11px] text-primary-500 font-semibold tracking-widest uppercase">Under-19</div>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-[15px] font-semibold rounded-lg transition-all duration-200 ${active ? activeLinkClass : linkClass
                      }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-0.5 bg-primary-500 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {/* Case 1: Custom Auth (admin/coordinator) */}
              {isCustomAuth && (
                <>
                  <Link
                    href={customRole === 'ADMIN' ? '/admin/dashboard' : '/coordinator/dashboard'}
                    className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border transition-all duration-200 ${scrolled
                        ? 'text-gray-400 border-white/15 hover:text-primary-400 hover:border-primary-500/40 hover:bg-primary-500/5'
                        : 'text-gray-500 border-gray-300 hover:text-primary-600 hover:border-primary-400 hover:bg-primary-50'
                      }`}
                  >
                    <Shield className="w-4 h-4" />
                    {customRole === 'ADMIN' ? 'Admin Dashboard' : 'Coordinator Dashboard'}
                  </Link>

                </>
              )}

              {/* Case 2: Clerk Auth (normal user) */}
              {!isCustomAuth && isClerkAuth && (
                <>
                  <Link
                    href="/my-registration"
                    className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-lg border transition-all duration-200 ${scrolled
                        ? 'text-gray-300 border-white/15 hover:text-white hover:border-white/30'
                        : 'text-gray-600 border-gray-300 hover:text-primary-600 hover:border-primary-400 hover:bg-primary-50'
                      }`}
                  >
                    My Registration
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              )}

              {/* Case 3: No one logged in */}
              {!isCustomAuth && !isClerkAuth && (
                <>
                  <Link
                    href="/admin/login"
                    className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border transition-all duration-200 ${scrolled
                        ? 'text-gray-400 border-white/15 hover:text-primary-400 hover:border-primary-500/40 hover:bg-primary-500/5'
                        : 'text-gray-500 border-gray-300 hover:text-primary-600 hover:border-primary-400 hover:bg-primary-50'
                      }`}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                  <Link
                    href="/sign-up"
                    className="text-base font-bold text-white bg-primary-600 hover:bg-primary-500 px-7 py-3 rounded-lg transition-all duration-200 shadow-md shadow-primary-600/30"
                  >
                    Register
                  </Link>
                  <Link
                    href="/sign-in"
                    className="text-base font-bold text-white bg-primary-600 hover:bg-primary-500 px-7 py-3 rounded-lg transition-all duration-200 shadow-md shadow-primary-600/30"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg transition-all ${scrolled ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-gray-950/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />
        <div className={`absolute top-0 right-0 h-full w-72 bg-white border-l border-gray-200 shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden ring-2 ring-primary-300">
                <Image src="/Hero.png" alt="SPL" fill className="object-cover" />
              </div>
              <span className="text-sm font-bold text-gray-900">SPL Under-19</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto h-[calc(100%-4rem)] px-3 py-4 flex flex-col gap-0.5">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${active
                      ? 'bg-primary-50 text-primary-600 border border-primary-200'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  {link.label}
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />}
                </Link>
              )
            })}

            <div className="my-3 border-t border-gray-100" />

            {/* Mobile Drawer content - same logic as desktop */}
            {isCustomAuth && (
              <>
                <Link
                  href={customRole === 'ADMIN' ? '/admin/dashboard' : '/coordinator/dashboard'}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
                >
                  <Shield className="w-3.5 h-3.5" />
                  {customRole === 'ADMIN' ? 'Admin Dashboard' : 'Coordinator Dashboard'}
                </Link>

              </>
            )}

            {!isCustomAuth && isClerkAuth && (
              <>
                <Link
                  href="/my-registration"
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold ${pathname === '/my-registration'
                      ? 'bg-primary-50 text-primary-600 border border-primary-200'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  My Registration
                </Link>
                <div className="flex items-center gap-3 px-4 py-2.5">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-sm text-gray-500">My Account</span>
                </div>
              </>
            )}

            {!isCustomAuth && !isClerkAuth && (
              <>
                <Link
                  href="/admin/login"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 border border-gray-200"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Login
                </Link>
                <Link
                  href="/sign-up"
                  className="flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-500"
                >
                  Register
                </Link>
                <Link
                  href="/sign-in"
                  className="flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-500"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}