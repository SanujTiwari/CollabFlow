import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/3 left-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Product Showcase / Hero Banner */}
        <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card border border-violet-500/30 text-xs font-semibold text-violet-300 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>CollabFlow Workspace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Welcome back to <br />
            <span className="gradient-accent-text">your project hub.</span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
            Access your team boards, check task updates, collaborate in real time, and push project milestones forward.
          </p>

          {/* Key Metrics / Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="glass-card p-4 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-black text-white gradient-text">100%</h3>
              <p className="text-xs text-gray-400 mt-1 font-semibold">Real-Time Sync</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-black text-white gradient-text">&lt; 50ms</h3>
              <p className="text-xs text-gray-400 mt-1 font-semibold">Socket Latency</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
              <h3 className="text-2xl font-black text-white gradient-text">Unlimited</h3>
              <p className="text-xs text-gray-400 mt-1 font-semibold">Workspace Boards</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div className="lg:col-span-5 w-full">
          <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/15 relative overflow-hidden">
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600" />

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <span className="text-white font-black text-xl">C</span>
                </div>
                <span className="text-xl font-bold text-white tracking-tight">CollabFlow</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to your account</h2>
              <p className="text-xs text-gray-400 mt-1">Enter your credentials to access your workspaces</p>
            </div>

            {error && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 p-3.5 rounded-xl mb-6 text-xs font-semibold flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full glass-input rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full glass-input rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-glow text-white py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In ➔</span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-gray-400 font-medium">
                Don't have an account yet?{" "}
                <Link to="/register" className="text-violet-400 hover:text-violet-300 font-bold transition-colors underline underline-offset-4">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;