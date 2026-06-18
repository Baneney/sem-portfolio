import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, useScroll, useTransform, useSpring, useMotionValueEvent, motion } from 'framer-motion'
import cornucopia from './assets/cornucopia.jpeg'
import stonePlatformLeft from './assets/stone-platform-left.jpeg'
import stonePlatformRight from './assets/stone-platform-right.jpeg'
import Hero from './pages/Hero'
import About1 from './pages/About1'
import About2 from './pages/About2'
import About3 from './pages/About3'
import Certificates from './pages/Certificates'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import ScrollIndicator from './components/ScrollIndicator'
import Splash from './components/Splash'
import Chatbot from './components/Chatbot'
import ArrowTransition from './components/ArrowTransition'

const bgImages = [cornucopia, stonePlatformLeft, stonePlatformRight]

function App() {
  const bgRefs         = useRef<(HTMLDivElement | null)[]>([])
  const bgContainerRef = useRef<HTMLDivElement>(null)
  const snapContainerRef = useRef<HTMLDivElement>(null)
  const transitionRef = useRef<HTMLDivElement>(null)
  
  const currentPageRef = useRef(-1)
  const [showTransition, setShowTransition] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const splashDone = useRef(false)
  const contentReady = useRef(false)
  const scrollLockedRef = useRef(false)

  // Scroll tracking for Katniss transition
  const { scrollYProgress } = useScroll({
    container: snapContainerRef,
    target: transitionRef,
    offset: ["start end", "end start"]
  })

  // Smooth progress with weighted spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45, 
    damping: 35,
    restDelta: 0.001
  })

  // Map smooth progress to frames
  // We stretch the range so frame 25 (the peak/fade start) happens later
  const frameValue = useTransform(smoothProgress, [0, 1], [-10, 32])

  // GLOBAL BACKGROUND STATE
  // Fade out the transition overlays as we reach the end of the sequence
  const globalBgOpacity = useTransform(frameValue, [-10, -5, 2, 25, 30], [0, 1, 1, 1, 0])

  // Lock scroll during katniss phase — prevent scrolling past About1
  useMotionValueEvent(frameValue, "change", (latest) => {
    // We unlock at 28 to ensure the assets have mostly faded out
    const isLocked = latest < 28
    scrollLockedRef.current = isLocked
    
    if (snapContainerRef.current) {
      // Disable smooth scroll during lock to prevent coasting past the limit
      snapContainerRef.current.style.scrollBehavior = isLocked ? 'auto' : 'smooth'
    }
  })

  function tryDismissSplash() {
    if (splashDone.current && contentReady.current) {
      setShowSplash(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => {
      splashDone.current = true
      tryDismissSplash()
    }, 3500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const container = snapContainerRef.current
    if (!container) return

    // Proactive wheel/touch interception to prevent over-scroll
    function handleWheel(e: WheelEvent) {
      if (scrollLockedRef.current) {
        const scrollTop = container!.scrollTop
        const about1Top = document.getElementById('about1')?.offsetTop || 0
        
        // Strictly prevent scrolling past the start of About1 while locked
        if (scrollTop >= about1Top && e.deltaY > 0) {
          e.preventDefault()
          container!.scrollTop = about1Top
        }
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  useEffect(() => {
    const dismiss = () => {
      contentReady.current = true
      tryDismissSplash()
    }

    if (document.readyState === 'complete') {
      dismiss()
      return
    }

    window.addEventListener('load', dismiss)

    const images = document.querySelectorAll('img')
    let pending = 0
    images.forEach(img => {
      if (!img.complete) {
        pending++
        img.addEventListener('load', () => {
          pending--
          if (pending <= 0) dismiss()
        }, { once: true })
        img.addEventListener('error', () => {
          pending--
          if (pending <= 0) dismiss()
        }, { once: true })
      }
    })

    if (pending <= 0) dismiss()

    return () => window.removeEventListener('load', dismiss)
  }, [])

  function goToPage(index: number) {
    const prevIndex = currentPageRef.current
    if (index === prevIndex) return
    currentPageRef.current = index

    // Precise Background Control (About Pages)
    const about1Pos = document.getElementById('about1')?.offsetTop || 0
    const about2Pos = document.getElementById('about2')?.offsetTop || 0
    const about3Pos = document.getElementById('about3')?.offsetTop || 0
    const vh = window.innerHeight

    const scrollTop = snapContainerRef.current?.scrollTop || 0
    
    let activeAbout = -1
    if (Math.abs(scrollTop - about1Pos) < vh / 2) activeAbout = 0
    else if (Math.abs(scrollTop - about2Pos) < vh / 2) activeAbout = 1
    else if (Math.abs(scrollTop - about3Pos) < vh / 2) activeAbout = 2

    if (activeAbout !== -1) {
      bgRefs.current.forEach((bg, i) => {
        if (bg) bg.style.opacity = i === activeAbout ? '1' : '0'
      })
    }

    // Skills transition trigger
    const skillsPos = document.getElementById('skills')?.offsetTop || 9999
    if (index >= 5 && Math.abs(scrollTop - skillsPos) < vh / 2 && prevIndex < index) {
      setShowTransition(true)
      setTimeout(() => setShowTransition(false), 1700)
    }
  }

  useEffect(() => {
    const container = snapContainerRef.current
    if (!container) return

    function handleScroll() {
      const scrollEl = container!
      const scrollTop = scrollEl.scrollTop
      const vh = window.innerHeight

      // Snap lock at About1 during katniss phase
      if (scrollLockedRef.current) {
        const about1El = document.getElementById('about1')
        if (about1El) {
          const about1Top = about1El.offsetTop
          if (scrollTop > about1Top) {
            scrollEl.scrollTop = about1Top
            return
          }
        }
      }

      const sections = ['about', 'katniss-section', 'about1', 'about2', 'about3', 'skills', 'certificates', 'projects', 'contact']
      let currentIndex = 0
      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i])
        if (el && scrollTop >= el.offsetTop - vh / 2) {
          currentIndex = i
        }
      }
      goToPage(currentIndex)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="text-gray-300 font-sans">
      <AnimatePresence>
        {showSplash && <Splash onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* ── Unified Cinematic Background Layer ── */}
      {/* This layer exists globally and morphs opacities to ensure no hard edges or cut-offs */}
      <motion.div
        className="fixed inset-0 bg-black z-[18] pointer-events-none"
        style={{ opacity: globalBgOpacity }}
      />

      {/* Katniss arrow-shooting transition — always mounted behind snap-container */}
      <ArrowTransition currentFrameValue={frameValue} />

      {/* Fixed backgrounds — About pages only */}
      <div
        ref={bgContainerRef}
        className="fixed inset-0 -z-10"
        style={{ opacity: 1 }}
      >
        {bgImages.map((src, i) => (
          <div
            key={i}
            ref={(el) => {
              bgRefs.current[i] = el;
            }}
            className="bg-layer"
            style={{ backgroundImage: `url(${src})`, opacity: i === 0 ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-black/50" style={{ zIndex: 1 }} />
      </div>

      {/* Page transition overlay — About3 → Skills */}
      {showTransition && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,200,80,0.35),rgba(200,80,0,0.15),transparent_65%)] animate-transition-bloom" />
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#ff8c00]/25 via-[#c85000]/12 to-transparent blur-3xl animate-transition-fire" />
          <div className="absolute inset-x-0 bottom-0 h-full">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 rounded-full bg-[#ffd86a] animate-transition-ember"
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

      <div
        id="snap-container"
        className="snap-container"
        ref={snapContainerRef}
      >
        <Hero showSplash={showSplash} containerRef={snapContainerRef} />

        {/* Transition Spacer — slightly taller to account for more frames */}
        <section
          id="katniss-section"
          ref={transitionRef}
          className="relative w-full h-[300vh] pointer-events-none"
          style={{ zIndex: 5 }}
        ></section>

        <About1 containerRef={snapContainerRef} />
        <About2 containerRef={snapContainerRef} />
        <About3 containerRef={snapContainerRef} />
        <Skills />
        <Certificates containerRef={snapContainerRef} />
        <Projects />
        <Contact />
      </div>

      <ScrollIndicator />
      {!showSplash && <Chatbot />}
    </div>
  );
}

export default App
