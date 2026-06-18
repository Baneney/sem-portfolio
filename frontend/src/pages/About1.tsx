import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useMotionTemplate } from 'framer-motion'

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

export default function About1({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const sectionRef = useRef<HTMLElement>(null)

  // Entry parallax
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 40, damping: 30 })

  // Exit transforms — hero pattern
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
      className="section-page relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Noise + amber vignette */}
      <div className="noise-texture absolute inset-0 pointer-events-none z-[1]" style={{ opacity: 0.15 }} />
      <div className="amber-vignette absolute inset-0 pointer-events-none z-[1]" />

      {/* Fire glow orb — parallax drift */}
      <motion.div
        className="absolute w-[60vw] h-[60vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,140,0,0.12) 0%, rgba(200,80,0,0.04) 50%, transparent 70%)',
          y: useTransform(smooth, [0, 1], [100, -100]),
          x: useTransform(smooth, [0, 1], [-30, 30]),
          top: '20%',
          left: '20%',
        }}
      />

      {/* Second glow orb */}
      <motion.div
        className="absolute w-[40vw] h-[40vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,180,50,0.08) 0%, rgba(200,100,0,0.03) 50%, transparent 70%)',
          y: useTransform(smooth, [0, 1], [-60, 60]),
          bottom: '10%',
          right: '10%',
        }}
      />

      {/* Content — exit transforms */}
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

        {/* Label */}
        <motion.p
          className="text-[#c9952a] text-xs tracking-[0.3em] uppercase mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Who I am
        </motion.p>

        {/* Word-by-word statement */}
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

        {/* Intro paragraph */}
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

        {/* Bottom accent line */}
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
