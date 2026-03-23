const AdminDoctorCard = ({ doctor, onDelete }) => {

  const { _id, userId, specialization, department, experience, fees } = doctor

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4'>

      {/* Avatar */}
      <div className='w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0'>
        {userId?.name?.charAt(0)}
      </div>

      {/* Info */}
      <div className='flex-1'>
        <p className='font-semibold text-gray-900'>Dr. {userId?.name}</p>
        <p className='text-teal-600 text-sm'>{specialization}</p>
        <div className='flex gap-2 mt-1'>
          <span className='text-xs text-gray-400'>{department}</span>
          <span className='text-xs text-gray-400'>· {experience} yrs</span>
          <span className='text-xs text-gray-400'>· ₹{fees}</span>
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(_id)}
        className='text-xs bg-red-50 text-red-500 hover:bg-red-100 font-medium px-3 py-1.5 rounded-xl transition-colors'
      >
        Delete
      </button>

    </div>
  )
}

export default AdminDoctorCard