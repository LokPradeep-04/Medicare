const BookingSummary = ({ doctor, date, selectedSlot }) => {
  return (
    <div className='bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6'>
      <p className='text-sm font-semibold text-teal-800 mb-3'>
        Booking Summary
      </p>
      <div className='space-y-1'>
        <p className='text-sm text-teal-700'>
          👨‍⚕️ Dr. {doctor?.userId?.name}
        </p>
        <p className='text-sm text-teal-700'>
          🏥 {doctor?.specialization}
        </p>
        <p className='text-sm text-teal-700'>
          📅 {date}
        </p>
        <p className='text-sm text-teal-700'>
          ⏰ {selectedSlot}
        </p>
        <p className='text-sm text-teal-700'>
          💰 ₹{doctor?.fees}
        </p>
      </div>
    </div>
  )
}

export default BookingSummary