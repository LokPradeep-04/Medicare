import { useState, useEffect, useContext, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Chatbot from '../components/Chatbot'
import Loader from '../components/Loader'
import DoctorSummaryCard from '../components/DoctorSummaryCard'
import SlotPicker from '../components/SlotPicker'
import BookingSummary from '../components/BookingSummary'
import { AuthContext } from '../context/AuthContext'
import useSocket from '../hooks/useSocket'

const API_BASE_URL = import.meta.env.VITE_API_URL

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

  const today = new Date().toISOString().split('T')[0]

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
  }, [date, doctorId])

  // Real-time slot updates via Socket.io
  useSocket({
    onSlotBooked: useCallback(({ doctorId: dId, date: d, time: t }) => {
      // Remove slot if it matches current doctor and date view
      if (dId === doctorId && d === date) {
        setSlots(prev => prev.filter(s => s !== t))
        if (selectedSlot === t) setSelectedSlot('')
      }
    }, [doctorId, date, selectedSlot]),
    onSlotCancelled: useCallback(({ doctorId: dId, date: d, time: t }) => {
      // Add the slot back if it matches current view
      if (dId === doctorId && d === date) {
        setSlots(prev => [...prev, t].sort())
      }
    }, [doctorId, date]),
  })

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
      } else {
        setError(data.message)
      }
    } catch {
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
        <div className='min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 flex items-center justify-center px-4'>
          <div className='bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center animate-fade-in'>

            {}
            <div className='flex items-center justify-center mb-6'>
              <div className='w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center'>
                <svg className='w-10 h-10 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
                </svg>
              </div>
            </div>

            <h2 className='text-2xl font-bold text-gray-900 mb-1'>Appointment Confirmed!</h2>
            <p className='text-gray-500 text-sm mb-8'>Your booking has been successfully placed.</p>

            {}
            <div className='bg-gray-50 rounded-2xl p-5 text-left space-y-4 mb-8'>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <svg className='w-5 h-5 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                  </svg>
                </div>
                <div>
                  <p className='text-xs text-gray-400 uppercase tracking-wide'>Doctor</p>
                  <p className='font-semibold text-gray-900'>{doctor?.userId?.name || 'Your Doctor'}</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <svg className='w-5 h-5 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                </div>
                <div>
                  <p className='text-xs text-gray-400 uppercase tracking-wide'>Date</p>
                  <p className='font-semibold text-gray-900'>
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <svg className='w-5 h-5 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
                <div>
                  <p className='text-xs text-gray-400 uppercase tracking-wide'>Time</p>
                  <p className='font-semibold text-gray-900'>{selectedSlot}</p>
                </div>
              </div>
            </div>

            {}
            <button
              onClick={() => navigate('/dashboard')}
              className='w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors'
            >
              Go to Dashboard
            </button>

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

        {doctor && <DoctorSummaryCard doctor={doctor} />}

        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
          <h3 className='font-bold text-gray-900 text-lg mb-6'>
            Select Date & Time
          </h3>

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
                  selectedDate={date}
                />
              )}
            </div>
          )}

          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4'>
              {error}
            </div>
          )}

          {selectedSlot && (
            <BookingSummary
              doctor={doctor}
              date={date}
              selectedSlot={selectedSlot}
            />
          )}

          <button
            onClick={handleBook}
            disabled={booking || !date || !selectedSlot}
            className='w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60'
          >
            {booking ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </div>

      </div>
      <Chatbot />
    </div>
  )
}

export default BookAppointment
