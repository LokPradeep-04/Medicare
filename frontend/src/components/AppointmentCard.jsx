const statusStyles = {
  booked: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}

const AppointmentCard = ({ appointment, onCancel, onReschedule }) => {

  const { _id, doctorId, date, time, status } = appointment

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4'>

      <div className='flex items-center gap-4 flex-1'>
        <div className='w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0'>
          {doctorId?.userId?.name?.charAt(0)}
        </div>

        <div>
          <p className='font-semibold text-gray-900'>
            Dr. {doctorId?.userId?.name}
          </p>
          <p className='text-sm text-gray-500 mt-0.5 leading-tight'>
            {doctorId?.specialization} · {doctorId?.department}
          </p>
          <div className='flex flex-wrap items-center gap-3 mt-1.5'>
            <span className='text-xs text-gray-400 font-medium'>📅 {date}</span>
            <span className='text-xs text-gray-400 font-medium'>⏰ {time}</span>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50'>
        <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg ${statusStyles[status]}`}>
          {status}
        </span>
        
        {status === 'booked' && (
          <div className='flex items-center gap-2'>
            <button
              onClick={() => onReschedule?.(appointment)}
              className='text-xs bg-teal-50 text-teal-600 hover:bg-teal-100 font-bold px-4 py-2 rounded-xl transition-colors'
            >
              Reschedule
            </button>
            <button
              onClick={() => onCancel(_id)}
              className='text-xs bg-red-50 text-red-500 hover:bg-red-100 font-bold px-4 py-2 rounded-xl transition-colors'
            >
              Cancel
            </button>
          </div>
        )}
      </div>

    </div>
  )
}

export default AppointmentCard
