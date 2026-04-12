'use client';

import Link from 'next/link';

const footerLinks = [
  { href: '#features', label: 'Features' },
  { href: '#help', label: 'Help Center' },
  { href: '#privacy', label: 'Privacy Policy' },
  { href: '#terms', label: 'Terms of Service' },
  { href: '#contact', label: 'Contact Us' },
];

export function LmsFooter() {
  return (
    <footer className="bg-cream-100 border-t border-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Copyright */}
          <div className="text-sm text-teal-700 font-body">
            <p>
              K9 Design System © {new Date().getFullYear()}. All rights reserved.
            </p>
          </div>

          {/* Right: Footer Links */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-start md:justify-end">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-teal-700 hover:text-teal-900 font-body transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
