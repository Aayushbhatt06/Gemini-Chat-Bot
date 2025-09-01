import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    // Prevent form submission if this is triggered by a form
    if (e) e.preventDefault();

    if (!email || !password) return setError("Please fill all fields.");
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login...");

      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        console.log("Login failed:", data.message);
        setError(data.message || "Login failed.");
      } else if (data.success && data.token && data.user) {
        console.log("Login successful, storing data...");

        // Store all necessary data (matching what ChatSection expects)
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);

        console.log("Data stored, navigating to home...");

        // Small delay to ensure storage is complete
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 100);
      } else {
        console.log("Invalid response format:", data);
        setError("Login failed - invalid response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <div className="w-full max-w-md p-8 bg-black/20 backdrop-blur-md rounded-3xl shadow-2xl border border-white/10">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-center mb-6">
          Login
        </h1>

        {/* Wrap inputs in form to handle Enter key properly */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 shadow-xl disabled:opacity-50"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 shadow-xl disabled:opacity-50"
          />

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full p-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-xl text-white transition-all duration-300 hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center text-white/50 mt-4 text-sm">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-cyan-400 hover:text-blue-400 transition-colors underline"
            onClick={() => navigate("/signup")}
            disabled={loading}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
