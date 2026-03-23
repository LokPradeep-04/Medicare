const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm'>
      <p>© {new Date().getFullYear()} MediCare Hospital. All rights reserved.</p>
      <p className='mt-1'>
        Emergency: 1800-MED-CARE | Mon-Sat 8AM-8PM | Emergency 24/7
      </p>
    </footer>
  )
}

export default Footer