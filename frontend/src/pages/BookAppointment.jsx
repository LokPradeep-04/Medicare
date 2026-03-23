import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Chatbot from '../components/Chatbot'
import Loader from '../components/Loader'
import DoctorSummaryCard from '../components/DoctorSummaryCard'
import SlotPicker from '../components/SlotPicker'
import BookingSummary from '../components/BookingSummary'
import { AuthContext } from '../context/AuthContext'

const BookAppointment = () => {

  const { doctorId } = useParams()
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)

  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const API_BASE_URL = import.meta.env.VITE_API_URL
  const today = new Date().toISOString().split('T')[0]

  // Fetch doctor
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/doctors/${doctorId}`)
        const data = await res.json()
        if (res.ok) setDoctor(data.doctor)
      } catch (err) {
        console.log('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDoctor()
  }, [doctorId])

  // Fetch slots when date changes
  useEffect(() => {
    if (!date) return
    const fetchSlots = async () => {
      setSlotsLoading(true)
      setSelectedSlot('')
      setSlots([])
      try {
        const res = await fetch(`${API_BASE_URL}/doctors/${doctorId}/slots?date=${date}`)
        const data = await res.json()
        if (res.ok) setSlots(data.freeSlots)
      } catch (err) {
        console.log('Error:', err)
      } finally {
        setSlotsLoading(false)
      }
    }
    fetchSlots()
  }, [date])

  const handleBook = async () => {
    if (!date) return setError('Please select a date')
    if (!selectedSlot) return setError('Please select a time slot')
    setError('')
    setBooking(true)
    try {
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ doctorId, date, time: selectedSlot }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => navigate('/dashboard'), 2000)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <Loader />

  if (success) {
    return (
      <div>
        <Navbar />
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
          <div className='text-center'>
            <div className='text-6xl mb-4'>✅</div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Appointment Booked!
            </h2>
            <p className='text-gray-500'>
              Check your email for confirmation. Redirecting...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <Navbar />
      <div className='max-w-2xl mx-auto px-4 py-10'>

        <h1 className='text-2xl font-bold text-gray-900 mb-6'>
          Book Appointment
        </h1>

        {/* Doctor Summary */}
        {doctor && <DoctorSummaryCard doctor={doctor} />}

        {/* Booking Form */}
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
          <h3 className='font-bold text-gray-900 text-lg mb-6'>
            Select Date & Time
          </h3>

          {/* Date Picker */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Select Date
            </label>
            <input
              type='date'
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 transition-all'
            />
          </div>

          {/* Slot Picker */}
          {date && (
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Available Slots
              </label>
              {slotsLoading ? (
                <p className='text-gray-400 text-sm'>Loading slots...</p>
              ) : (
                <SlotPicker
                  slots={slots}
                  selectedSlot={selectedSlot}
                  onSelect={setSelectedSlot}
                />
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4'>
              {error}
            </div>
          )}

          {/* Booking Summary */}
          {selectedSlot && (
            <BookingSummary
              doctor={doctor}
              date={date}
              selectedSlot={selectedSlot}
            />
          )}

          {/* Confirm Button */}
          <button
            onClick={handleBook}
            disabled={booking || !date || !selectedSlot}
            className='w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60'
          >
            {booking ? 'Booking...' : 'Confirm Appointment'}
          </button>
          <p className='text-center text-xs text-gray-400 mt-3'>
            Redirecting to your dashboard...
          </p>
        </div>

      </div>
      <Chatbot />
    </div>
  )
}

export default BookAppointment
