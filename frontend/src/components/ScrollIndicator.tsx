import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const sections = [
  { id: 'about', label: 'Home' },
  { id: 'about1', label: 'About' },
  { id: 'about2', label: 'Experience' },
  { id: 'about3', label: 'Philosophy' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

interface Segment {
  top: number
  height: number
  progress: number
}

export default function ScrollIndicator() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [segments, setSegments] = useState<Segment[]>([])
  const [activeProgress, setActiveProgress] = useState(0)

  const compute = useCallback(() => {
    const container = document.getElementById('snap-container')
    if (!container) return

    const scrollTop = container.scrollTop
    const scrollH = container.scrollHeight - container.clientHeight
    if (scrollH <= 0) return

    const vh = container.clientHeight
    const totalTrack = vh * 0.7
    const gap = 6
    const totalGaps = gap * (sections.length - 1)

    // Measure sections
    const measured = sections.map(s => {
      const el = document.getElementById(s.id)
      return el ? { offsetTop: el.offsetTop, height: el.offsetHeight } : { offsetTop: 0, height: vh }
    })

    const totalSectionH = measured.reduce((sum, s) => sum + s.height, 0)

    // Build segments
    const segs: Segment[] = []
    let cursor = 0
    measured.forEach((s, i) => {
      const segH = Math.max(8, ((s.height / totalSectionH) * (totalTrack - totalGaps)))
      const segProgress = Math.max(0, Math.min(1,
        (scrollTop - s.offsetTop + vh) / s.height
      ))
      segs.push({ top: cursor, height: segH, progress: segProgress })
      cursor += segH + gap
    })

    setSegments(segs)

    // Active section
    const vh3 = container.clientHeight
    let closest = 0
    let minDist = Infinity
    sections.forEach((s, i) => {
      const el = document.getElementById(s.id)
      if (!el) return
      const dist = Math.abs(el.offsetTop - scrollTop - vh3 * 0.3)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    setActiveIdx(closest)
    setActiveProgress(segs[closest]?.progress ?? 0)
  }, [])

  useEffect(() => {
    const container = document.getElementById('snap-container')
    if (!container) return
    compute()
    container.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      container.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [compute])

  return (
    <div className="fixed right-10 top-1/2 -translate-y-1/2 z-40 flex items-center gap-4 pointer-events-none">
      {/* Section label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={activeIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="text-[10px] tracking-[0.2em] uppercase text-white text-right min-w-[70px]"
        >
          {sections[activeIdx].label}
        </motion.span>
      </AnimatePresence>

      {/* Segmented track */}
      <div className="relative" style={{ height: segments.length ? segments[segments.length - 1].top + segments[segments.length - 1].height : 0 }}>
        {segments.map((seg, i) => {
          const isActive = i === activeIdx
          const fill = isActive ? seg.progress : i < activeIdx ? 1 : 0
          return (
            <div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 rounded-full overflow-visible"
              style={{ top: seg.top, width: 2, height: seg.height }}
            >
              {/* Background track */}
              <div className="absolute inset-0 bg-white/[0.06] rounded-full" />
              {/* Fill */}
              <motion.div
                className="absolute top-0 left-0 w-full rounded-full"
                style={{
                  background: isActive
                    ? 'linear-gradient(to bottom, rgba(255,216,106,0.3), rgba(255,216,106,0.9))'
                    : 'rgba(255,216,106,0.25)',
                }}
                animate={{ height: `${fill * 100}%` }}
                transition={{ duration: 0.15, ease: 'linear' }}
              />
              {/* Dot — only on active segment */}
              {isActive && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-[#ffd86a] shadow-[0_0_8px_rgba(255,216,106,0.6)]"
                  animate={{ top: `${fill * 100}%` }}
                  transition={{ duration: 0.15, ease: 'linear' }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
