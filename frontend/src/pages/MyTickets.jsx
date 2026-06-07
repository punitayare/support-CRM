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
        "http://localhost:8000/api/tickets/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTickets(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load your tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Tickets</h1>

      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-500">No tickets found</p>
      ) : (
        <div className="grid gap-4">
          {tickets.map((t) => (
            <div key={t.ticket_id} className="p-4 bg-white shadow rounded-xl">

              <h2 className="font-semibold">{t.subject}</h2>

              <div className="text-sm text-gray-500">
                Status: {t.status}
              </div>

              <div className="text-xs text-gray-400 mt-1">
                Assigned: {t.agent_name || "Not Assigned"}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}