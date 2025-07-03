// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAAOrqYYspOpNJRjEKo14n7FC5UOX5xvqs",
  authDomain: "pooja-booking-app.firebaseapp.com",
  projectId: "pooja-booking-app",
  storageBucket: "pooja-booking-app.appspot.com",
  messagingSenderId: "220572323031",
  appId: "1:220572323031:web:4101a8fa49e686d76c7492",
  measurementId: "G-WP6TTQLZFQ"
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)
const auth = getAuth(app)

export { app, analytics, db, auth }
