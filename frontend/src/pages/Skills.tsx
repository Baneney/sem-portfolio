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
      const t = 1 - p

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
        <div className="w-[45%] flex flex-col justify-center pr-16">
          <p className="text-[#e5d4a1] text-xs font-medium tracking-widest uppercase mb-4">
            Skills
          </p>
          <h2 className="text-[1.6rem] font-black text-white leading-[1.15] uppercase tracking-tight mb-10">
            Full Stack Developer crafting digital experiences with precision and
            fire.
          </h2>
          <a
            href="#contact"
            className="text-[#e5d4a1] text-xs font-semibold tracking-[0.3em] uppercase hover:text-[#ffd86a] transition-colors"
          >
            Contact Me ✦
          </a>
        </div>

        {/* Right side — accordion */}
        <div className="w-[55%] flex flex-col justify-center pl-6">
          {categories.map((cat) => {
            const isOpen = openIndex === cat.name
            return (
              <div key={cat.name} className="relative">
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
                    transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                    className="text-xl font-light"
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
                              whileHover={{ scale: 1.08, y: -2 }}
                              className="px-4 py-2 rounded-full text-[13px] font-medium tracking-wide
                                         bg-white/[0.04] border border-white/[0.08]
                                         text-white/60
                                         hover:border-[#ffd86a]/30 hover:text-[#ffd86a]
                                         hover:bg-[#ffd86a]/[0.06]
                                         hover:shadow-[0_0_24px_rgba(255,216,106,0.1)]
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
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
