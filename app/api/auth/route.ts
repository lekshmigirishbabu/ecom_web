import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { getAdminAuth } from '@/lib/firebaseAdmin';

const SESSION_COOKIE_NAME = '__session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

export async function POST(req: NextRequest) {
  try {
    // 1. Grab the ID token from Authorization header
    const idToken =
      req.headers.get('authorization')?.split('Bearer ')[1] ?? '';

    if (!idToken) {
      return new Response(JSON.stringify({ error: 'Missing ID token' }), {
        status: 401,
      });
    }

    // 2. Verify token & create a session cookie
    const adminAuth = getAdminAuth();
    if (!adminAuth) {
      return new Response(JSON.stringify({ error: 'Server auth not configured' }), {
        status: 500,
      });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: COOKIE_MAX_AGE * 1_000,
    });

    // 3. Set HTTP-only cookie - Updated for Next.js 15
    const cookieStore = await cookies();
    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
    });

    return new Response(JSON.stringify({ status: 'success' }));
  } catch (err) {
    console.error('Auth error:', err);
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
    });
  }
}

export async function DELETE() {
  try {
    // Get the cookie store - Updated for Next.js 15
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    // If there's a valid session cookie, revoke it on Firebase
    if (sessionCookie?.value) {
      try {
        const adminAuthInstance = getAdminAuth();
        if (adminAuthInstance) {
          const decodedClaims = await adminAuthInstance.verifySessionCookie(sessionCookie.value);
          await adminAuthInstance.revokeRefreshTokens(decodedClaims.uid);
        }
      } catch (error) {
        console.log('Session cookie verification failed during logout:', error);
        // Continue with cookie deletion even if verification fails
      }
    }

    // Clear the session cookie - Updated for Next.js 15
    cookieStore.delete(SESSION_COOKIE_NAME);

    return new Response(JSON.stringify({ status: 'signed out' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, try to clear the cookie
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    
    return new Response(JSON.stringify({ error: 'Logout failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
