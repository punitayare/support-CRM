import { useEffect, useState, useCallback } from "react";

import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import SearchBar from "../components/SearchBar";
import TicketTable from "../components/TicketTable";
import CreateTicketModal from "../components/CreateTicketModal";
import TicketDetailsDrawer from "../components/TicketsDetailDrawer";

import api from "../api/api";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchTickets = useCallback(
    async (searchValue = search, statusValue = status) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get("/api/tickets/", {
          params: {
            search: searchValue || undefined,
            status: statusValue || undefined,
          },
        });

        setTickets(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load tickets");
      } finally {
        setIsLoading(false);
      }
    },
    [search, status]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets(search, status);
    }, 300); // 🔥 debounce search

    return () => clearTimeout(timer);
  }, [search, status, fetchTickets]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <Header />

        <StatsCards tickets={tickets} />

        <SearchBar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          onCreateClick={() => setIsModalOpen(true)}
        />

        {/* 🔥 Loading State */}
        {isLoading && (
          <p className="text-gray-500 mt-4">Loading tickets...</p>
        )}

        {/* ❌ Error State */}
        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}

        <TicketTable
          tickets={tickets}
          refreshTickets={fetchTickets}
          selectedTicket={selectedTicketId}
          
  user={JSON.parse(localStorage.getItem("user"))}
          onSelectTicket={(id) => {
            setSelectedTicketId(id);
            setIsDrawerOpen(true);
          }}
        />

        <TicketDetailsDrawer
          ticketId={selectedTicketId}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          refreshTickets={fetchTickets}
        />

        <CreateTicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refreshTickets={fetchTickets}
        />
      </main>
    </div>
  );
}