import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { createApiClient, isTokenExpired } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem('token')
    if (!saved || saved === 'undefined' || saved === 'null' || isTokenExpired(saved)) {
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } catch {}
      return ''
    }
    return saved
  })
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    if (!saved || saved === 'undefined' || saved === 'null') {
      localStorage.removeItem('user')
      return null
    }
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse user data:', e)
      localStorage.removeItem('user')
      return null
    }
  })
  
  const api = useMemo(() => createApiClient(() => token), [token])
  
  const loginUser = (t, u) => { 
    setToken(t)
    setUser(u)
    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(u))
  }
  
  const logout = () => { 
    setToken('')
    setUser(null)
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } catch {}
  }

  // Auto logout on 401 unauthorized event
  useEffect(() => {
    const handleUnauthorized = () => {
      logout()
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [])
  
  const value = { token, user, api, login: loginUser, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }
