import { useEffect, useState } from "react";
import axios from "axios";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchMyTickets = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://support-crm-q58l.onrender.com/api/tickets/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("MY TICKETS RESPONSE:", res.data);

      setTickets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("MY TICKETS ERROR:", err);

      console.log("Status:", err.response?.status);
      console.log("Response:", err.response?.data);

      alert(
        err.response?.data?.detail ||
          "Failed to load your tickets"
      );
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

    if (
      status === "Resolved" ||
      status === "Closed"
    )
      return "bg-green-100 text-green-700";

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        My Tickets
      </h1>

      {loading ? (
        <p className="text-gray-500">
          Loading tickets...
        </p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-500">
          No tickets found
        </p>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.ticket_id}
              className="bg-white p-5 rounded-xl shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">
                    {ticket.subject}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Ticket ID: {ticket.ticket_id}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <strong>Description:</strong>{" "}
                  {ticket.description}
                </p>

                <p className="text-sm">
                  <strong>Assigned Agent:</strong>{" "}
                  {ticket.agent_name ||
                    "Not Assigned"}
                </p>

                <p className="text-sm">
                  <strong>Created:</strong>{" "}
                  {new Date(
                    ticket.created_at
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}