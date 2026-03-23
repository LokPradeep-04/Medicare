import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Chatbot from '../components/Chatbot'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import StatCard from '../components/StatCard'
import AppointmentCard from '../components/AppointmentCard'
import FilterTabs from '../components/FilterTabs'
import { AuthContext } from '../context/AuthContext'

const FILTERS = ['All', 'Booked', 'Completed', 'Cancelled']

const PatientDashboard = () => {

  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  const API_BASE_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/my`, {
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

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) fetchAppointments()
    } catch (err) {
      console.log('Error:', err)
    }
  }

  const upcoming = appointments.filter(a => a.status === 'booked').length
  const completed = appointments.filter(a => a.status === 'completed').length
  const cancelled = appointments.filter(a => a.status === 'cancelled').length

  const filtered = activeFilter === 'All'
    ? appointments
    : appointments.filter(a => a.status === activeFilter.toLowerCase())

  if (loading) return <Loader />

  return (
    <div className='bg-gray-50 min-h-screen'>
      <Navbar />

      <div className='max-w-5xl mx-auto px-4 py-10'>

        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Welcome, {user?.name} 👋
            </h1>
            <p className='text-gray-500 text-sm mt-1'>
              Manage your appointments
            </p>
          </div>
          <button
            onClick={() => navigate('/doctors')}
            className='bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors'
          >
            + Book Appointment
          </button>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
          <StatCard
            icon='📅'
            label='Upcoming'
            value={upcoming}
            color='bg-teal-50'
          />
          <StatCard
            icon='✅'
            label='Completed'
            value={completed}
            color='bg-green-50'
          />
          <StatCard
            icon='❌'
            label='Cancelled'
            value={cancelled}
            color='bg-red-50'
          />
        </div>

        {/* Filter Tabs */}
        <div className='mb-5'>
          <FilterTabs
            filters={FILTERS}
            activeFilter={activeFilter}
            onSelect={setActiveFilter}
          />
        </div>

        {/* Appointments */}
        {filtered.length === 0 ? (
          <div className='text-center py-20 bg-white rounded-2xl border border-gray-100'>
            <p className='text-4xl mb-3'>📋</p>
            <p className='text-gray-500 font-medium'>No appointments found</p>
            <button
              onClick={() => navigate('/doctors')}
              className='mt-4 bg-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors'
            >
              Book Your First Appointment
            </button>
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            {filtered.map(appointment => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}

      </div>
      <Chatbot />

    </div>
  )
}

export default PatientDashboard