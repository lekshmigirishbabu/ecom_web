import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as LoginBody;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Firebase sign-in
    const credential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Fetch user profile to verify role
    const userRef = doc(db, 'users', credential.user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json(
        { error: 'User profile not found.' },
        { status: 404 }
      );
    }

    const profile = userSnap.data();
    if (profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied: admin privileges required.' },
        { status: 403 }
      );
    }

    // Optionally create a session cookie / JWT here
    // For simplicity we just return profile data
    return NextResponse.json({
      uid: credential.user.uid,
      email: credential.user.email,
      role: profile.role
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Authentication failed.' },
      { status: 401 }
    );
  }
}
