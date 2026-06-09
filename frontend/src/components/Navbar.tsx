type NavbarProps = { atTop: boolean }

export default function Navbar({ atTop }: NavbarProps) {
  return (
    <nav className={`fixed top-0 w-full border-b z-50 transition-colors duration-300 ${atTop ? 'bg-transparent border-transparent' : 'bg-black/40 backdrop-blur border-white/10'}`}>
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
  )
}
