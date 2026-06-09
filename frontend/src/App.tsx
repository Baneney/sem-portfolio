import { useEffect, useRef, useState } from 'react'
import cornucopia from './assets/cornucopia.jpeg'
import stonePlatformLeft from './assets/stone-platform-left.jpeg'
import stonePlatformRight from './assets/stone-platform-right.jpeg'
import cornucopiaCenter from './assets/cornucopia-center.png'
import cornucopiaLeft from './assets/cornucopia-left.png'
import cornucopiaRight from './assets/cornucopia-right.png'
import Navbar from './components/Navbar'
import Hero from './pages/Hero'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import Contact from './pages/Contact'

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
  const currentPageRef = useRef(-1)
  const [atTop, setAtTop] = useState(true)

  function goToPage(index: number) {
    if (index === currentPageRef.current) return
    currentPageRef.current = index
    setAtTop(index === 0)

    bgRefs.current.forEach((bg, i) => {
      if (bg) bg.style.opacity = i === index ? '1' : '0'
    })

    sculptureRefs.current.forEach((img, i) => {
      if (img) img.style.opacity = i === index ? '1' : '0'
    })

    if (index < 3 && wrapperRef.current) {
      const pos = POS[index]
      wrapperRef.current.style.left      = `${pos.x}%`
      wrapperRef.current.style.top       = `${pos.y}%`
      wrapperRef.current.style.transform = `translate(-50%, -50%) scale(${pos.scale})`
    }

    if (wrapperRef.current) {
      wrapperRef.current.style.opacity = index < 3 ? '1' : '0'
    }
  }

  useEffect(() => {
    const container = document.getElementById('snap-container')
    if (!container) return

    goToPage(0)

    const handleScroll = () => {
      const index = Math.round(container.scrollTop / window.innerHeight)
      goToPage(index)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="text-gray-300 font-sans">

      {/* Fixed crossfade backgrounds */}
      <div className="fixed inset-0 -z-10">
        {bgImages.map((src, i) => (
          <div
            key={i}
            ref={el => { bgRefs.current[i] = el }}
            className="bg-layer"
            style={{ backgroundImage: `url(${src})`, opacity: i === 0 ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-black/30" style={{ zIndex: 1 }} />
      </div>

      {/* Sculpture wrapper */}
      <div ref={wrapperRef} className="sculpture-float">
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

      <Navbar atTop={atTop} />

      {/* Scroll snap container */}
      <div id="snap-container" className="snap-container">
        <Hero />
        <Skills />
        <Projects />
        <Contact />
      </div>

    </div>
  )
}

export default App
