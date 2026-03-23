const DoctorSummaryCard = ({ doctor }) => {
  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6'>
      <div className='flex items-center gap-4'>
        <div className='w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-bold text-xl'>
          {doctor.userId?.name?.charAt(0)}
        </div>
        <div>
          <h2 className='font-bold text-gray-900 text-lg'>
            Dr. {doctor.userId?.name}
          </h2>
          <p className='text-teal-600 text-sm font-medium'>
            {doctor.specialization}
          </p>
          <p className='text-gray-500 text-sm'>
            Consultation fee: ₹{doctor.fees}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DoctorSummaryCard