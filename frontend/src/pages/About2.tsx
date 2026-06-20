import { useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

const internships = [
  {
    role: "UI/UX & Frontend Design Intern",
    company: "Camtastic Corp.",
    period: "Jan 2025 – Mar 2025",
    description:
      "Assisted in UI/UX design by creating wireframes, website layouts, and application graphics. Developed responsive frontend interfaces using HTML and CSS while ensuring a consistent and user-friendly experience.",
    tags: ["HTML5", "CSS"],
    accent: "#ffd86a",
    icon: "✦",
  },
  {
    role: "Full Stack Intern",
    company: "Lifewood Data Technology",
    period: "Mar 2025 – June 2025",
    description:
      "Developed web-based projects and interactive applications, including a company showcase website and game project to demonstrate development capabilities. Gained experience with AI tools, assisted with SEO strategies and content enhancements.",
    tags: ["Node.js", "PostgreSQL", "Docker"],
    accent: "#ff8c00",
    icon: "◈",
  },
]

const sparkles = Array.from({ length: 28 }, (_, i) => ({
  left: 5 + (i * 9.1) % 90,
  top: 5 + (i * 13) % 90,
  size: 1.5 + (i % 4) * 1.1,
  color: i % 3 === 0 ? '#ffd86a' : i % 3 === 1 ? '#ffb300' : '#ff8c00',
  shadow: i % 3 === 0 ? 'rgba(255,216,106,0.8)' : i % 3 === 1 ? 'rgba(255,179,0,0.7)' : 'rgba(255,140,0,0.6)',
  duration: 2.5 + (i % 5) * 0.8,
  delay: i * 0.2,
  dx: Math.cos((i / 28) * Math.PI * 2 + 0.8) * (10 + (i % 5) * 9),
  dy: Math.sin((i / 28) * Math.PI * 2 + 0.8) * (10 + (i % 5) * 9) - 8,
}))

// 3D magnetic tilt card
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setTilt({ x: -(e.clientY - cy) / (rect.height / 2) * 10, y: (e.clientX - cx) / (rect.width / 2) * 10 })
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false) }}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hovered ? 'scale(1.03)' : 'scale(1)'}`,
        transition: hovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}

export default function About2({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 40, damping: 30 })

  const { scrollYProgress: exitProgress } = useScroll({
    container: containerRef,
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const smoothExit = useSpring(exitProgress, { stiffness: 45, damping: 25 })
  const contentOpacity = useTransform(smoothExit, [0, 0.7], [1, 0])

  return (
    <motion.section
      ref={sectionRef}
      id="about2"
      className="section-page relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 sm:px-16 py-20 bg-[#080400]"
    >
      {/* Fire background glows — centre-right heavy (chapter 2 of 3) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] right-[-8%] w-[60%] h-[50%] rounded-full bg-[#c85000]/20 blur-[130px]" />
        <div className="absolute top-[45%] left-[-10%] w-[50%] h-[40%] rounded-full bg-[#e86000]/14 blur-[100px]" />
        <div className="absolute bottom-[8%] right-[20%] w-[38%] h-[30%] rounded-full bg-[#ff8c00]/10 blur-[80px]" />
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
        className="absolute w-[50vw] h-[50vw] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,140,0,0.07) 0%, transparent 60%)",
          y: useTransform(smooth, [0, 1], [80, -80]),
          top: "10%",
          right: "5%",
        }}
      />

      {/* Heading */}
      <motion.div className="relative z-10 text-center mb-16" style={{ opacity: contentOpacity }}>
        <p className="text-[#c9952a] text-xs tracking-[0.3em] uppercase mb-3">My path</p>
        <h2 className="text-[4vw] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffd86a] via-[#f0b43a] to-[#d18a1e] uppercase tracking-[0.15em]">
          Experience
        </h2>
      </motion.div>

      {/* Timeline */}
      <div className="relative z-10 w-full max-w-3xl">
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 -translate-x-1/2">
          <motion.div
            className="w-px bg-gradient-to-b from-[#ffd86a]/50 via-[#ff8c00]/30 to-transparent"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </div>

        <motion.div className="space-y-24" style={{ opacity: contentOpacity }}>
          {internships.map((item, i) => (
            <div key={i} className="relative">
              {/* Glowing timeline dot */}
              <motion.div
                className="absolute left-4 sm:left-1/2 top-8 -translate-x-1/2 z-20"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: item.accent, opacity: 0.3 }}
                  animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <div
                  className="w-4 h-4 rounded-full border-2 border-[#080400]"
                  style={{
                    background: item.accent,
                    boxShadow: `0 0 20px ${item.accent}99, 0 0 40px ${item.accent}44`,
                  }}
                />
              </motion.div>

              {/* Card */}
              <motion.div
                className={`relative w-full pl-10 sm:pl-0 sm:w-[46%] ${i === 0 ? "sm:mr-auto sm:pr-14" : "sm:ml-auto sm:pl-14"}`}
                initial={{ opacity: 0, x: i === 0 ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <TiltCard>
                  <div
                    className="relative rounded-2xl overflow-hidden group cursor-default transition-all duration-500"
                    style={{ border: `1.5px solid ${item.accent}55` }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.border = `1.5px solid ${item.accent}cc`
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${item.accent}33, 0 0 60px ${item.accent}18, inset 0 0 30px ${item.accent}08`
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.border = `1.5px solid ${item.accent}55`
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow = ''
                    }}
                  >
                    <div
                      className="relative z-10 rounded-2xl p-6 sm:p-7 transition-all duration-500"
                      style={{
                        background: `linear-gradient(135deg, rgba(22,16,6,0.95) 0%, rgba(14,10,3,0.97) 100%)`,
                        backdropFilter: "blur(20px)",
                      }}
                    >
                      {/* Shimmer on hover */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                        <motion.div
                          className="absolute inset-0 w-[200%] h-full -translate-x-full"
                          style={{ background: `linear-gradient(105deg, transparent 35%, ${item.accent}18 50%, transparent 65%)` }}
                          whileHover={{ translateX: "100%" }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                        />
                      </div>

                      {/* Top accent line */}
                      <div
                        className="absolute top-0 left-6 right-6 h-[1.5px] rounded-full transition-all duration-500 opacity-40 group-hover:opacity-100"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)`,
                          boxShadow: `0 0 8px ${item.accent}`,
                        }}
                      />

                      {/* Icon + Period */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs tracking-[0.25em] uppercase font-medium" style={{ color: `${item.accent}cc` }}>
                          {item.period}
                        </span>
                        <motion.span
                          className="text-xl"
                          style={{ color: item.accent, textShadow: `0 0 16px ${item.accent}` }}
                          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                          transition={{ duration: 4, repeat: Infinity, delay: i * 0.6 }}
                        >
                          {item.icon}
                        </motion.span>
                      </div>

                      <h3 className="text-white font-bold text-lg mb-1 leading-snug group-hover:text-[#fff8e7] transition-colors duration-300">
                        {item.role}
                      </h3>

                      <p className="text-sm mb-4 font-semibold opacity-80 group-hover:opacity-100 transition-all duration-300" style={{ color: `${item.accent}cc` }}>
                        @ {item.company}
                      </p>

                      <motion.div
                        className="h-px mb-4 rounded-full"
                        style={{ background: `linear-gradient(90deg, ${item.accent}44, transparent)` }}
                        initial={{ scaleX: 0, originX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                      />

                      <p className="text-[#e5d4a1]/70 text-sm leading-relaxed mb-5 group-hover:text-[#e5d4a1]/90 transition-colors duration-500">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, ti) => (
                          <motion.span
                            key={tag}
                            className="text-[10px] px-3 py-1 rounded-full font-semibold tracking-wider uppercase cursor-default select-none"
                            style={{
                              border: `1px solid ${item.accent}25`,
                              color: `${item.accent}66`,
                              background: `${item.accent}08`,
                            }}
                            whileHover={{
                              scale: 1.1,
                              color: item.accent,
                              borderColor: `${item.accent}88`,
                              background: `${item.accent}18`,
                              boxShadow: `0 0 12px ${item.accent}44`,
                            }}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + ti * 0.08 }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
