import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PROJECT_H = 280

const projects = [
  {
    title: 'E-Commerce App',
    year: '2024',
    description: 'A full-stack online store with cart, auth, and payment integration.',
    longDescription:
      'Built a complete e-commerce platform featuring user authentication, product catalog with search and filtering, shopping cart, and Stripe payment integration. Includes real-time inventory tracking, order history, and a responsive admin dashboard.',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    github: '#',
    live: '#',
    highlights: [
      'User authentication with JWT',
      'Real-time inventory tracking',
      'Stripe payment integration',
      'Admin dashboard with analytics',
    ],
  },
  {
    title: 'Task Manager',
    year: '2024',
    description: 'A productivity app to manage tasks with drag-and-drop and real-time sync.',
    longDescription:
      'A Kanban-style task management application with drag-and-drop boards, real-time collaboration via WebSockets, and cloud sync. Supports team workspaces, due dates, labels, and priority levels.',
    tech: ['TypeScript', 'React', 'Firebase'],
    github: '#',
    live: '#',
    highlights: [
      'Drag-and-drop Kanban boards',
      'Real-time collaboration',
      'Cloud sync with Firebase',
      'Team workspaces',
    ],
  },
  {
    title: 'Weather Dashboard',
    year: '2023',
    description: 'Displays real-time weather data using a public API with interactive charts.',
    longDescription:
      'A weather dashboard that visualizes current conditions and forecasts using the OpenWeatherMap API. Features interactive charts, location search, and a 7-day forecast with animated weather icons.',
    tech: ['JavaScript', 'Python', 'REST API'],
    github: '#',
    live: '#',
    highlights: [
      'Interactive weather charts',
      '7-day forecast',
      'Location search with autocomplete',
      'Animated weather icons',
    ],
  },
  {
    title: 'Portfolio Site',
    year: '2023',
    description: 'A cinematic portfolio with parallax scrolling and custom animations.',
    longDescription:
      'A personal portfolio website built with React and Framer Motion, featuring cinematic scroll transitions, parallax backgrounds, and custom SVG animations. Designed to showcase projects with a dramatic, immersive aesthetic.',
    tech: ['React', 'Framer Motion', 'Tailwind CSS'],
    github: '#',
    live: '#',
    highlights: [
      'Cinematic scroll transitions',
      'Parallax background layers',
      'Custom SVG animations',
      'Responsive design',
    ],
  },
  {
    title: 'Chat App',
    year: '2023',
    description: 'Real-time messaging app with rooms, typing indicators, and file sharing.',
    longDescription:
      'A real-time chat application built with Socket.io and Express. Features multiple chat rooms, typing indicators, online user presence, image/file sharing, and message history with pagination.',
    tech: ['Node.js', 'Socket.io', 'Express', 'React'],
    github: '#',
    live: '#',
    highlights: [
      'Real-time messaging with Socket.io',
      'Multiple chat rooms',
      'Typing indicators',
      'File and image sharing',
    ],
  },
]

function generateSnakePath(n: number) {
  const lx = 55
  const rx = 145
  let d = `M ${lx} 0`
  for (let i = 0; i < n; i++) {
    const y1 = i * PROJECT_H
    const y2 = (i + 1) * PROJECT_H
    const my = (y1 + y2) / 2
    const tx = i % 2 === 0 ? rx : lx
    d += ` C ${lx} ${my} ${tx} ${my} ${tx} ${y2}`
  }
  return d
}

export default function Projects() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [pathLen, setPathLen] = useState(1200)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLElement>(null)

  const snakePath = generateSnakePath(projects.length)

  useEffect(() => {
    if (svgRef.current) {
      const path = svgRef.current.querySelector('path')
      if (path) setPathLen(path.getTotalLength())
    }
  }, [])

  useEffect(() => {
    const wrapper = document.getElementById('snap-container')
    const section = containerRef.current
    if (!wrapper || !section) return

    const apply = () => {
      const scrollTop = wrapper.scrollTop
      const offsetTop = section.offsetTop
      const vh = wrapper.clientHeight
      const sectionH = section.offsetHeight

      const progress = Math.max(0, Math.min(1, (scrollTop - offsetTop) / (sectionH - vh)))

      const idx = Math.min(
        projects.length - 1,
        Math.floor(progress * projects.length)
      )
      setActiveIdx(Math.max(0, idx))

      const drawn = pathLen * Math.min(1, progress * 1.15)
      const pathEl = svgRef.current?.querySelector('path')
      if (pathEl) {
        pathEl.style.strokeDashoffset = String(pathLen - drawn)
      }
    }

    wrapper.addEventListener('scroll', apply, { passive: true })
    apply()
    return () => wrapper.removeEventListener('scroll', apply)
  }, [pathLen])

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative"
      style={{ backgroundColor: '#000', minHeight: `${(projects.length + 0.5) * PROJECT_H}px` }}
    >
      {/* Section label */}
      <div className="absolute top-12 left-10 z-10 flex items-center gap-2">
        <span className="w-1.5 h-px bg-[#ffd86a]/60" />
        <span className="text-[#ffd86a]/60 text-[10px] tracking-[0.3em] uppercase font-medium">
          Projects
        </span>
      </div>

      {/* Title */}
      <div className="absolute top-24 left-10 z-10">
        <h2
          className="text-[5rem] font-black leading-[0.95] uppercase"
          style={{
            background: 'linear-gradient(90deg, #d18a1e, #ffd86a, #ffffff, #f0b43a, #d18a1e)',
            backgroundSize: '300% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Work
        </h2>
      </div>

      <div className="flex w-full">
        {/* Left — snake line + project list */}
        <div className="relative w-[65%] pl-10 pt-[260px]">
          {/* SVG snake line */}
          <svg
            ref={svgRef}
            viewBox={`0 0 200 ${projects.length * PROJECT_H}`}
            className="absolute left-10 top-[260px]"
            style={{
              width: 200,
              height: projects.length * PROJECT_H,
              overflow: 'visible',
            }}
          >
            <defs>
              <filter id="snake-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Faint background track */}
            <path
              d={snakePath}
              fill="none"
              stroke="rgba(255,216,106,0.08)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Animated main stroke */}
            <path
              d={snakePath}
              fill="none"
              stroke="#ffd86a"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#snake-glow)"
              style={{
                strokeDasharray: pathLen,
                strokeDashoffset: pathLen,
                transition: 'stroke-dashoffset 0.1s linear',
              }}
            />
            {/* Node circles at each project */}
            {projects.map((_, i) => {
              const cx = i % 2 === 0 ? 145 : 55
              const cy = i * PROJECT_H + PROJECT_H / 2
              const isActive = i === activeIdx
              return (
                <g key={i}>
                  {isActive && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="18"
                      fill="none"
                      stroke="#ffd86a"
                      strokeWidth="1"
                      opacity="0.4"
                      className="animate-pulse"
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="6"
                    fill={isActive ? '#ffd86a' : 'rgba(255,216,106,0.25)'}
                    style={{ transition: 'fill 0.3s ease' }}
                  />
                </g>
              )
            })}
          </svg>

          {/* Project items */}
          {projects.map((p, i) => {
            const isActive = i === activeIdx
            const isLeft = i % 2 === 0
            return (
              <div
                key={p.title}
                className="relative flex items-center"
                style={{
                  height: PROJECT_H,
                  paddingLeft: isLeft ? 0 : 60,
                }}
              >
                {/* Connector line from node to text */}
                <div
                  className="absolute top-1/2"
                  style={{
                    left: isLeft ? 180 : 130,
                    width: 50,
                    height: 1,
                    background: isActive
                      ? 'linear-gradient(90deg, #ffd86a, transparent)'
                      : 'rgba(255,216,106,0.1)',
                    transition: 'background 0.3s ease',
                  }}
                />

                <div
                  className="cursor-pointer group"
                  style={{
                    marginLeft: isLeft ? 240 : 190,
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setSelected(i)}
                >
                  <span
                    className="block text-[11px] tracking-wider uppercase mb-1 transition-colors duration-300"
                    style={{ color: isActive ? '#ffd86a' : 'rgba(255,216,106,0.25)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className="text-3xl font-bold uppercase tracking-wide transition-all duration-300 group-hover:text-[#ffd86a]"
                    style={{
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.2)',
                      textShadow: isActive ? '0 0 30px rgba(255,216,106,0.15)' : 'none',
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="text-sm mt-1 max-w-md transition-colors duration-300"
                    style={{ color: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.12)' }}
                  >
                    {p.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right — sticky preview */}
        <div className="w-[35%] relative">
          <div
            className="sticky top-0 h-screen flex flex-col items-center justify-center px-8"
            style={{ position: 'sticky', top: 0 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -30 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-sm"
              >
                {/* Label */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">
                    Preview
                  </span>
                  <span className="text-[10px] tracking-wider text-white/20">
                    {projects[activeIdx].year}
                  </span>
                </div>

                {/* Image placeholder */}
                <div
                  className="w-full aspect-[4/3] rounded-xl overflow-hidden relative"
                  style={{
                    background: projects[activeIdx].gradient,
                    boxShadow: '0 8px 60px rgba(0,0,0,0.5), 0 0 80px rgba(255,216,106,0.05)',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/20 text-6xl font-black uppercase tracking-widest">
                      {projects[activeIdx].title.charAt(0)}
                    </span>
                  </div>
                  {/* Scanline overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
                    }}
                  />
                </div>

                {/* Tech pills */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {projects[activeIdx].tech.map(t => (
                    <span
                      key={t}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/40"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full max-w-3xl mx-8 max-h-[85vh] overflow-y-auto rounded-2xl"
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid rgba(255,216,106,0.1)',
                boxShadow: '0 0 120px rgba(255,216,106,0.06)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Back button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-6 left-6 z-10 flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white/40 hover:text-[#ffd86a] transition-colors group"
              >
                <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                Back
              </button>

              {/* Header gradient */}
              <div
                className="w-full h-56 rounded-t-2xl relative overflow-hidden"
                style={{ background: projects[selected].gradient }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/15 text-[8rem] font-black uppercase">
                    {projects[selected].title.charAt(0)}
                  </span>
                </div>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to bottom, transparent 40%, #0a0a0a 100%)',
                  }}
                />
              </div>

              {/* Content */}
              <div className="px-10 pb-10 -mt-16 relative z-10">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <h3 className="text-4xl font-bold text-white uppercase tracking-wide">
                      {projects[selected].title}
                    </h3>
                    <span className="text-[#ffd86a]/50 text-sm">{projects[selected].year}</span>
                  </div>
                </div>

                <p className="text-white/50 leading-relaxed mb-8">
                  {projects[selected].longDescription}
                </p>

                {/* Highlights */}
                <div className="mb-8">
                  <h4 className="text-xs tracking-[0.2em] uppercase text-[#ffd86a]/40 mb-4">
                    Key Features
                  </h4>
                  <ul className="grid grid-cols-2 gap-3">
                    {projects[selected].highlights.map(h => (
                      <li key={h} className="flex items-start gap-2 text-sm text-white/40">
                        <span className="text-[#ffd86a]/40 mt-0.5">✦</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech */}
                <div className="mb-8">
                  <h4 className="text-xs tracking-[0.2em] uppercase text-[#ffd86a]/40 mb-4">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {projects[selected].tech.map(t => (
                      <span
                        key={t}
                        className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-6">
                  <a
                    href={projects[selected].github}
                    className="text-xs tracking-[0.2em] uppercase text-white/40 hover:text-[#ffd86a] transition-colors"
                  >
                    GitHub →
                  </a>
                  <a
                    href={projects[selected].live}
                    className="text-xs tracking-[0.2em] uppercase text-[#ffd86a]/60 hover:text-[#ffd86a] transition-colors"
                  >
                    Live Demo →
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
