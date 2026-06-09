import { useEffect, useRef, useState } from 'react'
import cornucopia from './assets/cornucopia.jpeg'
import stonePlatformLeft from './assets/stone-platform-left.jpeg'
import stonePlatformRight from './assets/stone-platform-right.jpeg'

const bgImages = [cornucopia, stonePlatformLeft, stonePlatformRight]
import cornucopiaCenter from './assets/cornucopia-center.png'
import cornucopiaLeft from './assets/cornucopia-left.png'
import cornucopiaRight from './assets/cornucopia-right.png'

const skills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js',
  'Python', 'SQL', 'Git', 'Docker', 'REST APIs', 'Tailwind CSS',
]

const projects = [
  {
    title: 'E-Commerce App',
    description: 'A full-stack online store with cart, auth, and payment integration.',
    tech: ['React', 'Node.js', 'MongoDB'],
    github: '#', live: '#',
  },
  {
    title: 'Task Manager',
    description: 'A productivity app to manage tasks with drag-and-drop and real-time sync.',
    tech: ['TypeScript', 'React', 'Firebase'],
    github: '#', live: '#',
  },
  {
    title: 'Weather Dashboard',
    description: 'Displays real-time weather data using a public API with interactive charts.',
    tech: ['JavaScript', 'Python', 'REST API'],
    github: '#', live: '#',
  },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function clamp(v: number, min = 0, max = 1) {
  return Math.min(Math.max(v, min), max)
}

// Hero start position
const POS_HERO     = { x: 49, y: 25, scale: 1.3 }
// Where center arrives on skills — this is the handoff point for center→left
const POS_SKILLS   = { x: 71, y: 27, scale: 2.3 }
// Where left arrives on projects — this is the handoff point for left→right
const POS_PROJECTS = { x: 27, y: 27, scale: 2.3 }
// Where right ends up
const POS_RIGHT_END = { x: 80, y: 10, scale: 0.7 }

type SculptureState = {
  x: number; y: number; scale: number; opacity: number
}

function App() {
  const sculptureRef = useRef<HTMLDivElement>(null)
  const [activeImg, setActiveImg] = useState<'center' | 'left' | 'right'>('center')
  const activeImgRef = useRef<'center' | 'left' | 'right'>('center')
  const bgRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const about    = document.getElementById('about')
      const skillsEl = document.getElementById('skills')
      const projectsEl = document.getElementById('projects')
      if (!about || !skillsEl || !projectsEl) return

      const heroTop     = about.offsetTop
      const skillsTop   = skillsEl.offsetTop
      const projectsTop = projectsEl.offsetTop
      const projectsBot = projectsTop + projectsEl.offsetHeight

      let state: SculptureState
      let nextImg: 'center' | 'left' | 'right' = 'center'

      // SWAP_AT controls how far along (0→1) center fades before left takes over
      const SWAP_AT = 0.7  // center fades at 70% of hero→skills journey

      if (scrollY < skillsTop) {
        const t = clamp((scrollY - heroTop) / (skillsTop - heroTop))

        if (t < SWAP_AT) {
          // center moving toward POS_SKILLS, fades out near SWAP_AT
          const moveT  = clamp(t / SWAP_AT)
          const fadeT  = clamp((t - (SWAP_AT - 0.15)) / 0.15)  // fade in last 15% before SWAP_AT
          const swapX  = lerp(POS_HERO.x,     POS_SKILLS.x,     moveT)
          const swapY  = lerp(POS_HERO.y,     POS_SKILLS.y,     moveT)
          const swapS  = lerp(POS_HERO.scale, POS_SKILLS.scale, moveT)
          state = { x: swapX, y: swapY, scale: swapS, opacity: 1 - fadeT }
          nextImg = 'center'
        } else {
          // left pops in at the swap position, continues to POS_SKILLS
          const moveT  = clamp((t - SWAP_AT) / (1 - SWAP_AT))
          const swapX  = lerp(POS_HERO.x,     POS_SKILLS.x,     SWAP_AT)
          const swapY  = lerp(POS_HERO.y,     POS_SKILLS.y,     SWAP_AT)
          const swapS  = lerp(POS_HERO.scale, POS_SKILLS.scale, SWAP_AT)
          state = {
            x:       lerp(swapX,        POS_SKILLS.x,     moveT),
            y:       lerp(swapY,        POS_SKILLS.y,     moveT),
            scale:   lerp(swapS,        POS_SKILLS.scale, moveT),
            opacity: 1,
          }
          nextImg = 'left'
        }

      } else if (scrollY < projectsTop) {
        // left continues from POS_SKILLS, fades at 70% toward POS_PROJECTS
        const t      = clamp((scrollY - skillsTop) / (projectsTop - skillsTop))
        const SWAP2  = 0.7
        if (t < SWAP2) {
          const moveT = clamp(t / SWAP2)
          const fadeT = clamp((t - (SWAP2 - 0.15)) / 0.15)
          state = {
            x:       lerp(POS_SKILLS.x,     POS_PROJECTS.x,     moveT),
            y:       lerp(POS_SKILLS.y,     POS_PROJECTS.y,     moveT),
            scale:   lerp(POS_SKILLS.scale, POS_PROJECTS.scale, moveT),
            opacity: 1 - fadeT,
          }
          nextImg = 'left'
        } else {
          // right pops in at swap position, continues to POS_PROJECTS
          const moveT = clamp((t - SWAP2) / (1 - SWAP2))
          const swapX = lerp(POS_SKILLS.x,     POS_PROJECTS.x,     SWAP2)
          const swapY = lerp(POS_SKILLS.y,     POS_PROJECTS.y,     SWAP2)
          const swapS = lerp(POS_SKILLS.scale, POS_PROJECTS.scale, SWAP2)
          state = {
            x:       lerp(swapX,   POS_PROJECTS.x,     moveT),
            y:       lerp(swapY,   POS_PROJECTS.y,     moveT),
            scale:   lerp(swapS,   POS_PROJECTS.scale, moveT),
            opacity: 1,
          }
          nextImg = 'right'
        }

      } else {
        // right continues from POS_PROJECTS to POS_RIGHT_END
        const t = clamp((scrollY - projectsTop) / (projectsBot - projectsTop))
        state = {
          x:       lerp(POS_PROJECTS.x,     POS_RIGHT_END.x,     t),
          y:       lerp(POS_PROJECTS.y,     POS_RIGHT_END.y,     t),
          scale:   lerp(POS_PROJECTS.scale, POS_RIGHT_END.scale, t),
          opacity: 1,
        }
        nextImg = 'right'
      }

      // crossfade backgrounds based on scroll position between sections
      const sections = [about, skillsEl, projectsEl]
      const bgOpacities = [0, 0, 0]

      if (scrollY < skillsTop) {
        const t = clamp((scrollY - heroTop) / (skillsTop - heroTop))
        bgOpacities[0] = 1 - t
        bgOpacities[1] = t
      } else if (scrollY < projectsTop) {
        const t = clamp((scrollY - skillsTop) / (projectsTop - skillsTop))
        bgOpacities[1] = 1 - t
        bgOpacities[2] = t
      } else {
        bgOpacities[2] = 1
      }

      bgRefs.current.forEach((bg, i) => {
        if (bg) bg.style.opacity = String(bgOpacities[i])
      })

      // swap image source when needed
      if (nextImg !== activeImgRef.current) {
        activeImgRef.current = nextImg
        setActiveImg(nextImg)
      }

      // apply position
      if (sculptureRef.current) {
        sculptureRef.current.style.left      = `${state.x}%`
        sculptureRef.current.style.top       = `${state.y}%`
        sculptureRef.current.style.transform = `translate(-50%, -50%) scale(${state.scale})`
        sculptureRef.current.style.opacity   = String(state.opacity)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const imgSrc = activeImg === 'center'
    ? cornucopiaCenter
    : activeImg === 'left'
    ? cornucopiaLeft
    : cornucopiaRight

  return (
    <div className="text-gray-300 font-sans">

      {/* Fixed crossfade background layers */}
      <div className="fixed inset-0 -z-10">
        {bgImages.map((src, i) => (
          <div
            key={i}
            ref={el => { bgRefs.current[i] = el }}
            className="bg-layer"
            style={{ backgroundImage: `url(${src})`, opacity: i === 0 ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0" style={{ zIndex: 1 }} />
      </div>

      {/* Single sculpture element — image swaps on section change */}
      <div ref={sculptureRef} className="sculpture-float">
        {activeImg === 'center' && <div className="sculpture-ring" />}
        <img src={imgSrc} alt="" className="sculpture-img" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-black/40 backdrop-blur border-b border-white/10 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-white font-bold text-xl">John Dev</span>
          <div className="flex gap-6 text-sm">
            {['About', 'Skills', 'Projects', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="about" className="section-wrap">
        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6">
          <p className="text-indigo-300 text-sm font-medium tracking-widest uppercase mb-3">Hello, I'm</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">John Doe</h1>
          <p className="text-xl md:text-2xl text-indigo-200 mb-6">Full Stack Developer</p>
          <p className="max-w-xl text-gray-300 mb-10">
            I build modern, performant web applications with clean code and great user experiences.
            Passionate about turning ideas into real products.
          </p>
          <div className="flex gap-4 justify-center mt-40">
            <a href="#projects" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">View Projects</a>
            <a href="#contact" className="border border-white/40 hover:border-white text-white px-6 py-3 rounded-lg font-medium transition-colors">Contact Me</a>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section-wrap">
        <div className="relative z-10 min-h-screen flex flex-col justify-end px-6 pb-24">
          <div className="max-w-5xl mx-auto w-full">
            <h2 className="text-3xl font-bold text-white text-center mb-4">Skills</h2>
            <p className="text-center text-gray-400 mb-12">Technologies I work with</p>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map(skill => (
                <span key={skill} className="bg-black/40 border border-white/20 text-gray-200 px-5 py-2 rounded-full text-sm hover:border-indigo-400 hover:text-white transition-colors backdrop-blur-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="section-wrap">
        <div className="relative z-10 min-h-screen flex flex-col justify-end px-6 pb-24">
          <div className="max-w-5xl mx-auto w-full">
            <h2 className="text-3xl font-bold text-white text-center mb-4">Projects</h2>
            <p className="text-center text-gray-400 mb-12">Things I've built</p>
            <div className="grid md:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project.title} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex flex-col hover:border-indigo-400 transition-colors">
                  <h3 className="text-white font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-gray-300 text-sm flex-1 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tech.map(t => (
                      <span key={t} className="bg-indigo-900/60 text-indigo-200 text-xs px-3 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-sm">
                    <a href={project.github} className="text-gray-300 hover:text-white transition-colors">GitHub →</a>
                    <a href={project.live} className="text-indigo-300 hover:text-indigo-200 transition-colors">Live →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="min-h-screen flex flex-col justify-center px-6 bg-gray-950">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-gray-400 mb-10">
            I'm currently open to new opportunities. Whether you have a question or just want to say hi, my inbox is always open.
          </p>
          <a href="mailto:johndoe@email.com" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-block mb-10">
            Say Hello
          </a>
          <div className="flex justify-center gap-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-gray-950 py-6 text-center text-gray-600 text-sm">
        Designed & Built by John Doe
      </footer>

    </div>
  )
}

export default App
