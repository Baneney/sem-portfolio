import { useState } from 'react'

const categories = [
  {
    name: 'Frontend',
    skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind', 'Bootstrap', 'Electron'],
  },
  {
    name: 'Animation & 3D',
    skills: ['Framer Motion', 'Three.js', 'GSAP', 'CSS Animations', 'WebGL'],
  },
  {
    name: 'Backend',
    skills: ['Node.js', 'Python', 'Express', 'REST APIs', 'GraphQL', 'Django'],
  },
  {
    name: 'Databases',
    skills: ['PostgreSQL', 'MongoDB', 'Firebase', 'Redis', 'Supabase'],
  },
  {
    name: 'DevOps & Tools',
    skills: ['Git', 'Docker', 'AWS', 'Linux', 'CI/CD', 'Figma'],
  },
]

export default function Skills() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      id="skills"
      className="free-page flex items-center px-10 overflow-hidden bg-[#423422]"
    >
      <div className="flex w-full h-full">
        {/* Left side — bio */}
        <div className="w-1/2 flex flex-col justify-center pr-16">
          <p className="text-[#e5d4a1] text-sm font-medium tracking-widest uppercase mb-6">
            Skills
          </p>
          <h2 className="text-[2.8rem] font-black text-white leading-[1.1] uppercase tracking-tight mb-12">
            Full Stack Developer crafting digital experiences with precision and
            fire.
          </h2>
          <a
            href="#contact"
            className="text-[#e5d4a1] text-xs font-semibold tracking-[0.3em] uppercase hover:text-[#ffd86a] transition-colors"
          >
            Contact Me ✦
          </a>
        </div>

        {/* Right side — accordion */}
        <div className="w-1/2 flex flex-col justify-center">
          {categories.map((cat, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={cat.name} className="border-b border-white/10">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <span className="text-[2rem] font-bold text-white group-hover:text-[#ffd86a] transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-white/50 text-2xl font-light w-8 text-right">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: isOpen ? "300px" : "0" }}
                >
                  <ul className="pb-6 pl-2 space-y-2">
                    {cat.skills.map((skill) => (
                      <li key={skill} className="text-white/60 text-base">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
