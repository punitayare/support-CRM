import {
  LayoutDashboard,
  Ticket,
  User,
  Users,
  LogOut,
  ClipboardList,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen = true, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const goTo = (path) => {
    navigate(path);
    if (onClose) onClose(); // close on mobile
  };

  return (
    <>
      {/* BACKDROP (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static z-50 top-0 left-0
          h-full w-72 bg-white border-r flex flex-col
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="p-5 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">
            SupportCRM
          </h1>
        </div>

        {/* Navigation */}
        <nav className="p-3 sm:p-4 flex-1 space-y-2 overflow-y-auto">

          {/* Dashboard */}
          <div
            onClick={() => goTo("/dashboard")}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition
              ${location.pathname === "/dashboard"
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-gray-100"
              }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </div>

          {/* Agent */}
          {user?.role === "agent" && (
            <div
              onClick={() => goTo("/agent/tickets")}
              className="flex items-center gap-3 p-3 text-green-600 cursor-pointer hover:bg-green-50 rounded-xl"
            >
              <ClipboardList size={20} />
              Assigned Tickets
            </div>
          )}

          {/* Admin */}
          {user?.role === "admin" && (
            <>
              <div
                onClick={() => goTo("/admin/users")}
                className="flex items-center gap-3 p-3 text-purple-700 cursor-pointer hover:bg-purple-100 rounded-xl"
              >
                <Users size={20} />
                User Management
              </div>

              <div
                onClick={() => goTo("/admin/assign")}
                className="flex items-center gap-3 p-3 text-orange-600 cursor-pointer hover:bg-orange-100 rounded-xl"
              >
                <ClipboardList size={20} />
                Assign Tickets
              </div>
            </>
          )}
        </nav>

        {/* USER SECTION */}
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
    </>
  );
}