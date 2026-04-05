import React, { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { authAPI } from '../api/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('jorshor_token')
      if (token) {
        const res = await authAPI.me()
        setUser(res.data.data.user)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (err) {
      console.error('Auth verification failed', err)
      setIsAuthenticated(false)
      setUser(null)
      localStorage.removeItem('jorshor_token')
      localStorage.removeItem('jorshor_user')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const res = await authAPI.login(email, password)
    const { token, user } = res.data.data
    localStorage.setItem('jorshor_token', token)
    localStorage.setItem('jorshor_user', JSON.stringify(user))
    setUser(user)
    setIsAuthenticated(true)
    return res.data
  }

  const signup = async (name, email, password) => {
    const res = await authAPI.signup(name, email, password)
    const { token, user: newUser } = res.data.data
    localStorage.setItem('jorshor_token', token)
    localStorage.setItem('jorshor_user', JSON.stringify(newUser))
    setUser(newUser)
    setIsAuthenticated(true)
    return res.data
  }

  const googleLogin = (credential) => {
    const decoded = jwtDecode(credential)
    // Create a mock user object from Google payload
    const googleUser = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: 'admin',
      picture: decoded.picture
    }
    // Set a dummy token to bypass future checkAuth if needed (mocked session)
    localStorage.setItem('jorshor_token', credential) 
    localStorage.setItem('jorshor_user', JSON.stringify(googleUser))
    setUser(googleUser)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    try {
      if (isAuthenticated) {
        await authAPI.logout()
      }
    } catch(err) {
      console.log('Server logout call failed', err)
    } finally {
      localStorage.removeItem('jorshor_token')
      localStorage.removeItem('jorshor_user')
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data)
    const { user: updatedUser } = res.data.data
    localStorage.setItem('jorshor_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    return updatedUser
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      googleLogin,
      signup,
      logout,
      checkAuth,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
