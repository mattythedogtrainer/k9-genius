import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'K9 Genius - Smart Dog Training',
  description: 'AI-powered adaptive dog training platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-card border-r border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-8 px-2">
                <span className="text-2xl">🐕</span>
                <h1 className="text-xl font-bold text-gold">K9 Genius</h1>
              </div>
              <nav className="flex flex-col gap-1">
                <a href="/dashboard" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Dashboard</a>
                <a href="/courses" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Courses</a>
                <a href="/train" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Train</a>
                <a href="/leaderboard" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Leaderboard</a>
                <a href="/dogs" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">My Dogs</a>
                <a href="/profile" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Profile</a>
              </nav>
            </aside>
            {/* Main content */}
            <main className="flex-1 p-6 md:p-8 overflow-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
