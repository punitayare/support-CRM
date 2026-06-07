import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 NEW STATES (SEARCH + FILTER)
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
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
    } catch (error) {
      console.error("Error fetching tickets:", error);
      alert("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // 🔥 FIXED FILTER LOGIC
  const filteredTickets = tickets.filter((t) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      t.subject?.toLowerCase().includes(searchText) ||
      t.customer_email?.toLowerCase().includes(searchText) ||
      t.ticket_id?.toLowerCase().includes(searchText);

    const matchesStatus =
      status === "" || t.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-4">
        All Tickets ({user?.role})
      </h1>

      {/* 🔥 SEARCH BAR */}
      <SearchBar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        onCreateClick={() => console.log("create ticket")}
      />

      {/* LOADING */}
      {loading ? (
        <p className="text-gray-500">Loading tickets...</p>
      ) : filteredTickets.length === 0 ? (
        <p className="text-gray-500">No tickets found</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Ticket ID</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Status</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Assigned To</th>
              </tr>
            </thead>

            <tbody>
              {filteredTickets.map((t) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{t.ticket_id}</td>
                  <td className="p-3">{t.subject}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        t.status === "open"
                          ? "bg-red-100 text-red-600"
                          : t.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="p-3">{t.customer_email}</td>
                  <td className="p-3">
                    {t.assigned_to || "Unassigned"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}