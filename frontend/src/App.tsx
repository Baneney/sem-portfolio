import { useEffect, useRef, useState } from 'react'
import cornucopia from './assets/cornucopia.jpeg'
import stonePlatformLeft from './assets/stone-platform-left.jpeg'
import stonePlatformRight from './assets/stone-platform-right.jpeg'
import cornucopiaCenter from './assets/cornucopia-center.png'
import cornucopiaLeft from './assets/cornucopia-left.png'
import cornucopiaRight from './assets/cornucopia-right.png'
import Hero from './pages/Hero'
import About1 from './pages/About1'
import About2 from './pages/About2'
import About3 from './pages/About3'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import Contact from './pages/Contact'

// Pages 1, 2, 3 = About1, About2, About3
const bgImages   = [cornucopia, stonePlatformLeft, stonePlatformRight]
const sculptures = [cornucopiaCenter, cornucopiaLeft, cornucopiaRight]

const POS = [
  { x: 49, y: 43, scale: 1.3 },
  { x: 70, y: 55, scale: 2.3 },
  { x: 30, y: 56, scale: 2.3 },
]

function App() {
  const bgRefs         = useRef<(HTMLDivElement | null)[]>([])
  const sculptureRefs  = useRef<(HTMLImageElement | null)[]>([])
  const wrapperRef     = useRef<HTMLDivElement>(null)
  const bgContainerRef = useRef<HTMLDivElement>(null)
  const currentPageRef = useRef(-1)
  const [showTransition, setShowTransition] = useState(false)

  function goToPage(index: number) {
    const prevIndex = currentPageRef.current
    if (index === prevIndex) return
    currentPageRef.current = index

    const aboutIndex = index - 1 // about pages 1,2,3 → 0,1,2
    const isAbout = aboutIndex >= 0 && aboutIndex < 3

    // Cinematic flourish when leaving About3 for Skills
    const wasAbout = prevIndex >= 1 && prevIndex <= 3
    if (wasAbout && !isAbout && prevIndex === 3) {
      setShowTransition(true)
      setTimeout(() => setShowTransition(false), 1700)
    }

    if (isAbout) {
      bgRefs.current.forEach((bg, i) => {
        if (bg) bg.style.opacity = i === aboutIndex ? '1' : '0'
      })
      sculptureRefs.current.forEach((img, i) => {
        if (img) img.style.opacity = i === aboutIndex ? '1' : '0'
      })
      if (wrapperRef.current) {
        const pos = POS[aboutIndex]
        wrapperRef.current.style.opacity   = '1'
        wrapperRef.current.style.left      = `${pos.x}%`
        wrapperRef.current.style.top       = `${pos.y}%`
        wrapperRef.current.style.transform = `translate(-50%, -50%) scale(${pos.scale})`
      }
    } else {
      if (wrapperRef.current) wrapperRef.current.style.opacity = '0'
    }
  }

  useEffect(() => {
    const container = document.getElementById('snap-container')
    if (!container) return

    goToPage(0)

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const vh = window.innerHeight
      const index = Math.round(scrollTop / vh)

      if (index >= 3) {
        container.style.scrollSnapType = 'none'
      } else {
        container.style.scrollSnapType = 'y mandatory'
      }

      goToPage(index)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="text-gray-300 font-sans">

      {/* Fixed backgrounds — About pages only */}
      <div
        ref={bgContainerRef}
        className="fixed inset-0 -z-10"
        style={{ opacity: 1 }}
      >
        {bgImages.map((src, i) => (
          <div
            key={i}
            ref={el => { bgRefs.current[i] = el }}
            className="bg-layer"
            style={{ backgroundImage: `url(${src})`, opacity: i === 0 ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-black/50" style={{ zIndex: 1 }} />
      </div>

      {/* Sculpture — About pages only */}
      <div
        ref={wrapperRef}
        className="sculpture-float"
        style={{ opacity: 0,
                 left: `${POS[0].x}%`, top: `${POS[0].y}%`,
                 transform: `translate(-50%, -50%) scale(${POS[0].scale})` }}
      >
        {sculptures.map((src, i) => (
          <img
            key={i}
            ref={el => { sculptureRefs.current[i] = el }}
            src={src}
            alt=""
            className="sculpture-img sculpture-layer"
            style={{ opacity: i === 0 ? 1 : 0 }}
          />
        ))}
      </div>

      {/* Page transition overlay — About3 → Skills */}
      {showTransition && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,200,80,0.35),rgba(200,80,0,0.15),transparent_65%)] animate-transition-bloom" />
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#ff8c00]/25 via-[#c85000]/12 to-transparent blur-3xl animate-transition-fire" />
          <div className="absolute inset-x-0 bottom-0 h-full">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="absolute bottom-0 rounded-full bg-[#ffd86a] animate-transition-ember"
                style={{
                  left: `${8 + i * 6.5}%`,
                  width: `${2 + (i % 3)}px`,
                  height: `${2 + (i % 3)}px`,
                  animationDelay: `${i * 0.06}s`,
                  animationDuration: `${1.4 + (i % 4) * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* <Navbar atTop={atTop} /> */}

      <div id="snap-container" className="snap-container">
        <Hero />
        <About1 />
        <About2 />
        <About3 />
        <Skills />
        <Projects />
        <Contact />
      </div>

    </div>
  )
}

export default App
