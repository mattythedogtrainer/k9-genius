export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f1419] flex flex-col items-center justify-center">
      {children}
    </div>
  );
}
