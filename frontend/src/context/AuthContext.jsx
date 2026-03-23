import { createContext, useState, useEffect, useContext } from 'react'
import Cookies from 'js-cookie'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [token, setToken] = useState(Cookies.get('token') || null)
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (res.ok) {
          setUser(data.user)
        } else {
          Cookies.remove('token')
          setToken(null)
          setUser(null)
        }
      } catch (error) {
        console.log('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [token])

  const login = (token, userData) => {
    Cookies.set('token', token, { expires: 7 })
    setToken(token)
    setUser(userData)
  }

  const logout = () => {
    Cookies.remove('token')
    setToken(null)
    setUser(null)
  }

  const values = {
    user,
    token,
    loading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
