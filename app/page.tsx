'use client';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Wand2,
} from 'lucide-react';

export default function Landing() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setLoggedIn(!!user));
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-50 h-16 backdrop-blur bg-green-100/80 dark:bg-green-900/70 border-b border-green-200 dark:border-green-800">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-5 lg:px-10">
          {/* Brand */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight"
          >
            Plant<span className="text-green-600">ingo</span>
          </Link>

          {/* Right-side links */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            {loggedIn ? (
              <Link href="/dashboard" className="hover:text-green-600 transition-colors">
                My Profile
              </Link>
            ) : (
              <Link href="/auth/login" className="hover:text-green-600 transition-colors">
                Sign&nbsp;In
              </Link>
            )}

            <Link href="/admin" className="hover:text-green-600 transition-colors">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate flex flex-1 items-center justify-center overflow-hidden px-6 py-24 lg:py-32">
        {/* Abstract gradient blob */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-green-500 via-green-400/60 to-green-700/30 opacity-30 blur-3xl"
        />

        {/* Decorative floating shapes */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-4 h-72 w-72 -translate-x-1/2 rounded-full bg-green-400/40 blur-3xl sm:h-96 sm:w-96" />
          <div className="absolute right-10 bottom-10 h-56 w-56 rounded-full bg-green-500/30 blur-3xl" />
        </div>

        {/* Content */}
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl/[1.2] font-extrabold tracking-tight sm:text-5xl/[1.2] lg:text-6xl">
            All the plants you need. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
              Delivered&nbsp;fast.
            </span>
          </h1>

          <p className="mt-6 text-lg text-green-800 dark:text-green-300 sm:text-xl">
            Discover thousands of plants, pots, and gardening tools.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-green-600 px-8 py-3 font-semibold text-white shadow-lg shadow-green-600/30 transition hover:scale-105 hover:bg-green-700 active:scale-95"
          >
            <ShoppingBag className="h-5 w-5" />
            Start&nbsp;Shopping
          </Link>

          {/* Mini feature list */}
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <li className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Truck className="h-4 w-4 text-green-700" />
              Free &amp; fast shipping
            </li>
            <li className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
              <ShieldCheck className="h-4 w-4 text-green-700" />
              Secure payments
            </li>
            <li className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Wand2 className="h-4 w-4 text-green-700" />
              7-day easy returns
            </li>
          </ul>
        </div>
      </section>

      {/* Trending categories (optional) */}
      <section className="bg-green-100 dark:bg-green-900 border-t border-green-200 dark:border-green-800 py-16">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-2xl font-bold mb-8 text-center text-green-900 dark:text-green-200">
            Trending Plants
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card */}
            {[
              {
                title: 'Indoor Plants',
                img: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=480&h=320&fit=crop',
              },
              {
                title: 'Succulents',
                img: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=480&h=320&fit=crop',
              },
              {
                title: 'Flowering Plants',
                img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=480&h=320&fit=crop',
              },
              {
                title: 'Ornamental Leafy Plants',
                img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=480&h=320&fit=crop',
              },
            ].map((c) => (
              <Link
                key={c.title}
                href="/shop"
                className="group relative overflow-hidden rounded-2xl shadow hover:shadow-lg"
              >
                <img
                  src={c.img}
                  alt={c.title}
                  className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent" />
                <span className="absolute bottom-3 left-3 text-lg font-semibold text-white">
                  {c.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-300 text-sm py-4 text-center">
        © {new Date().getFullYear()} Plantingo
      </footer>
    </div>
  );
}
