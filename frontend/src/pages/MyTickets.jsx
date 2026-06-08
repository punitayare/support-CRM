import { useEffect, useState } from "react";
import axios from "axios";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "https://support-crm-q58l.onrender.com/api/tickets/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = Array.isArray(res.data) ? res.data : [];
      setTickets(data);
    } catch (err) {
      console.error("MY TICKETS ERROR:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load tickets"
      );

      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const getStatusColor = (status) => {
    if (status === "Open")
      return "bg-blue-100 text-blue-700";
    if (status === "In Progress")
      return "bg-orange-100 text-orange-700";
    if (status === "Closed" || status === "Resolved")
      return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        My Tickets
      </h1>

      {loading && (
        <p className="text-gray-500">Loading...</p>
      )}

      {!loading && error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && !error && tickets.length === 0 && (
        <p className="text-gray-500">
          No tickets found
        </p>
      )}

      {!loading && !error && (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.ticket_id}
              className="bg-white p-5 rounded-xl shadow border"
            >
              <div className="flex justify-between">
                <h2 className="font-semibold text-lg">
                  {ticket.subject}
                </h2>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                ID: {ticket.ticket_id}
              </p>

              <p className="text-sm mt-3">
                {ticket.description || "-"}
              </p>

              <div className="mt-3 text-sm text-gray-600">
                <p>
                  Customer: {ticket.customer_name}
                </p>
                <p>
                  Email: {ticket.customer_email}
                </p>
                <p>
                  Agent: {ticket.agent_name || "Not Assigned"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}