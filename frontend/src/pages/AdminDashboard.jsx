import { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import StatCard from '../components/StatCard'
import FilterTabs from '../components/FilterTabs'
import AdminDoctorCard from '../components/AdminDoctorCard'
import AdminPatientCard from '../components/AdminPatientCard'
import AdminAppointmentCard from '../components/AdminAppointmentCard'
import AddDoctorForm from '../components/AddDoctorForm'
import { AuthContext } from '../context/AuthContext'

const TABS = ['Overview', 'Doctors', 'Patients', 'Appointments']

const AdminDashboard = () => {

  const { token } = useContext(AuthContext)

  const [activeTab, setActiveTab] = useState('Overview')
  const [stats, setStats] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddDoctor, setShowAddDoctor] = useState(false)

  const API_BASE_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [statsRes, doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/doctors`),
        fetch(`${API_BASE_URL}/admin/patients`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/appointments/all`, { headers: { Authorization: `Bearer ${token}` } }),
      ])

      const [statsData, doctorsData, patientsData, appointmentsData] = await Promise.all([
        statsRes.json(),
        doctorsRes.json(),
        patientsRes.json(),
        appointmentsRes.json(),
      ])

      if (statsRes.ok) setStats(statsData)
      if (doctorsRes.ok) setDoctors(doctorsData.doctors)
      if (patientsRes.ok) setPatients(patientsData.patients)
      if (appointmentsRes.ok) setAppointments(appointmentsData.appointments)
    } catch (err) {
      console.log('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDoctor = async (id) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return
    try {
      const res = await fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) fetchAll()
    } catch (err) {
      console.log('Error:', err)
    }
  }

  const handleCancelAppointment = async (id) => {
    if (!confirm('Cancel this appointment?')) return
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) fetchAll()
    } catch (err) {
      console.log('Error:', err)
    }
  }

  if (loading) return <Loader />

  return (
    <div className='bg-gray-50 min-h-screen'>
      <Navbar />
      <div className='max-w-6xl mx-auto px-4 py-10'>

        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Admin Dashboard ⚙️
            </h1>
            <p className='text-gray-500 text-sm mt-1'>
              MediCare Hospital Management
            </p>
          </div>
          <button
            onClick={() => setShowAddDoctor(true)}
            className='bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors'
          >
            + Add Doctor
          </button>
        </div>

        {/* Tabs */}
        <div className='mb-6'>
          <FilterTabs
            filters={TABS}
            activeFilter={activeTab}
            onSelect={setActiveTab}
          />
        </div>

        {/* Overview Tab */}
        {activeTab === 'Overview' && (
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <StatCard
              icon='👨‍⚕️'
              label='Total Doctors'
              value={stats?.totalDoctors || 0}
              color='bg-teal-50'
            />
            <StatCard
              icon='👥'
              label='Total Patients'
              value={stats?.totalPatients || 0}
              color='bg-blue-50'
            />
            <StatCard
              icon='📅'
              label="Today's Appointments"
              value={stats?.todayAppointments || 0}
              color='bg-yellow-50'
            />
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'Doctors' && (
          <div className='flex flex-col gap-3'>
            {doctors.filter(d => d.userId !== null).map(doctor => (
              <AdminDoctorCard
                key={doctor._id}
                doctor={doctor}
                onDelete={handleDeleteDoctor}
              />
            ))}
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'Patients' && (
          <div className='flex flex-col gap-3'>
            {patients.map(patient => (
              <AdminPatientCard
                key={patient._id}
                patient={patient}
              />
            ))}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'Appointments' && (
          <div className='flex flex-col gap-3'>
            {appointments.map(appointment => (
              <AdminAppointmentCard
                key={appointment._id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
              />
            ))}
          </div>
        )}

      </div>

      {/* Add Doctor Modal */}
      {showAddDoctor && (
        <AddDoctorForm
          token={token}
          onAdd={fetchAll}
          onClose={() => setShowAddDoctor(false)}
        />
      )}

    </div>
  )
}

export default AdminDashboard
