import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { User } from '@/types';

const fbAuth = getAuth();

export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    
    // Create session after successful login
    await signInWithSession();
    
    return { user: userCredential.user, profile: userDoc.data() as User };
  } catch (error) {
    throw error;
  }
};

export const createUser = async (email: string, password: string, role: 'admin' | 'customer') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userData: User = {
      uid: userCredential.user.uid,
      email,
      role,
      createdAt: new Date()
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    
    // Create session after successful registration
    await signInWithSession();
    
    return { user: userCredential.user, profile: userData };
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  await signOutWithSession();
};

export const getCurrentUser = async (): Promise<User | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  return userDoc.exists() ? userDoc.data() as User : null;
};

// Session management functions
export const signInWithSession = async () => {
  try {
    // After login (call this after successful Firebase auth)
    const idToken = await fbAuth.currentUser?.getIdToken();
    if (idToken) {
      await axios.post('/api/auth', {}, { 
        headers: { Authorization: `Bearer ${idToken}` } 
      });
    }
  } catch (error) {
    console.error('Error creating session:', error);
    // Don't throw error here as the main auth operation succeeded
  }
};

export const signOutWithSession = async () => {
  try {
    // Clear session first, then Firebase auth
    await axios.delete('/api/auth');
  } catch (error) {
    console.error('Error clearing session:', error);
  } finally {
    // Always sign out from Firebase even if session clearing fails
    await firebaseSignOut(fbAuth);
  }
};
