import { useState } from 'react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DEFAULT_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30']

const AddDoctorForm = ({ onAdd, onClose, token }) => {

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '',
    age: '', gender: '', specialization: '',
    department: '', experience: '', fees: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_BASE_URL = import.meta.env.VITE_API_URL

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const availableSlots = DAYS.map(day => ({
        day,
        slots: DEFAULT_SLOTS
      }))

      const res = await fetch(`${API_BASE_URL}/doctors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, availableSlots }),
      })
      const data = await res.json()
      if (res.ok) {
        onAdd()
        onClose()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4'>
      <div className='bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto'>

        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-lg font-bold text-gray-900'>Add New Doctor</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 text-xl font-bold'
          >
            ✕
          </button>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Full Name</label>
              <input name='name' value={formData.name} onChange={handleChange} required
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500'
                placeholder='Dr. John Smith' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Email</label>
              <input name='email' type='email' value={formData.email} onChange={handleChange} required
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500'
                placeholder='doctor@medicare.com' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Password</label>
              <input name='password' type='password' value={formData.password} onChange={handleChange} required
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500'
                placeholder='Min 6 characters' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Phone</label>
              <input name='phone' value={formData.phone} onChange={handleChange} required
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500'
                placeholder='9876543210' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Age</label>
              <input name='age' type='number' value={formData.age} onChange={handleChange} required
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500'
                placeholder='35' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Gender</label>
              <select name='gender' value={formData.gender} onChange={handleChange} required
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500'>
                <option value=''>Select</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Specialization</label>
              <input name='specialization' value={formData.specialization} onChange={handleChange} required
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500'
                placeholder='Cardiologist' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Department</label>
              <select name='department' value={formData.department} onChange={handleChange} required
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500'>
                <option value=''>Select</option>
                {['Cardiology','Neurology','Orthopedics','Pediatrics','General Medicine','Dental','Ophthalmology','Dermatology','ENT','Gynecology'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Experience (years)</label>
              <input name='experience' type='number' value={formData.experience} onChange={handleChange} required
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500'
                placeholder='5' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Fees (₹)</label>
              <input name='fees' type='number' value={formData.fees} onChange={handleChange} required
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500'
                placeholder='500' />
            </div>
          </div>

          <div className='flex gap-3 pt-2'>
            <button type='button' onClick={onClose}
              className='flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors'>
              Cancel
            </button>
            <button type='submit' disabled={loading}
              className='flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors disabled:opacity-60'>
              {loading ? 'Adding...' : 'Add Doctor'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default AddDoctorForm