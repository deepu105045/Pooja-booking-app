// src/hooks/useFirestoreBooking.js
import { useEffect, useState } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc
} from 'firebase/firestore'
import { db } from '../firebase'

// Determine environment collection based on VITE_FIREBASE_ENV variable
const env = import.meta.env.VITE_FIREBASE_ENV || 'dev'
const collectionName = env === 'prod' ? 'bookings_prod' : 'bookings_dev'
console.log('Firestore Environment:', env)
console.log('Using collection:', collectionName)

export function useFirestoreBooking(year) {
  const [bookings, setBookings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('Setting up Firestore listener for collection:', collectionName)
    const colRef = collection(db, collectionName)
    const q = query(
      colRef,
      where('year', '==', year),
      orderBy('date', 'asc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('Firestore snapshot from collection:', collectionName)
        console.log('Firestore snapshot docs:', snapshot.docs.map((d) => d.data()))

        // For each date, pick the most recent non-cancelled booking if available, otherwise the most recent booking
        const bookingsByDate = {}
        snapshot.forEach((doc) => {
          const booking = doc.data()
          const date = booking.date
          // If this booking is not cancelled, prefer it
          const isCancelled = booking.status && booking.status.toLowerCase().includes('cancelled')
          if (!bookingsByDate[date]) {
            bookingsByDate[date] = { ...booking, id: doc.id }
          } else {
            // Prefer non-cancelled over cancelled
            const existing = bookingsByDate[date]
            const existingIsCancelled = existing.status && existing.status.toLowerCase().includes('cancelled')
            if (!isCancelled && existingIsCancelled) {
              bookingsByDate[date] = { ...booking, id: doc.id }
            } else if (isCancelled === existingIsCancelled) {
              // If both are cancelled or both are not, pick the latest createdAt
              if (booking.createdAt > existing.createdAt) {
                bookingsByDate[date] = { ...booking, id: doc.id }
              }
            }
          }
        })
        setBookings(bookingsByDate)
        setLoading(false)
      },
      (err) => {
        console.error('Firestore error:', err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [year])

  // Add a booking document for given date and user info
  const addBooking = async (dateStr, name, phone, status) => {
    try {
      console.log('Adding booking to collection:', collectionName)
      await addDoc(collection(db, collectionName), {
        date: dateStr,
        year,
        name,
        phone,
        createdAt: new Date().toISOString(),
        status,
      })
    } catch (err) {
      console.error('Error adding booking:', err)
      setError(err)
      throw err
    }
  }

  // Update booking status by document ID
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      console.log('Updating booking in collection:', collectionName)
      const docRef = doc(db, collectionName, bookingId)
      await updateDoc(docRef, { status: newStatus })
    } catch (err) {
      console.error('Error updating booking:', err)
      setError(err)
      throw err
    }
  }

  return { bookings, loading, error, addBooking, updateBookingStatus }
}
