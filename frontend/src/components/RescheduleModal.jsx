import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const API_BASE_URL = import.meta.env.VITE_API_URL

const RescheduleModal = ({ appointment, token, onClose, onSuccess }) => {
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const doctorId = appointment?.doctorId?._id

  useEffect(() => {
    if (!date || !doctorId) return
    const fetchSlots = async () => {
      setSlotsLoading(true)
      setSelectedSlot('')
      setSlots([])
      try {
        const res = await fetch(`${API_BASE_URL}/doctors/${doctorId}/slots?date=${date}`)
        const data = await res.json()
        if (res.ok) {
          const filtered = appointment.date === date
            ? data.freeSlots.filter(s => s !== appointment.time)
            : data.freeSlots
          setSlots(filtered)
        }
      } catch {
        setError('Failed to load slots.')
      } finally {
        setSlotsLoading(false)
      }
    }
    fetchSlots()
  }, [date, doctorId])

  const handleReschedule = async () => {
    if (!date || !selectedSlot) return setError('Please select a date and time slot.')
    setError('')
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${appointment._id}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date, time: selectedSlot }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        // We will call onSuccess when they close the success screen
      } else {
        setError(data.message)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleFinish = () => {
    onSuccess()
    onClose()
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm'>
      <div className='bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in'>

        {success ? (
          <div className='text-center'>
            <div className='flex items-center justify-center mb-6'>
              <div className='w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center'>
                <svg className='w-10 h-10 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
                </svg>
              </div>
            </div>

            <h2 className='text-2xl font-bold text-gray-900 mb-1'>Rescheduled!</h2>
            <p className='text-gray-500 text-sm mb-8'>Your appointment has been successfully updated.</p>

            <div className='bg-gray-50 rounded-2xl p-5 text-left space-y-4 mb-8'>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <svg className='w-5 h-5 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                  </svg>
                </div>
                <div>
                  <p className='text-xs text-gray-400 uppercase tracking-wide'>Doctor</p>
                  <p className='font-semibold text-gray-900'>{appointment?.doctorId?.userId?.name}</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <svg className='w-5 h-5 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                </div>
                <div>
                  <p className='text-xs text-gray-400 uppercase tracking-wide'>New Date</p>
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
                  <p className='text-xs text-gray-400 uppercase tracking-wide'>New Time</p>
                  <p className='font-semibold text-gray-900'>{selectedSlot}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className='w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors'
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-xl font-bold text-gray-900'>Reschedule Appointment</h2>
                <p className='text-sm text-gray-400 mt-0.5'>
                  Dr. {appointment?.doctorId?.userId?.name}
                </p>
              </div>
              <button
                onClick={onClose}
                className='w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500'
              >
                ✕
              </button>
            </div>

            {/* Current Slot */}
            <div className='bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6 text-sm text-amber-700'>
              <span className='font-semibold'>Current:</span> {appointment?.date} at {appointment?.time}
            </div>

            {/* Date Picker */}
            <div className='mb-5'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>New Date</label>
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
              <div className='mb-5'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Available Slots</label>
                {slotsLoading ? (
                  <p className='text-gray-400 text-sm'>Loading slots...</p>
                ) : slots.length === 0 ? (
                  <div className='bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-3 rounded-xl'>
                    No slots available for this date.
                  </div>
                ) : (() => {
                  const isPast = (slot) => {
                    const slotDateTime = dayjs(`${date} ${slot}`, 'YYYY-MM-DD h:mm A')
                    return slotDateTime.isBefore(dayjs())
                  }
                  const available = slots.filter(s => !isPast(s))
                  if (available.length === 0) {
                    return (
                      <div className='bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-3 rounded-xl'>
                        No slots available for this date.
                      </div>
                    )
                  }
                  return (
                    <div className='grid grid-cols-4 gap-2'>
                      {slots.map((slot) => {
                        const past = isPast(slot)
                        return (
                          <button
                            key={slot}
                            onClick={() => !past && setSelectedSlot(slot)}
                            disabled={past}
                            className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
                              past
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                                : selectedSlot === slot
                                  ? 'bg-teal-600 text-white border-teal-600'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-teal-400 hover:text-teal-600'
                            }`}
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4'>
                {error}
              </div>
            )}

            {/* Actions */}
            <div className='flex gap-3 mt-2'>
              <button
                onClick={onClose}
                className='flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                disabled={saving || !date || !selectedSlot}
                className='flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60'
              >
                {saving ? 'Saving...' : 'Confirm Reschedule'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RescheduleModal
