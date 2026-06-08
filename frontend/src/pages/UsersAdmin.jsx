import { useEffect, useState } from "react";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "https://support-crm-q58l.onrender.com/api/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId, newRole) => {
    try {
      const res = await fetch(
        `https://support-crm-q58l.onrender.com/api/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ new_role: newRole }),
        }
      );

      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // 🌈 ROLE COLORS (gradient + glow)
  const roleStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "agent":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
      default:
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    }
  };

  const cardAccent = (role) => {
    switch (role) {
      case "admin":
        return "border-l-4 border-red-500";
      case "agent":
        return "border-l-4 border-blue-500";
      default:
        return "border-l-4 border-green-500";
    }
  };

  if (loading) {
    return (
      <div className="p-10 grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-6">
      
      {/* HEADER */}
      <div className="mb-8 p-6 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg border border-white">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          User Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage roles and permissions for your CRM users
        </p>
      </div>

      {/* CARDS */}
      <div className="grid gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-5 flex flex-col md:flex-row md:items-center md:justify-between hover:scale-[1.01] ${cardAccent(
              user.role
            )}`}
          >
            {/* LEFT */}
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-gray-800">
                {user.name}
              </h2>

              <p className="text-sm text-gray-500">{user.email}</p>

              <span
                className={`w-fit px-3 py-1 rounded-full text-xs font-bold shadow-md ${roleStyle(
                  user.role
                )}`}
              >
                {user.role.toUpperCase()}
              </span>
            </div>

            {/* RIGHT */}
            <div className="mt-4 md:mt-0">
              <select
                value={user.role}
                onChange={(e) =>
                  updateRole(user.id, e.target.value)
                }
                className="px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              >
                <option value="customer">🟢 Customer</option>
                <option value="agent">🔵 Agent</option>
                <option value="admin">🔴 Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}