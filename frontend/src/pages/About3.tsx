import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

export default function About3({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const sectionRef = useRef<HTMLElement>(null)

  // Entry parallax
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 40, damping: 30 })

  // Exit transforms
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
      className="section-page relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* amber vignette */}
      <div className="amber-vignette absolute inset-0 pointer-events-none z-[1]" />


      {/* Radial glow expand */}
      <motion.div
        className="absolute w-[80vw] h-[80vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,180,50,0.12) 0%, rgba(200,80,0,0.04) 40%, transparent 70%)',
        }}
        initial={{ scale: 0.4, opacity: 0 }}
        whileInView={{ scale: 1.5, opacity: 0.25 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* Fire glow orb — left, parallax */}
      <motion.div
        className="absolute w-[40vw] h-[40vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,140,0,0.08) 0%, transparent 60%)',
          y: orb1Y,
          top: '15%',
          left: '5%',
        }}
      />

      {/* Fire glow orb — right, parallax */}
      <motion.div
        className="absolute w-[30vw] h-[30vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,80,0,0.06) 0%, transparent 60%)',
          y: orb2Y,
          bottom: '20%',
          right: '8%',
        }}
      />

      {/* Content — exit transforms */}
      <motion.div
        className="relative z-10 text-center px-5 max-w-3xl"
        style={{ opacity: contentOpacity }}
      >
        {/* Label */}
        <motion.p
          className="text-[#c9952a] text-xs tracking-[0.3em] uppercase mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          What drives me
        </motion.p>

        {/* Heading */}
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

        {/* Quote body */}
        <motion.blockquote
          className="relative max-w-2xl mx-auto px-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Opening quote mark */}
          <span className="absolute top-0 left-0 text-[#ffd86a]/10 text-8xl font-serif leading-none pointer-events-none select-none">
            &ldquo;
          </span>

          <p className="relative z-10 text-[#e5d4a1]/60 text-base sm:text-lg leading-relaxed italic py-6">
            I believe great software is built at the intersection of technical excellence
            and human empathy. Every line of code is an opportunity to make someone's
            life a little easier.
          </p>

          {/* Closing quote mark */}
          <span className="absolute bottom-0 right-0 text-[#ffd86a]/10 text-8xl font-serif leading-none pointer-events-none select-none">
            &rdquo;
          </span>
        </motion.blockquote>

        {/* Bottom accent line */}
        <motion.div
          className="mx-auto mt-14 h-px bg-gradient-to-r from-transparent via-[#ffd86a]/30 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 100, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />

        {/* Signature */}
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
