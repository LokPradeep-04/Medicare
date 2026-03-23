const SlotPicker = ({ slots, selectedSlot, onSelect }) => {

  if (slots.length === 0) {
    return (
      <div className='bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-3 rounded-xl'>
        No slots available for this date. Please select another date.
      </div>
    )
  }

  return (
    <div className='grid grid-cols-4 gap-2'>
      {slots.map((slot, index) => (
        <button
          key={index}
          onClick={() => onSelect(slot)}
          className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
            selectedSlot === slot
              ? 'bg-teal-600 text-white border-teal-600'
              : 'bg-white text-gray-700 border-gray-200 hover:border-teal-400 hover:text-teal-600'
          }`}
        >
          {slot}
        </button>
      ))}
    </div>
  )
}

export default SlotPicker