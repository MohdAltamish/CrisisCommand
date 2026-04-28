'use client';
import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Incident } from '@/types';

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'incidents'),
      orderBy('reportedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        reportedAt: doc.data().reportedAt?.toDate(),
        acknowledgedAt: doc.data().acknowledgedAt?.toDate(),
        resolvedAt: doc.data().resolvedAt?.toDate(),
      })) as Incident[];
      setIncidents(data);
    }, (error) => {
      console.error('Firestore listener error:', error);
    });

    return () => unsubscribe();
  }, []);

  return incidents;
}
