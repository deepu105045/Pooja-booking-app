import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';

function getMembersCollectionName() {
  return import.meta.env.MODE === 'development' ? 'members_dev' : 'members_prod';
}

export function useFirestoreMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const colRef = collection(db, getMembersCollectionName());
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMembers(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const addMember = async (member) => {
    try {
      const colRef = collection(db, getMembersCollectionName());
      await addDoc(colRef, member);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const updateMember = async (id, updates) => {
    try {
      const docRef = doc(db, getMembersCollectionName(), id);
      await updateDoc(docRef, updates);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return { members, loading, error, addMember, updateMember };
} 