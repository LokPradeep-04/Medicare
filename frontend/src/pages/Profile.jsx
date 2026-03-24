import { useState, useContext, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Profile = () => {
    const { user, token, login } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        age: '',
        gender: '',
        specialization: '',
        experience: '',
        fees: '',
    })

    const API_BASE_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                age: user.age || '',
                gender: user.gender || '',
                specialization: user.doctorInfo?.specialization || '',
                experience: user.doctorInfo?.experience || '',
                fees: user.doctorInfo?.fees || '',
            })
        }
    }, [user])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (res.ok) {
                toast.success('Profile updated successfully')
                login(token, data.user)
            } else {
                toast.error(data.message || 'Update failed')
            }
        } catch (err) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-gray-500 text-sm">Update your personal information</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={user?.email}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                                    required
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        {user?.role === 'doctor' && (
                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Doctor Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fees</label>
                                        <input
                                            type="number"
                                            name="fees"
                                            value={formData.fees}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold px-12 py-3 rounded-2xl transition-all disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile
