import { useNavigate } from 'react-router-dom'

const DoctorCard = ({ doctor }) => {

  const navigate = useNavigate()
  const { _id, userId, specialization, department, experience, fees } = doctor

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all'>

      <div className='flex items-center gap-4 mb-4'>
        <div className='w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0'>
          {userId?.name?.charAt(0)}
        </div>
        <div>
          <h3 className='font-bold text-gray-900'>Dr. {userId?.name}</h3>
          <p className='text-teal-600 text-sm font-medium'>{specialization}</p>
        </div>
      </div>

      <div className='flex flex-wrap gap-2 mb-4'>
        <span className='bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full'>
          {department}
        </span>
        <span className='bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full'>
          {experience} yrs experience
        </span>
        <span className='bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full'>
          ₹{fees}
        </span>
      </div>

      <div className='flex gap-2'>
        <button
          onClick={() => navigate(`/doctors/${_id}`)}
          className='flex-1 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors'
        >
          View Profile
        </button>
        <button
          onClick={() => navigate(`/book/${_id}`)}
          className='flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors'
        >
          Book Now
        </button>
      </div>

    </div>
  )
}

export default DoctorCard