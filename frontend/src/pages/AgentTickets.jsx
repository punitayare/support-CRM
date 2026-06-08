import { useEffect, useState } from "react";
import axios from "axios";

export default function AgentTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchAgentTickets = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://support-crm-q58l.onrender.com/api/tickets/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentTickets();
  }, []);

  const statusStyle = (status) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-6">

      {/* HEADER */}
      <div className="mb-6 p-6 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg border border-white">
        <h1 className="text-3xl font-bold text-gray-800">
          🎫 Assigned Tickets
        </h1>
        <p className="text-gray-600">
          Manage and resolve your assigned customer issues
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && tickets.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No assigned tickets 🎉
        </div>
      )}

      {/* TICKETS */}
      <div className="grid gap-4">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-5 border-l-4 border-indigo-400 hover:scale-[1.01]"
          >
            <div className="flex justify-between items-start">

              {/* LEFT */}
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {t.subject}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {t.description}
                </p>

                <div className="mt-3 flex gap-3 items-center">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${statusStyle(
                      t.status
                    )}`}
                  >
                    {t.status.toUpperCase()}
                  </span>

                  <span className="text-xs text-gray-400">
                    ID: {t.ticket_id}
                  </span>
                </div>
              </div>

              {/* RIGHT */}
              <div className="text-xs text-gray-400">
                #{t.ticket_id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}