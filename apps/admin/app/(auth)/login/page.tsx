'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmail,
  signInWithGoogle,
  signInWithApple,
  signOutUser,
  clientAuth,
  clientDb,
} from '@k9-genius/db/client';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const checkAdminRole = async (userId: string): Promise<boolean> => {
    try {
      const userDocRef = doc(clientDb, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        return false;
      }

      const userData = userDocSnap.data();
      return userData.role === 'ADMIN';
    } catch (err) {
      console.error('Error checking user role:', err);
      return false;
    }
  };

  const handleSignIn = async (
    signInFn: () => Promise<void>
  ) => {
    setError('');
    setLoading(true);

    try {
      await signInFn();

      // Get current user and check role
      const user = clientAuth.currentUser;
      if (!user) {
        throw new Error('Sign in failed');
      }

      const isAdmin = await checkAdminRole(user.uid);

      if (!isAdmin) {
        setError('Access denied. Admin accounts only.');
        await signOutUser();
        return;
      }

      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn(() => signInWithEmail(email, password));
  };

  const handleGoogleSignIn = async () => {
    await handleSignIn(signInWithGoogle);
  };

  const handleAppleSignIn = async () => {
    await handleSignIn(signInWithApple);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1419] px-4">
      <div className="w-full max-w-md bg-[#1a1f29] rounded-lg shadow-xl p-8 border border-[#F39C12]/20">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#F39C12] mb-2">K9 Admin</h1>
          <p className="text-gray-400">Administrator Portal</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#0f1419] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F39C12] transition"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#0f1419] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F39C12] transition"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F39C12] hover:bg-[#E67E22] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* OAuth Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0f1419] border border-gray-600 rounded-lg text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <span>🔍</span>
            Sign in with Google
          </button>

          <button
            onClick={handleAppleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0f1419] border border-gray-600 rounded-lg text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <span>🍎</span>
            Sign in with Apple
          </button>
        </div>
      </div>
    </div>
  );
}
