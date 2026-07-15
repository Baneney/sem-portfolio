import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ExternalLink, Check, Copy, Download } from 'lucide-react'

const GithubIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
)
const LinkedinIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)

const EMAIL = 'luizsemwarain@gmail.com'

const links = [
  {
    label: "Resume",
    href: "/sem-resume.pdf",
    Icon: Download,
    subtitle: "Download CV",
  },
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
        <div className="flex flex-col sm:flex-row gap-5 w-full justify-center relative">
          {links.map((l, i) => (
            <LinkCard key={l.label} link={l} index={3 + i} onCopy={l.copy ? handleCopy : undefined} copied={copied && !!l.copy} />
          ))}
          {/* Copied toast */}
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,216,106,0.15), rgba(200,80,0,0.1))',
                  border: '1px solid rgba(255,216,106,0.2)',
                  color: '#ffd86a',
                  boxShadow: '0 0 20px rgba(255,216,106,0.1)',
                }}
              >
                <Check size={14} strokeWidth={2} />
                Copied to clipboard
              </motion.div>
            )}
          </AnimatePresence>
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
  const cardRef = useRef<HTMLDivElement>(null)

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

    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`)
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`)
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)'
  }, [])

  const isCopyCard = !!onCopy

  const cardContent = (
    <>
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(circle 120px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,216,106,0.12), transparent)' }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-[#ffd86a]/40 to-transparent group-hover:w-[90%] group-hover:via-[#ffd86a]/60 transition-all duration-700" />
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-16 bg-[#ffd86a]/0 group-hover:bg-[#ffd86a]/[0.06] blur-2xl rounded-full transition-all duration-700 pointer-events-none" />
      <div className="absolute top-2 right-3 w-1 h-1 rounded-full bg-[#ffd86a]/30 group-hover:bg-[#ffd86a]/70 group-hover:shadow-[0_0_8px_rgba(255,216,106,0.5)] transition-all duration-500 pointer-events-none group-hover:animate-[bounce_2s_ease-in-out_infinite]" />
      <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.06] group-hover:border-[#ffd86a]/20 group-hover:bg-[#ffd86a]/[0.06] transition-all duration-500" style={{ transform: 'translateZ(20px)' }}>
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, rgba(255,216,106,0.1), transparent 70%)' }}
        />
        {copied
          ? <Check size={22} strokeWidth={1.5} className="text-emerald-400" />
          : <link.Icon size={22} strokeWidth={1.5} className="text-white/40 group-hover:text-[#ffd86a] transition-colors duration-500" />
        }
      </div>
      <span className="text-white/50 text-sm font-medium tracking-wide group-hover:text-[#ffd86a]/90 transition-colors duration-300" style={{ transform: 'translateZ(12px)' }}>
        {link.label}
      </span>
      <span className="text-white/15 text-[11px] tracking-wider group-hover:text-white/35 transition-colors duration-300" style={{ transform: 'translateZ(8px)' }}>
        {link.subtitle}
      </span>
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd86a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      {onCopy ? (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCopy() }}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-white/10 hover:text-[#ffd86a]/60 transition-all duration-300 hover:bg-white/[0.04]"
        >
          {copied ? <Check size={13} strokeWidth={1.5} /> : <Copy size={13} strokeWidth={1.5} />}
        </button>
      ) : (
        <ExternalLink
          size={13}
          strokeWidth={1.5}
          className="absolute top-3 right-3 text-white/10 group-hover:text-[#ffd86a]/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </>
  )

  const sharedProps = {
    ref: cardRef as any,
    custom: index,
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, amount: 0.3 },
    variants: fadeUp,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: "group relative flex flex-col items-center gap-3 px-6 sm:px-8 py-6 sm:py-7 rounded-2xl border border-[#ffd86a]/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] hover:border-[#ffd86a]/30 transition-all duration-500 min-w-0 sm:min-w-[180px] cursor-pointer overflow-hidden",
    style: { transformStyle: 'preserve-3d' as const, willChange: 'transform' as const, transition: 'transform 0.15s ease-out, border-color 0.5s, background 0.5s' },
  }

  if (isCopyCard) {
    return (
      <motion.div {...sharedProps} onClick={onCopy}>
        {cardContent}
      </motion.div>
    )
  }

  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  const isPdf = link.href.endsWith('.pdf')

  return (
    <motion.a
      {...sharedProps}
      href={link.href}
      target={isPdf && !isMobile ? '_blank' : link.href.startsWith('http') ? '_blank' : undefined}
      rel={link.href.startsWith('http') || (isPdf && !isMobile) ? 'noopener noreferrer' : undefined}
      download={isPdf && isMobile ? 'sem-resume.pdf' : undefined}
    >
      {cardContent}
    </motion.a>
  )
}
