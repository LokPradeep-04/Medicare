import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Hero = () => {
  const { user } = useAuth()
  return (
    <div className='bg-gradient-to-br from-[#0a1628] to-[#0f766e] py-24 px-4'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-5xl font-bold text-white mb-6 leading-tight'>
          Quality Healthcare, <br />
          <span className='text-teal-400'>Simplified</span>
        </h1>
        <p className='text-gray-300 text-lg mb-8 max-w-xl'>
          Book appointments with our expert doctors in minutes.Get instant confirmation and real-time slot availability.
        </p>
        <div className='flex gap-4'>
          <Link to='/doctors' className='bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors'>
            Book Appointment →
          </Link>
          {!user && (
            <Link to='/register' className='bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg border border-white/20 transition-colors'>
              Create Account
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Hero