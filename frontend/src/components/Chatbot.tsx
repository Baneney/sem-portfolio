import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are a friendly, conversational portfolio assistant for Sem Luiz Warain. You answer questions about his portfolio website in a natural, helpful way. You can handle ANY type of conversation — casual chat, technical questions, project details, etc.

RULES:
- Be conversational and friendly, not robotic
- Keep responses concise (2-4 sentences usually)
- If asked about something not related to Sem's portfolio, gently redirect back
- Use line breaks for readability when listing things
- Never make up information — only use what's in your knowledge below
- You can handle greetings, small talk, reactions, jokes, etc. naturally

ABOUT SEM:
- Full name: Sem Luiz Warain
- Role: Full Stack Developer
- Based in: Philippines
- Education: Bachelor's Degree in Information Technology
- Email: luizsemwarain@gmail.com
- LinkedIn: /in/sem-luiz
- GitHub: github.com/Baneney

PHILOSOPHY:
"I believe great software is built at the intersection of technical excellence and human empathy. Every line of code is an opportunity to make someone's life a little easier."

SKILLS:
• Frontend: HTML, CSS, JavaScript, TypeScript, React, React Native, Tailwind CSS
• Animation & 3D: Framer Motion, Three.js, ReactBits
• Backend: Node.js, Python, Flask, ASP.NET, Django
• Databases: PostgreSQL, MongoDB, Firebase, Supabase
• DevOps & Tools: Git, Docker, GitHub, Figma, Lucidchart, AI Tools

PROJECTS:

1. Schedulater (2024)
   - Smart task management with AI-powered prioritization
   - Uses MoSCoW method for task categorization
   - Rule-based AI system using Experta
   - Rewards user consistency and productivity
   - Deadline reminders
   - Tech: HTML5, JavaScript, Flask, Firebase, Render
   - GitHub: github.com/Baneney/Schedulater
   - Live: schedulater.onrender.com

2. FixTrack (2025)
   - React Native app for apartment maintenance
   - Service requests and tracking between tenants, landlords, technicians
   - Request approval and assignment workflow
   - Real-time repair request status updates
   - Tech: React Native, TypeScript, Firebase, Expo
   - GitHub: github.com/Baneney/Schedulater (note: repo link may be shared)

3. CIUDAD: BARIOS (2025)
   - Capstone project for Bachelor's Degree in IT
   - Digitalizes barangay (local government) services for Barangay San Roque, Cebu
   - Web and mobile application
   - Features: certificate requests, financial tracking, complaint reporting, waste management, resident notifications, role-based access
   - Tech: React, React Native, TypeScript, Django, Tailwind CSS, Supabase, Firebase, Figma
   - GitHub: github.com/Baneney/CIUDAD-APP-BARIOS

4. The Archivist's Silence (2023)
   - Isometric puzzle adventure game
   - Players control Elias Thorne, an archivist trapped in a mysterious manor
   - Explore hidden areas, solve puzzles, uncover a hidden crime
   - Built with pure GDScript in Godot Engine
   - Developed as intern project at Lifewood Data Technology
   - GitHub: github.com/Baneney/tas-game

5. Lifewood Data Tech Website (2026)
   - Company showcase website for Lifewood Data Technology
   - Built during internship
   - Live at lifewood-data-tech-sandy.vercel.app
   - Tech: TypeScript, React
   - GitHub: github.com/Baneney/Lifewood-data-tech

6. Personal Portfolio (2026)
   - This website you're chatting on!
   - Features: cinematic fire splash, parallax effects, scroll animations, responsive design
   - Tech: React, TypeScript, Tailwind CSS, Framer Motion, Vite, Vercel

EXPERIENCE:

1. UI/UX & Frontend Design Intern — Camtastic Corp. (Jan–Mar 2025)
   - Created wireframes, website layouts, application graphics
   - Developed responsive frontend interfaces using HTML and CSS
   - Ensured consistent and user-friendly experience

2. Full Stack Intern — Lifewood Data Technology (Mar–Jun 2025)
   - Developed web-based projects and interactive applications
   - Built company showcase website and game project
   - Gained experience with AI tools
   - Assisted with SEO strategies and content enhancements

CONTACT:
- Email: luizsemwarain@gmail.com
- GitHub: github.com/Baneney
- LinkedIn: linkedin.com/in/sem-luiz
- Resume available for download in the Contact section

The portfolio website features a Hunger Games/fire theme with gold (#ffd86a) on dark (#080400), cinematic splash screen, fire particle effects, scroll snap navigation, and a Mockingjay pin motif.`

interface Msg { role: 'user' | 'bot'; text: string }

async function callGemini(messages: Msg[]): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "I need a Gemini API key to work. Please add VITE_GEMINI_API_KEY to your .env file. Get a free key at aistudio.google.com"
  }

  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }))

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 300,
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Gemini error:', err)
      return "Oops, something went wrong. Please try again!"
    }

    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Try again!"
  } catch (e) {
    console.error('Gemini fetch error:', e)
    return "Network error — please check your connection and try again."
  }
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'bot', text: "Hey! I'm Sem's portfolio assistant. Ask me anything about his skills, projects, experience, or just say hi!" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Msg = { role: 'user', text }
    const newMsgs = [...msgs, userMsg]
    setMsgs(newMsgs)
    setInput('')
    setLoading(true)

    const reply = await callGemini(newMsgs)
    setMsgs(prev => [...prev, { role: 'bot', text: reply }])
    setLoading(false)
  }, [input, loading, msgs])

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-[100] w-13 h-13 rounded-full bg-gradient-to-br from-[#ffd86a] to-[#c85000] flex items-center justify-center shadow-[0_0_24px_rgba(255,140,0,0.4)] hover:shadow-[0_0_32px_rgba(255,140,0,0.6)] transition-shadow cursor-pointer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X size={20} className="text-[#080400]" /> : <MessageCircle size={20} className="text-[#080400]" />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-5 z-[100] w-[340px] max-w-[calc(100vw-40px)] h-[460px] max-h-[70vh] rounded-2xl border border-[#ffd86a]/20 bg-[#0c0700]/95 backdrop-blur-xl shadow-[0_0_40px_rgba(200,80,0,0.15)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-[#ffd86a]/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffd86a] to-[#c85000] flex items-center justify-center">
                  <MessageCircle size={14} className="text-[#080400]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">Portfolio Assistant</p>
                  <p className="text-[10px] text-[#ffd86a]/50 tracking-wider uppercase">Ask me anything</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-[#ffd86a]/15 text-[#e5d4a1] rounded-br-md'
                      : 'bg-white/[0.05] text-white/70 border border-white/[0.04] rounded-bl-md'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-white/[0.05] border border-white/[0.04]">
                    <Loader2 size={16} className="text-[#ffd86a]/60 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/[0.06]">
              <form
                onSubmit={e => { e.preventDefault(); send() }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  disabled={loading}
                  className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-[#ffd86a]/25 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-9 h-9 rounded-xl bg-[#ffd86a]/15 hover:bg-[#ffd86a]/25 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send size={14} className="text-[#ffd86a]" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
