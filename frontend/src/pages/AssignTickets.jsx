import { useEffect, useState } from "react";

export default function AssignTickets() {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const token = localStorage.getItem("token");

  // 🔥 fetch tickets
  const fetchTickets = async () => {
    const res = await fetch("http://localhost:8000/api/tickets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setTickets(data);
  };

  // 🔥 fetch users (filter agents)
  const fetchAgents = async () => {
    const res = await fetch("http://localhost:8000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setAgents(data.filter((u) => u.role === "agent"));
  };

  useEffect(() => {
    fetchTickets();
    fetchAgents();
  }, []);

  // 🔥 assign ticket
  const assignTicket = async (ticketId, agentId) => {
    const res = await fetch(
      `http://localhost:8000/api/tickets/${ticketId}/assign?agent_id=${agentId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      alert("Ticket assigned successfully");
      fetchTickets();
    } else {
      alert("Failed to assign ticket");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Assign Tickets
      </h1>

      <div className="grid gap-4">

        {tickets.map((ticket) => (
  <div
    key={ticket.ticket_id}
    className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
  >
    {/* Ticket Info */}
    <div>
      <p className="font-semibold">
        {ticket.subject}
      </p>

      <p className="text-sm text-gray-500">
        Status: {ticket.status}
      </p>

      <p className="text-xs text-gray-400">
        Assigned: {ticket.agent_name || "Not Assigned"}
      </p>
    </div>

    {/* Assign Section */}
    <div className="flex gap-2 items-center">
      <select
        className="border p-2 rounded"
        onChange={(e) =>
          assignTicket(ticket.ticket_id, e.target.value)
        }
      >
        <option value="">Select Agent</option>

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