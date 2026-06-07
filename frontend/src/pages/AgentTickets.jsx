import { useEffect, useState } from "react";
import axios from "axios";

export default function AgentTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchAgentTickets = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:8000/api/tickets/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTickets(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load assigned tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentTickets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assigned Tickets</h1>

      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-500">No assigned tickets</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => (
            <div key={t.id} className="p-4 bg-white shadow rounded-xl">
              <h2 className="font-semibold">{t.subject}</h2>
              <p className="text-sm text-gray-500">{t.description}</p>

              <div className="mt-2 flex justify-between text-sm">
                <span>Status: {t.status}</span>
                <span className="text-blue-600">
                  Ticket ID: {t.ticket_id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}