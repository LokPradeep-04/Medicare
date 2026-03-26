const QueueCard = ({ appointment, onComplete }) => {

  const { _id, patientId, date, time } = appointment

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4'>

      <div className='flex items-center gap-4 flex-1'>
        <div className='w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0'>
          {patientId?.name?.charAt(0)}
        </div>

        <div>
          <p className='font-bold text-gray-900'>
            {patientId?.name}
          </p>
          <div className='flex flex-wrap items-center gap-2 mt-1'>
            <span className='text-xs text-gray-400 font-medium'>📅 {date}</span>
            <span className='text-xs text-gray-400 font-medium'>⏰ {time}</span>
          </div>
          <div className='flex flex-wrap gap-x-2 gap-y-0.5 mt-1'>
            {patientId?.age && (
              <span className='text-xs text-gray-400'>Age: {patientId?.age}</span>
            )}
            {patientId?.gender && (
              <span className='text-xs text-gray-400 capitalize'>· {patientId?.gender}</span>
            )}
            {patientId?.phone && (
              <span className='text-xs text-teal-600 font-medium'>· 📞 {patientId?.phone}</span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => onComplete(_id)}
        className='w-full sm:w-auto bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white font-bold text-sm px-6 py-3 rounded-xl transition-all border border-teal-100 sm:border-transparent'
      >
        ✅ Done
      </button>

    </div>
  )
}

export default QueueCard