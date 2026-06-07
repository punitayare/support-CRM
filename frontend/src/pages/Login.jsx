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
      console.log("PASSWORD:", password);
console.log("PASSWORD LENGTH:", password?.length);
      const res = await fetch("https://support-crm-q58l.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        alert(data.detail || "Invalid login");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
    console.log("LOGIN CLICKED");
  };

  // 🔥 ONLY ADMIN DEMO
  const fillDemo = () => {
    setEmail("admin@demo.com");
    setPassword("admin123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 via-blue-600 to-blue-500 px-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            Welcome Back
          </h2>
          <p className="text-white/70 mt-2">
            Login to your SupportCRM account
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-white text-sm">Email</label>
          <input
            className="w-full mt-2 p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-white text-sm">Password</label>
          <input
            type="password"
            className="w-full mt-2 p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-white text-indigo-600 font-semibold hover:bg-indigo-100 transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="text-white/60 text-sm">or demo login</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* 🔥 ONLY ADMIN DEMO BUTTON */}
        <div className="grid grid-cols-1">
          <button
            onClick={fillDemo}
            className="py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition"
          >
            Admin Demo Login
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-white/70 mt-6 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-white font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}