import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

const sparkles = Array.from({ length: 28 }, (_, i) => ({
  left: 5 + (i * 7.7) % 90,
  top: 5 + (i * 12.3) % 90,
  size: 1.5 + (i % 4) * 1.1,
  color: i % 3 === 0 ? '#ffd86a' : i % 3 === 1 ? '#ffb300' : '#ff8c00',
  shadow: i % 3 === 0 ? 'rgba(255,216,106,0.8)' : i % 3 === 1 ? 'rgba(255,179,0,0.7)' : 'rgba(255,140,0,0.6)',
  duration: 2.5 + (i % 5) * 0.8,
  delay: i * 0.19,
  dx: Math.cos((i / 28) * Math.PI * 2 + 1.5) * (10 + (i % 5) * 9),
  dy: Math.sin((i / 28) * Math.PI * 2 + 1.5) * (10 + (i % 5) * 9) - 8,
}))

export default function About3({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 40, damping: 30 })

  const { scrollYProgress: exitProgress } = useScroll({
    container: containerRef,
    target: sectionRef,
    offset: ["start start", "end start"]
  })
  const smoothExit = useSpring(exitProgress, { stiffness: 45, damping: 25 })
  const contentOpacity = useTransform(smoothExit, [0, 0.7], [1, 0])

  const orb1Y = useTransform(smooth, [0, 1], [50, -50])
  const orb2Y = useTransform(smooth, [0, 1], [-40, 40])

  return (
    <motion.section
      ref={sectionRef}
      id="about3"
      className="section-page relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080400]"
    >
      {/* Fire background glows — bottom-centre heavy (chapter 3 of 3, building toward Skills) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] right-[-5%] w-[55%] h-[45%] rounded-full bg-[#c85000]/18 blur-[130px]" />
        <div className="absolute top-[35%] left-[-10%] w-[48%] h-[42%] rounded-full bg-[#e86000]/14 blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[20%] w-[60%] h-[50%] rounded-full bg-[#ff8c00]/18 blur-[100px]" />
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sparkles.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: s.color,
              boxShadow: `0 0 ${6 + (i % 4) * 3}px ${s.shadow}`,
              opacity: 0,
              animation: `project-scatter ${s.duration}s ease-out ${s.delay}s infinite`,
              '--scatter-x': `${s.dx}vw`,
              '--scatter-y': `${s.dy}vh`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Parallax glow orbs */}
      <motion.div
        className="absolute w-[40vw] h-[40vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,140,0,0.08) 0%, transparent 60%)',
          y: orb1Y,
          top: '15%',
          left: '5%',
        }}
      />
      <motion.div
        className="absolute w-[30vw] h-[30vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,80,0,0.06) 0%, transparent 60%)',
          y: orb2Y,
          bottom: '20%',
          right: '8%',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-5 max-w-3xl"
        style={{ opacity: contentOpacity }}
      >
        <motion.p
          className="text-[#c9952a] text-xs tracking-[0.3em] uppercase mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          What drives me
        </motion.p>

        <div className="text-center">
          <motion.h2
            className="inline-block text-[9vw] sm:text-[4vw] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffd86a] via-[#f0b43a] to-[#d18a1e] uppercase tracking-[0.08em] mb-10 leading-tight px-[0.2em] mr-[-0.08em]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Philosophy
          </motion.h2>
        </div>

        <motion.blockquote
          className="relative max-w-2xl mx-auto px-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="absolute top-0 left-0 text-[#ffd86a]/10 text-8xl font-serif leading-none pointer-events-none select-none">
            &ldquo;
          </span>

          <p className="relative z-10 text-[#e5d4a1]/60 text-base sm:text-lg leading-relaxed italic py-6">
            I believe great software is built at the intersection of technical excellence
            and human empathy. Every line of code is an opportunity to make someone's
            life a little easier.
          </p>

          <span className="absolute bottom-0 right-0 text-[#ffd86a]/10 text-8xl font-serif leading-none pointer-events-none select-none">
            &rdquo;
          </span>
        </motion.blockquote>

        <motion.div
          className="mx-auto mt-14 h-px bg-gradient-to-r from-transparent via-[#ffd86a]/30 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 100, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />

        <motion.p
          className="mt-8 text-[#c9952a]/40 text-[10px] tracking-[0.4em] uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          — Sem Luiz Warain
        </motion.p>
      </motion.div>
    </motion.section>
  )
}
