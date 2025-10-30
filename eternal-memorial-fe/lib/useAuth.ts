"use client"

import { useState, useEffect } from 'react'
import { User, getUser } from './auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Get initial auth state
    setUser(getUser())

    // Listen for storage events to update auth state
    const handleStorageChange = () => {
      setUser(getUser())
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return { user }
}