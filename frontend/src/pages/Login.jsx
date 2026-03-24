import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const API_BASE_URL = import.meta.env.VITE_API_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Login successful!")
        login(data.token, { role: data.role, email })
        if (data.role === 'admin') navigate('/admin')
        else if (data.role === 'doctor') navigate('/doctor')
        else navigate('/dashboard')
      } else {
        setError(data.message)
        toast.error(data.message || 'Login failed')
      }
    } catch {
      setError('Something went wrong. Please try again.')
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md'>

          <div className='text-center mb-8'>
            <h1 className='text-2xl font-bold text-gray-900'>Welcome Back</h1>
            <p className='text-gray-500 text-sm mt-1'>Sign in to your account</p>
          </div>

          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                Email Address
              </label>
              <input
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                Password
              </label>
              <input
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all'
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60'
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className='text-center text-sm text-gray-500 mt-6'>
            Don't have an account?{' '}
            <Link to='/register' className='text-teal-600 font-medium hover:underline'>
              Register here
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login
