
import { useState, useRef, useEffect, useContext } from 'react'
import ChatMessage from './ChatMessage'
import { AuthContext } from '../context/AuthContext'

const QUICK_PROMPTS = [
  'Which doctor for chest pain?',
  'Hospital timings?',
  'How to book appointment?',
]

const Chatbot = () => {

  const { token } = useContext(AuthContext)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: 'Hi! 👋 I am your MediCare assistant. Describe your symptoms or ask me anything about the hospital!'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const historyRef = useRef([])

  const API_BASE_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const message = text || input.trim()
    if (!message || loading) return

    setMessages(prev => [...prev, { role: 'user', content: message }])
    setInput('')
    setLoading(true)

    historyRef.current = [
      ...historyRef.current,
      { role: 'user', content: message }
    ]

    try {
      const res = await fetch(`${API_BASE_URL}/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessages(prev => [...prev, { role: 'bot', content: data.reply }])
        historyRef.current = [
          ...historyRef.current,
          { role: 'model', content: data.reply }
        ]
      } else {
        setMessages(prev => [...prev, {
          role: 'bot',
          content: 'Sorry, I am having trouble. Please try again.'
        }])
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Sorry, something went wrong. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      
      <button
        onClick={() => setOpen(!open)}
        className='fixed bottom-6 right-6 z-50 w-14 h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-2xl'
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className='fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden'
          style={{ height: '480px' }}>

          <div className='bg-teal-600 px-4 py-3 flex items-center gap-3'>
            <div className='w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg'>
              🤖
            </div>
            <div>
              <p className='text-white font-semibold text-sm'>MediCare Assistant</p>
              <p className='text-teal-100 text-xs'>AI powered health guide</p>
            </div>
            <div className='ml-auto w-2 h-2 bg-green-400 rounded-full'></div>
          </div>

          <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-3'>
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}

            {loading && (
              <div className='flex justify-start'>
                <div className='bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm'>
                  <div className='flex gap-1'>
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ animationDelay: `${i * 0.15}s` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className='px-4 pb-2 flex flex-wrap gap-1.5'>
              {QUICK_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className='text-xs bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full hover:bg-teal-100 transition-colors'
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className='p-3 border-t border-gray-100 flex gap-2'>
            <input
              className='flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 transition-all'
              placeholder='Ask me anything...'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className='bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-60 transition-colors'
            >
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  )
}

export default Chatbot