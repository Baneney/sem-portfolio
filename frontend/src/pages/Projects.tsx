import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import schedulaterImg from "../assets/schedulater.png";
import fixTrack from "../assets/FixTrack.png";
import ciudad from '../assets/ciudad.png'
import tas from '../assets/tas.png'
import portfolio from "../assets/portfolio.png";

const PROJECT_H = 280

const projects = [
  {
    title: "Schedulater",
    year: "2024",
    image: schedulaterImg,
    description:
      "A smart task management system that uses AI-powered prioritization to help users organize, track, and manage tasks with React, Flask, and Firebase.",
    longDescription:
      "A smart task management system that helps users organize, prioritize, and track their tasks using an AI-powered rule-based prioritization engine. It combines a modern React frontend with a Flask backend and Firebase for authentication and data storage.",
    tech: ["HTML5", "Javascript", "Flask", "Firebase", "Render"],
    gradient: "linear-gradient(135deg, #667eea, #764ba2)",
    github: "https://github.com/Baneney/Schedulater.git",
    live: "https://schedulater.onrender.com/",
    highlights: [
      "Task categorization using MoSCoW method",
      "Rule-based AI system using Experta",
      "Rewards user consistency and productivity",
      "Deadline reminders",
    ],
  },
  {
    title: "FixTrack",
    year: "2025",
    image: fixTrack,
    description:
      "A React Native app that simplifies apartment maintenance through service requests and tracking between tenants, landlords, and technicians.",
    longDescription:
      "React Native mobile application designed to streamline apartment maintenance by facilitating real-time service requests and transparent transaction tracking between tenants, landlords, and technicians",
    tech: ["React Native", "Typescript", "Firebase", "Expo"],
    github: "https://github.com/Baneney/Schedulater.git",
    live: "",
    highlights: [
      "Request approval and assignment workflow",
      "Maintenance request management system",
      "Real-time repair request status updates",
      "Technician task assignment and tracking",
    ],
  },
  {
    title: "CIUDAD",
    year: "2025",
    image: ciudad,
    description:
      "A digital web and mobile system that streamlines barangay services, including certificate requests and financial tracking. Developed as an IT capstone project for Barangay San Roque, Cebu.",
    longDescription:
      "CIUDAD: BARIOS (BARANGAY SERVICES & MODERNIZATION SYSTEM) is a comprehensive web and mobile application to digitalize local government services, streamlining certificate requests and real-time financial tracking modules built with the guidance of the client - Barangay Officials of San Roque Cebu. This was my capstone project for my Bachelor's Degree in Information Technology.",
    tech: [
      "React",
      "React Native",
      "Typescript",
      "Django",
      "Tailwind CSS",
      "Supabase",
      "Firebase",
      "Figma",
    ],
    github: "https://github.com/Baneney/CIUDAD-APP-BARIOS.git",
    live: "",
    highlights: [
      "Barangay management and administrative system",
      "Development plan and financial management",
      "Council event, ordinance, and document management",
      "GAD project and budget tracking",
      "Waste management and collection request system",
      "Complaint and illegal dumping reporting",
      "Resident announcements and notification system",
      "Role-based access for barangay staff and residents",
    ],
  },
  {
    title: "Archivist's Silence",
    year: "2023",
    image: tas,
    description:
      "An isometric puzzle adventure game built with pure GDScript, where players explore a mysterious manor, solve puzzles, and uncover hidden secrets. Developed as an intern project at Lifewood Data Technology.",
    longDescription:
      "The Archivist’s Silence is an isometric puzzle adventure game where players control Elias Thorne, an archivist trapped inside a mysterious manor. Players explore hidden areas, solve puzzles, and uncover clues to reveal the truth behind a stolen family legacy and a hidden crime. The game focuses on exploration, investigation, and solving interactive puzzles to progress through the story.",
    tech: ["GDScript", "Godot Engine", "GDShader"],
    github: "https://github.com/Baneney/tas-game.git",
    live: "",
    highlights: [
      "Immersive isometric puzzle adventure experience",
      "Narrative-driven investigation with a deep mystery storyline",
      "Campaign-based level design with unique locations and challenges",
      "Custom-built gameplay systems using pure GDScript",
    ],
  },
  {
    title: "Personal Portfolio",
    year: "2026",
    image: portfolio,
    description:
      "A personal portfolio website developed with React and Tailwind CSS that highlights my skills, projects, and development experience. This project represents the portfolio website currently displayed.",
    longDescription:
      "A personal portfolio website developed using React and Tailwind CSS to showcase my technical skills, projects, and professional experience in software development. The website features a modern and responsive design that highlights my work, capabilities, and journey as a developer.",
    tech: ["React", "Typescript","Tailwind CSS", "Framer Motion", "Vite", "Vercel"],
    github: "#",
    live: "",
    highlights: [
      "Skills and experience presentation",
      "Project showcase and case study sections",
      "Responsive and modern UI design",
    ],
  },
];

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
  const mobileLineRef = useRef<HTMLDivElement>(null)
  const mobileDotsRef = useRef<HTMLDivElement[]>([])
  const mobileItemsRef = useRef<HTMLDivElement[]>([])

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

      // Mobile: animate vertical line fill + dots + item dimming
      if (mobileLineRef.current) {
        mobileLineRef.current.style.clipPath = `inset(0 0 ${Math.max(0, (1 - progress * 1.2) * 100)}% 0)`
      }
      mobileDotsRef.current.forEach((dotEl, i) => {
        if (!dotEl) return
        const projectProgress = i / (projects.length - 1)
        const lit = progress * 1.15 >= projectProgress
        const isActive = i === clampedIdx
        dotEl.style.background = lit ? '#ffd86a' : 'rgba(255,216,106,0.15)'
        dotEl.style.boxShadow = lit ? '0 0 10px rgba(255,216,106,0.5)' : 'none'
        dotEl.style.transform = isActive ? 'scale(1.3)' : 'scale(1)'
        // Pulse ring
        const pulse = dotEl.querySelector('[data-pulse]') as HTMLElement | null
        if (pulse) {
          pulse.style.background = isActive ? 'rgba(255,216,106,0.3)' : 'rgba(255,216,106,0)'
          pulse.style.animation = isActive ? 'mobile-dot-pulse 2s ease-in-out infinite' : 'none'
        }
      })
      // Dim inactive mobile items
      mobileItemsRef.current.forEach((itemEl, i) => {
        if (!itemEl) return
        const isActive = i === clampedIdx
        itemEl.style.opacity = isActive ? '1' : '0.2'
        const h3 = itemEl.querySelector('h3') as HTMLElement | null
        if (h3) h3.style.color = isActive ? '#ffffff' : 'rgba(255,255,255,0.15)'
        const desc = itemEl.querySelector('p') as HTMLElement | null
        if (desc) desc.style.color = isActive ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.08)'
        const num = itemEl.querySelector('span') as HTMLElement | null
        if (num) num.style.color = isActive ? 'rgba(255,216,106,0.5)' : 'rgba(255,216,106,0.1)'
      })
    }

    wrapper.addEventListener('scroll', apply, { passive: true })
    apply()
    return () => wrapper.removeEventListener('scroll', apply)
  }, [pathLen])

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative py-16 sm:py-70 px-5 sm:px-10"
      style={{ backgroundColor: '#000' }}
    >
      {/* Page transition — entire section fades and slides up */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
      {/* ── MOBILE: Minimal timeline ── */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-2projects md:mb-3">
            <span className="w-1.5 h-px bg-[#ffd86a]/60" />
            <span className="text-[#ffd86a]/60 text-[10px] tracking-[0.3em] uppercase font-medium">
              Works
            </span>
          </div>
          <h2
            className="text-[12vw] md:text-4xl font-black leading-[0.95] tracking-[0.2rem] md:tracking-wide mb-2 md:mb-6 uppercase animate-text-fire"
            style={{
              background: 'linear-gradient(90deg, #d18a1e, #ffd86a, #ffffff, #f0b43a, #d18a1e)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(255, 216, 106, 0.25))',
            }}
          >
            Projects
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative pl-10">
          {/* Background line (dim) */}
          <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-white/[0.06]" />
          {/* Filled line (lit) */}
          <div
            ref={mobileLineRef}
            className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#ffd86a] via-[#ffd86a]/60 to-transparent"
            style={{ clipPath: 'inset(0 0 100% 0)' }}
          />

          <div className="flex flex-col gap-14">
            {projects.map((p, i) => (
              <motion.div
                key={p.title}
                ref={el => { if (el) mobileItemsRef.current[i] = el }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                className="relative cursor-pointer group"
                style={{ transition: 'opacity 0.5s ease, filter 0.5s ease' }}
                onClick={() => setSelected(i)}
              >
                {/* Dot on the line — centered on the 2px line at left-[11px] */}
                <div className="absolute left-[-35px] top-1 flex items-center justify-center">
                  {/* Pulse ring — visible when lit */}
                  <div
                    ref={el => { if (el) mobileDotsRef.current[i] = el }}
                    className="w-3 h-3 rounded-full bg-white/[0.06] transition-all duration-300 relative"
                  >
                    <span className="absolute inset-[-4px] rounded-full bg-[#ffd86a]/0 transition-all duration-300" data-pulse={i} />
                  </div>
                </div>

                {/* Number */}
                <span className="text-[13px] tracking-wider text-[#ffd86a]/40 block mb-2" style={{ transition: 'color 0.5s ease' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Title */}
                <h3 className="text-3xl font-black uppercase tracking-wide text-white/90 mb-3" style={{ transition: 'color 0.5s ease' }}>
                  {p.title}
                </h3>

                {/* Description */}
                <p className="text-white/35 text-sm leading-relaxed" style={{ transition: 'color 0.5s ease' }}>
                  {p.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DESKTOP: Snake path layout ── */}
      <div className="hidden lg:flex w-full">
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
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#ffd86a]/60">
                    Preview
                  </span>
                  <span className="text-[10px] tracking-wider text-[#ffd86a]/40">
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
                      className="text-[10px] px-2.5 py-1 rounded-full border text-[#ffd86a]/60 border-[#ffd86a]/15 bg-[#ffd86a]/[0.04]"
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
              className="relative w-full max-w-3xl mx-8 max-h-[85vh] overflow-y-auto rounded-2xl modal-scrollbar"
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid rgba(255,216,106,0.1)',
                boxShadow: '0 0 120px rgba(255,216,106,0.06)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 z-10 flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-colors"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,1), 0 4px 50px rgba(0,0,0,0.9)' }}
              >
                <X size={23} strokeWidth={2} />
              </button>

              {/* Header image */}
              <div
                className="w-full h-40 sm:h-56 rounded-t-2xl relative overflow-hidden"
              >
                <img
                  src={projects[selected].image}
                  alt={projects[selected].title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to bottom, transparent 40%, #0a0a0a 100%)',
                  }}
                />
              </div>

              {/* Content */}
              <div className="px-5 sm:px-10 pb-8 sm:pb-10 -mt-16 relative z-10">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <h3 className="text-2xl sm:text-4xl font-bold text-white uppercase tracking-wide">
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
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs tracking-[0.2em] uppercase text-white/40 hover:text-[#ffd86a] transition-colors"
                  >
                    GitHub →
                  </a>
                  {projects[selected].live && (
                    <a
                      href={projects[selected].live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs tracking-[0.2em] uppercase text-[#ffd86a]/60 hover:text-[#ffd86a] transition-colors"
                    >
                      Live Demo →
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
