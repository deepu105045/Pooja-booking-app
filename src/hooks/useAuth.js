import { useState, useEffect } from 'react'
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { app } from '../firebase'

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (err) {
        console.log("Error in Signin with Google", err)
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    logout
  }
} 