import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'K9 Genius Admin',
  description: 'K9 Genius staff administration dashboard',
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
                <span className="text-2xl">🛡️</span>
                <h1 className="text-xl font-bold text-gold">K9 Admin</h1>
              </div>
              <nav className="flex flex-col gap-1">
                <a href="/" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Dashboard</a>
                <a href="/users" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Users</a>
                <a href="/courses" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Courses</a>
                <a href="/trainers" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Trainers</a>
                <a href="/revenue" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Revenue</a>
                <a href="/leaderboard" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Leaderboard</a>
                <a href="/moderation" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Moderation</a>
                <a href="/settings" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Settings</a>
                <div className="my-4 border-t border-slate-800"></div>
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">LMS</div>
                <a href="/lms" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">LMS Dashboard</a>
                <a href="/lms/users" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Users & Enrollments</a>
                <a href="/lms/courses" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Course Manager</a>
                <a href="/lms/roadmaps" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Roadmaps</a>
                <a href="/lms/certifications" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Certifications</a>
                <a href="/lms/resources" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Resources</a>
                <a href="/lms/entitlements" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Entitlements</a>
                <a href="/lms/integrations" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Integrations</a>
                <a href="/lms/reports" className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">Reports</a>
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
