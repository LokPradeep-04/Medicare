const AdminDoctorCard = ({ doctor, onDelete }) => {

  const { _id, userId, specialization, department, experience, fees } = doctor

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4'>

      <div className='flex items-center gap-4 flex-1'>
        <div className='w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0'>
          {userId?.name?.charAt(0)}
        </div>

        <div>
          <p className='font-bold text-gray-900 leading-tight'>Dr. {userId?.name}</p>
          <p className='text-teal-600 text-sm font-medium mt-0.5'>{specialization}</p>
          <div className='flex flex-wrap items-center gap-2 mt-1.5'>
            <span className='text-xs text-gray-400 font-medium'>{department}</span>
            <span className='text-xs text-gray-400 font-medium'>· {experience} yrs exp</span>
            <span className='text-xs text-teal-600 font-bold'>· ₹{fees}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(_id)}
        className='w-full sm:w-auto bg-red-50 text-red-500 hover:bg-red-600 hover:text-white font-bold px-5 py-3 rounded-xl text-xs transition-all border border-red-50 sm:border-transparent'
      >
        Remove Doctor
      </button>

    </div>
  )
}

export default AdminDoctorCard