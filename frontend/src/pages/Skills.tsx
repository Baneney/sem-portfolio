import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import skillsBg from '../assets/skills-bg.png'
import treeLeft from '../assets/tree-left.png'
import treeCenter from '../assets/tree-center.png'
import treeRight from '../assets/tree-right.png'

const categories = [
  {
    name: 'Frontend',
    icon: '◈',
    skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind', 'Bootstrap', 'Electron'],
  },
  {
    name: 'Animation & 3D',
    icon: '◆',
    skills: ['Framer Motion', 'Three.js', 'GSAP', 'CSS Animations', 'WebGL'],
  },
  {
    name: 'Backend',
    icon: '◇',
    skills: ['Node.js', 'Python', 'Express', 'REST APIs', 'GraphQL', 'Django'],
  },
  {
    name: 'Databases',
    icon: '◈',
    skills: ['PostgreSQL', 'MongoDB', 'Firebase', 'Redis', 'Supabase'],
  },
  {
    name: 'DevOps & Tools',
    icon: '◆',
    skills: ['Git', 'Docker', 'AWS', 'Linux', 'CI/CD', 'Figma'],
  },
]

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.08 },
  },
}

const pillReveal = {
  hidden: { opacity: 0, y: 16, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 22 },
  },
}

export default function Skills() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const treeLeftRef = useRef<HTMLImageElement>(null)
  const treeCenterRef = useRef<HTMLImageElement>(null)
  const treeRightRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const container = document.getElementById('snap-container')
    const section = sectionRef.current
    if (!container || !section) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const offsetTop = section.offsetTop
      const vh = container.clientHeight

      const p = Math.max(0, Math.min(1, (scrollTop - offsetTop + vh) / (vh + section.offsetHeight)))
      const raw = Math.max(0, 1 - p * 2)
      const t = 1 - Math.pow(1 - raw, 3)

      if (treeLeftRef.current) {
        treeLeftRef.current.style.transform = `translateX(${-t * 100}%)`
      }
      if (treeRightRef.current) {
        treeRightRef.current.style.transform = `translateX(${t * 100}%)`
      }
      if (treeCenterRef.current) {
        treeCenterRef.current.style.transform = `translateY(${t * 60}px)`
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="free-page flex items-center px-10 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#080400]">
        <img
          src={skillsBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080400]/80 via-[#080400]/40 to-[#080400]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080400]/60 via-transparent to-[#080400]/80" />
      </div>

      {/* Tree silhouettes — foreground */}
      <div className="absolute inset-0 flex items-end pointer-events-none z-10 overflow-hidden">
        <img ref={treeLeftRef} src={treeLeft} alt="" className="h-full object-cover object-left will-change-transform" style={{ flex: '620 1 0' }} />
        <img ref={treeCenterRef} src={treeCenter} alt="" className="h-full object-cover object-center will-change-transform" style={{ flex: '700 1 0' }} />
        <img ref={treeRightRef} src={treeRight} alt="" className="h-full object-cover object-right will-change-transform" style={{ flex: '558 1 0' }} />
      </div>

      <div className="flex w-full h-full relative z-20">
        {/* Left side — bio */}
        <div className="w-[45%] flex flex-col justify-center pr-16 relative">

          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-px bg-[#ffd86a]/60" />
            <span className="text-[#ffd86a]/60 text-[10px] tracking-[0.3em] uppercase font-medium">
              Expertise
            </span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-9xl font-black text-white leading-[0.95] tracking-tight mb-6 uppercase"
          >
            Skills
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="text-white/50 text-sm leading-relaxed mb-10 max-w-lg"
          >
            Full Stack Developer &mdash; crafting digital experiences with precision and fire through elegant code and dramatic motion.
          </motion.p>

          <motion.a
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
            whileHover={{ x: 4 }}
            href="#contact"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase text-[#ffd86a]/80 hover:text-[#ffd86a] transition-colors group"
          >
            Contact Me
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </motion.a>
        </div>

        {/* Right side — accordion */}
        <div className="w-[55%] flex flex-col justify-center pl-6 relative">
          {/* Ambient decorative glows */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[10%] right-[10%] w-32 h-32 rounded-full bg-[#ffd86a]/[0.03] blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-[20%] left-[5%] w-40 h-40 rounded-full bg-[#c85000]/[0.03] blur-3xl pointer-events-none"
          />
          {categories.map((cat, index) => {
            const isOpen = openIndex === cat.name
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                className="relative"
              >
                {/* Active indicator */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-[-24px] top-0 bottom-0 w-[3px] origin-top bg-gradient-to-b from-[#ffd86a] via-[#f0b43a] to-transparent rounded-full"
                    />
                  )}
                </AnimatePresence>

                {/* Category header */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : cat.name)}
                  className="relative w-full flex items-center justify-between py-6 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <motion.span
                      animate={{ color: isOpen ? '#ffd86a' : 'rgba(255,255,255,0.25)' }}
                      transition={{ duration: 0.3 }}
                      className="text-sm"
                    >
                      {cat.icon}
                    </motion.span>
                    <span className={`text-xl uppercase font-bold transition-colors duration-300 ${isOpen ? 'text-[#ffd86a]' : 'text-white/80 group-hover:text-white'}`}>
                      {cat.name}
                    </span>
                    <motion.span
                      animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="text-[10px] tracking-wider font-medium text-[#ffd86a]/60 bg-[#ffd86a]/10 px-2 py-0.5 rounded-full border border-[#ffd86a]/20"
                    >
                      {cat.skills.length}
                    </motion.span>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0, color: isOpen ? '#ffd86a' : 'rgba(255,255,255,0.3)' }}
                    whileHover={{ scale: 1.3 }}
                    transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                    className="text-xl font-light cursor-pointer"
                  >
                    +
                  </motion.span>
                </button>

                {/* Divider */}
                <div className="relative h-px">
                  <div className="absolute inset-0 bg-white/[0.06]" />
                  <motion.div
                    animate={{ scaleX: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute inset-0 bg-gradient-to-r from-[#ffd86a]/40 via-[#ffd86a]/20 to-transparent origin-left"
                  />
                </div>

                {/* Skills content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      {/* Radial glow behind pills */}
                      <div className="relative py-5 pl-4">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[120%] bg-[radial-gradient(ellipse,rgba(255,216,106,0.06),transparent_70%)] pointer-events-none" />

                        <motion.ul
                          variants={stagger}
                          initial="hidden"
                          animate="visible"
                          className="relative flex flex-wrap gap-2.5"
                        >
                          {cat.skills.map((skill) => (
                            <motion.li
                              key={skill}
                              variants={pillReveal}
                              whileHover={{ scale: 1.15, y: -4 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 rounded-full text-[13px] font-medium tracking-wide
                                         bg-white/[0.04] border border-white/[0.08]
                                         text-white/60
                                         hover:border-[#ffd86a]/40 hover:text-[#ffd86a]
                                         hover:bg-[#ffd86a]/[0.08]
                                         hover:shadow-[0_0_32px_rgba(255,216,106,0.18)]
                                         transition-colors duration-200 cursor-default
                                         backdrop-blur-sm"
                            >
                              {skill}
                            </motion.li>
                          ))}
                        </motion.ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
