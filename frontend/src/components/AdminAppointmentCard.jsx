const statusStyles = {
  booked: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}

const AdminAppointmentCard = ({ appointment, onCancel }) => {

  const { _id, patientId, doctorId, date, time, status } = appointment

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4'>

      <div className='flex-1'>
        <p className='font-bold text-gray-900 leading-tight'>
          {patientId?.name}
        </p>
        <p className='text-sm text-gray-500 mt-0.5 leading-tight'>
          Dr. {doctorId?.userId?.name} · {doctorId?.specialization}
        </p>
        <div className='flex flex-wrap items-center gap-3 mt-1.5'>
          <span className='text-xs text-gray-400 font-medium'>📅 {date}</span>
          <span className='text-xs text-gray-400 font-medium'>⏰ {time}</span>
        </div>
      </div>

      <div className='flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50'>
        <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg ${statusStyles[status]}`}>
          {status}
        </span>
        {status === 'booked' && (
          <button
            onClick={() => onCancel(_id)}
            className='text-xs bg-red-50 text-red-500 hover:bg-red-600 hover:text-white font-bold px-4 py-2 rounded-xl transition-all border border-red-50 sm:border-transparent'
          >
            Cancel
          </button>
        )}
      </div>

    </div>
  )
}

export default AdminAppointmentCard