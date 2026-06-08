import {
  LayoutDashboard,
  Ticket,
  User,
  Users,
  LogOut,
  ClipboardList,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white border-r flex flex-col h-screen">

      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600">
          SupportCRM
        </h1>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1 space-y-2">

        {/* Dashboard */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 p-3 rounded-xl bg-indigo-100 text-indigo-700 cursor-pointer"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </div>

        {/* Tickets (all roles) */}
        

        {/* 👤 CUSTOMER VIEW (optional future page) */}
        

        {/* 🛠️ AGENT VIEW */}
        {user?.role === "agent" && (
          <div
            onClick={() => navigate("/agent/tickets")}
            className="flex items-center gap-3 p-3 text-green-600 cursor-pointer hover:bg-green-50 rounded-xl"
          >
            <ClipboardList size={20} />
            Assigned Tickets
          </div>
        )}

        {/* 👑 ADMIN MENU */}
        {user?.role === "admin" && (
          <>
            <div
              onClick={() => navigate("/admin/users")}
              className="flex items-center gap-3 p-3 text-purple-700 cursor-pointer hover:bg-purple-100 rounded-xl"
            >
              <Users size={20} />
              User Management
            </div>

            <div
              onClick={() => navigate("/admin/assign")}
              className="flex items-center gap-3 p-3 text-orange-600 cursor-pointer hover:bg-orange-100 rounded-xl"
            >
              <ClipboardList size={20} />
              Assign Tickets
            </div>
          </>
        )}

      </nav>

      {/* User Section */}
      <div className="p-4 border-t bg-slate-50">

        {token && user ? (
          <div className="space-y-3">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                <User size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 mt-2"
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600"
          >
            Login
          </button>
        )}

      </div>
    </div>
  );
}