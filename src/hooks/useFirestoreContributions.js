import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

function getContributionsCollectionName() {
  return import.meta.env.MODE === 'development' ? 'contributions_dev' : 'contributions_prod';
}

export function useFirestoreContributions(year) {
  const [contributions, setContributions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContributions = useCallback(async () => {
    setLoading(true);
    try {
      const colRef = collection(db, getContributionsCollectionName());
      const q = query(colRef, where('year', '==', year));
      const snapshot = await getDocs(q);
      const data = {};
      snapshot.forEach(docSnap => {
        const c = docSnap.data();
        if (!data[c.memberId]) data[c.memberId] = {};
        data[c.memberId][c.month] = { ...c, id: docSnap.id };
      });
      setContributions(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  // Add or update a contribution for a member/month/year
  const addOrUpdateContribution = async ({ memberId, year, month, amount }) => {
    try {
      const colName = getContributionsCollectionName();
      const docId = `${memberId}_${year}_${month}`;
      await setDoc(doc(db, colName, docId), {
        memberId,
        year,
        month,
        amount,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return { contributions, loading, error, addOrUpdateContribution, refetch: fetchContributions };
} 