import { useNavigate } from 'react-router-dom'

const departments = [
  { icon: '❤️', name: 'Cardiology', desc: 'Heart & cardiovascular care' },
  { icon: '🧠', name: 'Neurology', desc: 'Brain & nervous system' },
  { icon: '🦴', name: 'Orthopedics', desc: 'Bones, joints & muscles' },
  { icon: '👶', name: 'Pediatrics', desc: "Children's healthcare" },
  { icon: '💊', name: 'General Medicine', desc: 'Primary care & wellness' },
  { icon: '🦷', name: 'Dental', desc: 'Dental & oral health' },
  { icon: '👁️', name: 'Ophthalmology', desc: 'Eye care & vision' },
  { icon: '🩺', name: 'Dermatology', desc: 'Skin care & treatment' },
]

const Departments = () => {

  const navigate = useNavigate()

  return (
    <div className='bg-gray-50 py-16 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900'>Our Departments</h2>
          <p className='text-gray-500 mt-2'>Expert care across all major medical specialties</p>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {departments.map((dept, index) => (
            <div
              key={index}
              onClick={() => navigate(`/doctors?department=${dept.name}`)}
              className='bg-white rounded-2xl p-6 text-center cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100'
            >
              <div className='text-4xl mb-4'>{dept.icon}</div>
              <p className='font-semibold text-gray-900'>{dept.name}</p>
              <p className='text-gray-400 text-sm mt-1'>{dept.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Departments