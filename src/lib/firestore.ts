import { db } from './firebase';
import {
  collection, addDoc, updateDoc, doc,
  serverTimestamp, arrayUnion, Timestamp
} from 'firebase/firestore';
import { Incident, IncidentUpdate } from '@/types';

export async function createIncident(
  data: Omit<Incident, 'id' | 'updates' | 'status' | 'reportedAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'incidents'), {
    ...data,
    status: 'active',
    updates: [],
    reportedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function acknowledgeIncident(id: string, staffName: string): Promise<void> {
  await updateDoc(doc(db, 'incidents', id), {
    status: 'acknowledged',
    acknowledgedAt: serverTimestamp(),
    acknowledgedBy: staffName,
  });
}

export async function resolveIncident(id: string): Promise<void> {
  await updateDoc(doc(db, 'incidents', id), {
    status: 'resolved',
    resolvedAt: serverTimestamp(),
  });
}

export async function addIncidentUpdate(
  id: string,
  update: Omit<IncidentUpdate, 'id'>
): Promise<void> {
  await updateDoc(doc(db, 'incidents', id), {
    updates: arrayUnion({
      id: crypto.randomUUID(),
      ...update,
      createdAt: Timestamp.now(),
    }),
  });
}

export async function attachAIResponse(id: string, aiResponse: object): Promise<void> {
  await updateDoc(doc(db, 'incidents', id), { aiResponse });
}
