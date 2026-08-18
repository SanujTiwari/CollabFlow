import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      if (credentialResponse.credential) {
        await googleLogin(credentialResponse.credential);
        navigate("/dashboard");
      } else {
        setError("Google authentication failed. No credential received.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Google sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign Up was unsuccessful. Please try again.");
  };

  return (
    <div className="min-h-screen bg-[#DFDBD4] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">

          {/* ─── Left Side: Hero + Botanical Art ─── */}
          <div className="hidden lg:flex flex-col justify-center pr-16 relative min-h-[640px]">
            {/* Brand */}
            <div className="flex items-center gap-2.5 mb-10">
              <div className="w-9 h-9 bg-[#D47E30] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM17 14v6M14 17h6" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#1E293B] tracking-tight">CollabFlow</span>
            </div>

            {/* Hero Text */}
            <h1 className="text-5xl xl:text-[56px] font-extrabold text-[#1E293B] leading-[1.1] tracking-tight">
              Start building<br />
              <span className="gradient-accent-text">something great.</span>
            </h1>

            <p className="text-[#475569] text-base leading-relaxed mt-5 max-w-md">
              Create your free account to start organizing projects, tracking tasks, and collaborating with your team in real time.
            </p>

            {/* Botanical Decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none select-none overflow-hidden">
              <svg viewBox="0 0 600 200" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 140 C80 100, 160 160, 240 120 C320 80, 400 150, 480 110 C520 90, 560 130, 600 100 L600 200 L0 200Z" fill="#C9976A" opacity="0.25" />
                <path d="M0 160 C100 130, 180 180, 280 140 C380 100, 440 170, 540 130 L600 150 L600 200 L0 200Z" fill="#D47E30" opacity="0.18" />
                <g transform="translate(100, 65)">
                  <path d="M0 60 Q15 20 30 0 Q20 30 40 60 Q20 50 0 60Z" fill="#8B5E3C" opacity="0.5" />
                  <path d="M10 55 Q30 25 50 10 Q35 35 55 60 Q30 50 10 55Z" fill="#A0714A" opacity="0.4" />
                  <path d="M-10 65 Q0 40 5 20 Q10 45 20 65 Q5 60 -10 65Z" fill="#6B4226" opacity="0.45" />
                </g>
                <g transform="translate(400, 55)">
                  <path d="M0 70 Q20 25 40 0 Q25 35 50 70 Q25 55 0 70Z" fill="#8B5E3C" opacity="0.45" />
                  <path d="M15 65 Q35 30 55 5 Q40 35 60 65 Q35 55 15 65Z" fill="#A0714A" opacity="0.35" />
                </g>
                <circle cx="200" cy="100" r="3" fill="#C9C3BB" opacity="0.5" />
                <circle cx="340" cy="90" r="2.5" fill="#C9C3BB" opacity="0.4" />
              </svg>
            </div>

            <div className="flex items-center gap-2 mt-8 text-[#475569]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs font-medium">Your data is secure and always protected.</span>
            </div>
          </div>

          {/* ─── Right Side: Sign-Up Form Card ─── */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <div className="bg-[#F8F6F2] rounded-2xl p-8 sm:p-10 border border-[#C9C3BB] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]">

              {/* Mobile brand */}
              <div className="flex items-center gap-2 mb-6 lg:hidden">
                <div className="w-8 h-8 bg-[#D47E30] rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM17 14v6M14 17h6" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-[#1E293B]">CollabFlow</span>
              </div>

              <h2 className="text-2xl font-bold text-[#1E293B] tracking-tight">Create your account</h2>
              <p className="text-sm text-[#475569] mt-1">Get started — no credit card required</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-[#DC2626] p-3 rounded-xl mt-5 text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="register-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full glass-input rounded-xl pl-11 pr-4 py-3 text-sm transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full glass-input rounded-xl pl-11 pr-4 py-3 text-sm transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full glass-input rounded-xl pl-11 pr-11 py-3 text-sm transition-all"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94a3b8] hover:text-[#475569] transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  id="register-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full btn-glow py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-[#C9C3BB]" />
                <span className="text-xs text-[#475569] font-medium">or</span>
                <div className="flex-1 h-px bg-[#C9C3BB]" />
              </div>

              {/* Google Sign Up */}
              <div className="w-full flex justify-center overflow-hidden rounded-xl">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  width="360"
                  text="signup_with"
                  shape="rectangular"
                />
              </div>

              {/* Sign In Link */}
              <p className="text-center text-sm text-[#475569] mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-[#D47E30] hover:text-[#B96322] font-bold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-[#475569]">
        <span>Privacy Policy</span>
        <span className="mx-2">•</span>
        <span>Terms of Service</span>
        <span className="mx-2">•</span>
        <span>Contact Us</span>
      </footer>
    </div>
  );
};

export default Register;