const AdminPatientCard = ({ patient }) => {

  const { name, email, phone, age, gender } = patient

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4'>

      {/* Avatar */}
      <div className='w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0'>
        {name?.charAt(0)}
      </div>

      {/* Info */}
      <div className='flex-1'>
        <p className='font-semibold text-gray-900'>{name}</p>
        <p className='text-sm text-gray-500'>{email}</p>
        <div className='flex gap-2 mt-1'>
          {phone && <span className='text-xs text-gray-400'>📞 {phone}</span>}
          {age && <span className='text-xs text-gray-400'>· Age: {age}</span>}
          {gender && <span className='text-xs text-gray-400 capitalize'>· {gender}</span>}
        </div>
      </div>

    </div>
  )
}

export default AdminPatientCard