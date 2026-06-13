import { useEffect, useRef, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ExternalLink, Check, Copy } from 'lucide-react'

const GithubIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
)
const LinkedinIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)

const EMAIL = 'luizsemwarain@gmail.com'

const links = [
  {
    label: "Email",
    href: `mailto:${EMAIL}`,
    Icon: Mail,
    subtitle: EMAIL,
    copy: EMAIL,
  },
  {
    label: "GitHub",
    href: "https://github.com/Baneney",
    Icon: GithubIcon,
    subtitle: "@Baneney",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sem-luiz-warain-0085b73a4",
    Icon: LinkedinIcon,
    subtitle: "/in/sem-luiz",
  },
];

const fadeUp: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const fireRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const handleMouse = useCallback((e: MouseEvent) => {
    const section = sectionRef.current
    if (!section) return
    const rect = section.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    // Cursor glow
    if (glowRef.current) {
      glowRef.current.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px)`
    }

    // Fire parallax
    if (fireRef.current) {
      fireRef.current.style.transform = `translate(${x * 10}px, ${y * 8}px)`
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    section.addEventListener('mousemove', handleMouse, { passive: true })
    return () => section.removeEventListener('mousemove', handleMouse)
  }, [handleMouse])

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-5 sm:px-10 py-10"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#080400]">
        <div ref={fireRef} className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: 'translateY(-15%) translateX(-10%)' }}>
          <div className="absolute top-[0%] left-[0%] w-[90%] h-[100%] rounded-full bg-[#c85000]/80 blur-[120px]" />
          <div className="absolute top-[5%] left-[10%] w-[65%] h-[85%] rounded-full bg-[#e86000]/70 blur-[70px]" />
          <div className="absolute top-[12%] left-[18%] w-[45%] h-[70%] rounded-full bg-[#ff8c00]/80 blur-[40px]" />
          <div className="absolute top-[18%] left-[24%] w-[30%] h-[55%] rounded-full bg-[#ffb300]/70 blur-[20px]" />
          <div className="absolute top-[22%] left-[28%] w-[18%] h-[40%] rounded-full bg-[#ffd700]/80 blur-[10px]" />
          <div className="absolute top-[27%] left-[32%] w-[8%] h-[22%] rounded-full bg-[#fff5c0]/60 blur-[5px]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#080400]/50 to-[#080400]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080400]/60 via-transparent to-[#080400]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#080400_70%)]" />
      </div>

      {/* Cursor glow */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,216,106,0.06) 0%, transparent 70%)', willChange: 'transform' }}
      />

      {/* Embers */}
      {Array.from({ length: 18 }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${3 + (i * 5.3) % 94}%`,
            bottom: '-4px',
            width: `${1.5 + (i % 3) * 0.8}px`,
            height: `${1.5 + (i % 3) * 0.8}px`,
            background: i % 3 === 0 ? '#ffd86a' : i % 3 === 1 ? '#ffb300' : '#ff8c00',
            animation: `ember-rise ${2.8 + (i % 5) * 0.6}s ease-out ${i * 0.25}s infinite`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">
        {/* Label */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="flex items-center gap-3 mb-6"
        >
          <div className="h-px w-10 bg-[#c9952a]/50" />
          <span className="text-[#c9952a] text-xs tracking-[0.3em] uppercase">
            Contacts
          </span>
          <div className="h-px w-10 bg-[#c9952a]/50" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white/90 leading-tight mb-3"
        >
          Let's <span className="text-[#ffd86a]">Connect</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-white/35 text-sm leading-relaxed max-w-sm mb-14"
        >
          Open to new opportunities, collaborations, or just a conversation.
        </motion.p>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
          {links.map((l, i) => (
            <LinkCard key={l.label} link={l} index={3 + i} onCopy={l.copy ? handleCopy : undefined} copied={copied && !!l.copy} />
          ))}
        </div>

        {/* Bottom line */}
        <motion.div
          custom={6}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mt-14 flex items-center gap-3 text-white/15 text-[10px] tracking-[0.3em] uppercase"
        >
          <div className="h-px w-6 bg-white/10" />
          Available worldwide
          <div className="h-px w-6 bg-white/10" />
        </motion.div>
      </div>
    </section>
  )
}

function LinkCard({ link, index, onCopy, copied }: { link: typeof links[number]; index: number; onCopy?: () => void; copied: boolean }) {
  const cardRef = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / centerY * -8
    const rotateY = (x - centerX) / centerX * 8

    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`)
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`)
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)'
  }, [])

  return (
    <motion.a
      ref={cardRef}
      href={link.href}
      target={link.href.startsWith('http') ? '_blank' : undefined}
      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col items-center gap-3 px-6 sm:px-8 py-6 sm:py-7 rounded-2xl border border-white/[0.06] bg-white/[0.10] hover:border-[#ffd86a]/25 transition-[border-color,background-color] duration-500 min-w-0 sm:min-w-[180px] cursor-pointer"
      style={{ transformStyle: 'preserve-3d', willChange: 'transform', transition: 'transform 0.15s ease-out, border-color 0.5s, background-color 0.5s' }}
    >
      {/* Spotlight follow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(circle 120px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,216,106,0.08), transparent)' }}
      />

      {/* Animated border glow */}
      <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 animate-[spin_4s_linear_infinite]" style={{ background: 'conic-gradient(from 0deg, transparent 0%, #ffd86a40 25%, transparent 50%, #ffd86a20 75%, transparent 100%)' }} />
        <div className="absolute inset-[1px] rounded-2xl bg-[#080400]/80" />
      </div>

      {/* Icon */}
      <div className="relative text-white/30 group-hover:text-[#ffd86a] transition-colors duration-500" style={{ transform: 'translateZ(20px)' }}>
        {copied ? <Check size={28} strokeWidth={1.5} className="text-emerald-400" /> : <link.Icon />}
      </div>

      {/* Label */}
      <span className="text-white/60 text-sm font-medium tracking-wide group-hover:text-white/90 transition-colors duration-300" style={{ transform: 'translateZ(12px)' }}>
        {link.label}
      </span>

      {/* Subtitle */}
      <span className="text-white/20 text-[11px] tracking-wider group-hover:text-white/35 transition-colors duration-300" style={{ transform: 'translateZ(8px)' }}>
        {link.subtitle}
      </span>

      {/* Copy / External */}
      {onCopy ? (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCopy() }}
          className="absolute top-3 right-3 p-1 rounded-md text-white/10 hover:text-[#ffd86a]/50 transition-all duration-300 hover:bg-white/[0.03]"
        >
          {copied ? <Check size={12} strokeWidth={1.5} /> : <Copy size={12} strokeWidth={1.5} />}
        </button>
      ) : (
        <ExternalLink
          size={12}
          strokeWidth={1.5}
          className="absolute top-3 right-3 text-white/10 group-hover:text-[#ffd86a]/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </motion.a>
  )
}
