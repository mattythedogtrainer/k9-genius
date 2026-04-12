'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@k9-genius/ui';

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/courses', label: 'My Courses' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/roadmaps', label: 'Roadmaps' },
  { href: '/progress', label: 'Progress' },
  { href: '/resources', label: 'Resources' },
  { href: '/community', label: 'Community' },
  { href: '/settings', label: 'Settings' },
];

function PawIcon() {
  return (
    <svg
      className="w-6 h-6 text-teal-700"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="14" r="4" />
      <circle cx="5" cy="8" r="2.5" />
      <circle cx="19" cy="8" r="2.5" />
      <circle cx="3" cy="12" r="2.5" />
      <circle cx="21" cy="12" r="2.5" />
    </svg>
  );
}

function getUserInitials(displayName?: string): string {
  if (!displayName) return 'U';
  const parts = displayName.split(' ');
  return parts.map((part) => part.charAt(0)).join('').toUpperCase().slice(0, 2);
}

export function LmsNavbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string): boolean => {
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0 group">
              <PawIcon />
              <span className="text-sm font-semibold text-teal-900 hidden sm:inline-block font-heading group-hover:text-teal-700 transition">
                K9 Design System
              </span>
            </Link>

            {/* Center: Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors relative group ${
                      active
                        ? 'text-coral-500'
                        : 'text-teal-700 hover:text-teal-900'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-coral-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right: Search, Notifications, Avatar */}
            <div className="flex items-center gap-4">
              {/* Search Bar - Desktop Only */}
              <div className="hidden md:flex flex-1 max-w-xs mx-4">
                <div className="relative w-full">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-cream-100 bg-cream-50 text-sm text-teal-900 placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
                    readOnly
                  />
                </div>
              </div>

              {/* Notifications Bell */}
              <button className="relative p-2 rounded-lg text-teal-700 hover:bg-cream-100 transition hidden sm:block">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0018 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
                <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 bg-coral-500 text-white text-xs font-bold rounded-full">
                  3
                </span>
              </button>

              {/* User Avatar */}
              <div className="flex items-center gap-2">
                {loading ? (
                  <div className="w-9 h-9 bg-teal-400 rounded-full animate-pulse" />
                ) : (
                  <div className="w-9 h-9 bg-teal-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {getUserInitials(user?.displayName || undefined)}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-teal-700 hover:bg-cream-100 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-cream-100 bg-cream-50">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      active
                        ? 'bg-coral-500 text-white'
                        : 'text-teal-700 hover:bg-cream-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
