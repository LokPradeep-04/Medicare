const statusStyles = {
  booked: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}

const AppointmentCard = ({ appointment, onCancel, onReschedule }) => {

  const { _id, doctorId, date, time, status } = appointment

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4'>

      <div className='w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0'>
        {doctorId?.userId?.name?.charAt(0)}
      </div>

      <div className='flex-1'>
        <p className='font-semibold text-gray-900'>
          Dr. {doctorId?.userId?.name}
        </p>
        <p className='text-sm text-gray-500 mt-0.5'>
          {doctorId?.specialization} · {doctorId?.department}
        </p>
        <div className='flex items-center gap-3 mt-1'>
          <span className='text-xs text-gray-400'>📅 {date}</span>
          <span className='text-xs text-gray-400'>⏰ {time}</span>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        {status === 'booked' && (
          <>
            <button
              onClick={() => onReschedule?.(appointment)}
              className='text-xs bg-teal-50 text-teal-600 hover:bg-teal-100 font-medium px-3 py-1 rounded-full transition-colors'
            >
              Reschedule
            </button>
            <button
              onClick={() => onCancel(_id)}
              className='text-xs bg-red-50 text-red-500 hover:bg-red-100 font-medium px-3 py-1 rounded-full transition-colors'
            >
              Cancel
            </button>
          </>
        )}
      </div>

    </div>
  )
}

export default AppointmentCard
