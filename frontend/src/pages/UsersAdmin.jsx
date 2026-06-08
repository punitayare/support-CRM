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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

      if (res.ok) {
        fetchUsers();
      } else {
        alert("Failed to update role");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const roleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "agent":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  if (loading) {
    return (
      <div className="p-10 grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          User Management
        </h1>
        <p className="text-gray-500">
          Manage roles and permissions for your CRM users
        </p>
      </div>

      {/* Card Grid */}
      <div className="grid gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            {/* Left */}
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>

              <span
                className={`mt-2 w-fit px-3 py-1 rounded-full text-xs font-semibold ${roleColor(
                  user.role
                )}`}
              >
                {user.role.toUpperCase()}
              </span>
            </div>

            {/* Right */}
            <div className="mt-4 md:mt-0">
              <select
                value={user.role}
                onChange={(e) => updateRole(user.id, e.target.value)}
                className="px-3 py-2 border rounded-lg bg-gray-50 hover:bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              >
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}