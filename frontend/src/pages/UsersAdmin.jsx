import { useEffect, useState } from "react";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // 🔥 fetch users (you must have GET /api/users endpoint)
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  // 🔥 update role
  const updateRole = async (userId, newRole) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/users/${userId}/role`,
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
        alert("Role updated");
        fetchUsers();
      } else {
        alert("Failed to update role");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading users...</div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-3 font-medium">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="px-2 py-1 text-sm rounded bg-indigo-100 text-indigo-700">
                    {user.role}
                  </span>
                </td>

                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateRole(user.id, e.target.value)
                    }
                    className="border p-2 rounded"
                  >
                    <option value="customer">Customer</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}