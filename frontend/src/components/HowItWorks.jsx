const steps = [
  { icon: '🔍', step: '1', title: 'Find a Doctor', desc: 'Browse specialists by department or search by name' },
  { icon: '📅', step: '2', title: 'Book a Slot', desc: 'Choose your preferred date and available time slot' },
  { icon: '✅', step: '3', title: 'Get Confirmed', desc: 'Receive instant email confirmation' },
  { icon: '🏥', step: '4', title: 'Visit Hospital', desc: 'Arrive on time for a smooth experience' },
]

const HowItWorks = () => {
  return (
    <div className='bg-white py-16 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900'>How It Works</h2>
          <p className='text-gray-500 mt-2'>Book your appointment in 4 simple steps</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {steps.map((item, index) => (
            <div key={index} className='text-center'>
              <div className='w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4'>
                {item.icon}
              </div>
              <div className='w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3'>
                {item.step}
              </div>
              <h3 className='font-semibold text-gray-900 mb-1'>{item.title}</h3>
              <p className='text-gray-500 text-sm'>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HowItWorks