import { useEffect, useState } from "react";

export default function AssignTickets() {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    try {
      const res = await fetch(
        "https://support-crm-q58l.onrender.com/api/tickets",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch(
        "https://support-crm-q58l.onrender.com/api/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setAgents(data.filter((u) => u.role === "agent"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchAgents();
  }, []);

  const assignTicket = async (ticketId, agentId) => {
    try {
      const res = await fetch(
        `https://support-crm-q58l.onrender.com/api/tickets/${ticketId}/assign?agent_id=${agentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        fetchTickets();
      } else {
        alert("Failed to assign ticket");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "closed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="p-10 grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 bg-gray-200 animate-pulse rounded-xl"
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
          Ticket Assignment Panel
        </h1>
        <p className="text-gray-500">
          Assign tickets to support agents efficiently
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.ticket_id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            {/* Left: Ticket Info */}
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-gray-800">
                {ticket.subject}
              </h2>

              <span
                className={`w-fit px-3 py-1 text-xs font-semibold rounded-full ${statusColor(
                  ticket.status
                )}`}
              >
                {ticket.status.toUpperCase()}
              </span>

              <p className="text-sm text-gray-500">
                Assigned to:{" "}
                <span className="font-medium">
                  {ticket.agent_name || "Not Assigned"}
                </span>
              </p>
            </div>

            {/* Right: Assign */}
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <select
                className="px-3 py-2 border rounded-lg bg-gray-50 hover:bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                onChange={(e) =>
                  assignTicket(ticket.ticket_id, e.target.value)
                }
                defaultValue=""
              >
                <option value="">Assign Agent</option>

                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}