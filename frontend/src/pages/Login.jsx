import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        "https://support-crm-q58l.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        alert(data.detail || "Invalid login");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("admin@demo.com");
    setPassword("admin123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500 px-4">

      {/* BACKDROP CARD */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">S</span>
          </div>

          <h2 className="text-3xl font-bold text-white">
            Welcome Back
          </h2>

          <p className="text-blue-100 mt-2 text-sm">
            Sign in to your SupportCRM dashboard
          </p>
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-blue-100 text-sm">Email</label>
          <input
            className="w-full mt-2 p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 outline-none focus:ring-2 focus:ring-blue-300 transition"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="text-blue-100 text-sm">Password</label>
          <input
            type="password"
            className="w-full mt-2 p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 outline-none focus:ring-2 focus:ring-blue-300 transition"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* DIVIDER */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="text-blue-100 text-sm">or</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* DEMO BUTTON */}
        <button
          onClick={fillDemo}
          className="w-full py-2 rounded-xl bg-white/10 border border-white/20 text-blue-100 hover:bg-white/20 transition"
        >
          Use Admin Demo Account
        </button>

        {/* FOOTER */}
        <p className="text-center text-blue-100 mt-6 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-white font-semibold cursor-pointer hover:underline"
          >
            Create account
          </span>
        </p>
      </div>
    </div>
  );
}