import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const navLinkClass = ({ isActive }) =>
        `relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-teal-50 ${isActive
            ? 'text-teal-600 bg-teal-50'
            : 'text-gray-600 hover:text-teal-600'
        }`

    return (
        <nav className="sticky top-0 z-[100] w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    
                    <NavLink to="/" className="flex items-center group transition-transform duration-300">
                        <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-3 shadow-lg shadow-teal-100 group-hover:rotate-6 transition-transform">
                            M
                        </div>
                        <span className="text-2xl font-black tracking-tight text-gray-900">
                            Medi<span className="text-teal-600">Care</span>
                        </span>
                    </NavLink>

                    <div className="hidden md:flex items-center space-x-2">
                        <NavLink to="/" end className={navLinkClass}>Home</NavLink>
                        <NavLink to="/doctors" className={navLinkClass}>Doctors</NavLink>
                        
                        {user?.role === 'patient' && (
                            <NavLink to="/dashboard" className={navLinkClass}>Appointments</NavLink>
                        )}
                        {user?.role === 'doctor' && (
                            <NavLink to="/doctor" className={navLinkClass}>Dashboard</NavLink>
                        )}
                        {user?.role === 'admin' && (
                            <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-4">
                            {!user ? (
                                <div className="flex items-center gap-3">
                                    <NavLink to="/login" className="text-sm font-semibold text-gray-600 hover:text-teal-600 px-4 py-2 transition-colors">
                                        Sign In
                                    </NavLink>
                                    <NavLink to="/register" className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-6 py-2.5 rounded-2xl shadow-lg shadow-teal-100 transition-all hover:-translate-y-0.5 active:translate-y-0">
                                        Get Started
                                    </NavLink>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 border-l border-gray-100 pl-4 ml-2">
                                    <NavLink to="/profile" className="flex items-center gap-3 group">
                                        <p className="text-sm font-bold text-gray-900 leading-none">
                                            {user.name}
                                        </p>
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-teal-700 font-bold border-2 border-transparent group-hover:border-teal-500 transition-all overflow-hidden ring-2 ring-transparent group-hover:ring-teal-50">
                                            {user.name?.charAt(0)}
                                        </div>
                                    </NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-white border border-red-200 hover:bg-red-500 rounded-xl transition-all shadow-sm shadow-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Hamburger Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-50 focus:outline-none transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden animate-fade-in border-t border-gray-100 bg-white/95 backdrop-blur-xl">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <NavLink to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-lg font-bold text-gray-900 hover:bg-teal-50 rounded-2xl transition-colors">Home</NavLink>
                        <NavLink to="/doctors" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-lg font-bold text-gray-900 hover:bg-teal-50 rounded-2xl transition-colors">Doctors</NavLink>
                        
                        {user && (
                            <>
                                {user.role === 'patient' && (
                                    <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-lg font-bold text-gray-900 hover:bg-teal-50 rounded-2xl transition-colors">Appointments</NavLink>
                                )}
                                {user.role === 'doctor' && (
                                    <NavLink to="/doctor" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-lg font-bold text-gray-900 hover:bg-teal-50 rounded-2xl transition-colors">Dashboard</NavLink>
                                )}
                                <NavLink to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-lg font-bold text-teal-600 hover:bg-teal-50 rounded-2xl transition-colors">My Profile</NavLink>
                                <button
                                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                    className="w-full text-left px-4 py-3 text-lg font-bold text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                                >
                                    Log Out
                                </button>
                            </>
                        )}

                        {!user && (
                            <div className="pt-4 border-t border-gray-100 space-y-3">
                                <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-4 text-lg font-bold text-gray-600 hover:bg-gray-50 rounded-2xl">Sign In</NavLink>
                                <NavLink to="/register" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-4 bg-teal-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-teal-100">Get Started</NavLink>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar