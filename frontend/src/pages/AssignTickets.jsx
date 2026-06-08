import { useEffect, useState } from "react";

export default function AssignTickets() {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    const res = await fetch(
      "https://support-crm-q58l.onrender.com/api/tickets",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setTickets(data);
  };

  const fetchAgents = async () => {
    const res = await fetch(
      "https://support-crm-q58l.onrender.com/api/users",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setAgents(data.filter((u) => u.role === "agent"));
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
    fetchAgents();
  }, []);

  const assignTicket = async (ticketId, agentId) => {
    const res = await fetch(
      `https://support-crm-q58l.onrender.com/api/tickets/${ticketId}/assign?agent_id=${agentId}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) fetchTickets();
  };

  // 🌈 STATUS COLORS (more vibrant)
  const statusStyle = (status) => {
    switch (status) {
      case "open":
        return "bg-gradient-to-r from-yellow-400 to-orange-400 text-white";
      case "in_progress":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
      case "closed":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  if (loading) {
    return (
      <div className="p-10 grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-6">
      {/* HEADER */}
      <div className="mb-8 p-6 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg border border-white">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">
          Ticket Assignment Panel
        </h1>
        <p className="text-gray-600 mt-1">
          Assign tickets to agents in real time 🚀
        </p>
      </div>

      {/* CARDS */}
      <div className="grid gap-5">
        {tickets.map((ticket) => (
          <div
            key={ticket.ticket_id}
            className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-5 border-l-4 border-indigo-400 hover:scale-[1.01]"
          >
            {/* Glow background accent */}
            <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-10 bg-gradient-to-r from-indigo-400 to-blue-400 transition" />

            <div className="relative flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              
              {/* LEFT */}
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {ticket.subject}
                </h2>

                {/* STATUS BADGE */}
                <span
                  className={`w-fit px-3 py-1 text-xs font-bold rounded-full shadow-md ${statusStyle(
                    ticket.status
                  )}`}
                >
                  {ticket.status.toUpperCase()}
                </span>

                <p className="text-sm text-gray-500">
                  Assigned to:{" "}
                  <span className="font-semibold text-gray-700">
                    {ticket.agent_name || "Not Assigned"}
                  </span>
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-2">
                <select
                  className="px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  onChange={(e) =>
                    assignTicket(ticket.ticket_id, e.target.value)
                  }
                  defaultValue=""
                >
                  <option value="">🎯 Assign Agent</option>

                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}