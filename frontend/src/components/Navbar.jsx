import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinkClass = ({ isActive }) =>
    `font-medium text-sm transition-colors duration-200 hover:text-teal-600 ${
      isActive ? 'text-teal-600' : 'text-gray-600'
    }`  

  return (
    <nav className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>

        <NavLink to='/'>
          <span className='font-bold text-xl text-gray-900'>
            Medi<span className='text-teal-600'>Care</span>
          </span>
        </NavLink>

        <div className='flex items-center gap-8'>
          <NavLink to='/' end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to='/doctors' className={navLinkClass}>
            Doctors
          </NavLink>
          {user?.role === 'patient' && (
            <NavLink to='/dashboard' className={navLinkClass}>
              My Appointments
            </NavLink>
          )}
          {user?.role === 'doctor' && (
            <NavLink to='/doctor' className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to='/admin' className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </div>

        <div className='flex items-center gap-3'>
          {!user ? (
            <>
              <NavLink to='/login' className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to='/register' className='bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors'>
                Register
              </NavLink>
            </>
          ) : (
            <div className='flex items-center gap-3'>
              <span className='text-sm text-gray-600 font-medium'>
              {user.name}
              </span>
              <button
                onClick={handleLogout}
                className='bg-red-500 hover:bg-red-600 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors'>
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar