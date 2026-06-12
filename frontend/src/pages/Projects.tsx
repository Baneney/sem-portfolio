import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ecommerceImg from "../assets/cornucopia.png";
import taskManagerImg from "../assets/skills-bg.png";
import weatherImg from '../assets/projects/weather-dashboard.png'
import portfolioImg from '../assets/projects/portfolio.png'
import chatImg from '../assets/projects/chat.png'

const PROJECT_H = 280

const projects = [
  {
    title: 'E-Commerce App',
    year: '2024',
    image: ecommerceImg,
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
    image: taskManagerImg,
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
    image: weatherImg,
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
    image: portfolioImg,
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
    image: chatImg,
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
  const seg = PROJECT_H

  let d = `M ${lx} 0`
  // Virtual "previous CP2" so the first segment enters smoothly from above
  // Reflection: cp1 = 2*start - prevCP2 → want cp1.y ≈ seg*0.25 below start
  // So prevCP2.y = 2*0 - seg*0.25 = -seg*0.25
  let prevCP2 = { x: lx, y: -seg * 0.25 }

  for (let i = 0; i < n; i++) {
    const startX = i === 0 ? lx : (i % 2 === 0 ? lx : rx)
    const startY = i * seg
    const endX = i % 2 === 0 ? rx : lx
    const endY = (i + 1) * seg

    // C1 continuity: reflect previous CP2 through current start point
    const cp1x = 2 * startX - prevCP2.x
    const cp1y = 2 * startY - prevCP2.y

    // Second control point pulls toward the end x, 30% above end y
    const cp2x = endX
    const cp2y = endY - seg * 0.3

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`
    prevCP2 = { x: cp2x, y: cp2y }
  }
  return d
}

function getPointOnPath(pathEl: SVGPathElement, ratio: number) {
  const len = pathEl.getTotalLength()
  return pathEl.getPointAtLength(len * ratio)
}

export default function Projects() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [pathLen, setPathLen] = useState(1200)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLElement>(null)
  const glowDotRef = useRef<SVGCircleElement>(null)
  const glowTrailRef = useRef<SVGPathElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

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

      const newIdx = Math.min(
        projects.length - 1,
        Math.floor(progress * projects.length)
      )
      const clampedIdx = Math.max(0, newIdx)
      setActiveIdx(prev => prev === clampedIdx ? prev : clampedIdx)

      // Directly update project item DOM elements (bypass React state for smoothness)
      const items = itemsRef.current?.querySelectorAll('[data-project]') as NodeListOf<HTMLElement> | undefined
      if (items) {
        items.forEach((el, i) => {
          const dist = Math.abs(progress * (projects.length - 1) - i)
          const s = 0.6 + 0.7 * Math.exp(-dist * dist * 1.4)
          const isActive = i === clampedIdx

          el.style.transform = `scale(${s})`
          el.style.transformOrigin = 'left center'

          const h3 = el.querySelector('h3') as HTMLElement | null
          if (h3) {
            h3.style.fontSize = `${1.5 + s * 0.7}rem`
            h3.style.color = isActive ? '#ffffff' : `rgba(255,255,255,${0.1 + s * 0.1})`
          }

          const num = el.querySelector('[data-num]') as HTMLElement | null
          if (num) {
            num.style.color = isActive ? '#ffd86a' : `rgba(255,216,106,${0.1 + s * 0.15})`
          }

          const desc = el.querySelector('[data-desc]') as HTMLElement | null
          if (desc) {
            desc.style.color = isActive ? 'rgba(255,255,255,0.5)' : `rgba(255,255,255,${0.05 + s * 0.08})`
          }

          const conn = el.querySelector('[data-connector]') as HTMLElement | null
          if (conn) {
            conn.style.background = isActive
              ? 'linear-gradient(90deg, #ffd86a, transparent)'
              : `rgba(255,216,106,${0.05 + s * 0.08})`
          }
        })
      }

      // Animate main stroke draw
      const drawn = pathLen * Math.min(1, progress * 1.15)
      const pathEl = svgRef.current?.querySelector('.snake-main') as SVGPathElement | null
      if (pathEl) {
        pathEl.style.strokeDashoffset = String(pathLen - drawn)
      }

      // Glow trail — brighter stroke that follows the draw
      const glowPathEl = glowTrailRef.current
      if (glowPathEl) {
        const glowDrawn = pathLen * Math.min(1, progress * 1.15)
        glowPathEl.style.strokeDashoffset = String(pathLen - glowDrawn)
      }

      // Traveling glow dot — moves along the path
      const dot = glowDotRef.current
      if (dot && pathEl) {
        const point = getPointOnPath(pathEl, Math.min(1, progress * 1.15))
        dot.setAttribute('cx', String(point.x))
        dot.setAttribute('cy', String(point.y))
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
      className="relative py-70 px-10"
      style={{ backgroundColor: '#000', minHeight: `${(projects.length + 0.5) * PROJECT_H}px` }}
    >
      {/* Page transition — entire section fades and slides up */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
      <div className="flex w-full">
        {/* Left — snake line + project list */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-[65%] pl-10 pt-[260px]"
        >
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
              <filter id="snake-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="5" result="blur1" />
                <feGaussianBlur stdDeviation="12" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="dot-glow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="dot-gradient">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#ffd86a" />
                <stop offset="100%" stopColor="#d18a1e" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Faint background track */}
            <path
              d={snakePath}
              fill="none"
              stroke="rgba(255,216,106,0.06)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Glow trail — brighter, wider, blurred behind the main stroke */}
            <path
              ref={glowTrailRef}
              d={snakePath}
              fill="none"
              stroke="rgba(255,216,106,0.3)"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#snake-glow)"
              style={{
                strokeDasharray: pathLen,
                strokeDashoffset: pathLen,
                transition: 'stroke-dashoffset 0.1s linear',
              }}
            />

            {/* Animated main stroke */}
            <path
              className="snake-main"
              d={snakePath}
              fill="none"
              stroke="#ffd86a"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                strokeDasharray: pathLen,
                strokeDashoffset: pathLen,
                transition: 'stroke-dashoffset 0.1s linear',
              }}
            />

            {/* Traveling glow dot */}
            <circle
              ref={glowDotRef}
              cx="55"
              cy="0"
              r="10"
              fill="url(#dot-gradient)"
              filter="url(#dot-glow)"
              opacity="0.9"
            />

            {/* Node circles at each project */}
            {projects.map((_, i) => {
              const cx = i % 2 === 0 ? 145 : 55
              const cy = i * PROJECT_H + PROJECT_H / 2
              const isActive = i === activeIdx
              const isPast = i < activeIdx
              return (
                <g key={i}>
                  {/* Outer ring on active */}
                  {isActive && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="20"
                      fill="none"
                      stroke="#ffd86a"
                      strokeWidth="1"
                      opacity="0.3"
                    >
                      <animate
                        attributeName="r"
                        values="14;22;14"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.5;0.1;0.5"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  {/* Core dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isActive ? 7 : 5}
                    fill={isActive ? '#ffd86a' : isPast ? 'rgba(255,216,106,0.5)' : 'rgba(255,216,106,0.15)'}
                    style={{ transition: 'all 0.4s ease' }}
                  />
                  {/* Inner bright core on active */}
                  {isActive && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="2.5"
                      fill="#ffffff"
                      opacity="0.8"
                    />
                  )}
                </g>
              )
            })}
          </svg>

          {/* Project items */}
          <div ref={itemsRef}>
          {projects.map((p, i) => {
            const isLeft = i % 2 === 0
            return (
              <motion.div
                key={p.title}
                data-project
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                className="relative flex items-center"
                style={{
                  height: PROJECT_H,
                  paddingLeft: isLeft ? 0 : 60,
                }}
              >
                {/* Connector line from node to text */}
                <div
                  className="absolute top-1/2 connector-line"
                  data-connector
                  style={{
                    left: isLeft ? 180 : 130,
                    width: 50,
                    height: 1,
                    background: 'rgba(255,216,106,0.1)',
                  }}
                />

                <div
                  className="cursor-pointer group"
                  style={{
                    marginLeft: isLeft ? 240 : 190,
                    transformOrigin: 'left center',
                  }}
                  onClick={() => setSelected(i)}
                >
                  <span
                    data-num
                    className="block text-[11px] tracking-wider uppercase mb-1"
                    style={{ color: 'rgba(255,216,106,0.25)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className="font-bold uppercase tracking-wide group-hover:text-[#ffd86a]"
                    style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.2)' }}
                  >
                    {p.title}
                  </h3>
                  <p
                    data-desc
                    className="mt-1 max-w-md"
                    style={{ color: 'rgba(255,255,255,0.12)' }}
                  >
                    {p.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
          </div>
        </motion.div>

        {/* Right — sticky preview */}
        <div className="w-[35%] relative preview-fade-in">
          <div
            className="sticky top-0 h-screen flex flex-col items-center justify-center px-8"
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

                {/* Image */}
                <div
                  className="w-full aspect-[4/3] rounded-xl overflow-hidden relative"
                  style={{
                    boxShadow: '0 8px 60px rgba(0,0,0,0.5), 0 0 80px rgba(255,216,106,0.05)',
                  }}
                >
                  <img
                    src={projects[activeIdx].image}
                    alt={projects[activeIdx].title}
                    className="w-full h-full object-cover"
                  />
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
      </motion.div>

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
