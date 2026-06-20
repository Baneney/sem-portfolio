import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

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

export default function About1({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
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

  const words = ["I", "build", "things", "that", "move."]

  return (
    <motion.section
      ref={sectionRef}
      id="about1"
      className="section-page relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080400]"
    >
      {/* Fire background glows — top-left heavy (chapter 1 of 3) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-10%] w-[65%] h-[55%] rounded-full bg-[#c85000]/20 blur-[130px]" />
        <div className="absolute top-[40%] right-[-10%] w-[45%] h-[40%] rounded-full bg-[#e86000]/12 blur-[100px]" />
        <div className="absolute bottom-[5%] left-[15%] w-[35%] h-[30%] rounded-full bg-[#ff8c00]/10 blur-[80px]" />
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

      {/* Parallax glow orb */}
      <motion.div
        className="absolute w-[55vw] h-[55vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,140,0,0.08) 0%, rgba(200,80,0,0.03) 50%, transparent 70%)',
          y: useTransform(smooth, [0, 1], [80, -80]),
          x: useTransform(smooth, [0, 1], [-20, 20]),
          top: '15%',
          left: '25%',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-5"
        style={{ opacity: contentOpacity }}
      >
        {/* Gold accent line */}
        <motion.div
          className="mx-auto mb-8 h-px bg-gradient-to-r from-transparent via-[#ffd86a]/40 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 120, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        <motion.p
          className="text-[#c9952a] text-xs tracking-[0.3em] uppercase mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Who I am
        </motion.p>

        <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-5 gap-y-2">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="text-[7vw] sm:text-[5vw] font-bold text-white/90 leading-none"
              variants={wordVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              custom={i}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.p
          className="mt-10 sm:mt-14 text-[#e5d4a1]/60 text-sm sm:text-base leading-relaxed max-w-lg mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          I'm Sem Luiz Warain — a Full Stack Developer who blends technology
          and design to create polished digital experiences. I build web
          applications, interactive projects, and intuitive interfaces with a
          mindset that every output represents my craft.
        </motion.p>

        <motion.div
          className="mx-auto mt-10 h-px bg-gradient-to-r from-transparent via-[#c85000]/30 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 80, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 1 }}
        />
      </motion.div>
    </motion.section>
  )
}
