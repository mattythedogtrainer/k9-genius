export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lms-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-teal-900">
            K9 Design System
          </h1>
          <p className="text-teal-400 mt-2 font-body">Learning Platform</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-cream-100 p-8">
          <h2 className="text-xl font-heading font-bold text-teal-900 mb-6">Sign In</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-teal-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2.5 rounded-lg border border-cream-100 bg-cream-50 text-teal-900 placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 rounded-lg border border-cream-100 bg-cream-50 text-teal-900 placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-900 text-cream-50 font-heading font-medium rounded-lg transition-colors duration-200"
            >
              Sign In
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-teal-700 hover:underline">Forgot password?</a>
          </div>
        </div>
        <p className="text-center text-sm text-teal-400 mt-6">
          Powered by K9 Genius
        </p>
      </div>
    </div>
  );
}
