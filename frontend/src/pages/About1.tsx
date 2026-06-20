import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion'

/* ── data ─────────────────────────────────────────────────── */
const HEADLINE_WORDS = [
  { text: "I",      color: "text-white/90",     hover: "#ffffff" },
  { text: "build",  color: "text-white/90",     hover: "#ffd86a" },
  { text: "things", color: "text-white/90",     hover: "#ff8c00" },
  { text: "that",   color: "text-white/90",     hover: "#ffffff" },
  { text: "move.",  color: "text-[#ffd86a]",    hover: "#ffd86a" },
]

const FUN_FACTS = [
  { emoji: "🎮", label: "Game Dev",       detail: "Built an isometric puzzle adventure in Godot" },
  { emoji: "🚀", label: "NASA Hackathon", detail: "Competed in NASA's global Space Apps Challenge" },
  { emoji: "🌐", label: "Full Stack",     detail: "React · Django · Node · PostgreSQL · Docker" },
  { emoji: "🎨", label: "UI/UX",          detail: "Wireframes to pixel-perfect production UIs" },
  { emoji: "📱", label: "Mobile",         detail: "React Native apps for iOS & Android" },
  { emoji: "🤖", label: "AI Tools",       detail: "Integrated AI into real client projects" },
]

const FLOATING_BADGES = [
  { text: "React",          x: -42, y: -38, delay: 0.0,  rot: -6  },
  { text: "TypeScript",     x:  38, y: -44, delay: 0.15, rot:  5  },
  { text: "Framer Motion",  x: -48, y:  18, delay: 0.3,  rot: -4  },
  { text: "Django",         x:  42, y:  26, delay: 0.45, rot:  7  },
  { text: "Godot",          x: -12, y:  52, delay: 0.6,  rot: -3  },
  { text: "Docker",         x:  18, y: -60, delay: 0.75, rot:  4  },
]

const sparkles = Array.from({ length: 28 }, (_, i) => ({
  left: 5 + (i * 8.3) % 90,
  top: 5 + (i * 11) % 90,
  size: 1.5 + (i % 4) * 1.1,
  color: i % 3 === 0 ? '#ffd86a' : i % 3 === 1 ? '#ffb300' : '#ff8c00',
  shadow: i % 3 === 0 ? 'rgba(255,216,106,0.8)' : i % 3 === 1 ? 'rgba(255,179,0,0.7)' : 'rgba(255,140,0,0.6)',
  duration: 2.5 + (i % 5) * 0.8,
  delay: i * 0.22,
  dx: Math.cos((i / 28) * Math.PI * 2) * (10 + (i % 5) * 9),
  dy: Math.sin((i / 28) * Math.PI * 2) * (10 + (i % 5) * 9) - 8,
}))

/* ── sub-components ───────────────────────────────────────── */

/** Fun-fact chip — hover to flip, un-hover to flip back */
function FactChip({ emoji, label, detail, index }: { emoji: string; label: string; detail: string; index: number }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <motion.div
      className="relative w-52 h-20 cursor-default select-none"
      initial={{ opacity: 0, y: 24, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: 0.6 + index * 0.08, type: 'spring', stiffness: 180, damping: 16 }}
      whileHover={{ scale: 1.05, y: -4 }}
      onHoverStart={() => setFlipped(true)}
      onHoverEnd={() => setFlipped(false)}
      style={{ perspective: 800 }}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex items-center justify-center gap-3 rounded-2xl border border-[#ffd86a]/30 bg-[#140f04]/85 backdrop-blur-sm"
          style={{ backfaceVisibility: 'hidden', boxShadow: '0 0 20px rgba(255,216,106,0.08)' }}
        >
          <span className="text-2xl">{emoji}</span>
          <span className="text-sm font-bold tracking-wider text-[#ffd86a]/80 uppercase">{label}</span>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 flex items-center justify-center px-4 rounded-2xl border border-[#ff8c00]/60 bg-[#1a0d02]/95"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', boxShadow: '0 0 24px rgba(255,140,0,0.25)' }}
        >
          <p className="text-[11px] leading-relaxed text-[#e5d4a1]/85 text-center font-medium">{detail}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/** Floating tech badge that drifts around the avatar placeholder */
function FloatingBadge({ text, x, y, delay, rot }: { text: string; x: number; y: number; delay: number; rot: number }) {
  return (
    <motion.div
      className="absolute px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#ffd86a]/30 bg-[#0f0a02]/80 text-[#ffd86a]/70 backdrop-blur-sm whitespace-nowrap"
      style={{ left: `calc(50% + ${x}%)`, top: `calc(50% + ${y}%)`, rotate: rot }}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 18 }}
      animate={{ y: [0, -6, 0], rotate: [rot, rot + 2, rot] }}
      whileHover={{ scale: 1.15, borderColor: 'rgba(255,216,106,0.8)', color: '#ffd86a', boxShadow: '0 0 12px rgba(255,216,106,0.3)' }}
    >
      {text}
    </motion.div>
  )
}

/* ── main page ────────────────────────────────────────────── */
export default function About1({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const sectionRef    = useRef<HTMLElement>(null)
  const cursorGlowRef = useRef<HTMLDivElement>(null)
  const [hoveredWord, setHoveredWord] = useState<number | null>(null)
  const [activeFact, setActiveFact]   = useState<number | null>(null)

  /* scroll-linked transforms */
  const { scrollYProgress } = useScroll({ container: containerRef, target: sectionRef, offset: ["start end", "end start"] })
  const smooth = useSpring(scrollYProgress, { stiffness: 40, damping: 30 })

  const { scrollYProgress: exitProgress } = useScroll({ container: containerRef, target: sectionRef, offset: ["start start", "end start"] })
  const smoothExit    = useSpring(exitProgress, { stiffness: 45, damping: 25 })
  const contentOpacity = useTransform(smoothExit, [0, 0.7], [1, 0])

  /* magnetic cursor glow */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!cursorGlowRef.current || !sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cursorGlowRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    el.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => el.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <motion.section
      ref={sectionRef}
      id="about1"
      className="section-page relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080400]"
    >
      {/* ── magnetic cursor glow ── */}
      <div
        ref={cursorGlowRef}
        className="absolute w-[420px] h-[420px] rounded-full pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(circle, rgba(255,140,0,0.07) 0%, transparent 65%)',
          transition: 'transform 0.12s ease-out',
          top: 0, left: 0,
        }}
      />

      {/* ── fire background glows ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-10%] w-[65%] h-[55%] rounded-full bg-[#c85000]/20 blur-[130px]" />
        <div className="absolute top-[40%] right-[-10%] w-[45%] h-[40%] rounded-full bg-[#e86000]/12 blur-[100px]" />
        <div className="absolute bottom-[5%] left-[15%] w-[35%] h-[30%] rounded-full bg-[#ff8c00]/10 blur-[80px]" />
      </div>

      {/* ── sparkles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sparkles.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.left}%`, top: `${s.top}%`,
              width: `${s.size}px`, height: `${s.size}px`,
              background: s.color,
              boxShadow: `0 0 ${6 + (i % 4) * 3}px ${s.shadow}`,
              opacity: 0,
              animation: `project-scatter ${s.duration}s ease-out ${s.delay}s infinite`,
              '--scatter-x': `${s.dx}vw`, '--scatter-y': `${s.dy}vh`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ── parallax glow orb ── */}
      <motion.div
        className="absolute w-[55vw] h-[55vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,140,0,0.08) 0%, rgba(200,80,0,0.03) 50%, transparent 70%)',
          y: useTransform(smooth, [0, 1], [80, -80]),
          x: useTransform(smooth, [0, 1], [-20, 20]),
          top: '15%', left: '25%',
        }}
      />

      {/* ── main content ── */}
      <motion.div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24" style={{ opacity: contentOpacity }}>

        {/* LEFT — text side */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">

          {/* label + top line */}
          <motion.div className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}
          >
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#ffd86a]/50" />
            <p className="text-[#c9952a] text-xs tracking-[0.3em] uppercase">Who I am</p>
          </motion.div>

          {/* Interactive headline — each word reacts individually */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-3 sm:gap-x-4 gap-y-1 mb-8">
            {HEADLINE_WORDS.map((w, i) => (
              <motion.span
                key={i}
                className={`text-[10vw] sm:text-[6vw] lg:text-[4.5vw] font-black leading-none cursor-default select-none transition-all duration-200 ${w.color}`}
                variants={{
                  hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: i * 0.13, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                onHoverStart={() => setHoveredWord(i)}
                onHoverEnd={() => setHoveredWord(null)}
                whileHover={{ scale: 1.12, y: -6 }}
                style={{
                  textShadow: hoveredWord === i ? `0 0 30px ${w.hover}88, 0 0 60px ${w.hover}44` : 'none',
                  color: hoveredWord === i ? w.hover : undefined,
                }}
              >
                {w.text}
              </motion.span>
            ))}
          </div>

          {/* Bio */}
          <motion.p
            className="text-[#e5d4a1]/60 text-sm sm:text-base leading-relaxed max-w-md"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, delay: 0.8 }}
          >
            I'm <span className="text-[#ffd86a]/90 font-semibold">Sem Luiz Warain</span> — a Full Stack Developer who blends technology and design to create polished digital experiences. I build web applications, interactive projects, and intuitive interfaces.
          </motion.p>

          {/* Animated bottom divider */}
          <motion.div
            className="mt-8 h-px bg-gradient-to-r from-[#ffd86a]/40 via-[#ff8c00]/20 to-transparent"
            initial={{ width: 0, opacity: 0 }} whileInView={{ width: 160, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, delay: 1 }}
          />

          {/* Hint text */}
          <motion.p
            className="mt-4 text-[#ffd86a]/25 text-[10px] tracking-[0.3em] uppercase"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 1.4 }}
          >
            ↓ flip the cards to explore
          </motion.p>
        </div>

        {/* RIGHT — interactive side */}
        <div className="flex flex-col items-center gap-10">

          {/* Avatar ring with floating badges */}
          <div className="relative w-48 h-48 flex-shrink-0">
            {/* Animated ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '1.5px solid rgba(255,216,106,0.25)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full"
              style={{ border: '1px solid rgba(255,140,0,0.15)' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            />

            {/* Center avatar circle */}
            <motion.div
              className="absolute inset-4 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 35% 35%, rgba(255,180,50,0.25) 0%, rgba(200,80,0,0.15) 50%, rgba(8,4,0,0.9) 100%)',
                border: '1px solid rgba(255,216,106,0.3)',
                boxShadow: '0 0 40px rgba(255,140,0,0.15), inset 0 0 30px rgba(200,80,0,0.1)',
              }}
              whileHover={{ boxShadow: '0 0 60px rgba(255,140,0,0.3), inset 0 0 40px rgba(200,80,0,0.2)' }}
            >
              <span className="text-5xl select-none" role="img" aria-label="developer">👨‍💻</span>
            </motion.div>

            {/* Orbiting dot */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2.5 h-2.5 rounded-full bg-[#ffd86a]"
              style={{ boxShadow: '0 0 10px rgba(255,216,106,0.9), 0 0 20px rgba(255,216,106,0.5)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              transformTemplate={({ rotate }) =>
                `rotate(${rotate}) translateX(88px) rotate(-${rotate})`
              }
            />

            {/* Floating tech badges */}
            {FLOATING_BADGES.map((b, i) => (
              <FloatingBadge key={i} {...b} />
            ))}
          </div>

          {/* Fun-fact chips grid */}
          <div className="flex flex-col items-center gap-3">
            <motion.p
              className="text-[#ffd86a]/30 text-[9px] tracking-[0.35em] uppercase mb-1"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.5 }}
            >
              hover to discover
            </motion.p>
            <div className="grid grid-cols-2 gap-3">
              {FUN_FACTS.map((f, i) => (
                <FactChip key={i} {...f} index={i} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}
