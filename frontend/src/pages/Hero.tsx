import hgPin from '../assets/hg-big-pin.png'
import FireCanvas from '../components/FireCanvas'
import PinShine from '../components/PinShine'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function RevealText({ children, delay, className = '' }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ x: '-110%', opacity: 0 }}
        animate={{ x: '0%', opacity: 1 }}
        transition={{
          duration: 0.35,
          ease: [0.25, 0.1, 0.25, 1],
          delay,
        }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export default function Hero({ showSplash }: { showSplash: boolean }) {
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const lineInView = useInView(bottomBarRef, { once: true, amount: 0.5 })
  const progress = useMotionValue(0)
  const dotCx = useTransform(progress, [0, 1], [0, 1000])
  const [reveal, setReveal] = useState(false)
  const animationsDone = useRef(false)

  useEffect(() => {
    const container = document.getElementById('snap-container')
    if (!container) return

    if (showSplash || !animationsDone.current) {
      container.style.overflowY = 'hidden'
    }

    if (!showSplash && !animationsDone.current && (lineInView || true)) {
      animate(progress, 1, {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0,
      })
      const t = setTimeout(() => {
        setReveal(true)
        animationsDone.current = true
        container.style.overflowY = ''
      }, 650)
      return () => clearTimeout(t)
    }
  }, [lineInView, progress, showSplash])

  function scrollToSection(id: string) {
    const container = document.getElementById('snap-container')
    const el = document.getElementById(id)
    if (!container || !el) return
    const isSnapPage = ['about', 'about1', 'about2', 'about3'].includes(id)
    if (!isSnapPage) container.style.scrollSnapType = 'none'
    container.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
    if (!isSnapPage) {
      const targetTop = el.offsetTop
      const checkReached = () => {
        const diff = Math.abs(container.scrollTop - targetTop)
        if (diff < 5) {
          container.style.scrollSnapType = 'y mandatory'
          return
        }
        requestAnimationFrame(checkReached)
      }
      requestAnimationFrame(checkReached)
    }
  }

  return (
    <section
      id="about"
      className="snap-page relative flex flex-col justify-between px-5 sm:px-10 md:px-16 py-6 sm:py-10 overflow-hidden w-full"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#080400]">
        {/* Fire container — change translateX to move fire left/right, translateY to move up/down */}
        <div
          className="absolute inset-0"
          style={{ transform: "translateX(6%)" }}
        >
          <div className="absolute top-[0%] right-[-20%] w-[90%] h-[100%] rounded-full bg-[#c85000]/80 blur-[120px]" />
          <div className="absolute top-[5%] right-[-10%] w-[65%] h-[85%] rounded-full bg-[#e86000]/70 blur-[70px]" />
          <div className="absolute top-[12%] right-[0%] w-[45%] h-[70%] rounded-full bg-[#ff8c00]/80 blur-[40px]" />
          <div className="absolute top-[18%] right-[8%] w-[30%] h-[55%] rounded-full bg-[#ffb300]/70 blur-[20px]" />
          <div className="absolute top-[22%] right-[14%] w-[18%] h-[40%] rounded-full bg-[#ffd700]/80 blur-[10px]" />
          <div className="absolute top-[27%] right-[19%] w-[8%] h-[22%] rounded-full bg-[#fff5c0]/60 blur-[5px]" />
        </div>
        {/* dark crush — left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080400] from-30% via-[#080400]/70 via-50% to-transparent" />
        {/* dark top & bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080400]/80 via-transparent to-[#080400]/80" />
      </div>

      {/* Fire canvas — bottom left */}
      <FireCanvas />

      {/* Mockingjay pin — right side with shine */}
      <div
        className="absolute right-[-10%] sm:right-[-5%] top-[-5%] h-[100%] sm:h-[137%] pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <PinShine src={hgPin} />
      </div>

      {/* Name + description */}
      <div
        className="flex flex-col justify-end sm:justify-center flex-1 w-full sm:w-[55%] relative mb-7 sm:mb-0"
        style={{ zIndex: 3 }}
      >
        {/* decorative label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-[#c9952a]" />
          <span className="text-[#c9952a] text-xs tracking-[0.3em] uppercase">
            Full Stack Developer
          </span>
          <div className="h-px w-8 bg-[#c9952a]" />
        </div>

        {/* stacked name */}
        <div className="flex flex-col leading-none">
          <span className="text-[8vw] font-bold text-white/90 leading-none tracking-tight">
            Sem
          </span>
          <span className="text-[8vw] font-bold text-white/70 leading-none tracking-tight">
            Luiz
          </span>
          <span className="text-[10vw] font-bold text-[#c9952a] leading-none tracking-tight">
            Warain.
          </span>
        </div>

        {/* tagline */}
        <p className="text-white/50 text-sm sm:text-md leading-relaxed mt-4 sm:mt-5 max-w-xs">
          Quiet creator, <em>bringing ideas to life,</em>
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>through motion, detail and softness.
        </p>
      </div>

      {/* Bottom bar */}
      <div
        ref={bottomBarRef}
        className="relative group flex justify-between items-center pt-[15px] sm:pt-6 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.35em] uppercase text-white/60 overflow-hidden"
        style={{ zIndex: 3 }}
      >
        {/* Animated SVG draw line */}
        <svg
          className="absolute inset-x-0 top-0 w-full h-[1px] pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 1000 1"
        >
          <defs>
            <filter id="line-dot-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Glow layer */}
          <motion.path
            d="M 0 0.5 L 1000 0.5"
            fill="none"
            stroke="rgba(255,181,46,0.15)"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ pathLength: progress }}
          />
          {/* Core line */}
          <motion.path
            d="M 0 0.5 L 1000 0.5"
            fill="none"
            stroke="rgba(255,216,106,0.25)"
            strokeWidth="1"
            strokeLinecap="round"
            style={{ pathLength: progress }}
          />
          {/* Traveling dot — driven by same progress value */}
          <motion.circle
            cx={dotCx}
            cy={0.5}
            r="2"
            fill="rgba(255,216,106,0.6)"
            filter="url(#line-dot-glow)"
            style={{ opacity: progress }}
          />
        </svg>

        {/* ── Left: V1.0 ── */}
        <span className={`relative inline-flex items-center gap-2 text-white/60 transition-colors duration-300 hover:text-[#ffd86a] ${reveal ? '' : 'opacity-0'}`}>
          <RevealText key={reveal ? 'rv1' : 'wait'} delay={reveal ? 0 : 9999}>
            <span className="text-[#ffd86a]/80">→</span>
          </RevealText>
          <RevealText key={reveal ? 'rv2' : 'wait2'} delay={reveal ? 0.05 : 9999}>
            <span className="relative cursor-default">
              V1.0
              <span className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,214,104,0.95),transparent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
            </span>
          </RevealText>
        </span>

        {/* ── Center: LinkedIn / GitHub ── */}
        <div className={`hidden sm:flex gap-4 ${reveal ? '' : 'opacity-0'}`}>
          <a
            href="#"
            className="group relative inline-flex items-center text-white/70 transition-all duration-300 hover:text-[#ffd86a] hover:-translate-y-1"
          >
            <RevealText key={reveal ? 'rl1' : 'wait3'} delay={reveal ? 0.1 : 9999}>LinkedIn</RevealText>
            <span className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,214,104,0.95),transparent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
          </a>
          <span className="text-white/30">/</span>
          <a
            href="#"
            className="group relative inline-flex items-center text-white/70 transition-all duration-300 hover:text-[#ffd86a] hover:-translate-y-1"
          >
            <RevealText key={reveal ? 'rg1' : 'wait4'} delay={reveal ? 0.16 : 9999}>GitHub</RevealText>
            <span className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,214,104,0.95),transparent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
          </a>
        </div>

        {/* ── Right: About / Skills / Projects / Contact ── */}
        <div className={`flex gap-3 sm:gap-6 ${reveal ? '' : 'opacity-0'}`}>
          <a
            href="#about1"
            onClick={e => { e.preventDefault(); scrollToSection('about1') }}
            className="group relative inline-flex items-center text-white/70 transition-all duration-300 hover:text-[#ffd86a] hover:-translate-y-1"
          >
            <RevealText key={reveal ? 'ra1' : 'wait5'} delay={reveal ? 0.22 : 9999}>About</RevealText>
            <span className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,214,104,0.9),transparent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
          </a>
          <a
            href="#skills"
            onClick={e => { e.preventDefault(); scrollToSection('skills') }}
            className="group relative inline-flex items-center text-white/70 transition-all duration-300 hover:text-[#ffd86a] hover:-translate-y-1"
          >
            <RevealText key={reveal ? 'rs1' : 'wait6'} delay={reveal ? 0.28 : 9999}>Skills</RevealText>
            <span className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,214,104,0.9),transparent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
          </a>
          <a
            href="#projects"
            onClick={e => { e.preventDefault(); scrollToSection('projects') }}
            className="group relative inline-flex items-center text-white/70 transition-all duration-300 hover:text-[#ffd86a] hover:-translate-y-1"
          >
            <RevealText key={reveal ? 'rp1' : 'wait7'} delay={reveal ? 0.34 : 9999}>Projects</RevealText>
            <span className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,214,104,0.9),transparent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
          </a>
          <a
            href="#contact"
            onClick={e => { e.preventDefault(); scrollToSection('contact') }}
            className="group relative inline-flex items-center text-white/70 transition-all duration-300 hover:text-[#ffd86a] hover:-translate-y-1"
          >
            <RevealText key={reveal ? 'rc1' : 'wait8'} delay={reveal ? 0.4 : 9999}>Contact</RevealText>
            <span className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,214,104,0.9),transparent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
          </a>
        </div>
      </div>
    </section>
  );
}
