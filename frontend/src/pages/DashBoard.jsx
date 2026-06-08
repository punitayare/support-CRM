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

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status, fetchTickets]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      {/* SIDEBAR (NEW FIXED SYSTEM) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* MAIN */}
      <main className="flex-1 ml-0 md:ml-72 p-3 sm:p-6 w-full overflow-x-hidden">

        {/* TOP BAR */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-2xl p-2"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <div className="flex-1">
            <Header />
          </div>

        </div>

        {/* STATS */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-3 sm:p-4 border border-gray-100">
            <StatsCards tickets={tickets} />
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-2xl shadow-md p-3 sm:p-4 border border-gray-100 hover:shadow-lg transition">
            <SearchBar
              search={search}
              setSearch={setSearch}
              status={status}
              setStatus={setStatus}
              onCreateClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="p-3 sm:p-4 mb-4 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 animate-pulse text-sm sm:text-base">
            Loading tickets...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="p-3 sm:p-4 mb-4 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-x-auto hover:shadow-2xl transition">
          <div className="min-w-[700px]">
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
          </div>
        </div>

        {/* DRAWER */}
        <TicketDetailsDrawer
          ticketId={selectedTicketId}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          refreshTickets={fetchTickets}
        />

        {/* MODAL */}
        <CreateTicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refreshTickets={fetchTickets}
        />

      </main>
    </div>
  );
}