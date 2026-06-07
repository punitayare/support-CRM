import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/DashBoard.jsx";

import UsersAdmin from "./pages/UsersAdmin.jsx";
import AssignTickets from "./pages/AssignTickets.jsx";

import Tickets from "./pages/Tickets.jsx";
import MyTickets from "./pages/MyTickets.jsx";
import AgentTickets from "./pages/AgentTickets.jsx";

// 🔐 safe user getter
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

// 🔒 Private Route
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

// 👑 Admin Route
function AdminRoute({ children }) {
  const user = getUser();
  return user?.role === "admin" ? children : <Navigate to="/dashboard" />;
}

// 🛠 Agent Route
function AgentRoute({ children }) {
  const user = getUser();
  return user?.role === "agent" ? children : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />

        {/* 👤 Customer */}
        <Route
          path="/tickets"
          element={<PrivateRoute><Tickets /></PrivateRoute>}
        />

        <Route
          path="/my-tickets"
          element={<PrivateRoute><MyTickets /></PrivateRoute>}
        />

        {/* 🛠 Agent */}
        <Route
          path="/agent/tickets"
          element={
            <PrivateRoute>
              <AgentRoute>
                <AgentTickets />
              </AgentRoute>
            </PrivateRoute>
          }
        />

        {/* 👑 Admin */}
        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <AdminRoute>
                <UsersAdmin />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/assign"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AssignTickets />
              </AdminRoute>
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}