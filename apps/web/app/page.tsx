export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Welcome to K9 Genius</h1>
      <p className="text-slate-400 mb-8">AI-powered adaptive dog training</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-slate-800 rounded-xl p-6 hover:border-gold/50 transition-colors">
          <div className="text-3xl mb-3">🎓</div>
          <h2 className="text-lg font-semibold text-white mb-1">Browse Courses</h2>
          <p className="text-sm text-slate-400">Expert-led training courses for every skill level</p>
        </div>
        <div className="bg-card border border-slate-800 rounded-xl p-6 hover:border-gold/50 transition-colors">
          <div className="text-3xl mb-3">🧠</div>
          <h2 className="text-lg font-semibold text-white mb-1">Genius Brain</h2>
          <p className="text-sm text-slate-400">AI adapts training to your dog's learning style</p>
        </div>
        <div className="bg-card border border-slate-800 rounded-xl p-6 hover:border-gold/50 transition-colors">
          <div className="text-3xl mb-3">🏆</div>
          <h2 className="text-lg font-semibold text-white mb-1">Leaderboard</h2>
          <p className="text-sm text-slate-400">Compete with other dog owners worldwide</p>
        </div>
      </div>
    </div>
  );
}
