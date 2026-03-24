import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const SlotPicker = ({ slots, selectedSlot, onSelect, selectedDate }) => {

  const isPast = (slot) => {
    const slotDateTime = dayjs(`${selectedDate} ${slot}`, 'YYYY-MM-DD h:mm A')
    return slotDateTime.isBefore(dayjs())
  }

  const available = slots.filter(s => !isPast(s))

  if (slots.length === 0 || available.length === 0) {
    return (
      <div className='bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-3 rounded-xl'>
        No slots available for this date. Please select another date.
      </div>
    )
  }

  return (
    <div className='grid grid-cols-4 gap-2'>
      {slots.map((slot, index) => {
        const past = isPast(slot)
        return (
          <button
            key={index}
            onClick={() => !past && onSelect(slot)}
            disabled={past}
            className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
              past
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                : selectedSlot === slot
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-teal-400 hover:text-teal-600'
            }`}
          >
            {slot}
          </button>
        )
      })}
    </div>
  )
}

export default SlotPicker