import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

const Register = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const API_BASE_URL = import.meta.env.VITE_API_URL

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Registration successful! Welcome to Medicare.')
        login(data.token, { role: 'patient', email: formData.email })
        navigate('/dashboard')
      } else {
        setError(data.message)
        toast.error(data.message || 'Registration failed')
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
      <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10'>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md'>

          <div className='text-center mb-8'>
            <h1 className='text-2xl font-bold text-gray-900'>Create Account</h1>
          </div>

          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                Full Name
              </label>
              <input
                type='text'
                name='name'
                placeholder='Enter your full name'
                value={formData.name}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                Email Address
              </label>
              <input
                type='email'
                name='email'
                placeholder='you@example.com'
                value={formData.email}
                onChange={handleChange}
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
                name='password'
                placeholder='password'
                value={formData.password}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                Phone Number
              </label>
              <input
                type='text'
                name='phone'
                placeholder='phone number'
                value={formData.phone}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                  Age
                </label>
                <input
                  type='number'
                  name='age'
                  placeholder='25'
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                  Gender
                </label>
                <select
                  name='gender'
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all'
                >
                  <option value=''>Select</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='other'>Other</option>
                </select>
              </div>
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 mt-2'
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className='text-center text-sm text-gray-500 mt-6'>
            Already have an account?{' '}
            <Link to='/login' className='text-teal-600 font-medium hover:underline'>
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Register
