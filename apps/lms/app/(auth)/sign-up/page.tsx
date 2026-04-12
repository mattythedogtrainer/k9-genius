'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUpWithEmail, signInWithGoogle, signInWithApple } from '@k9-genius/db';

export default function SignUpPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!displayName || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        setIsLoading(false);
        return;
      }

      await signUpWithEmail(email, password, displayName);
      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create account. Please try again.'
      );
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to sign up with Google'
      );
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    setError('');
    setIsAppleLoading(true);

    try {
      await signInWithApple();
      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to sign up with Apple'
      );
      setIsAppleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lms-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg border border-cream-100 shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-heading text-teal-900 mb-2">
              Get Started
            </h1>
            <p className="text-teal-400 font-body">
              Create your K9 Genius account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-body">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-semibold font-heading text-teal-900 mb-2"
              >
                Full Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 border border-cream-100 rounded-lg font-body text-teal-900 placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold font-heading text-teal-900 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-cream-100 rounded-lg font-body text-teal-900 placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold font-heading text-teal-900 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-cream-100 rounded-lg font-body text-teal-900 placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
              <p className="text-xs text-teal-400 font-body mt-1">
                At least 8 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold font-heading text-teal-900 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-cream-100 rounded-lg font-body text-teal-900 placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-teal-700 disabled:opacity-60 text-cream-50 font-semibold font-heading py-2.5 rounded-lg transition-colors duration-200"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-teal-400 font-body">
                or continue with
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
              className="w-full bg-white hover:bg-gray-50 disabled:bg-white disabled:opacity-60 border border-cream-100 text-teal-900 font-semibold font-heading py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {isGoogleLoading ? 'Signing up...' : 'Google'}
            </button>

            <button
              type="button"
              onClick={handleAppleSignUp}
              disabled={isAppleLoading}
              className="w-full bg-black hover:bg-gray-900 disabled:bg-black disabled:opacity-60 text-white font-semibold font-heading py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.05 13.5c-.02-3.34 2.75-4.95 2.87-5.03-.77-1.12-1.97-1.27-2.4-1.29-1.02-.1-1.98.6-2.5.6-.52 0-1.35-.59-2.21-.57-1.14.02-2.2.66-2.78 1.67-.59 1.02-.75 2.53-.36 3.82.39 1.3 1.39 2.53 2.67 2.67 1.27.13 2.48-1.04 3.11-1.04.63 0 1.79 1.04 3.24.89.53-.09 2.01-.21 2.96-1.59-1.45-.93-2.33-2.78-2.3-4.43z" />
                <path d="M12.07 2c-1.34.02-2.6.82-3.27 1.96-.68 1.15-.73 2.78-.33 4.07 1.48-1.12 3.18-1.27 4.33-.82 1.15.45 1.85 1.55 1.97 2.82 1.13-.47 2.45-1.23 3.23-2.43.77-1.2.87-2.9.15-4.27-.72-1.36-2.1-2.2-3.56-2.27-.88-.04-1.78.25-2.52.94z" />
              </svg>
              {isAppleLoading ? 'Signing up...' : 'Apple'}
            </button>
          </div>

          <p className="text-center text-teal-400 font-body text-sm mt-8">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="text-coral-500 hover:text-coral-600 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
