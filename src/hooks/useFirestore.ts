// frontend/src/hooks/useFirestore.ts
import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export interface AppUser {
  uid: string;  // Note: using 'uid' to match your backend
  email: string;
  displayName: string;
  role: string;
  department?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const useUsers = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userData: AppUser[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          return {
            uid: doc.id, // Firestore document ID becomes uid
            email: data.email || '',
            displayName: data.displayName || '',
            role: data.role || '',
            department: data.department,
            phoneNumber: data.phoneNumber,
            isActive: data.isActive ?? true,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          };
        });
        
        setUsers(userData);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const addUser = async (userData: Omit<AppUser, 'uid' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const newUser: AppUser = {
        uid: docRef.id,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      console.error('Error adding user:', err);
      throw err;
    }
  };

  return { users, loading, error, addUser };
};