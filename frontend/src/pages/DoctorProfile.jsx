import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'

const DoctorProfile = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/doctors/${id}`)
        const data = await res.json()
        if (res.ok) {
          setDoctor(data.doctor)
        }
      } catch (error) {
        console.log('Error fetching doctor:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDoctor()
  }, [id])

  if (loading) return <Loader />

  if (!doctor) return (
    <div>
      <Navbar />
      <div className='text-center py-32'>
        <p className='text-gray-500'>Doctor not found</p>
      </div>
    </div>
  )

  return (
    <div>
      <Navbar />

      <div className='max-w-4xl mx-auto px-4 py-10'>

        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6'>
          <div className='flex flex-col sm:flex-row gap-6 items-start'>

            <div className='w-24 h-24 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-bold text-4xl flex-shrink-0'>
              {doctor.userId?.name?.charAt(0)}
            </div>

            <div className='flex-1'>
              <h1 className='text-2xl font-bold text-gray-900'>
                Dr. {doctor.userId?.name}
              </h1>
              <p className='text-teal-600 font-medium text-lg mt-1'>
                {doctor.specialization}
              </p>

              <div className='flex flex-wrap gap-2 mt-4'>
                <span className='bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full'>
                  🏥 {doctor.department}
                </span>
                <span className='bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full'>
                  🏅 {doctor.experience} yrs experience
                </span>
                <span className='bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full'>
                  💰 ₹{doctor.fees} per visit
                </span>
                <span className='bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full'>
                  ✉️ {doctor.userId?.email}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/book/${doctor._id}`)}
              className='bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors flex-shrink-0'
            >
              Book Appointment
            </button>

          </div>
        </div>

        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-8'>
          <h2 className='text-lg font-bold text-gray-900 mb-6'>
            Weekly Availability
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
            {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => {
              const dayData = doctor.availableSlots?.find(s => s.day === day)
              return (
                <div
                  key={day}
                  className={`rounded-xl p-4 border ${
                    dayData
                      ? 'bg-teal-50 border-teal-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <p className={`text-sm font-semibold ${
                    dayData ? 'text-teal-700' : 'text-gray-400'
                  }`}>
                    {day}
                  </p>
                  <p className={`text-xs mt-1 ${
                    dayData ? 'text-teal-600' : 'text-gray-400'
                  }`}>
                    {dayData ? `${dayData.slots.length} slots` : 'Not available'}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

      </div>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default DoctorProfile
