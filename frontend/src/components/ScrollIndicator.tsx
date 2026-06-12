import { useEffect, useState } from 'react'
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

export default function ScrollIndicator() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const container = document.getElementById('snap-container')
    if (!container) return

    const apply = () => {
      const scrollTop = container.scrollTop
      const scrollH = container.scrollHeight - container.clientHeight
      if (scrollH <= 0) return

      setProgress(scrollTop / scrollH)

      const vh = container.clientHeight
      let closest = 0
      let minDist = Infinity
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id)
        if (!el) return
        const dist = Math.abs(el.offsetTop - scrollTop - vh * 0.3)
        if (dist < minDist) { minDist = dist; closest = i }
      })
      setActiveIdx(closest)
    }

    container.addEventListener('scroll', apply, { passive: true })
    apply()
    return () => container.removeEventListener('scroll', apply)
  }, [])

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 flex items-center gap-4 pointer-events-none">
      {/* Section label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={activeIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="text-[10px] tracking-[0.2em] uppercase text-white/40 text-right min-w-[70px]"
        >
          {sections[activeIdx].label}
        </motion.span>
      </AnimatePresence>

      {/* Track + fill */}
      <div className="relative w-[2px] h-[70vh] bg-white/[0.06] rounded-full overflow-visible">
        <motion.div
          className="absolute top-0 left-0 w-full rounded-full"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,216,106,0.15), rgba(255,216,106,0.8))',
          }}
          animate={{ height: `${progress * 100}%` }}
          transition={{ duration: 0.15, ease: 'linear' }}
        />
        {/* Dot at leading edge */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-[#ffd86a] shadow-[0_0_8px_rgba(255,216,106,0.6)]"
          animate={{ top: `${progress * 100}%` }}
          transition={{ duration: 0.15, ease: 'linear' }}
        />
      </div>
    </div>
  )
}
