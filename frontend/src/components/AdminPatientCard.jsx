const AdminPatientCard = ({ patient }) => {

  const { name, email, phone, age, gender } = patient

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4'>

      <div className='flex items-center gap-4 flex-1'>
        <div className='w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0'>
          {name?.charAt(0)}
        </div>

        <div>
          <p className='font-bold text-gray-900 leading-tight'>{name}</p>
          <p className='text-sm text-gray-500 mt-0.5'>{email}</p>
          <div className='flex flex-wrap items-center gap-2 mt-1.5'>
            {phone && <span className='text-xs text-gray-400 font-medium'>📞 {phone}</span>}
            {age && <span className='text-xs text-gray-400 font-medium'>· Age: {age}</span>}
            {gender && <span className='text-xs text-gray-400 font-medium capitalize'>· {gender}</span>}
          </div>
        </div>
      </div>

    </div>
  )
}

export default AdminPatientCard