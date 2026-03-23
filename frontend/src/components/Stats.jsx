const stats = [
  { number: '50+', label: 'Expert Doctors' },
  { number: '8', label: 'Departments' },
  { number: '10K+', label: 'Patients Served' },
  { number: '24/7', label: 'Emergency Care' },
]

const Stats = () => {
  return (
    <div className='bg-white py-12 px-4 border-b border-gray-100'>
      <div className='max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
        {stats.map((stat, index) => (
          <div key={index}>
            <p className='text-3xl font-bold text-teal-600'>{stat.number}</p>
            <p className='text-gray-500 text-sm mt-1'>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stats