import { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import StatCard from '../components/StatCard'
import QueueCard from '../components/QueueCard'
import { AuthContext } from '../context/AuthContext'

const DoctorDashboard = () => {

  const { user, token } = useContext(AuthContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/doctor`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) setAppointments(data.appointments)
    } catch (err) {
      console.log('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (id) => {
    if (!confirm('Mark this appointment as completed?')) return
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}/complete`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) fetchAppointments()
    } catch (err) {
      console.log('Error:', err)
    }
  }

  // Stats
  const total = appointments.length
  const remaining = appointments.filter(a => a.status === 'booked').length
  const completed = appointments.filter(a => a.status === 'completed').length

  // Only show booked in queue
  const queue = appointments.filter(a => a.status === 'booked')

  if (loading) return <Loader />

  return (
    <div className='bg-gray-50 min-h-screen'>
      <Navbar />
      <div className='max-w-4xl mx-auto px-4 py-10'>

        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900'>
            Welcome, Dr. {user?.name} 🩺
          </h1>
          <p className='text-gray-500 text-sm mt-1'>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
          <StatCard
            icon='👥'
            label="Today's Patients"
            value={total}
            color='bg-teal-50'
          />
          <StatCard
            icon='⏳'
            label='Remaining'
            value={remaining}
            color='bg-yellow-50'
          />
          <StatCard
            icon='✅'
            label='Completed'
            value={completed}
            color='bg-green-50'
          />
        </div>

        {/* Queue */}
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
          <h2 className='text-lg font-bold text-gray-900 mb-5'>
            Today's Queue
          </h2>

          {queue.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-4xl mb-3'>🎉</p>
              <p className='text-gray-500 font-medium'>
                No more appointments today!
              </p>
            </div>
          ) : (
            <div className='flex flex-col gap-3'>
              {queue.map(appointment => (
                <QueueCard
                  key={appointment._id}
                  appointment={appointment}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default DoctorDashboard
