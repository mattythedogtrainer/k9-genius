import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'K9 Genius Trainer',
  description: 'K9 Genius certified trainer dashboard',
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
            <aside className="hidden md:flex w-64 flex-col bg-card border-r border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-8 px-2">
                <span className="text-2xl">🎓</span>
                <h1 className="text-xl font-bold text-gold">K9 Trainer</h1>
              </div>
              <nav className="flex flex-col gap-1">
                <a href="/" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Dashboard</a>
                <a href="/courses" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">My Courses</a>
                <a href="/students" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Students</a>
                <a href="/funnels" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Funnels</a>
                <a href="/crm" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">CRM</a>
                <a href="/marketing" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Marketing</a>
                <a href="/analytics" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Analytics</a>
                <a href="/settings" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Settings</a>
              </nav>
            </aside>
            <main className="flex-1 p-6 md:p-8 overflow-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
