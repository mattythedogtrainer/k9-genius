import { LmsNavbar } from '@/components/LmsNavbar';
import { LmsFooter } from '@/components/LmsFooter';
import { AuthGuard } from '@/components/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-lms-bg">
        {/* Navigation Bar */}
        <LmsNavbar />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <LmsFooter />
      </div>
    </AuthGuard>
  );
}
