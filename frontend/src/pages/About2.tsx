import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useMotionTemplate } from 'framer-motion'

const internships = [
  {
    role: "UI/UX & Frontend Design Intern",
    company: "Camtastic Corp.",
    period: "Jan 2025 – Mar 2025",
    description: "Assisted in UI/UX design by creating wireframes, website layouts, and application graphics. Developed responsive frontend interfaces using HTML and CSS while ensuring a consistent and user-friendly experience.",
    tags: ["HTML5", "CSS"],
  },
  {
    role: "Full Stack Intern",
    company: "Lifewood Data Technology",
    period: "Mar 2025 – June 2025",
    description: "Developed web-based projects and interactive applications, including a company showcase website and game project to demonstrate development capabilities. Gained experience with AI tools, assisted with SEO strategies and content enhancements.",
    tags: ["Node.js", "PostgreSQL", "Docker"],
  },
]

export default function About2({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
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

  return (
    <motion.section
      ref={sectionRef}
      id="about2"
      className="section-page relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-30 sm:px-30 py-30"
    >
      {/* Noise + amber vignette */}
      <div
        className="noise-texture absolute inset-0 pointer-events-none z-[1]"
        style={{ opacity: 0.15 }}
      />
      <div className="amber-vignette absolute inset-0 pointer-events-none z-[1]" />

      {/* Fire glow orb — parallax */}
      <motion.div
        className="absolute w-[50vw] h-[50vw] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,140,0,0.1) 0%, transparent 60%)",
          y: useTransform(smooth, [0, 1], [80, -80]),
          top: "10%",
          right: "5%",
        }}
      />

      {/* Second glow */}
      <motion.div
        className="absolute w-[35vw] h-[35vw] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(200,80,0,0.08) 0%, transparent 60%)",
          y: useTransform(smooth, [0, 1], [-50, 50]),
          bottom: "15%",
          left: "10%",
        }}
      />

      {/* Content — exit transforms */}
      <motion.div
        className="relative z-10 text-center mb-16"
        style={{ opacity: contentOpacity }}
      >
        <p className="text-[#c9952a] text-xs tracking-[0.3em] uppercase mb-3">
          My path
        </p>
        <h2 className="text-[4vw]  font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffd86a] via-[#f0b43a] to-[#d18a1e] uppercase tracking-[0.15em]">
          Experience
        </h2>
      </motion.div>

      {/* Timeline container */}
      <div className="relative z-10 w-full max-w-3xl">
        {/* Timeline vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
          <motion.div
            className="w-px bg-gradient-to-b from-[#ffd86a]/40 via-[#ffd86a]/20 to-transparent"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>

        {/* Cards — exit transforms on wrapper */}
        <motion.div className="space-y-24" style={{ opacity: contentOpacity }}>
          {internships.map((item, i) => (
            <div key={i} className="relative">
              {/* Timeline dot */}
              <motion.div
                className="absolute left-1/2 top-8 -translate-x-1/2 w-3 h-3 rounded-full bg-[#ffd86a] z-10"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
                style={{
                  boxShadow:
                    "0 0 16px rgba(255,216,106,0.6), 0 0 32px rgba(255,140,0,0.3)",
                }}
              />

              {/* Card */}
              <motion.div
                className={`relative w-full sm:w-[45%] ${i === 0 ? "sm:mr-auto sm:pr-12" : "sm:ml-auto sm:pl-12"}`}
                initial={{
                  opacity: 0,
                  x: i === 0 ? -80 : 80,
                  rotateZ: i === 0 ? -3 : 3,
                }}
                whileInView={{ opacity: 1, x: 0, rotateZ: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="rounded-[20px] bg-[#070806]/80 p-5 sm:p-6 border border-[#ffd86a]/15 backdrop-blur-sm shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                  {/* Corner glow */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#ffd86a]/5 rounded-full blur-[50px]" />
                  <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#c85000]/5 rounded-full blur-[50px]" />

                  <p className="text-[#c9952a] text-xs tracking-wider uppercase mb-2">
                    {item.period}
                  </p>
                  <h3 className="text-white/90 font-bold text-lg mb-1">
                    {item.role}
                  </h3>
                  <p className="text-[#ffd86a]/50 text-sm mb-3">
                    {item.company}
                  </p>
                  <p className="text-[#e5d4a1]/50 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-[#ffd86a]/15 text-[#ffd86a]/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
