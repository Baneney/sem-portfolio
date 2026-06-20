import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const sections = [
  { id: 'about', label: 'Home' },
  { id: 'katniss-section', label: 'The Games', hidden: true },
  { id: 'about1', label: 'About' },
  { id: 'about2', label: 'Experience' },
  { id: 'about3', label: 'Philosophy' },
  { id: 'skills', label: 'Skills' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

interface Segment {
  top: number
  height: number
  fill: number
  hidden?: boolean
}

export default function ScrollIndicator({ scrollToSection }: { scrollToSection?: (id: string) => void }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [segments, setSegments] = useState<Segment[]>([])

  const compute = useCallback(() => {
    const container = document.getElementById('snap-container')
    if (!container) return

    const scrollTop = container.scrollTop
    const scrollH = container.scrollHeight - container.clientHeight
    if (scrollH <= 0) return

    const overallProgress = scrollTop / scrollH

    // Measure sections
    const measured = sections.map(s => {
      const el = document.getElementById(s.id)
      return el ? el.offsetHeight : container.clientHeight
    })

    const totalSectionH = measured.reduce((sum, h) => sum + h, 0)
    const vh = container.clientHeight
    const totalTrack = vh * 0.7
    const gap = 6
    
    // Count only visible sections for gaps
    const visibleCount = sections.filter(s => !s.hidden).length
    const totalGaps = gap * (visibleCount - 1)
    const availableTrack = totalTrack - totalGaps

    // Build segments
    let cursor = 0
    const segs: Segment[] = measured.map((h, i) => {
      const isHidden = sections[i].hidden
      const segH = Math.max(8, (h / totalSectionH) * availableTrack)

      // How much of total scroll does this section cover?
      const sectionStart = measured.slice(0, i).reduce((sum, hh) => sum + hh, 0) / totalSectionH
      const sectionEnd = (sectionStart * totalSectionH + h) / totalSectionH

      // Fill for this segment
      let fill = 0
      if (overallProgress >= sectionEnd) {
        fill = 1
      } else if (overallProgress > sectionStart) {
        fill = (overallProgress - sectionStart) / (sectionEnd - sectionStart)
      }
      fill = Math.max(0, Math.min(1, fill))

      const seg: Segment = { top: cursor, height: segH, fill, hidden: isHidden }
      if (!isHidden) {
        cursor += segH + gap
      }
      return seg
    })

    setSegments(segs)

    // Active section — which section contains the scroll position?
    let cumH = 0
    let closest = 0
    for (let i = 0; i < measured.length; i++) {
      cumH += measured[i]
      if (scrollTop < cumH - measured[i] * 0.3) {
        closest = i
        break
      }
      closest = i
    }
    setActiveIdx(closest)
  }, [])

  useEffect(() => {
    const container = document.getElementById('snap-container')
    if (!container) return
    // Delay initial compute so DOM sections are measured
    const raf = requestAnimationFrame(() => compute())
    container.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      cancelAnimationFrame(raf)
      container.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [compute])

  const scrollTo = (index: number) => {
    const id = sections[index].id
    if (scrollToSection) {
      scrollToSection(id)
    } else {
      const container = document.getElementById('snap-container')
      const el = document.getElementById(id)
      if (!container || !el) return
      container.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
    }
  }

  return (
    <div
      className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 flex items-center gap-4 transition-opacity duration-300"
      style={{
        height: segments.length ? segments.filter(s => !s.hidden).reduce((acc, s) => acc + s.height + 6, 0) - 6 : 0,
        opacity: activeIdx === 0 ? 0 : 1,
        pointerEvents: activeIdx === 0 ? 'none' : 'auto',
      }}
    >
      {/* Segmented track */}
      <div className="relative" style={{ height: '100%' }}>
        {segments.map((seg, i) => {
          if (seg.hidden) return null
          const isActive = i === activeIdx
          return (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className="absolute left-1/2 -translate-x-1/2 rounded-full overflow-visible cursor-pointer group"
              style={{ top: seg.top, width: 3, height: seg.height }}
            >
              {/* Wider hit area */}
              <div className="absolute -inset-x-3 -inset-y-1" />
              {/* Background track */}
              <div className="absolute inset-0 bg-white/[0.06] rounded-full group-hover:bg-white/[0.12] transition-colors duration-200" />
              {/* Fill */}
              <motion.div
                className="absolute top-0 left-0 w-full rounded-full"
                style={{
                  background: isActive
                    ? 'linear-gradient(to bottom, rgba(255,216,106,0.3), rgba(255,216,106,0.9))'
                    : 'rgba(255,216,106,0.25)',
                }}
                animate={{ height: `${seg.fill * 100}%` }}
                transition={{ duration: 0.15, ease: 'linear' }}
              />
              {/* Dot on active */}
              {isActive && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-[#ffd86a] shadow-[0_0_8px_rgba(255,216,106,0.6)]"
                  animate={{ top: `${seg.fill * 100}%` }}
                  transition={{ duration: 0.15, ease: 'linear' }}
                />
              )}
            </button>
          )
        })}

        {/* Label — follows the active dot */}
        <AnimatePresence mode="wait">
          {!sections[activeIdx]?.hidden && (
            <motion.button
              key={activeIdx}
              onClick={() => scrollTo(activeIdx)}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.25 }}
              className="absolute right-full mr-4 -translate-y-1/2 cursor-pointer hidden sm:block"
              style={{ top: segments[activeIdx] ? segments[activeIdx].top + segments[activeIdx].fill * segments[activeIdx].height : 0 }}
            >
              <span className="text-[12px] tracking-[0.2em] uppercase text-white hover:text-[#ffd86a] transition-colors duration-200 whitespace-nowrap">
                {sections[activeIdx].label}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
