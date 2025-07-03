import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export function useAdminAccess(user) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user || !user.email) {
        console.log('No user or email found:', user)
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        // Determine environment based on VITE_FIREBASE_ENV variable
        const env = import.meta.env.VITE_FIREBASE_ENV || 'dev'
        const collectionName = `admin_${env}`
        
        console.log('Admin Access Environment:', env)
        console.log('Using admin collection:', collectionName)
        
        // Get the admin document for the current environment
        const adminDocRef = doc(db, collectionName, env)
        console.log('Checking admin access for user:', user.email)
        
        const adminDoc = await getDoc(adminDocRef)

        if (adminDoc.exists()) {
          const adminData = adminDoc.data()
          const users = adminData.users || []
          
          const hasAccess = users.includes(user.email)
          console.log(`Admin access check for ${user.email}: ${hasAccess} (${env} environment)`)
          console.log('Available admin users:', users)
          
          setIsAdmin(hasAccess)
        } else {
          console.log(`Admin document does not exist in ${collectionName} collection`)
          setIsAdmin(false)
        }
      } catch (err) {
        console.error('Error checking admin access:', err)
        setError(err)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminAccess()
  }, [user])

  return { isAdmin, loading, error }
} 