const StatCard = ({ icon, label, value, color }) => {
  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4'>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className='text-2xl font-bold text-gray-900'>{value}</p>
        <p className='text-gray-500 text-sm mt-0.5'>{label}</p>
      </div>
    </div>
  )
}

export default StatCard