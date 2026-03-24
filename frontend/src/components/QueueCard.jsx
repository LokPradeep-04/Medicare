const QueueCard = ({ appointment, onComplete }) => {

  const { _id, patientId, date, time } = appointment

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4'>

      <div className='w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0'>
        {patientId?.name?.charAt(0)}
      </div>

      <div className='flex-1'>
        <p className='font-semibold text-gray-900'>
          {patientId?.name}
        </p>
        <div className='flex items-center gap-3 mt-1'>
          <span className='text-xs text-gray-400'>📅 {date}</span>
          <span className='text-xs text-gray-400'>⏰ {time}</span>
        </div>
        <div className='flex gap-2 mt-1'>
          {patientId?.age && (
            <span className='text-xs text-gray-400'>
              Age: {patientId?.age}
            </span>
          )}
          {patientId?.gender && (
            <span className='text-xs text-gray-400 capitalize'>
              · {patientId?.gender}
            </span>
          )}
          {patientId?.phone && (
            <span className='text-xs text-gray-400'>
              · 📞 {patientId?.phone}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onComplete(_id)}
        className='bg-teal-50 text-teal-600 hover:bg-teal-100 font-semibold text-sm px-4 py-2 rounded-xl transition-colors'
      >
        ✅ Complete
      </button>

    </div>
  )
}

export default QueueCard