const statusStyles = {
  booked: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}

const AdminAppointmentCard = ({ appointment, onCancel }) => {

  const { _id, patientId, doctorId, date, time, status } = appointment

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4'>

      <div className='flex-1'>
        <p className='font-semibold text-gray-900'>
          {patientId?.name}
        </p>
        <p className='text-sm text-gray-500'>
          Dr. {doctorId?.userId?.name} · {doctorId?.specialization}
        </p>
        <div className='flex gap-3 mt-1'>
          <span className='text-xs text-gray-400'>📅 {date}</span>
          <span className='text-xs text-gray-400'>⏰ {time}</span>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        {status === 'booked' && (
          <button
            onClick={() => onCancel(_id)}
            className='text-xs bg-red-50 text-red-500 hover:bg-red-100 font-medium px-3 py-1 rounded-full transition-colors'
          >
            Cancel
          </button>
        )}
      </div>

    </div>
  )
}

export default AdminAppointmentCard