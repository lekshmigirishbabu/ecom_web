'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInUser, signInWithSession } from '@/lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    
    try {
      const { profile } = await signInUser(email, pwd);
      // Session is already created in signInUser function, but you could add it explicitly here if needed:
      // await signInWithSession();
      
      // Route by role
      router.push(profile.role === 'admin' ? '/admin' : '/dashboard');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Login failed';
      setErr(errorMessage);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-6">
        <h2 className="text-xl font-bold text-center">Sign In</h2>

        <input
          type="email"
          required
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Password"
          className="input-field"
          value={pwd}
          onChange={e => setPwd(e.target.value)}
        />

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? 'Signing in…' : 'Continue'}
        </button>

        <p className="text-center text-sm">
          New here?{' '}
          <Link href="/auth/register" className="text-primary-600 hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
