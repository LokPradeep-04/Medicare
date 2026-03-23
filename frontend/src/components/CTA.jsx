import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CTA = () => {
  const { user } = useAuth()
  return (
    <div className='bg-teal-600 py-16 px-4'>
      <div className='max-w-3xl mx-auto text-center'>
        <h2 className='text-3xl font-bold text-white mb-4'>
          Ready to Book Your Appointment?
        </h2>
        <p className='text-teal-100 mb-8'>
          Join thousands of patients who trust MediCare for their healthcare needs.
        </p>
        <div className='flex gap-4 justify-center'>
          <Link to='/doctors' className='bg-white text-teal-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors'>
            Find a Doctor
          </Link>
          {!user && (
            <Link to='/register' className='border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors'>
              Register Free
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default CTA