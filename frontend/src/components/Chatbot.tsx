import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'

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
      {/* Toggle button — futuristic Mockingjay beacon */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-[100] w-14 h-14 rounded-full cursor-pointer group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing outer ring */}
        <span className="absolute inset-0 rounded-full border border-[#ffd86a]/20 animate-[ping_3s_ease-in-out_infinite]" />
        {/* Glow halo */}
        <span className="absolute -inset-2 rounded-full bg-[radial-gradient(circle,rgba(255,140,0,0.2),transparent_70%)] group-hover:bg-[radial-gradient(circle,rgba(255,140,0,0.35),transparent_70%)] transition-all duration-500" />
        {/* Core button */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffd86a] via-[#e89000] to-[#c85000] shadow-[0_0_30px_rgba(255,140,0,0.5)] group-hover:shadow-[0_0_40px_rgba(255,140,0,0.7)] transition-shadow duration-500" />
        {/* Inner ring */}
        <span className="absolute inset-[3px] rounded-full border border-white/20" />
        {/* Icon */}
        <span className="absolute inset-0 flex items-center justify-center">
          {open
            ? <X size={18} className="text-[#080400]" />
            : <MessageCircle size={18} className="text-[#080400]" />
          }
        </span>
        {/* Corner accent dots */}
        <span className="absolute top-0 right-0 w-1 h-1 rounded-full bg-[#ffd86a] opacity-60" />
        <span className="absolute bottom-0 left-0 w-1 h-1 rounded-full bg-[#ffd86a] opacity-60" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-22 right-5 z-[100] w-[360px] max-w-[calc(100vw-40px)] h-[480px] max-h-[72vh] rounded-2xl flex flex-col overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(12,7,0,0.97) 0%, rgba(8,4,0,0.99) 100%)',
              boxShadow: '0 0 60px rgba(200,80,0,0.12), 0 0 1px rgba(255,216,106,0.3), inset 0 1px 0 rgba(255,216,106,0.06)',
              border: '1px solid rgba(255,216,106,0.1)',
            }}
          >
            {/* Animated border glow — top edge */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd86a]/40 to-transparent" />
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#ffd86a]/20 rounded-tl-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#ffd86a]/20 rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#ffd86a]/10 rounded-bl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#ffd86a]/10 rounded-br-2xl pointer-events-none" />

            {/* Header */}
            <div className="relative px-5 py-4 border-b border-[#ffd86a]/10">
              {/* Header background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#ffd86a]/[0.03] via-transparent to-[#c85000]/[0.03]" />
              <div className="relative flex items-center gap-3">
                {/* Avatar with status */}
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ffd86a] to-[#c85000] flex items-center justify-center shadow-[0_0_12px_rgba(255,140,0,0.3)]">
                    <MessageCircle size={15} className="text-[#080400]" />
                  </div>
                  {/* Online indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0c0700] shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white/90 tracking-wide">Portfolio Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[10px] text-emerald-400/70 tracking-widest uppercase">Online</p>
                  </div>
                </div>
                {/* Decorative tech lines */}
                <div className="flex flex-col gap-1 opacity-30">
                  <div className="w-6 h-[1px] bg-[#ffd86a]/40" />
                  <div className="w-4 h-[1px] bg-[#ffd86a]/25" />
                  <div className="w-5 h-[1px] bg-[#ffd86a]/30" />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ffd86a]/20 to-[#c85000]/20 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 border border-[#ffd86a]/10">
                      <MessageCircle size={10} className="text-[#ffd86a]/60" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
                      m.role === 'user'
                        ? 'text-[#e5d4a1] rounded-2xl rounded-br-md'
                        : 'text-white/70 rounded-2xl rounded-bl-md'
                    }`}
                    style={m.role === 'user'
                      ? { background: 'linear-gradient(135deg, rgba(255,216,106,0.12), rgba(200,80,0,0.08))', border: '1px solid rgba(255,216,106,0.1)' }
                      : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }
                    }
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ffd86a]/20 to-[#c85000]/20 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 border border-[#ffd86a]/10">
                    <MessageCircle size={10} className="text-[#ffd86a]/60" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.03] border border-white/[0.04]">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffd86a]/40 animate-[bounce_1.2s_ease-in-out_infinite]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffd86a]/40 animate-[bounce_1.2s_ease-in-out_infinite_0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffd86a]/40 animate-[bounce_1.2s_ease-in-out_infinite_0.4s]" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="relative px-4 py-3 border-t border-[#ffd86a]/10">
              <div className="absolute inset-0 bg-gradient-to-t from-[#ffd86a]/[0.02] to-transparent" />
              <form
                onSubmit={e => { e.preventDefault(); send() }}
                className="relative flex items-center gap-2"
              >
                <div className="flex-1 relative">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask anything..."
                    disabled={loading}
                    className="w-full bg-white/[0.03] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[#ffd86a]/20 transition-all duration-300 disabled:opacity-50"
                    style={{ border: '1px solid rgba(255,255,255,0.05)' }}
                  />
                  {/* Input glow on focus */}
                  <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-300" style={{ boxShadow: '0 0 15px rgba(255,216,106,0.05)' }} />
                </div>
                <motion.button
                  type="submit"
                  disabled={loading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                  style={{
                    background: input.trim() ? 'linear-gradient(135deg, rgba(255,216,106,0.15), rgba(200,80,0,0.1))' : 'rgba(255,255,255,0.03)',
                    border: input.trim() ? '1px solid rgba(255,216,106,0.2)' : '1px solid rgba(255,255,255,0.05)',
                    boxShadow: input.trim() ? '0 0 12px rgba(255,140,0,0.1)' : 'none',
                  }}
                >
                  <Send size={14} className="text-[#ffd86a]" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
