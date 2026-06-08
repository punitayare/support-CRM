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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">

    {/* CARD */}
    <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-3xl p-8">

      {/* HEADER */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-xl">S</span>
        </div>

        <h2 className="text-3xl font-bold text-gray-900">
          Welcome Back
        </h2>

        <p className="text-gray-500 mt-2 text-sm">
          Sign in to your SupportCRM dashboard
        </p>
      </div>

      {/* EMAIL */}
      <div className="mb-4">
        <label className="text-gray-700 text-sm">Email</label>
        <input
          className="w-full mt-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* PASSWORD */}
      <div className="mb-6">
        <label className="text-gray-700 text-sm">Password</label>
        <input
          type="password"
          className="w-full mt-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* LOGIN BUTTON */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      {/* DIVIDER */}
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-gray-400 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* DEMO BUTTON */}
      <button
        onClick={fillDemo}
        className="w-full py-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 transition"
      >
        Use Admin Demo Account
      </button>

      {/* FOOTER */}
      <p className="text-center text-gray-600 mt-6 text-sm">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-600 font-semibold cursor-pointer hover:underline"
        >
          Create account
        </span>
      </p>
    </div>
  </div>
);
}