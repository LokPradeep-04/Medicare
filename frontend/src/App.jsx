import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute'

import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import DoctorsList from './pages/DoctorsList'
import DoctorProfile from './pages/DoctorProfile'
import BookAppointment from './pages/BookAppointment'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/doctors' element={<DoctorsList />} />
        <Route path='/doctors/:id' element={<DoctorProfile />} />

        <Route path='/dashboard' element={
          <ProtectedRoute role='patient'>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path='/book/:doctorId' element={
          <ProtectedRoute role='patient'>
            <BookAppointment />
          </ProtectedRoute>
        } />

        <Route path='/doctor' element={
          <ProtectedRoute role='doctor'>
            <DoctorDashboard />
          </ProtectedRoute>
        } />

        <Route path='/admin' element={
          <ProtectedRoute role='admin'>
            <AdminDashboard />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App