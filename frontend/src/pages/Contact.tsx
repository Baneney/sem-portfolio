import { motion } from 'framer-motion'
import { Mail, ExternalLink } from 'lucide-react'
import hgPin from '../assets/hg-big-pin.png'

const GithubIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
)
const LinkedinIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)

const links = [
  {
    label: 'Email',
    href: 'mailto:johndoe@email.com',
    Icon: Mail,
    subtitle: 'johndoe@email.com',
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    Icon: GithubIcon,
    subtitle: '@username',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    Icon: LinkedinIcon,
    subtitle: '/in/username',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-10"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#080400]">
        <div className="absolute inset-0" style={{ transform: 'translateY(-15%) translateX(-10%)' }}>
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

      {/* Mockingjay pin — faded background */}
      <img
        src={hgPin}
        alt=""
        className="absolute right-[5%] top-[15%] h-[55%] opacity-[0.03] pointer-events-none select-none"
        style={{ filter: 'blur(1px)' }}
      />

      {/* Embers */}
      {Array.from({ length: 14 }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#ffd86a] pointer-events-none"
          style={{
            left: `${5 + (i * 6.5) % 90}%`,
            bottom: '-4px',
            width: `${1.5 + (i % 3)}px`,
            height: `${1.5 + (i % 3)}px`,
            animation: `ember-rise ${3 + (i % 4) * 0.8}s ease-out ${i * 0.3}s infinite`,
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
            The Signal
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
          className="text-4xl md:text-5xl font-bold text-white/90 leading-tight mb-3"
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
            <motion.a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              custom={3 + i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="group relative flex flex-col items-center gap-3 px-8 py-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#ffd86a]/20 hover:bg-[#ffd86a]/[0.03] transition-all duration-500 min-w-[180px]"
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(255,216,106,0.06),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Icon */}
              <div className="relative text-white/30 group-hover:text-[#ffd86a] transition-colors duration-500">
                <l.Icon />
              </div>

              {/* Label */}
              <span className="text-white/60 text-sm font-medium tracking-wide group-hover:text-white/90 transition-colors duration-300">
                {l.label}
              </span>

              {/* Subtitle */}
              <span className="text-white/20 text-[11px] tracking-wider group-hover:text-white/35 transition-colors duration-300">
                {l.subtitle}
              </span>

              {/* Arrow */}
              <ExternalLink
                size={12}
                strokeWidth={1.5}
                className="absolute top-3 right-3 text-white/10 group-hover:text-[#ffd86a]/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </motion.a>
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
